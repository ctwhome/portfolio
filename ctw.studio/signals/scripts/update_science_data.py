#!/usr/bin/env python3
"""Atomically refresh World Bank and Stanford science series in science.json."""

from __future__ import annotations

import csv
import json
import os
import tempfile
from io import StringIO
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "science.json"
COUNTRIES = ("WLD", "NLD", "USA", "KOR")
STANFORD_URL = (
    "https://drive.usercontent.google.com/download"
    "?id=11w0Lyo3pzA_YCbcIOrNUelv17sh2afvp&export=download&confirm=t"
)
STANFORD_HEADER = ["Year", "Number of AI publications in CS (in thousands)"]
AI_COUNTS = (
    101885, 104409, 105741, 107269, 116937, 139711,
    164199, 181107, 204054, 202734, 242664, 257891,
)
# Reviewed values from the current official Figure 1.6.1 CSV. The Drive file has
# changed in place before, so require every accepted observation to match and
# fail closed until the static chart/table receive an editorial refresh.
AI_SHARES = (
    .2163, .2175, .2167, .2197, .2342, .2584,
    .2871, .3031, .3601, .3903, .4176, .4094,
)
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


def fetch_bytes(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "CTW-Signals/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"Source returned HTTP {response.status}")
        return response.read()


def fetch_indicator(indicator_id: str) -> tuple[dict, list]:
    countries = quote(";".join(COUNTRIES), safe="")
    url = (
        f"https://api.worldbank.org/v2/country/{countries}/indicator/"
        f"{indicator_id}?format=json&per_page=1000"
    )
    payload = json.loads(fetch_bytes(url))
    if not isinstance(payload, list) or len(payload) != 2:
        raise RuntimeError(f"{indicator_id}: unexpected top-level schema")
    meta, rows = payload
    if meta.get("pages") != 1 or not isinstance(rows, list):
        raise RuntimeError(f"{indicator_id}: incomplete or invalid response")
    observed = {row.get("countryiso3code") for row in rows}
    if not set(COUNTRIES).issubset(observed):
        raise RuntimeError(f"{indicator_id}: missing countries {sorted(set(COUNTRIES) - observed)}")
    if any(row.get("indicator", {}).get("id") != indicator_id for row in rows):
        raise RuntimeError(f"{indicator_id}: indicator identity changed")
    return meta, rows


def build_series(config: dict, rows: list) -> dict:
    observations = {}
    for code in COUNTRIES:
        values = sorted(
            (
                {"year": int(row["date"]), "value": round(float(row["value"]), 4)}
                for row in rows
                if row.get("countryiso3code") == code
                and row.get("value") is not None
                and int(row["date"]) >= 2000
            ),
            key=lambda item: item["year"],
        )
        years = [item["year"] for item in values]
        if len(values) < 10:
            raise RuntimeError(f"{config['id']}: too few observations for {code}")
        if years != sorted(set(years)):
            raise RuntimeError(f"{config['id']}: duplicate or unordered years for {code}")
        observations[code] = values
    return {
        **config,
        "period": "2000–latest available annual observation",
        "denominator": "GDP" if config["id"] == "GB.XPD.RSDV.GD.ZS" else "annual article count",
        "observations": observations,
        "latest": {code: values[-1] for code, values in observations.items()},
    }


def fetch_ai_publications() -> dict:
    text = fetch_bytes(STANFORD_URL).decode("utf-8-sig")
    rows = list(csv.reader(StringIO(text)))
    if not rows or rows[0] != STANFORD_HEADER:
        raise RuntimeError(f"Stanford header changed: {rows[0] if rows else 'empty'}")
    if len(rows) != 25 or any(len(row) != 2 for row in rows[1:]):
        raise RuntimeError("Stanford CSV must contain exactly 24 two-column data rows")

    halves = (rows[1:13], rows[13:25])
    expected_years = list(range(2013, 2025))
    parsed = []
    for label, half in zip(("count", "share"), halves):
        years = [int(row[0]) for row in half]
        if years != expected_years or len(years) != len(set(years)):
            raise RuntimeError(f"Stanford {label} years changed")
        parsed.append([float(row[1]) for row in half])
    csv_counts = [round(value * 1000) for value in parsed[0]]
    if csv_counts != list(AI_COUNTS) or any(value <= 0 for value in csv_counts):
        raise RuntimeError("Stanford publication counts changed")
    if any(not 0 <= value <= 1 for value in parsed[1]):
        raise RuntimeError("Stanford publication shares outside 0..1")
    csv_shares = [round(value, 4) for value in parsed[1]]
    if csv_shares != list(AI_SHARES):
        raise RuntimeError("Stanford publication shares changed; review the static chart and table")
    growth = round((AI_COUNTS[-1] / AI_COUNTS[-2] - 1) * 100, 1)
    if growth != 6.3:
        raise RuntimeError(f"Stanford 2024 growth changed: {growth}%")

    return {
        "sourceId": "stanford-ai-publications",
        "label": "AI-related computer-science publications",
        "period": "2013–2024",
        "method": "OpenAlex bibliographic data classified with Stanford AI Index CSO Classifier v3.3; English-language publications with a computer-science label",
        "countUnit": "publications",
        "shareUnit": "share of computer-science publications",
        "observations": [
            {"year": year, "count": count, "share": share}
            for year, count, share in zip(expected_years, AI_COUNTS, AI_SHARES)
        ],
        "latestGrowthPercent": growth,
        "caveat": "Topic labels overlap; cross-disciplinary AI may be undercounted, and metadata and venue assignment lag. Volume does not measure quality, reliability, translation, AI authorship or social benefit.",
    }


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    fetched = {key: fetch_indicator(config["id"]) for key, config in INDICATORS.items()}
    ai_publications = fetch_ai_publications()
    source_dates = {meta.get("lastupdated") for meta, _ in fetched.values()}
    if None in source_dates or len(source_dates) != 1:
        raise RuntimeError(f"World Bank source-date mismatch: {sorted(source_dates, key=str)}")

    data["series"] = {
        key: build_series(INDICATORS[key], rows)
        for key, (_, rows) in fetched.items()
    }
    data["aiPublications"] = ai_publications
    data["meta"]["dataUpdated"] = source_dates.pop()
    data["meta"]["updateStatus"] = "World Bank and Stanford series refreshed; curated evidence unchanged"

    rendered = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    descriptor, temporary = tempfile.mkstemp(
        dir=DATA_PATH.parent, prefix=".science.", suffix=".json"
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
    print("Updated science.json: 2 World Bank series and Stanford Figure 1.6.1")


if __name__ == "__main__":
    main()
