#!/usr/bin/env python3
"""Local XLSX indexation importer. Never publish generated data without authorization."""
import argparse
from collections import Counter
import json
from pathlib import Path
import re
from xml.etree import ElementTree as ET
from zipfile import ZipFile

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
FIELDS = ["LNS_DOCUMENT","TYPE_DOCUMENT","JUR_COD","ANNEE","ORDRE","APR_COD",
          "NUM_SUITE","NATPRO_COD","NUM_PRO","PRO_COD","TYPE_INDEX",
          "CHAINE_ID","CHAINE_INDEX_ORDRE","CHAINE_INDEX"]

def column_number(address):
    result = 0
    for char in re.match(r"[A-Z]+", address).group():
        result = result * 26 + ord(char) - 64
    return result - 1

def rows(path):
    with ZipFile(path) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            strings = ["".join(t.text or "" for t in si.iter(NS+"t")) for si in root]
        root = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
        for row in root.iter(NS+"row"):
            values = [None] * len(FIELDS)
            for cell in row.findall(NS+"c"):
                index = column_number(cell.attrib["r"])
                if index >= len(FIELDS):
                    continue
                raw = cell.find(NS+"v")
                kind = cell.attrib.get("t")
                if kind == "inlineStr":
                    values[index] = "".join(t.text or "" for t in cell.iter(NS+"t"))
                elif raw is not None:
                    value = raw.text or ""
                    if kind == "s":
                        value = strings[int(value)]
                    elif kind not in ("str","e"):
                        try:
                            value = int(value)
                        except ValueError:
                            try:
                                value = float(value)
                            except ValueError:
                                pass
                    values[index] = value
            yield values

def transform(path):
    iterator = iter(rows(path))
    if next(iterator) != FIELDS:
        raise ValueError("Unexpected headers. Check the source file and first worksheet.")
    documents, entries = {}, []
    for number, row in enumerate(iterator, 2):
        if all(x is None for x in row):
            continue
        record = dict(zip(FIELDS, row))
        doc_id, chain_id = record["LNS_DOCUMENT"], record["CHAINE_ID"]
        if not doc_id or not chain_id:
            raise ValueError("Missing source identifier on row "+str(number))
        text = str(record["CHAINE_INDEX"] or "").replace("_x000D_", "\r")
        if str(doc_id) not in documents:
            documents[str(doc_id)] = {
                "source_document_id": doc_id,
                "type_document": record["TYPE_DOCUMENT"],
                "jur_code": record["JUR_COD"],
                "year": record["ANNEE"],
                "ordre": record["ORDRE"],
                "apr_code": record["APR_COD"],
                "num_suite": record["NUM_SUITE"],
                "natpro_code": record["NATPRO_COD"],
                "num_pro": record["NUM_PRO"],
                "pro_code": record["PRO_COD"]
            }
        segments = [x.strip() for x in text.split(" - ")]
        entries.append({
            "source_chain_id": str(chain_id),
            "source_document_id": str(doc_id),
            "type_indexation": record["TYPE_INDEX"],
            "indexation_order": record["CHAINE_INDEX_ORDRE"],
            "original_text": text,
            "source_language": None,
            "reference_chain_id": None,
            "classification": "undetermined",
            "candidate_segments": segments if len(segments)>1 else [],
            "segmentation_validated": False,
            "translations": {"es": None,"en": None}
        })
    return {
        "schema_version": "import-preview-v1",
        "notice": "Local working data. Never commit or publish without authorization.",
        "profile": {
            "indexation_entries": len(entries),
            "distinct_source_chain_ids": len({x["source_chain_id"] for x in entries}),
            "documents": len(documents),
            "distinct_texts": len({x["original_text"] for x in entries}),
            "types": dict(sorted(Counter(x["type_indexation"] for x in entries).items()))
        },
        "documents": list(documents.values()),
        "indexation_entries": entries,
        "reference_chains": [],
        "term_translations": []
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Local workbook .xlsx")
    parser.add_argument("--output", type=Path, default=Path("private-import/indexation-preview.json"))
    args = parser.parse_args()
    package = transform(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(package, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(package["profile"], ensure_ascii=False, indent=2))
    print("Private output:",args.output)
