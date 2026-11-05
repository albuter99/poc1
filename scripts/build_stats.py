#!/usr/bin/env python3
"""Generate deterministic Poc1 dashboard analytics from reference-chain JSON.

All analytic aggregation is performed in Python. GitHub Pages only renders
the resulting static data/stats.json. Local browser edits are recalculated using the same Python code via Pyodide.
"""
from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "chains.json"
DEST = ROOT / "data" / "stats.json"
GRAPH = ROOT / "data" / "graph-relations.json"

def entries(record):
    full = record.get("full_chain_label") or ""
    return [piece.strip() for piece in full.split(" - ") if piece.strip()]

def ordered(counter, limit=20):
    return [{"label": str(k), "value": v} for k, v in
            sorted(counter.items(), key=lambda t: (-t[1], str(t[0]).casefold()))[:limit]]

def number(value):
    return None if value is None else round(value, 2)

def block(key, title, value, subtitle, rows=None, kind="bars", note=None,
          status="ready", unit=None, source="data/chains.json"):
    return {
        "key": key, "title": title, "value": value, "subtitle": subtitle,
        "rows": rows or [], "kind": kind, "note": note, "status": status,
        "unit": unit, "source": source,
    }

def compute(chains):
    all_paths = [entries(c) for c in chains]
    keywords = Counter(t for path in all_paths for t in path)
    chain_names = Counter(" - ".join(path) for path in all_paths if path)
    lengths = Counter(len(path) for path in all_paths)
    metadata = json.loads(poc_metadata_json) if "poc_metadata_json" in globals() else (json.loads(GRAPH.read_text(encoding="utf-8")) if GRAPH.exists() else {"relations": {}})
    relations = metadata.get("relations", {})
    index_types = Counter()
    for chain in chains:
        value = chain.get("types_indexation", chain.get("type_indexation"))
        if value is None:
            value = relations.get(chain.get("id"), {}).get("type_indexation")
        kinds = value if isinstance(value, list) else ([value] if value else [])
        for kind in set(str(kind).strip() for kind in kinds if str(kind).strip()):
            index_types[kind] += 1
    missing = sum(1 for chain in chains if not (chain["types_indexation"] if "types_indexation" in chain else (chain.get("type_indexation") or relations.get(chain.get("id"), {}).get("type_indexation"))))
    if missing:
        index_types["Sans type d’indexation"] += missing
    dates = Counter()
    for c in chains:
        raw = str(c.get("created_at") or "")
        try:
            month = datetime.fromisoformat(raw.replace("Z", "+00:00")).strftime("%Y-%m")
            dates[month] += 1
        except (ValueError, TypeError):
            pass
    monthly = [{"label": mon, "value": count} for mon, count in sorted(dates.items())]
    current_month = datetime.now(timezone.utc).strftime("%Y-%m")
    current_count = dates.get(current_month, 0)
    maximum = max(lengths) if lengths else 0
    minimum = min(lengths) if lengths else 0
    distinct = len(chain_names)
    output = [
        block("keywords_total", "Nombre de termes différents", len(keywords),
              "Nombre total de termes distincts utilisés dans les chaînes.",
              ordered(keywords, 10),
              note="Nombre total de termes distincts utilisés dans les chaînes de référence."),
        block("keywords_frequency", "Nombre total de maillons", sum(keywords.values()),
              "Nombre total d’occurrences de termes dans l’ensemble des chaînes.",
              ordered(keywords, 30),
              note="Nombre total d’occurrences de termes dans l’ensemble des chaînes de référence."),
        block("chains_distinct", "Nombre de chaînes différentes", distinct,
              "Nombre total de chaînes distinctes présentes dans le répertoire.",
              ordered(chain_names, 12),
              note="Nombre total de chaînes de référence distinctes présentes dans le répertoire."),
        block("length_range", "Distribution de chaînes par nombre de maillons", len(chains),
              "Répartition du nombre de chaînes par nombre de maillons.",
              [{"label": f"{n} maillons", "value": lengths[n]} for n in sorted(lengths)],
              note="Répartition du nombre de chaînes de référence par nombre de maillons."),
        block("length_min", "Longueur minimale des chaînes", minimum,
              "Chaîne avec le nombre le plus petit de maillons.",
              [{"label": f"{n} maillons", "value": lengths[n]} for n in sorted(lengths)],
              note="Nombre de maillons de la chaîne de référence comportant le moins de maillons dans le répertoire."),
        block("length_max", "Longueur maximale des chaînes", maximum,
              "Chaîne avec le nombre le plus grand de maillons.",
              [{"label": f"{n} maillons", "value": lengths[n]} for n in sorted(lengths, reverse=True)],
              note="Nombre de maillons de la chaîne de référence comportant le plus de maillons dans le répertoire."),
        block("indexation_types", "Distribution par type d’indexation", sum(index_types.values()),
              "Répartition du nombre de chaînes par type d’indexation.",
              ordered(index_types, 30),
              note="Répartition du nombre de chaînes de référence par type d’indexation.",
              source="data/chains.json et data/graph-relations.json"),
        block("monthly_new", "Nombre de chaînes créées par mois", current_count,
              "Évolution mensuelle du nombre de chaînes créées.",
              monthly, kind="timeline",
              note="Évolution mensuelle du nombre de chaînes de référence créées."),

    ]
    return {
        "schema_version": 1, "origin": "python", "source": "data/chains.json",
        "record_count": len(chains), "metrics": output,
        "warning": "Statistiques Python calculées à partir des chaînes fournies.",
        "generated_from": "scripts/build_stats.py",
    }

def main():
    records = json.loads(SOURCE.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError("Expected a JSON list")
    stats = compute(records)
    DEST.write_text(json.dumps(stats, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Computed {len(stats['metrics'])} metrics for {len(records)} chains in {DEST}")

if __name__ == "__main__":
    main()
