#!/usr/bin/env python3
"""Synchronise the three-column FR / ES / EN term table to web dictionaries.

French is the stable natural-key for provisional indexing maillons.
The source term and row order are never changed by this importer.
Only non-empty human- or machine-edited translations are imported.
All translations remain draft until validated by a qualified reviewer.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SOURCE = DATA / "termes_fr_es_en.csv"
COLS = ["Francés", "Español", "Inglés"]
TARGETS = {
    "Español": ("es", DATA / "structured-term-translations-es.json", "poc1-es-structured-v1"),
    "Inglés": ("en", DATA / "structured-term-translations-en.json", "poc1-en-structured-v1"),
}

def main():
    with SOURCE.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f, delimiter=";")
        if reader.fieldnames != COLS:
            raise ValueError("Expected exactly three columns: " + repr(COLS))
        rows = list(reader)
    if len(rows) != 12341:
        raise ValueError(f"Unexpected term count {len(rows)}; expected 12341")
    seen = set()
    for n, row in enumerate(rows, start=2):
        french = row["Francés"].strip()
        if not french or french in seen:
            raise ValueError(f"Missing or duplicated French term in row {n}")
        seen.add(french)
    for column, (lang, path, schema) in TARGETS.items():
        dictionary = {
            row["Francés"].strip(): row[column].strip()
            for row in rows if row[column] and row[column].strip()
        }
        document = {
            "schema_version": schema,
            "language_code": lang,
            "status": "PROPOSED_NOT_VALIDATED",
            "translations": dictionary,
        }
        path.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{lang}: {len(dictionary)} proposals inserted; {len(rows)-len(dictionary)} missing")
    print("Import complete: all term references remain French-keyed, and no chains were modified.")

if __name__ == "__main__":
    main()
