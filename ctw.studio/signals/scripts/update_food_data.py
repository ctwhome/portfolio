#!/usr/bin/env python3
"""Refresh updateable global food-system observations baked into food-system.json.

Sources:
- FAOSTAT data republished through the Our World in Data grapher
- Poore & Nemecek (2018) product footprints republished through OWID

No credentials are required. Curated interpretation and slow-moving assessment values
remain deliberately review-gated in the JSON file.
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
from datetime import date
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "food-system.json"
SLAUGHTER_URL = "https://ourworldindata.org/grapher/animals-slaughtered-for-meat.csv"
FOOTPRINT_URL = "https://ourworldindata.org/grapher/food-emissions-supply-chain.csv"

SPECIES = ["Chicken", "Duck", "Pig", "Sheep", "Goat", "Turkey", "Cattle"]
PRODUCTS = [
    "Beef (beef herd)",
    "Lamb & Mutton",
    "Fish (farmed)",
    "Pig Meat",
    "Poultry Meat",
    "Tofu",
    "Peas",
]


def fetch_text(url: str) -> str:
    result = subprocess.run(
        [
            "curl",
            "--fail",
            "--silent",
            "--show-error",
            "--location",
            "--retry",
            "3",
            "--retry-delay",
            "2",
            url,
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def is_leap(year: int) -> bool:
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def refresh_slaughter(data: dict) -> None:
    rows = list(csv.DictReader(io.StringIO(fetch_text(SLAUGHTER_URL))))
    world = [row for row in rows if row.get("Entity") == "World"]
    if not world:
        raise RuntimeError("No World observations in slaughter dataset")

    latest_year = max(int(row["Year"]) for row in world)
    row = next(row for row in world if int(row["Year"]) == latest_year)
    missing = [species for species in SPECIES if not row.get(species)]
    if missing:
        raise RuntimeError(f"Missing slaughter columns for {', '.join(missing)}")

    days = 366 if is_leap(latest_year) else 365
    species_rows = []
    for species in SPECIES:
        annual = int(float(row[species]))
        species_rows.append(
            {
                "name": species,
                "annual": annual,
                "daily": round(annual / days),
            }
        )

    annual_total = sum(item["annual"] for item in species_rows)
    species_rows.sort(key=lambda item: item["annual"], reverse=True)
    data["slaughter"].update(
        {
            "year": latest_year,
            "daysInYear": days,
            "speciesIncluded": SPECIES,
            "annualTracked": annual_total,
            "dailyTracked": round(annual_total / days),
            "perMinuteTracked": round(annual_total / days / 24 / 60),
            "species": species_rows,
        }
    )


def refresh_footprints(data: dict) -> None:
    rows = list(csv.DictReader(io.StringIO(fetch_text(FOOTPRINT_URL))))
    by_product = {row["Entity"]: row for row in rows}
    missing = [name for name in PRODUCTS if name not in by_product]
    if missing:
        raise RuntimeError(f"Missing footprint rows for {', '.join(missing)}")

    footprints = []
    for name in PRODUCTS:
        row = by_product[name]
        total = sum(
            float(value)
            for key, value in row.items()
            if key not in {"Entity", "Year"} and value
        )
        footprints.append(
            {
                "product": name,
                "year": int(row["Year"]),
                "kgCO2ePerKgFood": round(total, 2),
            }
        )
    data["productFootprints"] = footprints


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    refresh_slaughter(data)
    refresh_footprints(data)
    data["meta"]["dataUpdated"] = date.today().isoformat()
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        "Updated food-system.json: "
        f"{data['slaughter']['year']} slaughter counts, "
        f"{len(data['productFootprints'])} product footprints"
    )


if __name__ == "__main__":
    main()
