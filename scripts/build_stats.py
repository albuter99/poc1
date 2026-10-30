#!/usr/bin/env python3
"""Generate deterministic Poc1 dashboard analytics from reference-chain JSON.

All analytic aggregation is performed in Python. GitHub Pages only renders
the resulting static data/stats.json. Local browser drafts are NOT part of it.
"""
from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
import json
import re
import unicodedata

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
    # Maillons used here = consecutive parent -> child pairs, rather than
    # branch membership records. We do not have separate IDs for maillons.
    maillons = Counter((a, b) for path in all_paths for a, b in zip(path, path[1:]))
    chain_names = Counter(" - ".join(path) for path in all_paths if path)
    lengths = Counter(len(path) for path in all_paths)
    domains = Counter((c.get("root") or (path[0] if path else "Non renseigné"))
                      for c, path in zip(chains, all_paths))
    dates = Counter()
    for c in chains:
        raw = str(c.get("created_at") or "")
        try:
            month = datetime.fromisoformat(raw.replace("Z", "+00:00")).strftime("%Y-%m")
            dates[month] += 1
        except (ValueError, TypeError):
            pass
    monthly = [{"label": mon, "value": count} for mon, count in sorted(dates.items())]
    last = sorted(dates)[-1] if dates else None
    prev = None
    if last:
        yy, mm = map(int, last.split("-"))
        prev = f"{yy-1}-12" if mm == 1 else f"{yy}-{mm-1:02d}"
    current_count = dates[last] if last else None
    prior_count = dates.get(prev, 0) if prev else None
    rate = ((current_count - prior_count) / prior_count * 100
            if current_count is not None and prior_count else None)
    maximum = max(lengths) if lengths else 0
    minimum = min(lengths) if lengths else 0
    distinct = len(chain_names)
    output = [
        block("keywords_total", "Mots-clés distincts", len(keywords), "Termes uniques exacts",
              ordered(keywords, 10), note="Les termes sont comparés à l'identique, accents compris. Les termes de niveau 1 sont inclus."),
        block("keywords_frequency", "Fréquence des mots-clés", sum(keywords.values()), "Occurrences totales",
              ordered(keywords, 30), note="Nombre de chaînes contenant chaque mot-clé, compté une fois par position."),
        block("maillons_total", "Maillons distincts", len(maillons), "Paires consécutives uniques",
              ordered(Counter({f"{a} → {b}": n for (a,b),n in maillons.items()}), 12),
              note="Définition provisoire : un maillon distinct est ici une paire ordonnée de termes consécutifs. Ce n'est pas un identifiant de maillon métier."),
        block("maillons_frequency", "Fréquence des maillons", sum(maillons.values()), "Liens ordonnés totaux",
              ordered(Counter({f"{a} → {b}": n for (a,b),n in maillons.items()}), 30),
              note="Fréquence des paires de termes adjacents, calculée à partir des chaînes."),
        block("chains_distinct", "Chaînes distinctes", distinct, "Libellés complets uniques",
              ordered(chain_names, 12), note="Une chaîne est distincte si sa séquence complète ordonnée diffère."),
        block("chains_frequency", "Fréquence des chaînes", len(chains), "Enregistrements totaux",
              ordered(chain_names, 30), note="Compte les répétitions exactes d'une même séquence complète."),
        block("length_range", "Longueur min. / max.", f"{minimum} / {maximum}", "Nombre de termes par chaîne",
              [{"label": f"{n} termes", "value": lengths[n]} for n in sorted(lengths, reverse=True)],
              note="La profondeur est le nombre de termes qui composent la chaîne, y compris le niveau racine."),
        block("length_language", "Longueur par langue (LNG)", None, "Langues des chaînes non renseignées",
              kind="unavailable", status="pending",
              note="La langue de l'interface ne constitue pas une langue de chaîne. Un champ LNG par chaîne est nécessaire."),
        block("depth_max", "Profondeur maximale", maximum, "Niveaux hiérarchiques",
              [{"label":f"{n} niveaux","value":lengths[n]} for n in sorted(lengths, reverse=True)],
              note="Pour cette maquette, un niveau correspond à un terme dans la chaîne."),
        block("legal_domains", "Répartition par domaine juridique", len(domains), "Domaines présents",
              ordered(domains, 30), note="Classification calculée depuis root (premier niveau)."),
        block("orphan_maillons", "Proportion de maillons orphelins", None, "Référentiel des maillons absent",
              kind="unavailable", status="pending",
              note="Impossible de déterminer des maillons orphelins sans un catalogue de maillons indépendant des chaînes."),
        block("monthly_new", "Nouvelles entrées par mois", rate, "Variation du dernier mois (en %)" if rate is not None else "Taux non calculable",
              monthly, kind="timeline",
              note=("Les dates created_at sont fictives. Variation calculée entre " + str(last) + " et " + str(prev) +
                    " lorsque le mois précédent contient au moins une entrée. Sinon taux indéfini."),
              unit="%" if rate is not None else None),
        block("synonyms", "Synonymes / variantes", None, "Aucun catalogue de synonymes",
              kind="unavailable", status="pending",
              note="Ne pas déduire des synonymes de chaînes similaires : une table de correspondances explicite est nécessaire."),
        block("length_distribution", "Répartition des chaînes par longueur", len(lengths), "Longueurs observées",
              [{"label":f"{n} termes","value":lengths[n]} for n in sorted(lengths, reverse=True)],
              note="Chaque barre indique le nombre de chaînes de cette longueur.")
    ]
    return {
        "schema_version": 1, "origin": "python", "source": "data/chains.json",
        "record_count": len(chains), "metrics": output,
        "warning": "Statistiques calculées en Python uniquement sur le JSON versionné. Les créations locales du navigateur ne sont pas incluses.",
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
