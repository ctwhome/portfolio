#!/usr/bin/env python3
"""Refresh approved World Bank / UNESCO UIS education series atomically.

Assessment editions, subgroup results, adult-learning surveys, pathways,
teacher-capacity evidence and AI-tutor studies are deliberately curated.
"""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "education.json"
GEOGRAPHY = "NLD"
MIN_YEAR = 2016
INDICATORS = {
    "primaryGrossEnrollment": {
        "id": "SE.PRM.ENRR",
        "sourceId": "world-bank-primary-enrollment-nl",
        "label": "School enrollment, primary, gross",
        "definition": (
            "Total enrollment in primary education, regardless of age, divided "
            "by the population of the age group that officially corresponds to "
            "primary education."
        ),
        "geography": "Netherlands",
        "population": (
            "all pupils enrolled in primary education relative to the official "
            "primary-school-age population"
        ),
        "denominator": "population of official primary-school age",
        "unit": "% gross enrollment ratio",
        "evidenceCategory": "observation",
        "caveat": (
            "A gross access ratio that can exceed 100 because it includes over-age "
            "and under-age pupils. Enrollment is not attendance, completion or proficiency."
        ),
    },
}


def fetch_json(url: str) -> object:
    request = Request(url, headers={"User-Agent": "CTW-Signals/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"source returned HTTP {response.status}")
        return json.loads(response.read())


def fetch_indicator(indicator_id: str) -> tuple[dict, list]:
    url = (
        f"https://api.worldbank.org/v2/country/{GEOGRAPHY}/indicator/"
        f"{indicator_id}?format=json&per_page=1000"
    )
    payload = fetch_json(url)
    if not isinstance(payload, list) or len(payload) != 2:
        raise RuntimeError(f"{indicator_id}: unexpected top-level schema")
    meta, rows = payload
    if not isinstance(meta, dict) or meta.get("pages") != 1 or not isinstance(rows, list):
        raise RuntimeError(f"{indicator_id}: incomplete response or pages changed")
    if meta.get("sourceid") != "2":
        raise RuntimeError(f"{indicator_id}: World Development Indicators source changed")
    if not rows:
        raise RuntimeError(f"{indicator_id}: Netherlands geography missing")
    if any(row.get("countryiso3code") != GEOGRAPHY for row in rows):
        raise RuntimeError(f"{indicator_id}: geography dimensions changed")
    if any(row.get("indicator", {}).get("id") != indicator_id for row in rows):
        raise RuntimeError(f"{indicator_id}: indicator identity changed")
    return meta, rows


def build_series(config: dict, rows: list, source_date: str) -> dict:
    observations = sorted(
        (
            {"year": int(row["date"]), "value": round(float(row["value"]), 4)}
            for row in rows
            if row.get("value") is not None and int(row["date"]) >= MIN_YEAR
        ),
        key=lambda item: item["year"],
    )
    years = [item["year"] for item in observations]
    if len(observations) < 3:
        raise RuntimeError(f"{config['id']}: too few observations")
    if years != sorted(set(years)):
        raise RuntimeError(f"{config['id']}: duplicate or unordered chronology")
    if config["id"] == "SE.PRM.ENRR" and any(
        not 0 <= item["value"] <= 150 for item in observations
    ):
        raise RuntimeError(f"{config['id']}: enrollment value outside reviewed range")
    return {
        **config,
        "period": f"annual; {observations[0]['year']}–{observations[-1]['year']} observations",
        "release": f"World Development Indicators / UNESCO UIS, source updated {source_date}",
        "observations": observations,
        "latest": observations[-1],
    }


def validate_preserved_series(data: dict) -> None:
    series = data.get("officialSeries")
    if not isinstance(series, dict) or set(series) != set(INDICATORS):
        raise RuntimeError("committed official series schema changed")
    for key, config in INDICATORS.items():
        item = series[key]
        for field in (
            "id", "sourceId", "definition", "geography", "population",
            "denominator", "unit", "period", "release", "evidenceCategory", "caveat",
        ):
            if not item.get(field):
                raise RuntimeError(f"{key}: committed series missing {field}")
        for field, expected in config.items():
            if item.get(field) != expected:
                raise RuntimeError(f"{key}: committed {field} contract changed")
        observations = item.get("observations", [])
        years = [row.get("year") for row in observations]
        if len(observations) < 3 or years != sorted(set(years)):
            raise RuntimeError(f"{key}: committed chronology invalid")
        if item.get("latest") != observations[-1]:
            raise RuntimeError(f"{key}: committed latest value invalid")


def atomic_write(data: dict) -> None:
    rendered = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    descriptor, temporary = tempfile.mkstemp(
        dir=DATA_PATH.parent, prefix=".education.", suffix=".json"
    )
    try:
        with os.fdopen(descriptor, "w") as handle:
            handle.write(rendered)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, DATA_PATH)
    except BaseException:
        if os.path.exists(temporary):
            os.unlink(temporary)
        raise


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    try:
        fetched = {
            key: fetch_indicator(config["id"])
            for key, config in INDICATORS.items()
        }
    except URLError as error:
        # Network denial must not turn a reviewed, committed dataset into a
        # partial refresh. Validate it and leave every byte untouched.
        validate_preserved_series(data)
        print(f"Education sources unavailable; validated and preserved education.json ({error.reason})")
        return

    source_dates = {meta.get("lastupdated") for meta, _ in fetched.values()}
    if None in source_dates or len(source_dates) != 1:
        raise RuntimeError(f"World Bank source-date mismatch: {sorted(source_dates, key=str)}")
    source_date = source_dates.pop()
    refreshed = {
        key: build_series(INDICATORS[key], rows, source_date)
        for key, (_, rows) in fetched.items()
    }

    # Only these keys are updater-owned. All curated evidence remains intact.
    data["officialSeries"] = refreshed
    data["meta"]["dataUpdated"] = source_date
    data["meta"]["updateStatus"] = (
        "World Bank / UNESCO UIS series refreshed; "
        "edition-pinned assessments and studies unchanged"
    )
    atomic_write(data)
    print("Updated education.json: 1 World Bank / UNESCO UIS series")


if __name__ == "__main__":
    main()
