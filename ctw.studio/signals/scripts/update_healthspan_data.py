#!/usr/bin/env python3
"""Refresh official population-health and workforce series in healthspan.json.

World Bank WDI and Eurostat supply deterministic no-key data. Waiting times,
clinical evidence, AMR interpretation and other non-comparable evidence remain
manually curated and source-auditable.
"""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "healthspan.json"
COUNTRIES = ("WLD", "NLD", "JPN", "USA")
INDICATORS = {
    "lifeExpectancy": {
        "id": "SP.DYN.LE00.IN",
        "label": "Life expectancy at birth",
        "unit": "years",
        "denominator": "period life table for total population",
        "sourceId": "world-bank-life",
    },
    "physicians": {
        "id": "SH.MED.PHYS.ZS",
        "label": "Physicians",
        "unit": "per 1,000 people",
        "denominator": "total population",
        "sourceId": "world-bank-physicians",
    },
}
EUROSTAT_URL = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/hlth_hlye"


def fetch_json(url: str) -> object:
    request = Request(url, headers={"User-Agent": "CTW-Signals/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"Source returned HTTP {response.status}")
        return json.load(response)


def fetch_world_bank(indicator_id: str) -> tuple[dict, list]:
    path = quote(";".join(COUNTRIES), safe="")
    url = (
        f"https://api.worldbank.org/v2/country/{path}/indicator/"
        f"{indicator_id}?format=json&per_page=1000"
    )
    payload = fetch_json(url)
    if not isinstance(payload, list) or len(payload) != 2:
        raise RuntimeError(f"{indicator_id}: unexpected top-level schema")
    meta, rows = payload
    if meta.get("pages") != 1 or not isinstance(rows, list):
        raise RuntimeError(f"{indicator_id}: incomplete response")
    for row in rows:
        if row.get("indicator", {}).get("id") != indicator_id:
            raise RuntimeError(f"{indicator_id}: indicator identity changed")
    return meta, rows


def build_world_bank_series(config: dict, rows: list) -> dict:
    observations = {}
    for code in COUNTRIES:
        values = [
            {"year": int(row["date"]), "value": round(float(row["value"]), 4)}
            for row in rows
            if row.get("countryiso3code") == code
            and row.get("value") is not None
            and int(row["date"]) >= 2000
        ]
        values.sort(key=lambda item: item["year"])
        if len(values) < 3:
            raise RuntimeError(f"{config['id']}: too few observations for {code}")
        if len(values) != len({item["year"] for item in values}):
            raise RuntimeError(f"{config['id']}: duplicate years for {code}")
        observations[code] = values
    return {
        **config,
        "period": "2000–latest available annual observation",
        "observations": observations,
        "latest": {code: values[-1] for code, values in observations.items()},
    }


def category_position(dataset: dict, dimension: str, code: str) -> int:
    index = dataset["dimension"][dimension]["category"]["index"]
    if code not in index:
        raise RuntimeError(f"Eurostat missing {dimension}={code}")
    return index[code]


def eurostat_value(dataset: dict, unit: str, sex: str, measure: str) -> float:
    ids = dataset.get("id")
    sizes = dataset.get("size")
    if ids != ["freq", "unit", "sex", "hlth_hle", "geo", "time"] or len(sizes) != 6:
        raise RuntimeError("Eurostat healthy-life-years dimensions changed")
    coords = {
        "freq": category_position(dataset, "freq", "A"),
        "unit": category_position(dataset, "unit", unit),
        "sex": category_position(dataset, "sex", sex),
        "hlth_hle": category_position(dataset, "hlth_hle", measure),
        "geo": 0,
        "time": 0,
    }
    flat = 0
    for dimension, size in zip(ids, sizes):
        flat = flat * size + coords[dimension]
    raw = dataset.get("value", {}).get(str(flat))
    if raw is None:
        raise RuntimeError(f"Eurostat missing {unit}/{sex}/{measure}")
    return round(float(raw), 1)


def fetch_healthy_life_years(geo: str, year: int) -> dict:
    query = urlencode({"lang": "en", "geo": geo, "time": year})
    dataset = fetch_json(f"{EUROSTAT_URL}?{query}")
    if not isinstance(dataset, dict) or dataset.get("class") != "dataset":
        raise RuntimeError(f"Eurostat {geo}: unexpected response")
    label = dataset["dimension"]["geo"]["category"]["label"].get(geo)
    if not label:
        raise RuntimeError(f"Eurostat {geo}: geography label missing")
    life = eurostat_value(dataset, "YR", "T", "LE_Y0")
    healthy = eurostat_value(dataset, "YR", "T", "HLY_Y0")
    return {
        "geography": geo,
        "label": label,
        "year": year,
        "lifeExpectancyYears": life,
        "healthyLifeYears": healthy,
        "yearsWithActivityLimitation": round(life - healthy, 1),
    }


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    series = {}
    dates = set()
    for key, config in INDICATORS.items():
        meta, rows = fetch_world_bank(config["id"])
        series[key] = build_world_bank_series(config, rows)
        dates.add(meta.get("lastupdated"))
    if None in dates or len(dates) != 1:
        raise RuntimeError(f"World Bank source-date mismatch: {sorted(dates, key=str)}")

    hly_year = data["healthyLifeYears"]["period"]
    healthy = [fetch_healthy_life_years(geo, hly_year) for geo in ("EU27_2020", "NL")]
    data["series"] = series
    data["healthyLifeYears"]["observations"] = healthy
    data["healthyLifeYears"]["sourceUpdated"] = "2026-07-17"
    data["meta"]["dataUpdated"] = dates.pop()
    data["meta"]["updateStatus"] = "Official API series refreshed; curated evidence unchanged"
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        "Updated healthspan.json: "
        f"{len(series)} World Bank series, {len(healthy)} Eurostat observations"
    )


if __name__ == "__main__":
    main()
