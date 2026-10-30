"""Unit tests for the owner-approved issue importer (no external packages)."""
import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parent / "import_issue.py"
spec = importlib.util.spec_from_file_location("import_issue", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

SAMPLE = [
    {
        "id": "REF-0001",
        "root": "Droit institutionnel",
        "base_chain": "Droit institutionnel - Conditions de recevabilité",
        "full_chain_label": "Droit institutionnel - Conditions de recevabilité - Portée",
        "selected_terms": ["Portée"],
    }
]
REQUEST = {
    "version": 1,
    "base_chain": "Droit institutionnel - Conditions de recevabilité",
    "selected_terms": ["Notification", "Conditions"],
    "validity_start_date": "2026-10-30",
    "validity_end_date": "1900-01-01",
}

class ImportTest(unittest.TestCase):
    def test_build_record(self):
        result = mod.build_record(SAMPLE, REQUEST)
        self.assertEqual(result["id"], "REF-0002")
        self.assertEqual(result["selected_terms"], ["Notification", "Conditions"])
        self.assertTrue(result["full_chain_label"].endswith("Notification - Conditions"))
        self.assertEqual(result["root"], "Droit institutionnel")

    def test_duplicate_rejected(self):
        req = dict(REQUEST, selected_terms=["Portée"])
        with self.assertRaisesRegex(ValueError, "existe déjà"):
            mod.build_record(SAMPLE, req)

    def test_unknown_base_rejected(self):
        req = dict(REQUEST, base_chain="Autre matière")
        with self.assertRaisesRegex(ValueError, "n'existe pas"):
            mod.build_record(SAMPLE, req)

    def test_invalid_date_rejected(self):
        req = dict(REQUEST, validity_start_date="2026-02-31")
        with self.assertRaises(ValueError):
            mod.build_record(SAMPLE, req)

    def test_long_base_allowed(self):
        extended = "Droit institutionnel - " + " - ".join(["Sous-niveau"] * 20)
        sample = [dict(SAMPLE[0], full_chain_label=extended + " - Portée")]
        req = dict(REQUEST, base_chain=extended)
        self.assertEqual(mod.build_record(sample, req)["base_chain"], extended)

    def test_owner_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "event.json"
            issue_body = ("POC1_CHAIN_REQUEST_V1\n\n```json\n" +
                          json.dumps(REQUEST) + "\n```")
            event = {"issue":{"user":{"login":"random-visitor"}, "body":issue_body}}
            path.write_text(json.dumps(event), encoding="utf-8")
            env = {"GITHUB_EVENT_PATH":str(path), "GITHUB_REPOSITORY_OWNER":"albuter99"}
            with patch.dict(os.environ,env):
                with self.assertRaises(PermissionError):
                    mod.read_issue()
                event["issue"]["user"]["login"] = "albuter99"
                path.write_text(json.dumps(event), encoding="utf-8")
                self.assertEqual(mod.read_issue(), REQUEST)

if __name__ == "__main__":
    unittest.main()
