#!/usr/bin/env python3
"""Contrôles reproductibles des maillons FR du corpus Excel de démonstration.

Utilisation : python scripts/check_corpus_segments.py
Les textes source sont conservés. Les indexations de type Objet sont du texte libre.
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEP = re.compile(r"(?:[\s\u00A0]+[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D\u0336][\s\u00A0]*|[\s\u00A0]*[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D\u0336][\s\u00A0]+)")
EMBEDDED = re.compile(r"[\s\u00A0]+[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D\u0336][\s\u00A0]+")
EXAMPLE = "Gaz à effet de serre − Quotas de mise sur le marché des hydrofluorocarbones"


def check():
    manifest = json.loads((ROOT / "data/excel-manifest.json").read_text(encoding="utf-8"))
    rows = []
    for name in manifest["indexation_files"]:
        rows.extend(json.loads((ROOT / name).read_text(encoding="utf-8")))
    errors = []
    by_type = Counter()
    ids = set()
    structured_terms = set()
    free_text_with_dashes = 0
    for row in rows:
        ident = str(row.get("source_chain_id") or "")
        raw = str(row.get("original_text") or "")
        terms = row.get("maillons_fr")
        kind = row.get("type_indexation")
        by_type[kind] += 1
        if ident in ids:
            errors.append((ident, "Identifiant répété"))
        ids.add(ident)
        if not isinstance(terms, list) or not terms or any(not isinstance(t, str) or not t or t != t.strip() for t in terms):
            errors.append((ident, "Maillons vides, mal formés ou non nettoyés"))
            continue
        canonical_source = str(row.get("indexation_text_fr") or "")
        expected = [raw.strip()] if kind == "Objet" else [x.strip() for x in SEP.split(canonical_source) if x.strip()]
        if terms != expected:
            errors.append((ident, "Segmentation différente du texte source"))
        canonical = raw.strip() if kind == "Objet" else " - ".join(terms)
        if row.get("indexation_text_fr") != canonical:
            errors.append((ident, "indexation_text_fr non canonique"))
        if kind == "Objet":
            if EMBEDDED.search(raw):
                free_text_with_dashes += 1
        else:
            structured_terms.update(terms)
            if any(SEP.search(t) for t in terms):
                errors.append((ident, "Séparateur entre termes resté dans un maillon"))
            if any("\\n" in t or "\\r" in t for t in terms):
                errors.append((ident, "Saut de ligne parasite dans un maillon structuré"))
    if len(rows) != manifest["profile"]["indexation_entries"]:
        errors.append(("manifest", f"Total inattendu: {len(rows)}"))
    for kind, count in manifest["profile"]["types"].items():
        if by_type[kind] != count:
            errors.append(("manifest", f"Comptage inattendu pour {kind}: {by_type[kind]} != {count}"))
    examples = [r for r in rows if EXAMPLE in r.get("original_text", "")]
    for row in examples:
        if row["maillons_fr"][:2] != ["Gaz à effet de serre", "Quotas de mise sur le marché des hydrofluorocarbones"]:
            errors.append((row["source_chain_id"], "Exemple Gaz à effet de serre mal séparé"))
    print(f"Indexations contrôlées : {len(rows)}")
    print(f"Types : {dict(by_type)}")
    print(f"Termes structurés distincts : {len(structured_terms)}")
    print(f"Textes libres Objet avec tirets espacés conservés : {free_text_with_dashes}")
    print(f"Exemples Gaz à effet de serre reconnus : {len(examples)}")
    print(f"Erreurs : {len(errors)}")
    for ident, reason in errors[:30]:
        print(f"  {ident}: {reason}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    check()
