#!/usr/bin/env python3
"""Complete missing ES and EN cells directly in the three-column term CSV.

One row == one unique French maillon. Machine drafts, not validated EU terminology.
Checkpoint every 250 successful nonempty translations by committing CSV + dictionaries.
"""
import argparse
import csv
import json
import os
import re
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CSV=ROOT/"data/termes_fr_es_en.csv"
LANGS={"Español":("es","Helsinki-NLP/opus-mt-fr-es","data/structured-term-translations-es.json","poc1-es-structured-v1"),
       "Inglés":("en","Helsinki-NLP/opus-mt-fr-en","data/structured-term-translations-en.json","poc1-en-structured-v1")}
HEADERS=["Francés","Español","Inglés"]
CHECKPOINT=250

def load_rows():
    with CSV.open("r",encoding="utf-8-sig",newline="") as f:
        rd=csv.DictReader(f,delimiter=";")
        if rd.fieldnames!=HEADERS: raise RuntimeError(f"Incorrect CSV columns: {rd.fieldnames}")
        rows=list(rd)
    if len(rows)!=12341: raise RuntimeError(f"Unexpected number of terms: {len(rows)}")
    unique={r["Francés"] for r in rows}
    if len(unique)!=len(rows) or "" in unique:
        raise RuntimeError("Missing or repeated French terms")
    return rows

def save(rows):
    temp=CSV.with_suffix(".csv.tmp")
    with temp.open("w",encoding="utf-8-sig",newline="") as f:
        w=csv.DictWriter(f,fieldnames=HEADERS,delimiter=";",lineterminator="\n",quoting=csv.QUOTE_ALL)
        w.writeheader()
        w.writerows(rows)
    os.replace(temp,CSV)
    for col,(lang,_model,file,schema) in LANGS.items():
        labels={r["Francés"]:r[col] for r in rows if r[col].strip()}
        payload={"schema_version":schema,"language_code":lang,"status":"MACHINE_PROPOSED_NOT_LEGALLY_VALIDATED","translations":labels}
        (ROOT/file).write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

def git_commit(rows,col,checkpoint):
    save(rows)
    subprocess.run(["git","add","data/termes_fr_es_en.csv",
                    "data/structured-term-translations-es.json",
                    "data/structured-term-translations-en.json"],check=True,cwd=ROOT)
    changes=subprocess.run(["git","diff","--cached","--quiet"],cwd=ROOT)
    if changes.returncode==0:return
    subprocess.run(["git","commit","-m",f"Translate missing {col} term rows, checkpoint {checkpoint} (unvalidated drafts)"],check=True,cwd=ROOT)
    subprocess.run(["git","push","origin","HEAD:prototype-excel-multilingue-es-en"],check=True,cwd=ROOT)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--language",choices=list(LANGS),required=True)
    parser.add_argument("--push",action="store_true")
    args=parser.parse_args()
    rows=load_rows()
    col=args.language
    code,model_name,_file,_schema=LANGS[col]
    indices=[i for i,r in enumerate(rows) if not r[col].strip()]
    print(f"{code}: {len(indices)} genuinely empty cells to translate",flush=True)
    if not indices: return
    import torch
    from transformers import AutoModelForSeq2SeqLM,AutoTokenizer
    torch.set_num_threads(min(4,os.cpu_count() or 2))
    tokenizer=AutoTokenizer.from_pretrained(model_name)
    model=AutoModelForSeq2SeqLM.from_pretrained(model_name)
    model.eval()
    added=0
    skipped=[]
    # Processing is rowwise in a single language while model inference is batched.
    for offset in range(0,len(indices),16):
        batch=indices[offset:offset+16]
        source=[rows[i]["Francés"] for i in batch]
        encoded=tokenizer(source,return_tensors="pt",padding=True,truncation=True,max_length=384)
        with torch.inference_mode():
            output=model.generate(**encoded,max_new_tokens=240,num_beams=1)
        translations=tokenizer.batch_decode(output,skip_special_tokens=True)
        for i,translated in zip(batch,translations):
            original=rows[i]["Francés"]
            draft=re.sub(r"\s+"," ",translated).strip()
            # Refuse missing/malformed output, do not invent completed translations.
            if not draft or draft==original or len(draft)>max(600,len(original)*3):
                skipped.append(original)
                continue
            if draft[0] in ("=","+","@"):
                draft="'"+draft
            rows[i][col]=draft
            added+=1
            if added%CHECKPOINT==0:
                if args.push:git_commit(rows,col,added)
                else:save(rows)
                print(f"CHECKPOINT {code}: {added} generated, {len(indices)-added} pending",flush=True)
    if args.push:git_commit(rows,col,added)
    else:save(rows)
    print(f"FINISHED language {code}: added={added}, skipped={len(skipped)}, "
          f"remaining={sum(not r[col].strip() for r in rows)}",flush=True)
    if skipped:
        print("REQUIRES_REVIEW:",json.dumps(skipped[:20],ensure_ascii=False),flush=True)
    # Report any untranslated rows without claiming false full coverage.

if __name__=="__main__":
    main()
