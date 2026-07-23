#!/usr/bin/env python3
"""Refresh the baked official observations for Housing & affordability (Brief 003).

No credentials are required. The script updates only quantitative observations;
editorial interpretation, caveats, country-selection rationale and source roles
remain review-gated in data/housing.json.
"""

from __future__ import annotations

import csv
import io
import itertools
import json
import subprocess
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "housing.json"

OECD_URL = (
    "https://sdmx.oecd.org/public/rest/v1/data/"
    "OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/.?startPeriod=2010-Q1"
)
ECB_URL = (
    "https://data-api.ecb.europa.eu/service/data/"
    "MIR/M.NL.B.A2C.A.R.A.2250.EUR.N"
    "?startPeriod=2015-01&format=csvdata&detail=dataonly"
)
CBS_BASE = "https://opendata.cbs.nl/ODataApi/OData"
WORLD_BANK_BASE = "https://api.worldbank.org/v2/country/WLD/indicator"
EUROSTAT_BASE = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"

COUNTRIES = {
    "NLD": ("Netherlands", "Primary context: rapid post-2015 deterioration despite a large regulated-rental sector."),
    "DEU": ("Germany", "A renter-majority contrast with a smaller post-2015 price-to-income shift."),
    "ESP": ("Spain", "A high-ownership market shaped by a different construction cycle after the euro-area housing crash."),
    "CAN": ("Canada", "A non-European high-income market with strong population growth and pronounced urban supply pressure."),
    "JPN": ("Japan", "An aging-country contrast where national abundance can coexist with scarcity in the largest cities."),
    "AUT": ("Austria", "A European contrast with substantial social and limited-profit housing, especially in Vienna."),
}

OECD_MEASURES = {
    "housePrice": ("HPI", "House-price index"),
    "rentPrice": ("RPI", "Rent-price index"),
    "priceToIncome": ("HPI_YDH", "Price-to-income index"),
    "priceToRent": ("HPI_RPI", "Price-to-rent index"),
}

TENURE_LABELS = {
    "OWN_L": "Owner with mortgage",
    "OWN_NL": "Owner without mortgage",
    "RENT_MKT": "Market-rate tenant",
    "RENT_FR": "Reduced/free-rent tenant",
}


def fetch_text(url: str, accept: str | None = None) -> str:
    command = [
        "curl",
        "--fail",
        "--silent",
        "--show-error",
        "--location",
        "--retry",
        "3",
        "--retry-delay",
        "2",
        "--connect-timeout",
        "20",
        "--max-time",
        "180",
    ]
    if accept:
        command.extend(["--header", f"Accept: {accept}"])
    command.append(url)
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    if not result.stdout.strip():
        raise RuntimeError(f"Empty response from {url}")
    return result.stdout


def fetch_json(url: str) -> Any:
    return json.loads(fetch_text(url, "application/json"))


def round1(value: str | float) -> float:
    return round(float(value), 1)


def parse_eurostat(dataset: str, filters: dict[str, str | list[str]]) -> list[dict]:
    payload = fetch_json(f"{EUROSTAT_BASE}/{dataset}?{urlencode(filters, doseq=True)}")
    dimensions = payload["id"]
    sizes = payload["size"]
    categories = []
    for dimension in dimensions:
        indexes = payload["dimension"][dimension]["category"]["index"]
        ordered = [None] * len(indexes)
        for code, position in indexes.items():
            ordered[position] = code
        categories.append(ordered)

    rows = []
    for coordinates in itertools.product(*[range(size) for size in sizes]):
        flat_index = 0
        for coordinate, size in zip(coordinates, sizes):
            flat_index = flat_index * size + coordinate
        raw_value = payload.get("value", {}).get(str(flat_index))
        if raw_value is None:
            continue
        row = {
            dimensions[index]: categories[index][coordinates[index]]
            for index in range(len(dimensions))
        }
        row["value"] = float(raw_value)
        rows.append(row)
    if not rows:
        raise RuntimeError(f"Eurostat returned no observations for {dataset}")
    return rows


def latest_non_null_world_bank(indicator: str) -> dict:
    payload = fetch_json(f"{WORLD_BANK_BASE}/{indicator}?format=json&per_page=100")
    if not isinstance(payload, list) or len(payload) < 2:
        raise RuntimeError(f"Unexpected World Bank response for {indicator}")
    for observation in payload[1]:
        if observation.get("value") is not None:
            return {"period": observation["date"], "value": float(observation["value"])}
    raise RuntimeError(f"World Bank returned no usable observations for {indicator}")


def refresh_world(data: dict) -> None:
    slum_share = latest_non_null_world_bank("EN.POP.SLUM.UR.ZS")
    urban_population_payload = fetch_json(
        f"{WORLD_BANK_BASE}/SP.URB.TOTL?format=json&per_page=100"
    )
    urban_by_year = {
        row["date"]: float(row["value"])
        for row in urban_population_payload[1]
        if row.get("value") is not None
    }
    urban_population = urban_by_year.get(slum_share["period"])
    if urban_population is None:
        raise RuntimeError("World Bank urban-population series lacks the slum-share year")
    estimated_people_millions = slum_share["value"] / 100 * urban_population / 1_000_000

    data["world"]["slumShare"] = {
        "value": round1(slum_share["value"]),
        "rawValue": slum_share["value"],
        "unit": "% of urban population",
        "period": slum_share["period"],
        "sourceId": "world-bank-slums",
    }
    data["world"]["urbanPopulation"] = {
        "valueBillions": round(urban_population / 1_000_000_000, 2),
        "valuePeople": urban_population,
        "period": slum_share["period"],
        "sourceId": "world-bank-slums",
    }
    data["world"]["estimatedPeople"] = {
        "valueMillions": round(estimated_people_millions),
        "period": slum_share["period"],
        "derived": True,
        "note": "Derived from unrounded source values: the World Bank/UN-Habitat slum share and World Bank urban-population observation for the same year. It is not a direct census count.",
        "sourceId": "world-bank-slums",
    }


def refresh_oecd(data: dict) -> None:
    rows = list(csv.DictReader(io.StringIO(fetch_text(OECD_URL, "text/csv"))))
    if not rows:
        raise RuntimeError("OECD returned no analytical house-price observations")

    netherlands = data["netherlands"].setdefault("oecd", {})
    for key, (measure, label) in OECD_MEASURES.items():
        observations = [
            {"period": row["TIME_PERIOD"], "value": round1(row["OBS_VALUE"])}
            for row in rows
            if row["REF_AREA"] == "NLD"
            and row["FREQ"] == "Q"
            and row["MEASURE"] == measure
            and row["UNIT_MEASURE"] == "IX"
        ]
        observations.sort(key=lambda item: item["period"])
        if len(observations) < 40:
            raise RuntimeError(f"OECD {measure} history is unexpectedly short")
        netherlands[key] = {
            "measure": measure,
            "label": label,
            "base": "2015=100",
            "frequency": "Quarterly, seasonally adjusted",
            "observations": observations,
            "latest": observations[-1],
            "sourceId": "oecd-house-prices",
        }

    availability = {}
    for code in COUNTRIES:
        availability[code] = {
            row["TIME_PERIOD"]
            for row in rows
            if row["REF_AREA"] == code
            and row["FREQ"] == "Q"
            and row["MEASURE"] == "HPI_YDH"
            and row["UNIT_MEASURE"] == "IX"
        }
    common_periods = set.intersection(*availability.values())
    comparison_period = max(common_periods)
    comparisons = []
    for code, (name, rationale) in COUNTRIES.items():
        row = next(
            item
            for item in rows
            if item["REF_AREA"] == code
            and item["FREQ"] == "Q"
            and item["MEASURE"] == "HPI_YDH"
            and item["TIME_PERIOD"] == comparison_period
        )
        comparisons.append(
            {
                "code": code,
                "name": name,
                "value": round1(row["OBS_VALUE"]),
                "whyIncluded": rationale,
            }
        )
    data["comparisons"]["period"] = comparison_period
    data["comparisons"]["countries"] = comparisons


def refresh_cbs(data: dict) -> None:
    existing_rows = fetch_json(f"{CBS_BASE}/85773ENG/TypedDataSet")["value"]
    monthly = []
    for row in existing_rows:
        raw_period = row.get("Periods", "")
        if len(raw_period) != 8 or "MM" not in raw_period or raw_period[:4] < "2015":
            continue
        monthly.append(
            {
                "period": f"{raw_period[:4]}-{raw_period[-2:]}",
                "priceIndex2020": round1(row["PriceIndexSellingPrices_1"]),
                "yearOnYearPct": round1(row["ChangesComparedToThePreviousYear_3"]),
                "soldHomes": row["SoldHomes_4"],
                "averagePurchasePriceEur": row["AveragePurchasePrice_7"],
            }
        )
    monthly.sort(key=lambda item: item["period"])
    if len(monthly) < 100:
        raise RuntimeError("CBS existing-home monthly history is unexpectedly short")
    data["netherlands"]["cbs"]["existingHomes"] = {
        "observations": monthly,
        "latest": monthly[-1],
        "sourceId": "cbs-existing-homes",
        "note": "Average purchase price is descriptive and is not corrected for changes in the mix of homes sold; the price index is the quality-adjusted measure.",
    }

    stock_rows = fetch_json(f"{CBS_BASE}/82235NED/TypedDataSet")["value"]
    household_rows = fetch_json(
        f"{CBS_BASE}/71486NED/TypedDataSet?"
        "$filter=RegioS%20eq%20%27NL01%20%20%27%20and%20"
        "LeeftijdReferentiepersoon%20eq%20%2710000%27"
    )["value"]
    stock_by_year = {
        int(row["Perioden"][:4]): row
        for row in stock_rows
        if row.get("Perioden", "")[:4].isdigit() and int(row["Perioden"][:4]) >= 2015
    }
    households_by_year = {
        int(row["Perioden"][:4]): int(row["TotaalParticuliereHuishoudens_1"])
        for row in household_rows
        if row.get("Perioden", "")[:4].isdigit() and int(row["Perioden"][:4]) >= 2015
    }
    aligned = []
    for year in sorted(stock_by_year):
        if year < 2018:
            continue
        if year not in households_by_year or year + 1 not in households_by_year:
            continue
        stock = stock_by_year[year]
        start = households_by_year[year]
        end = households_by_year[year + 1]
        aligned.append(
            {
                "year": year,
                "newConstruction": int(stock["Nieuwbouw_2"]),
                "netHousingAddition": int(stock["SaldoVoorraad_8"]),
                "householdsStart": start,
                "householdsEnd": end,
                "householdGrowth": end - start,
            }
        )
    if len(aligned) < 7:
        raise RuntimeError("CBS housing/household alignment is unexpectedly short")
    latest_stock = stock_by_year[max(stock_by_year)]
    data["netherlands"]["supplyVsHouseholds"] = aligned
    data["netherlands"]["latestSupply"] = {
        "year": max(stock_by_year),
        "newConstruction": int(latest_stock["Nieuwbouw_2"]),
        "netHousingAddition": int(latest_stock["SaldoVoorraad_8"]),
        "householdComparatorAvailable": max(stock_by_year) + 1 in households_by_year,
        "sourceIds": ["cbs-housing-stock", "cbs-households"],
        "note": "Households are measured on 1 January. Each aligned row compares stock change during the year with the change in private households from 1 January of that year to 1 January of the next.",
    }


def refresh_ecb(data: dict) -> None:
    rows = list(csv.DictReader(io.StringIO(fetch_text(ECB_URL, "text/csv"))))
    observations = [
        {"period": row["TIME_PERIOD"], "value": round1(row["OBS_VALUE"])}
        for row in rows
        if row.get("OBS_VALUE")
    ]
    observations.sort(key=lambda item: item["period"])
    if len(observations) < 100:
        raise RuntimeError("ECB mortgage-rate history is unexpectedly short")
    low = min(observations, key=lambda item: item["value"])
    data["netherlands"]["ecbMortgage"] = {
        "unit": "% per year",
        "definition": "Annualised agreed rate on new euro-denominated loans to Dutch households for house purchase, all initial fixation periods.",
        "observations": observations,
        "latest": observations[-1],
        "lowSince2015": low,
        "sourceId": "ecb-mortgage",
    }


def refresh_eurostat(data: dict) -> None:
    overburden = parse_eurostat(
        "ilc_lvho07c", {"geo": "NL", "sinceTimePeriod": "2015"}
    )
    latest_period = max(row["time"] for row in overburden)
    by_tenure = []
    for code, label in TENURE_LABELS.items():
        row = next(
            item
            for item in overburden
            if item["time"] == latest_period and item["tenure"] == code
        )
        by_tenure.append({"code": code, "tenure": label, "value": round1(row["value"])})
    total = next(
        item
        for item in overburden
        if item["time"] == latest_period and item["tenure"] == "TOTAL"
    )
    data["netherlands"]["overburden"].update(
        {
            "period": latest_period,
            "totalPct": round1(total["value"]),
            "byTenure": by_tenure,
            "sourceId": "eurostat-overburden",
        }
    )

    tenure = parse_eurostat(
        "ilc_lvho02",
        {
            "geo": ["NL", "EU27_2020"],
            "rskpovth": "TOTAL",
            "hhcomp": "TOTAL",
            "sinceTimePeriod": "2015",
        },
    )
    tenure_period = max(
        set(row["time"] for row in tenure if row["geo"] == "NL")
        & set(row["time"] for row in tenure if row["geo"] == "EU27_2020")
    )
    shares = {}
    for geography in ["NL", "EU27_2020"]:
        shares[geography] = {
            row["tenure"]: round1(row["value"])
            for row in tenure
            if row["geo"] == geography
            and row["time"] == tenure_period
            and row["tenure"] in {"OWN", "RENT_MKT", "RENT_FR"}
        }
    data["netherlands"]["tenure"] = {
        "period": tenure_period,
        "shares": shares,
        "sourceId": "eurostat-tenure",
        "note": "Rent at reduced price or free includes social, subsidised and other below-market arrangements; categories are population shares, not dwelling-stock shares.",
    }


def validate(data: dict) -> None:
    source_ids = {source["id"] for source in data["sources"]}
    if len(source_ids) != len(data["sources"]):
        raise RuntimeError("Duplicate source IDs")
    if data["comparisons"]["period"] < "2025-Q1":
        raise RuntimeError("Selected-country comparison is stale")
    if data["netherlands"]["cbs"]["existingHomes"]["latest"]["period"] < "2026-01":
        raise RuntimeError("CBS existing-home data is stale")
    for source in data["sources"]:
        if not source["url"].startswith("https://"):
            raise RuntimeError(f"Non-HTTPS source URL: {source['id']}")


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    refresh_world(data)
    refresh_oecd(data)
    refresh_cbs(data)
    refresh_ecb(data)
    refresh_eurostat(data)
    data["meta"]["dataUpdated"] = date.today().isoformat()
    for source in data["sources"]:
        source["accessed"] = date.today().isoformat()
    validate(data)
    DATA_PATH.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    latest_home = data["netherlands"]["cbs"]["existingHomes"]["latest"]
    affordability = data["netherlands"]["oecd"]["priceToIncome"]["latest"]
    print(f"Updated {DATA_PATH}")
    print(
        f"  Dutch existing homes: {latest_home['yearOnYearPct']}% y/y "
        f"({latest_home['period']})"
    )
    print(
        f"  Price-to-income: {affordability['value']} "
        f"({affordability['period']}, 2015=100)"
    )
    print(
        f"  Comparison: {data['comparisons']['period']} across "
        f"{len(data['comparisons']['countries'])} countries"
    )


if __name__ == "__main__":
    main()
