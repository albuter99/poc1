#!/usr/bin/env python3
"""Retira indexaciones de texto libre y valida la segmentacion FR.

Uso:
  python scripts/remove_free_text.py          # simulacion y auditoria, sin escribir
  python scripts/remove_free_text.py --apply  # escribe el corpus filtrado

No traduce datos. Conserva original_text. Detiene la escritura si encuentra
separadores dudosos o incoherencias; nunca corrige segmentos a ciegas.
"""
import argparse
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data/excel-manifest.json"
REPORT = ROOT / "data/structured-segmentation-review.json"
DASHES = "-‐‑‒–—―−﹘﹣－"
SPACED = re.compile(r"\\s+[" + re.escape(DASHES) + r"]\\s+")
ONE_SIDED = re.compile(r"(?:\\s+[" + re.escape(DASHES) + r"](?=\\S)|(?<=\\S)[" + re.escape(DASHES) + r"]\\s+)")
INVISIBLE = re.compile("[\\u200b\\u200c\\u200d\\ufeff]")
FREE_TYPES = {"objet", "free_text", "free text", "texte libre"}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="Persistir cambios")
    args = ap.parse_args()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    pending = {}
    removed, kept, problems, examples = [], [], [], []
    types = Counter()
    maillons = 0
    ids = set()
    all_texts = set()
    for relative in manifest["indexation_files"]:
        p = ROOT / relative
        rows = json.loads(p.read_text(encoding="utf-8"))
        if not isinstance(rows, list):
            raise ValueError(f"Lista de registros no valida: {relative}")
        filtered = []
        for row in rows:
            kind = str(row.get("type_indexation") or row.get("chain_type") or "").strip()
            if kind.casefold() in FREE_TYPES:
                removed.append(row.get("source_chain_id"))
                continue
            ident = str(row.get("source_chain_id") or "")
            terms = row.get("maillons_fr")
            label = row.get("indexation_text_fr")
            if not ident or ident in ids:
                problems.append([ident, "Identificador vacio o duplicado"])
            ids.add(ident)
            if not isinstance(terms, list) or not terms or any(not isinstance(t,str) or not t.strip() or t != t.strip() for t in terms):
                problems.append([ident, "Maillons invalidos"])
                continue
            for t in terms:
                if SPACED.search(t) or ONE_SIDED.search(t):
                    problems.append([ident, "Posible separador dentro de un termino", t[:150]])
                if "\\n" in t or "\\r" in t or INVISIBLE.search(t):
                    problems.append([ident, "Salto de linea o caracter invisible", t[:150]])
            canonical = " - ".join(terms)
            if label != canonical:
                problems.append([ident, "La cadena no coincide con los maillons", str(label)[:160]])
            if ONE_SIDED.search(str(row.get("original_text") or "")):
                examples.append([ident, "Separador con espacios asimetricos", str(row.get("original_text"))[:180]])
            if any(SPACED.search(t) for t in terms):
                problems.append([ident, "Separador no segmentado"])
            types[kind] += 1
            maillons += len(terms)
            all_texts.add(canonical)
            filtered.append(row)
            kept.append(ident)
        pending[p] = filtered
    if len(removed) + len(kept) != manifest["profile"]["indexation_entries"]:
        problems.append(["manifest", "Recuento anterior no coincide con el corpus"])
    report = {
        "source_entries": len(removed) + len(kept),
        "removed_free_text": len(removed),
        "remaining_structured": len(kept),
        "remaining_types": dict(types),
        "distinct_structured_texts": len(all_texts),
        "structured_maillon_occurrences": maillons,
        "validation_errors": problems[:300],
        "ambiguous_source_separators_to_review": examples[:300],
        "note": "Las variantes sin espacios alrededor del guion pueden formar parte de un termino compuesto y no se separan automaticamente.",
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if problems:
        raise SystemExit(f"Se encontraron {len(problems)} problemas: no se ha modificado ningun archivo")
    if not args.apply:
        print("SIMULACION: ejecutar con --apply para escribir los datos")
        return
    # Primero valida el corpus completo; solo despues persiste cambios.
    for path, rows in pending.items():
        path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    profile = manifest["profile"]
    profile["indexation_entries"] = len(kept)
    profile["distinct_source_chain_ids"] = len(kept)
    profile["distinct_texts"] = len(all_texts)
    profile["types"] = dict(types)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    print("Corpus guardado y manifiesto actualizado. Recalcular vistas y estadisticas derivadas.")

if __name__ == "__main__":
    main()
