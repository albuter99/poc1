#!/usr/bin/env python3
"""Final offline checks for the experimental MOT-CLES corpus and locales.

Run from repository root: python tests/test_final.py
No packages, server, institutional services or external requests required.
"""
import json
import re
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


class FinalChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = read_json(DATA / "excel-manifest.json")
        cls.documents = read_json(ROOT / cls.manifest["documents_file"])
        cls.entries = []
        for filename in cls.manifest["indexation_files"]:
            cls.entries.extend(read_json(ROOT / filename))

    def test_manifest_counts(self):
        p = self.manifest["profile"]
        self.assertEqual(self.manifest["schema_version"], "excel-branch-manifest-v1")
        self.assertEqual(len(self.documents), p["documents"])
        self.assertEqual(len(self.entries), p["indexation_entries"])
        self.assertEqual(len({r["source_chain_id"] for r in self.entries}), p["distinct_source_chain_ids"])
        self.assertEqual(len({r["original_text"] for r in self.entries if r["original_text"]}), p["distinct_texts"])

    def test_document_links_and_uniqueness(self):
        documents = [str(r["source_document_id"]) for r in self.documents]
        self.assertEqual(len(documents), len(set(documents)))
        known = set(documents)
        self.assertTrue(all(str(r["source_document_id"]) in known for r in self.entries))

    def test_indexation_types(self):
        actual = Counter(r["type_indexation"] for r in self.entries)
        self.assertEqual(dict(actual), self.manifest["profile"]["types"])

    def test_reference_chains_not_inferred(self):
        self.assertTrue(all(r.get("reference_chain_id") is None for r in self.entries))
        self.assertTrue(all(r.get("segmentation_validated") is False for r in self.entries))
        self.assertTrue(all(r.get("classification") == "undetermined" for r in self.entries))

    def test_translation_status_not_falsified(self):
        self.assertTrue(all(r.get("translations", {}).get("es") is None and
                            r.get("translations", {}).get("en") is None for r in self.entries))

    def test_es_en_ui_dictionary(self):
        source = (ROOT / "i18n.js").read_text(encoding="utf-8")
        labels = json.loads(re.search(r"const I18N_LABELS=(\[.*?\]);", source, re.S).group(1))
        dictionary = json.loads(re.search(r"const I18N_TRANSLATIONS=(\{.*\});\s*$", source, re.S).group(1))
        for language in ("es", "en"):
            with self.subTest(language=language):
                missing = [label for label in labels if not dictionary.get(language, {}).get(label, "").strip()]
                self.assertFalse(missing, f"Missing {language} UI labels: {missing}")

    def test_statistics_alignment(self):
        stats = read_json(DATA / "stats.json")
        self.assertEqual(stats["record_count"], self.manifest["profile"]["distinct_texts"])
        metrics = {m["key"]: m for m in stats["metrics"]}
        self.assertEqual(len(metrics), 8)
        self.assertEqual(metrics["chains_distinct"]["value"], self.manifest["profile"]["distinct_texts"])

    def test_required_application_files(self):
        for file in ("index.html", "relations.html", "branch-data.js", "graph.js", "analytics.js", "relational.js"):
            self.assertTrue((ROOT / file).is_file(), file)


if __name__ == "__main__":
    unittest.main(verbosity=2)
