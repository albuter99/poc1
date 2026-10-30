#!/usr/bin/env python3
"""Process an owner-approved Poc1 GitHub issue into the versioned JSON.

Run only in the issue workflow. This never trusts an ID or author from the
issue body. GitHub Actions separately verifies github.event.issue.user.login.
"""
from __future__ import annotations

import json
import os
import re
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "chains.json"
MARKER = "POC1_CHAIN_REQUEST_V1"
PATTERN = re.compile(r"\bPOC1_CHAIN_REQUEST_V1\s*\x60\x60\x60json\s*(\{[\s\S]*?\})\s*\x60\x60\x60", re.I)
MAX_TERMS = 20

def clean_term(term, max_len=150):
    if not isinstance(term, str):
        raise ValueError("Les termes doivent être des chaînes de caractères")
    term = term.strip()
    if not 1 <= len(term) <= max_len or any(ord(c) < 32 for c in term):
        raise ValueError("Terme invalide ou trop long")
    return term

def read_issue():
    event_path = Path(os.environ["GITHUB_EVENT_PATH"])
    event = json.loads(event_path.read_text(encoding="utf-8"))
    owner = os.environ["GITHUB_REPOSITORY_OWNER"]
    author = event.get("issue", {}).get("user", {}).get("login", "")
    if author.casefold() != owner.casefold():
        raise PermissionError("Seul le propriétaire du dépôt peut ajouter une chaîne")
    body = event.get("issue", {}).get("body") or ""
    if len(body) > 12000:
        raise ValueError("Demande trop longue")
    match = PATTERN.search(body)
    if not match:
        raise ValueError("Demande Poc1 absente ou mal formatée")
    obj = json.loads(match.group(1))
    if not isinstance(obj, dict) or obj.get("version") != 1:
        raise ValueError("Version de la demande non prise en charge")
    return obj

def validate_date(s):
    if not isinstance(s, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        raise ValueError("Date au format AAAA-MM-JJ obligatoire")
    date.fromisoformat(s)
    return s

def build_record(data, req):
    base = clean_term(req.get("base_chain"), max_len=1800)
    selected = req.get("selected_terms")
    if not isinstance(selected, list) or not 1 <= len(selected) <= MAX_TERMS:
        raise ValueError("Choisissez entre 1 et 20 termes")
    selected = [clean_term(x) for x in selected]
    if len(set(selected)) != len(selected):
        raise ValueError("Les termes ajoutés doivent être distincts")
    # The base must be a complete existing prefix, not arbitrary unvalidated text.
    existing = [c.get("full_chain_label", "") for c in data]
    if not any(chain == base or chain.startswith(base + " - ") for chain in existing):
        raise ValueError("La chaîne de base n'existe pas dans le référentiel")
    start = validate_date(req.get("validity_start_date"))
    end = validate_date(req.get("validity_end_date") or "1900-01-01")
    full = base + " - " + " - ".join(selected)
    if any(c.get("full_chain_label") == full for c in data):
        raise ValueError("Cette chaîne existe déjà dans le référentiel")
    highest = max((int(c["id"][4:]) for c in data
                   if re.fullmatch(r"REF-\d+", str(c.get("id", "")))), default=0)
    return {
        "id": f"REF-{highest + 1:04d}",
        "root": base.split(" - ")[0],
        "base_chain": base,
        "selected_terms": selected,
        "full_chain_label": full,
        "validity_start_date": start,
        "validity_end_date": end,
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "status": "Active",
    }

def main():
    req = read_issue()
    chains = json.loads(DATA.read_text(encoding="utf-8"))
    if not isinstance(chains, list):
        raise ValueError("Le fichier chains.json n'est pas un tableau")
    entry = build_record(chains, req)
    chains.append(entry)
    DATA.write_text(json.dumps(chains, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created {entry['id']} with {len(entry['selected_terms'])} terms")
    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        with open(output, "a", encoding="utf-8") as fh:
            fh.write(f"new_id={entry['id']}\n")

if __name__ == "__main__":
    main()
