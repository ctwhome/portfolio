#!/usr/bin/env python3
"""Refresh stable official series for Financial fragility (Brief 008).

The browser reads only the committed JSON. This updater owns the whitelisted BIS
household-credit and debt-service series, the ECB new-mortgage rate, Eurostat
household saving, and Eurostat government interest/debt observations. EBA, ECB
supervisory, CBS distributional and DNB pension evidence remains manually
reviewed because samples, definitions or publication formats require an audit.
"""

from __future__ import annotations

import argparse
import csv
import io
import itertools
import json
import os
import tempfile
import zipfile
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "financial-fragility.json"

BIS_CREDIT_URL = "https://data.bis.org/static/bulk/WS_TC_csv_flat.zip"
BIS_DSR_URL = "https://data.bis.org/static/bulk/WS_DSR_csv_flat.zip"
ECB_URL = (
    "https://data-api.ecb.europa.eu/service/data/"
    "MIR/M.NL.B.A2C.A.R.A.2250.EUR.N"
    "?startPeriod=2015-01&format=csvdata&detail=dataonly"
)
EUROSTAT_BASE = (
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"
)

BIS_CREDIT_KEY = "Q.NL.H.A.M.770.A"
BIS_DSR_KEY = "Q.NL.H"
ECB_KEY = "MIR.M.NL.B.A2C.A.R.A.2250.EUR.N"
ECB_DIMENSIONS = {
    "FREQ": "M",
    "REF_AREA": "NL",
    "BS_REP_SECTOR": "B",
    "BS_ITEM": "A2C",
    "MATURITY_NOT_IRATE": "A",
    "DATA_TYPE_MIR": "R",
    "AMOUNT_CAT": "A",
    "BS_COUNT_SECTOR": "2250",
    "CURRENCY_TRANS": "EUR",
    "IR_BUS_COV": "N",
}


def fetch_bytes(url: str, accept: str = "*/*") -> bytes:
    request = Request(
        url,
        headers={
            "Accept": accept,
            "User-Agent": "CTW-Signals/1.0 (+https://ctw.studio/signals/)",
        },
    )
    with urlopen(request, timeout=180) as response:
        payload = response.read()
    if not payload:
        raise RuntimeError(f"Empty response from {url}")
    return payload


def fetch_json(url: str) -> Any:
    return json.loads(fetch_bytes(url, "application/json"))


def csv_from_zip(payload: bytes) -> list[dict[str, str]]:
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        names = sorted(name for name in archive.namelist() if name.endswith(".csv"))
        if len(names) != 1:
            raise RuntimeError(f"Expected one CSV in BIS archive, found {names}")
        with archive.open(names[0]) as stream:
            text = io.TextIOWrapper(stream, encoding="utf-8-sig")
            rows = list(csv.DictReader(text))
    if not rows:
        raise RuntimeError("BIS archive contained no observations")
    return rows


def first(row: dict[str, str], *names: str) -> str:
    for name in names:
        value = row.get(name)
        if value not in (None, ""):
            return str(value)
        for header, decorated_value in row.items():
            if (
                header.partition(":")[0] == name
                and decorated_value not in (None, "")
            ):
                return str(decorated_value)
    return ""


def dimension_code(value: str) -> str:
    """Return the SDMX code from either `CODE` or `CODE: Label`."""
    return value.partition(":")[0].strip()


def bis_credit_key(row: dict[str, str]) -> str:
    explicit = first(row, "SERIES_KEY", "KEY")
    if explicit:
        return explicit.removeprefix("BIS,WS_TC,2.0/")
    fields = (
        ("FREQ",),
        ("BORROWERS_CTY", "BORROWERS_COUNTRY"),
        ("TC_BORROWERS", "BORROWING_SECTOR"),
        ("TC_LENDERS", "LENDING_SECTOR"),
        ("VALUATION",),
        ("UNIT_TYPE",),
        ("TC_ADJUST", "ADJUSTMENT"),
    )
    return ".".join(dimension_code(first(row, *names)) for names in fields)


def bis_dsr_key(row: dict[str, str]) -> str:
    explicit = first(row, "SERIES_KEY", "KEY")
    if explicit:
        return explicit.removeprefix("BIS,WS_DSR,1.0/")
    return ".".join(
        dimension_code(value)
        for value in (
            first(row, "FREQ"),
            first(row, "BORROWERS_CTY", "BORROWERS_COUNTRY"),
            first(row, "DSR_BORROWERS", "BORROWING_SECTOR"),
        )
    )


def parse_bis_series(
    payload: bytes, expected_key: str, key_function: Any, start: str
) -> list[dict[str, str | float]]:
    selected = []
    for row in csv_from_zip(payload):
        if key_function(row) != expected_key:
            continue
        period = first(row, "TIME_PERIOD", "TIME")
        raw_value = first(row, "OBS_VALUE", "VALUE")
        if period >= start and raw_value:
            selected.append({"period": period, "value": round(float(raw_value), 1)})
    selected.sort(key=lambda item: str(item["period"]))
    if len(selected) < 16:
        raise RuntimeError(f"BIS {expected_key} has too few observations")
    if len({item["period"] for item in selected}) != len(selected):
        raise RuntimeError(f"BIS {expected_key} returned duplicate periods")
    return selected


def validate_ecb_dimensions(row: dict[str, str]) -> None:
    key = first(row, "KEY", "SERIES_KEY")
    if key and key != ECB_KEY:
        raise RuntimeError(f"ECB series identity changed: {key}")
    actual = {field: first(row, field) for field in ECB_DIMENSIONS}
    if actual != ECB_DIMENSIONS:
        raise RuntimeError(f"ECB series dimensions changed: {actual}")


def parse_ecb(payload: bytes) -> list[dict[str, str | float]]:
    rows = list(csv.DictReader(io.StringIO(payload.decode("utf-8-sig"))))
    if not rows:
        raise RuntimeError("ECB returned no mortgage-rate observations")
    observations = []
    for row in rows:
        validate_ecb_dimensions(row)
        period = first(row, "TIME_PERIOD")
        value = first(row, "OBS_VALUE")
        if period >= "2015-01" and value:
            observations.append({"period": period, "value": round(float(value), 2)})
    observations.sort(key=lambda item: str(item["period"]))
    if len(observations) < 100:
        raise RuntimeError("ECB mortgage-rate history has too few observations")
    return observations


def parse_eurostat(
    dataset: str, filters: dict[str, str | list[str]]
) -> list[dict[str, str | float]]:
    payload = fetch_json(
        f"{EUROSTAT_BASE}/{dataset}?{urlencode(filters, doseq=True)}"
    )
    dimensions = payload.get("id", [])
    sizes = payload.get("size", [])
    if not dimensions or len(dimensions) != len(sizes):
        raise RuntimeError(f"Eurostat {dataset} dimensions changed")

    categories: list[list[str | None]] = []
    for dimension in dimensions:
        indexes = payload["dimension"][dimension]["category"]["index"]
        ordered: list[str | None] = [None] * len(indexes)
        for code, position in indexes.items():
            ordered[position] = code
        categories.append(ordered)

    rows: list[dict[str, str | float]] = []
    for coordinates in itertools.product(*[range(size) for size in sizes]):
        flat_index = 0
        for coordinate, size in zip(coordinates, sizes):
            flat_index = flat_index * size + coordinate
        raw_value = payload.get("value", {}).get(str(flat_index))
        if raw_value is None:
            continue
        row: dict[str, str | float] = {
            dimension: str(categories[index][coordinates[index]])
            for index, dimension in enumerate(dimensions)
        }
        row["value"] = float(raw_value)
        rows.append(row)
    if not rows:
        raise RuntimeError(f"Eurostat {dataset} returned no observations")
    return rows


def require_dimensions(
    rows: list[dict[str, str | float]],
    expected: dict[str, str],
    label: str,
) -> None:
    for row in rows:
        actual = {field: str(row.get(field)) for field in expected}
        if actual != expected:
            raise RuntimeError(f"{label} dimensions changed: {actual}")


def refresh_bis(data: dict) -> None:
    credit = parse_bis_series(
        fetch_bytes(BIS_CREDIT_URL),
        BIS_CREDIT_KEY,
        bis_credit_key,
        "2015-Q1",
    )
    dsr = parse_bis_series(
        fetch_bytes(BIS_DSR_URL), BIS_DSR_KEY, bis_dsr_key, "2015-Q1"
    )
    data["series"]["householdCredit"]["observations"] = credit
    data["series"]["householdCredit"]["latest"] = credit[-1]
    data["series"]["householdDebtService"]["observations"] = dsr
    data["series"]["householdDebtService"]["latest"] = dsr[-1]

    household = next(item for item in data["balanceSheets"] if item["id"] == "household")
    household["headline"] = f"{credit[-1]['value']:.1f}%"
    household["period"] = credit[-1]["period"]
    baseline = next(item for item in credit if item["period"] == "2015-Q4")
    data["verdict"]["text"] = (
        f"Dutch household credit was {credit[-1]['value']:.1f}% of GDP in "
        f"{str(credit[-1]['period']).replace('-', ' ')}, down from "
        f"{baseline['value']:.1f}% in 2015 Q4, while the BIS modelled household "
        f"debt-service ratio was {dsr[-1]['value']:.1f}% of income. Lower "
        "aggregate ratios do not remove risk for recent, highly leveraged or "
        "liquidity-poor borrowers."
    )


def refresh_ecb(data: dict) -> None:
    observations = parse_ecb(fetch_bytes(ECB_URL, "text/csv"))
    series = data["series"]["newMortgageRate"]
    series["observations"] = observations
    series["latest"] = observations[-1]
    source = next(item for item in data["sources"] if item["id"] == "ecb-mortgage-rate")
    source["period"] = f"Monthly; latest displayed {observations[-1]['period']}"


def refresh_saving(data: dict) -> None:
    rows = parse_eurostat(
        "nasa_10_ki",
        {
            "geo": "NL",
            "freq": "A",
            "sector": "S14_S15",
            "na_item": "SRG_S14_S15",
            "sinceTimePeriod": "2015",
        },
    )
    require_dimensions(
        rows,
        {
            "freq": "A",
            "geo": "NL",
            "sector": "S14_S15",
            "na_item": "SRG_S14_S15",
            "unit": "PC",
        },
        "Eurostat saving",
    )
    observations = [
        {"period": str(row["time"]), "value": round(float(row["value"]), 1)}
        for row in rows
    ]
    observations.sort(key=lambda item: item["period"])
    if len(observations) < 8:
        raise RuntimeError("Eurostat saving series has too few observations")
    data["series"]["householdSaving"]["observations"] = observations
    data["series"]["householdSaving"]["latest"] = observations[-1]
    source = next(item for item in data["sources"] if item["id"] == "eurostat-saving")
    source["period"] = f"Annual, 2015–{observations[-1]['period']} on page"


def only(
    rows: list[dict[str, str | float]], period: str, item: str, unit: str
) -> float:
    matches = [
        float(row["value"])
        for row in rows
        if row.get("time") == period
        and row.get("na_item") == item
        and row.get("unit") == unit
    ]
    if len(matches) != 1:
        raise RuntimeError(
            f"Eurostat missing or duplicate {period}/{item}/{unit}: {len(matches)}"
        )
    return matches[0]


def refresh_government(data: dict) -> None:
    rows = parse_eurostat(
        "gov_10a_main",
        {
            "geo": "NL",
            "freq": "A",
            "sector": "S13",
            "na_item": ["D41PAY", "TR"],
            "unit": ["MIO_EUR", "PC_GDP"],
            "sinceTimePeriod": "2015",
        },
    )
    require_dimensions(
        rows,
        {"freq": "A", "geo": "NL", "sector": "S13"},
        "Eurostat government",
    )
    if {str(row.get("na_item")) for row in rows} != {"D41PAY", "TR"}:
        raise RuntimeError("Eurostat government item dimensions changed")
    if {str(row.get("unit")) for row in rows} != {"MIO_EUR", "PC_GDP"}:
        raise RuntimeError("Eurostat government unit dimensions changed")
    periods = sorted(
        {
            str(row["time"])
            for row in rows
            if row.get("na_item") == "D41PAY" and row.get("unit") == "PC_GDP"
        }
    )
    observations = []
    for period in periods:
        interest = only(rows, period, "D41PAY", "MIO_EUR")
        revenue = only(rows, period, "TR", "MIO_EUR")
        observations.append(
            {
                "period": period,
                "interestMioEur": round(interest),
                "revenueMioEur": round(revenue),
                "interestToGdpPct": round(
                    only(rows, period, "D41PAY", "PC_GDP"), 1
                ),
                "interestToRevenuePct": round(interest / revenue * 100, 1),
            }
        )
    if len(observations) < 8:
        raise RuntimeError("Eurostat government interest series has too few observations")
    data["series"]["governmentInterest"]["observations"] = observations
    data["series"]["governmentInterest"]["latest"] = observations[-1]

    debt_rows = parse_eurostat(
        "gov_10dd_edpt1",
        {
            "geo": "NL",
            "freq": "A",
            "sector": "S13",
            "na_item": "GD",
            "unit": "PC_GDP",
            "sinceTimePeriod": "2015",
        },
    )
    require_dimensions(
        debt_rows,
        {
            "freq": "A",
            "geo": "NL",
            "sector": "S13",
            "na_item": "GD",
            "unit": "PC_GDP",
        },
        "Eurostat government debt",
    )
    debt_observations = sorted(
        (
            {"period": str(row["time"]), "value": round(float(row["value"]), 1)}
            for row in debt_rows
        ),
        key=lambda item: item["period"],
    )
    validate_periods(debt_observations, "governmentDebt", 8)
    latest_debt = debt_observations[-1]
    government = next(
        item for item in data["balanceSheets"] if item["id"] == "government"
    )
    government["headline"] = f"{latest_debt['value']:.1f}%"
    government["period"] = latest_debt["period"]
    government["sourceId"] = "eurostat-debt"


def validate_periods(observations: list[dict], label: str, minimum: int) -> None:
    if len(observations) < minimum:
        raise RuntimeError(f"{label} has too few observations")
    periods = [str(item["period"]) for item in observations]
    if periods != sorted(periods) or len(periods) != len(set(periods)):
        raise RuntimeError(f"{label} chronology is invalid")


def validate(data: dict) -> None:
    required_top = {
        "meta",
        "question",
        "verdict",
        "questions",
        "lenses",
        "dimensions",
        "balanceSheets",
        "series",
        "householdDistribution",
        "safeguards",
        "arrearsBoundary",
        "explanations",
        "reversalIndicators",
        "dataGaps",
        "sources",
    }
    missing = required_top - set(data)
    if missing:
        raise RuntimeError(f"JSON schema missing sections: {sorted(missing)}")
    if len(data["questions"]) != 5:
        raise RuntimeError("Signals five-question contract changed")
    if [item["id"] for item in data["dimensions"]] != [
        "household",
        "government",
        "banks",
        "pensions",
    ]:
        raise RuntimeError("Balance-sheet dimensions changed")

    source_ids = [source["id"] for source in data["sources"]]
    if len(source_ids) != len(set(source_ids)):
        raise RuntimeError("Duplicate source IDs")
    for source in data["sources"]:
        if not source["url"].startswith("https://"):
            raise RuntimeError(f"Non-HTTPS source: {source['id']}")
        for field in (
            "seriesTableId",
            "methodology",
            "transformation",
            "vintageRetrieved",
            "revisionPolicy",
            "denominatorUnit",
        ):
            if not source.get(field):
                raise RuntimeError(f"{source['id']} missing {field}")

    expected = {
        "householdCredit": (
            "BIS,WS_TC,2.0/Q.NL.H.A.M.770.A", "bis-household-credit", "% of GDP",
            "Quarterly nominal GDP, BIS ratio convention", 16,
        ),
        "householdDebtService": (
            "BIS,WS_DSR,1.0/Q.NL.H", "bis-household-dsr", "% of income",
            "BIS modelled income available for debt service", 16,
        ),
        "newMortgageRate": (
            ECB_KEY, "ecb-mortgage-rate", "% per annum",
            "Annualised agreed rate on new business", 10,
        ),
        "householdSaving": (
            "Eurostat nasa_10_ki/SRG_S14_S15", "eurostat-saving",
            "% of gross disposable income",
            "Gross disposable income adjusted for change in pension entitlements", 8,
        ),
        "governmentInterest": (
            "Eurostat gov_10a_main/S13/D41PAY", "eurostat-government",
            "% of GDP and % of revenue",
            "Nominal GDP for interest/GDP; total general-government revenue for interest/revenue", 6,
        ),
    }
    for name, (series_id, source_id, unit, denominator, minimum) in expected.items():
        series = data["series"][name]
        if series["id"] != series_id or series.get("sourceId") != source_id:
            raise RuntimeError(f"{name} indicator identity changed")
        if series["unit"] != unit or series.get("denominator") != denominator:
            raise RuntimeError(f"{name} dimensions changed")
        validate_periods(series["observations"], name, minimum)
        if series["latest"] != series["observations"][-1]:
            raise RuntimeError(f"{name} latest value does not match chronology")

    for row in data["series"]["governmentInterest"]["observations"]:
        derived = round(row["interestMioEur"] / row["revenueMioEur"] * 100, 1)
        if derived != row["interestToRevenuePct"]:
            raise RuntimeError(f"Government interest/revenue formula mismatch: {row}")
    if "Data gap" != data["arrearsBoundary"]["status"]:
        raise RuntimeError("Arrears definition gap must remain explicit")

    forbidden = ("composite score", "traffic-light total", "fragility score")
    serialized = json.dumps(data).lower()
    if any(term in serialized for term in forbidden):
        raise RuntimeError("Composite financial-fragility scoring is prohibited")


def write_atomic(data: dict) -> None:
    serialized = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{DATA_PATH.name}.", suffix=".tmp", dir=DATA_PATH.parent
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as stream:
            stream.write(serialized)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, DATA_PATH)
    finally:
        if temporary.exists():
            temporary.unlink()


def updater_owned_snapshot(data: dict) -> str:
    balance_sheets = {
        item["id"]: item
        for item in data["balanceSheets"]
        if item["id"] in {"household", "government"}
    }
    source_periods = {
        item["id"]: item["period"]
        for item in data["sources"]
        if item["id"] in {"ecb-mortgage-rate", "eurostat-saving"}
    }
    return json.dumps(
        {
            "series": data["series"],
            "balanceSheets": balance_sheets,
            "verdictText": data["verdict"]["text"],
            "sourcePeriods": source_periods,
        },
        sort_keys=True,
        ensure_ascii=False,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Validate and deterministically rewrite committed data without network access.",
    )
    args = parser.parse_args()

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    if not args.validate_only:
        before_refresh = updater_owned_snapshot(data)
        refresh_bis(data)
        refresh_ecb(data)
        refresh_saving(data)
        refresh_government(data)
        if updater_owned_snapshot(data) != before_refresh:
            data["meta"]["dataUpdated"] = date.today().isoformat()
        data["meta"]["updateStatus"] = (
            "BIS, ECB and Eurostat stable official series refreshed; "
            "review-gated evidence unchanged"
        )
    validate(data)
    write_atomic(data)

    mode = "Validated" if args.validate_only else "Updated"
    print(f"{mode} {DATA_PATH}")
    print(
        "  Household credit: "
        f"{data['series']['householdCredit']['latest']['value']}% of GDP "
        f"({data['series']['householdCredit']['latest']['period']})"
    )
    print(
        "  Household debt service: "
        f"{data['series']['householdDebtService']['latest']['value']}% of income "
        f"({data['series']['householdDebtService']['latest']['period']})"
    )
    print(
        "  New mortgage rate: "
        f"{data['series']['newMortgageRate']['latest']['value']}% "
        f"({data['series']['newMortgageRate']['latest']['period']})"
    )


if __name__ == "__main__":
    main()
