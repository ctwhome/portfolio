#!/usr/bin/env python3
"""Refresh approved World Bank demographic observations in demography.json.

Eurostat category snapshots, CBS observations and the UN WPP 2024 projection
remain review-gated. The browser reads only the committed JSON.
"""

from __future__ import annotations

import argparse
import json
import os
import tempfile
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "demography.json"
COUNTRIES = ("WLD", "NLD")
FIRST_YEAR = 2000
INDICATORS = {
    "population": {
        "id": "SP.POP.TOTL",
        "label": "Population, total",
        "unit": "people",
        "denominator": "Not applicable",
        "sourceId": "world-bank-population",
    },
    "olderShare": {
        "id": "SP.POP.65UP.TO.ZS",
        "label": "Population ages 65 and above",
        "unit": "% of total population",
        "denominator": "Total population",
        "sourceId": "world-bank-older-share",
    },
}


def fetch_json(url: str) -> object:
    request = Request(url, headers={"User-Agent": "CTW-Signals/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"Source returned HTTP {response.status}")
        return json.load(response)


def fetch_indicator(indicator_id: str) -> tuple[dict, list]:
    countries = quote(";".join(COUNTRIES), safe="")
    url = (
        f"https://api.worldbank.org/v2/country/{countries}/indicator/"
        f"{indicator_id}?format=json&per_page=1000"
    )
    payload = fetch_json(url)
    if not isinstance(payload, list) or len(payload) != 2:
        raise RuntimeError(f"{indicator_id}: unexpected top-level schema")
    meta, rows = payload
    if not isinstance(meta, dict) or meta.get("pages") != 1 or not isinstance(rows, list):
        raise RuntimeError(f"{indicator_id}: incomplete or invalid response")
    if meta.get("sourceid") != "2":
        raise RuntimeError(f"{indicator_id}: World Development Indicators source changed")
    found = {row.get("countryiso3code") for row in rows}
    if not set(COUNTRIES).issubset(found):
        raise RuntimeError(f"{indicator_id}: missing geographies {sorted(set(COUNTRIES) - found)}")
    if any(row.get("indicator", {}).get("id") != indicator_id for row in rows):
        raise RuntimeError(f"{indicator_id}: indicator identity changed")
    return meta, rows


def build_series(config: dict, rows: list) -> dict:
    observations = {}
    for code in COUNTRIES:
        values = sorted(
            (
                {
                    "year": int(row["date"]),
                    "value": (
                        int(row["value"])
                        if config["id"] == "SP.POP.TOTL"
                        else round(float(row["value"]), 4)
                    ),
                }
                for row in rows
                if row.get("countryiso3code") == code
                and row.get("value") is not None
                and int(row["date"]) >= FIRST_YEAR
            ),
            key=lambda item: item["year"],
        )
        years = [item["year"] for item in values]
        if len(values) < 20:
            raise RuntimeError(f"{config['id']}: too few observations for {code}")
        if years != sorted(set(years)):
            raise RuntimeError(f"{config['id']}: duplicate or unordered chronology for {code}")
        if years[-1] < 2025:
            raise RuntimeError(f"{config['id']}: latest observation for {code} predates 2025")
        if config["id"] == "SP.POP.TOTL" and any(item["value"] <= 0 for item in values):
            raise RuntimeError(f"{config['id']}: non-positive population for {code}")
        if config["id"] == "SP.POP.65UP.TO.ZS" and any(
            not 0 < item["value"] < 100 for item in values
        ):
            raise RuntimeError(f"{config['id']}: percentage outside 0..100 for {code}")
        observations[code] = values
    latest_year = min(values[-1]["year"] for values in observations.values())
    return {
        **config,
        "evidenceCategory": "observation",
        "period": f"{FIRST_YEAR}–{latest_year}",
        "timing": "Annual de facto population estimate",
        "population": "All residents regardless of legal status or citizenship",
        "observations": observations,
        "latest": {code: values[-1] for code, values in observations.items()},
    }


def validate_curated(data: dict) -> None:
    if data.get("dependencyTrajectory", {}).get("projection", {}).get("vintage") != (
        "World Population Prospects 2024"
    ):
        raise RuntimeError("Pinned projection vintage changed")
    projection = data["dependencyTrajectory"]["projection"]
    for field in ("author", "vintage", "variant", "assumptions", "sourceId"):
        if not projection.get(field):
            raise RuntimeError(f"Pinned projection missing {field}")
    components = data.get("componentsOfChange", {}).get("observations", [])
    if len(components) < 5:
        raise RuntimeError("Curated components of change are too short")
    for row in components:
        if row["netMigration"] != row["immigration"] - row["emigration"]:
            raise RuntimeError(f"Gross migration flows do not reconcile in {row['year']}")
    if [row["year"] for row in components] != sorted({row["year"] for row in components}):
        raise RuntimeError("Curated components chronology changed")
    for item in data.get("regionalDivergence", {}).get("records", []):
        if not item.get("code") or not data["regionalDivergence"].get("boundaryVintage"):
            raise RuntimeError("Regional code or boundary vintage missing")


def render_atomic(data: dict) -> None:
    rendered = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    descriptor, temporary = tempfile.mkstemp(
        dir=DATA_PATH.parent, prefix=".demography.", suffix=".json"
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(rendered)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, DATA_PATH)
    except BaseException:
        if os.path.exists(temporary):
            os.unlink(temporary)
        raise


def validate_official_series(data: dict) -> None:
    for key, config in INDICATORS.items():
        series = data.get("series", {}).get(key)
        if not series:
            raise RuntimeError(f"{config['id']}: committed series missing")
        for field, expected in config.items():
            if series.get(field) != expected:
                raise RuntimeError(f"{config['id']}: committed {field} contract changed")
        for code in COUNTRIES:
            rows = series.get("observations", {}).get(code, [])
            years = [row["year"] for row in rows]
            if len(rows) < 5 or years != sorted(set(years)) or years[-1] < 2025:
                raise RuntimeError(f"{config['id']}: invalid committed chronology for {code}")
            if series.get("latest", {}).get(code) != rows[-1]:
                raise RuntimeError(f"{config['id']}: committed latest value mismatch for {code}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="validate the committed snapshot and deterministically rewrite it without network access",
    )
    args = parser.parse_args()
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    validate_curated(data)

    if args.validate_only:
        validate_official_series(data)
        render_atomic(data)
        print("Validated demography.json offline: official snapshot and curated sections unchanged")
        return

    fetched = {key: fetch_indicator(config["id"]) for key, config in INDICATORS.items()}
    dates = {meta.get("lastupdated") for meta, _ in fetched.values()}
    if None in dates or len(dates) != 1:
        raise RuntimeError(f"World Bank source-date mismatch: {sorted(dates, key=str)}")
    data["series"] = {
        key: build_series(INDICATORS[key], rows)
        for key, (_, rows) in fetched.items()
    }
    data["meta"]["dataUpdated"] = dates.pop()
    data["meta"]["updateStatus"] = (
        "World Bank observations refreshed; curated Eurostat, CBS and projection evidence unchanged"
    )
    validate_curated(data)
    render_atomic(data)
    print("Updated demography.json: 2 World Bank series; curated evidence unchanged")


if __name__ == "__main__":
    main()
