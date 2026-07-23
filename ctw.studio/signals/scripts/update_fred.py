#!/usr/bin/env python3
"""Refresh the live BLS/FRED series used by the AI-and-jobs dashboard.

The script deliberately updates only official monthly time series and derived
headline values. Curated research evidence in data/ai-jobs.json remains manual
because exposure studies, working papers, and forecasts require source review.
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "ai-jobs.json"
START_DATE = "2020-01-01"
CHATGPT_BASELINE = "2022-11-01"
KNOWN_UNAVAILABLE = {
    "UNRATE": {
        "2025-10-01": "Data unavailable due to the 2025 lapse in appropriations.",
    }
}

SERIES = {
    "openings": {
        "fredId": "JTSJOL",
        "label": "Job openings",
        "shortLabel": "Openings",
        "unit": "million",
        "decimals": 3,
        "divisor": 1000,
        "sourceId": "fred-jolts",
        "definition": "Seasonally adjusted total nonfarm job openings in the United States.",
    },
    "hires": {
        "fredId": "JTSHIL",
        "label": "Hires",
        "shortLabel": "Hires",
        "unit": "million",
        "decimals": 3,
        "divisor": 1000,
        "sourceId": "fred-jolts",
        "definition": "Seasonally adjusted total nonfarm hires in the United States.",
    },
    "unemployment": {
        "fredId": "UNRATE",
        "label": "Unemployment rate",
        "shortLabel": "Unemployment",
        "unit": "percent",
        "decimals": 1,
        "divisor": 1,
        "sourceId": "fred-unrate",
        "definition": "Seasonally adjusted U.S. civilian unemployment rate.",
    },
}


def monthly_dates(start: str, end: str) -> list[str]:
    cursor = date.fromisoformat(start)
    final = date.fromisoformat(end)
    months = []
    while cursor <= final:
        months.append(cursor.isoformat())
        cursor = date(cursor.year + (cursor.month == 12), cursor.month % 12 + 1, 1)
    return months


def validate_monthly_series(fred_id: str, observations: list[dict]) -> list[dict]:
    dates = [item["date"] for item in observations]
    if dates != sorted(set(dates)):
        raise RuntimeError(f"{fred_id} dates are duplicated or out of order")

    expected = set(monthly_dates(dates[0], dates[-1]))
    missing = expected - set(dates)
    documented = set(KNOWN_UNAVAILABLE.get(fred_id, {})) & expected
    undocumented = missing - documented
    unexpectedly_present = documented - missing
    if undocumented:
        raise RuntimeError(
            f"{fred_id} has undocumented missing months: {', '.join(sorted(undocumented))}"
        )
    if unexpectedly_present:
        raise RuntimeError(
            f"{fred_id} now publishes formerly unavailable months: "
            f"{', '.join(sorted(unexpectedly_present))}; review the exception list"
        )

    return [
        {"date": missing_date, "reason": KNOWN_UNAVAILABLE[fred_id][missing_date]}
        for missing_date in sorted(missing)
    ]


def download_series(
    fred_id: str, divisor: float, decimals: int
) -> tuple[list[dict], list[dict]]:
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={fred_id}"
    result = subprocess.run(
        [
            "curl",
            "--fail",
            "--silent",
            "--show-error",
            "--location",
            "--retry",
            "3",
            "--connect-timeout",
            "20",
            "--max-time",
            "120",
            url,
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    text = result.stdout

    observations = []
    for row in csv.DictReader(io.StringIO(text)):
        raw = row.get(fred_id)
        observation_date = row.get("observation_date", "")
        if not raw or raw == "." or observation_date < START_DATE:
            continue
        observations.append(
            {
                "date": observation_date,
                "value": round(float(raw) / divisor, decimals),
            }
        )

    if not observations:
        raise RuntimeError(f"FRED returned no usable observations for {fred_id}")
    unavailable = validate_monthly_series(fred_id, observations)
    return observations, unavailable


def observation_on(series: list[dict], wanted_date: str) -> dict:
    try:
        return next(item for item in series if item["date"] == wanted_date)
    except StopIteration as exc:
        raise RuntimeError(f"Series is missing required baseline {wanted_date}") from exc


def percent_change(start: float, end: float) -> float:
    return round(((end - start) / start) * 100, 1)


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    refreshed = {}

    for key, config in SERIES.items():
        observations, unavailable = download_series(
            config["fredId"], config["divisor"], config["decimals"]
        )
        refreshed[key] = {
            field: value
            for field, value in config.items()
            if field not in {"divisor", "decimals"}
        }
        refreshed[key]["observations"] = observations
        refreshed[key]["unavailable"] = unavailable
        refreshed[key]["latest"] = observations[-1]

    openings = refreshed["openings"]["observations"]
    hires = refreshed["hires"]["observations"]
    unemployment = refreshed["unemployment"]["observations"]
    openings_baseline = observation_on(openings, CHATGPT_BASELINE)
    unemployment_baseline = observation_on(unemployment, CHATGPT_BASELINE)
    pre_chatgpt_peak = max(
        (item for item in openings if item["date"] <= CHATGPT_BASELINE),
        key=lambda item: item["value"],
    )

    data["series"] = refreshed
    data["headline"] = {
        "chatgptBaseline": CHATGPT_BASELINE,
        "openingsAtBaseline": openings_baseline,
        "openingsLatest": refreshed["openings"]["latest"],
        "openingsChangeSinceBaselinePct": percent_change(
            openings_baseline["value"], refreshed["openings"]["latest"]["value"]
        ),
        "preChatgptOpeningsPeak": pre_chatgpt_peak,
        "openingsChangeFromPreChatgptPeakPct": percent_change(
            pre_chatgpt_peak["value"], refreshed["openings"]["latest"]["value"]
        ),
        "hiresLatest": refreshed["hires"]["latest"],
        "unemploymentAtBaseline": unemployment_baseline,
        "unemploymentLatest": refreshed["unemployment"]["latest"],
        "unemploymentChangeSinceBaselinePoints": round(
            refreshed["unemployment"]["latest"]["value"]
            - unemployment_baseline["value"],
            1,
        ),
    }
    data["meta"]["seriesUpdated"] = date.today().isoformat()
    DATA_PATH.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    print(f"Updated {DATA_PATH}")
    for key, series in refreshed.items():
        latest = series["latest"]
        print(f"  {key}: {latest['value']} ({latest['date']})")


if __name__ == "__main__":
    main()
