#!/usr/bin/env python3
"""Prepare 6000 additional FR->ES draft term labels from the active structured corpus.

Uses one direct French-to-Spanish local model. Never translates a complete chain:
each candidate is one unique maillon. Drafts require legal/linguistic review.
Each group of 250 accepted labels is committed to the experimental branch.
"""
import argparse
import json
import os
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUTPUT = DATA / "structured-term-translations-es.json"
PROGRESS = DATA / "spanish-translation-progress.json"
BRANCH = "prototype-excel-multilingue-es-en"
MODEL = "Helsinki-NLP/opus-mt-fr-es"
PROTECTED = re.compile(r"(?i)(?:\b(?:directive|règlement|article|TFUE|TUE)\b|(?:\b(?:CE|UE)\b\s*[nº°.]?\s*\d)|\b\d{4}/\d{2,5}\b)")
DASH = re.compile(r"(?:\s[-\u2010-\u2015\u2212]\s)")
ONLY_CODE = re.compile(r"^(?:\(?[A-Z]{2,5}\)?|[A-Z]{1,4}-\d+/\d+)$")

def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def run(*args):
    subprocess.run(args, cwd=ROOT, check=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", type=int, default=6000)
    parser.add_argument("--checkpoint", type=int, default=250)
    parser.add_argument("--push", action="store_true")
    args = parser.parse_args()
    if args.target != 6000 or args.checkpoint != 250:
        raise SystemExit("Production run must use 6000 items and checkpoints of 250")
    manifest = read(DATA / "excel-manifest.json")
    count = Counter()
    for filename in manifest["indexation_files"]:
        for entry in read(ROOT / filename):
            if entry.get("type_indexation") == "Objet":
                raise RuntimeError("Free-text Objet present: abort")
            for term in entry["maillons_fr"]:
                term = term.strip()
                if not term or DASH.search(term):
                    raise RuntimeError("Invalid maillon: " + repr(term))
                count[term] += 1
    bundle = read(OUTPUT)
    if bundle["schema_version"] != "poc1-es-structured-v1" or bundle["language_code"] != "es":
        raise RuntimeError("Unexpected target translations schema")
    labels = bundle["translations"]
    baseline = read(PROGRESS) if PROGRESS.exists() else None
    if baseline:
        if baseline["target_new"] != args.target:
            raise RuntimeError("Conflicting prior translation target")
        candidates = baseline["candidate_labels"]
    else:
        candidates = [
            term for term, _frequency in sorted(count.items(), key=lambda item: (-item[1], item[0].casefold()))
            if term not in labels
        ]
        if len(candidates) < args.target:
            raise RuntimeError("Insufficient untranslated structured terms")
        baseline = {
            "schema_version": "poc1-es-batch-progress-v1",
            "language_code": "es",
            "source": "data/excel-manifest.json",
            "model": MODEL,
            "translation_status": "MACHINE_PROPOSED_REVIEW_REQUIRED",
            "target_new": args.target,
            "checkpoint_size": args.checkpoint,
            "initial_translated": len(set(labels) & set(count)),
            "candidate_labels": candidates,
            "checkpoint_history": [],
            "rejected_labels": [],
        }
    # For a rerun, only candidate_labels not yet in the dictionary are processed.
    already = set(labels)
    added = sum(term in already for term in candidates)
    if added >= args.target:
        print("Goal already reached, no changes.")
        return

    import torch
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    torch.set_num_threads(2)
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL)
    model.eval()
    rejected = set(baseline.get("rejected_labels", []))
    queue = [x for x in candidates if x not in already and x not in rejected]
    pending = 0
    for offset in range(0, len(queue), 12):
        if added >= args.target:
            break
        terms = queue[offset:offset + 12]
        encoded = tokenizer(terms, padding=True, truncation=True, max_length=256, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(**encoded, max_new_tokens=192, num_beams=1)
        drafts = tokenizer.batch_decode(outputs, skip_special_tokens=True)
        for fr, es in zip(terms, drafts):
            if added >= args.target:
                break
            es = re.sub(r"\s+", " ", es).strip()
            if not es or es == fr or len(es) < 2 or len(es) > max(450, 2.5 * len(fr)):
                rejected.add(fr)
                continue
            if ONLY_CODE.fullmatch(fr):
                rejected.add(fr)
                continue
            # Legal citations and article numbers need specialist review,
            # but all machine proposals are already flagged as unvalidated.
            labels[fr] = es
            added += 1
            pending += 1
            if added % args.checkpoint == 0:
                baseline["completed_new"] = added
                baseline["translated_active_terms"] = len(set(labels) & set(count))
                baseline["total_active_terms"] = len(count)
                baseline["rejected_labels"] = sorted(rejected)
                baseline["updated_at_utc"] = datetime.now(timezone.utc).isoformat()
                baseline["checkpoint_history"].append({"added_new": added, "translated_active_terms": baseline["translated_active_terms"]})
                save(OUTPUT, bundle)
                save(PROGRESS, baseline)
                print("CHECKPOINT", added, "/", args.target, "translations", flush=True)
                if args.push:
                    run("git", "add", str(OUTPUT.relative_to(ROOT)), str(PROGRESS.relative_to(ROOT)))
                    run("git", "commit", "-m", "Spanish machine translation checkpoint " + str(added) + "/6000 (review required)")
                    run("git", "push", "origin", "HEAD:" + BRANCH)
                pending = 0
    if pending or not PROGRESS.exists():
        baseline["completed_new"] = added
        baseline["translated_active_terms"] = len(set(labels) & set(count))
        baseline["total_active_terms"] = len(count)
        baseline["rejected_labels"] = sorted(rejected)
        baseline["updated_at_utc"] = datetime.now(timezone.utc).isoformat()
        save(OUTPUT, bundle)
        save(PROGRESS, baseline)
        if args.push:
            run("git", "add", str(OUTPUT.relative_to(ROOT)), str(PROGRESS.relative_to(ROOT)))
            run("git", "commit", "-m", "Spanish machine translation partial checkpoint " + str(added) + "/6000")
            run("git", "push", "origin", "HEAD:" + BRANCH)
    if added < args.target:
        raise RuntimeError("Only %d of 6000 machine proposals generated: inspect rejected labels" % added)
    print("Goal reached:", added, "new FR->ES machine proposals requiring review")

if __name__ == "__main__":
    main()
