#!/usr/bin/env python3
"""Refresh official science-capacity and output series in science.json.

World Bank WDI republishes R&D data compiled by UNESCO UIS. Interpretation,
papers and policy sources remain review-gated in the JSON.
"""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "science.json"
COUNTRIES = ("WLD", "NLD", "USA", "KOR")
INDICATORS = {
    "rdIntensity": {
        "id": "GB.XPD.RSDV.GD.ZS",
        "label": "Research and development expenditure",
        "unit": "% of GDP",
        "sourceId": "world-bank-rd",
    },
    "journalArticles": {
        "id": "IP.JRN.ARTC.SC",
        "label": "Scientific and technical journal articles",
        "unit": "articles",
        "sourceId": "world-bank-articles",
    },
}


def fetch_json(url: str) -> list:
    request = Request(url, headers={"User-Agent": "CTW-Signals/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"World Bank returned HTTP {response.status}")
        return json.load(response)


def fetch_indicator(indicator_id: str) -> tuple[dict, list]:
    country_path = quote(";".join(COUNTRIES), safe="")
    url = (
        f"https://api.worldbank.org/v2/country/{country_path}/indicator/"
        f"{indicator_id}?format=json&per_page=1000"
    )
    payload = fetch_json(url)
    if not isinstance(payload, list) or len(payload) != 2:
        raise RuntimeError(f"{indicator_id}: unexpected top-level schema")
    meta, rows = payload
    if meta.get("pages") != 1 or not isinstance(rows, list):
        raise RuntimeError(f"{indicator_id}: incomplete or invalid response")

    observed_countries = {row.get("countryiso3code") for row in rows}
    if not set(COUNTRIES).issubset(observed_countries):
        missing = sorted(set(COUNTRIES) - observed_countries)
        raise RuntimeError(f"{indicator_id}: missing countries {missing}")
    for row in rows:
        if row.get("indicator", {}).get("id") != indicator_id:
            raise RuntimeError(f"{indicator_id}: indicator identity changed")
    return meta, rows


def build_series(config: dict, rows: list) -> dict:
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
        if len(values) < 10:
            raise RuntimeError(f"{config['id']}: too few observations for {code}")
        years = [item["year"] for item in values]
        if len(years) != len(set(years)):
            raise RuntimeError(f"{config['id']}: duplicate years for {code}")
        observations[code] = values

    return {
        **config,
        "period": "2000–latest available annual observation",
        "denominator": "GDP" if config["id"] == "GB.XPD.RSDV.GD.ZS" else "annual article count",
        "observations": observations,
        "latest": {code: values[-1] for code, values in observations.items()},
    }


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    series = {}
    source_updates = set()
    for key, config in INDICATORS.items():
        meta, rows = fetch_indicator(config["id"])
        series[key] = build_series(config, rows)
        source_updates.add(meta.get("lastupdated"))

    if None in source_updates or len(source_updates) != 1:
        raise RuntimeError(f"World Bank source-date mismatch: {sorted(source_updates, key=str)}")
    source_date = source_updates.pop()
    data["series"] = series
    data["meta"]["dataUpdated"] = source_date
    data["meta"]["updateStatus"] = "Official API series refreshed; curated evidence unchanged"
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        "Updated science.json: "
        f"{len(series)} series, {len(COUNTRIES)} geographies, source {source_date}"
    )


if __name__ == "__main__":
    main()
