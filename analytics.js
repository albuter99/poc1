(function(){
"use strict";
let cache=null,loading=null,lastModal=null;
const source="./data/stats.json";
function e(v){return String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]))}
function fmt(n){return typeof n==="number"?new Intl.NumberFormat("fr-FR",{maximumFractionDigits:2}).format(n):String(n)}
function num(v){return v===null||v===undefined?"À compléter":fmt(v)}
function micro(rows){if(!rows.length)return '<span class="analytics-empty">Données non disponibles</span>';const vals=rows.slice(0,7),max=Math.max(...vals.map(x=>x.value),1);return '<div class="analytics-spark" aria-hidden="true">'+vals.map(x=>'<span style="height:'+Math.max(6,x.value/max*100)+'%"></span>').join("")+'</div>'}
function tile(m,i){return '<button type="button" class="analytics-tile" data-metric="'+e(m.key)+'" aria-label="Afficher '+e(m.title)+'">'+
'<span class="analytics-tile-header"><span class="analytics-number">'+String(i+1).padStart(2,"0")+'</span><span class="analytics-expand">↗</span></span>'+
'<span class="analytics-tile-title">'+e(m.title)+'</span>'+
'<span class="analytics-tile-body"><span class="analytics-tile-value '+(m.status!=="ready"?"analytics-pending":"")+'">'+e(num(m.value))+(m.unit?" "+e(m.unit):"")+'</span>'+micro(m.rows)+'</span>'+
'<span class="analytics-tile-foot">'+e(m.subtitle)+'</span></button>'}
function bars(rows){if(!rows?.length)return '<p class="analytics-no-data">Pas de données disponibles.</p>';const max=Math.max(...rows.map(x=>x.value),1);return '<div class="analytics-bars">'+rows.map((x,i)=>'<div class="analytics-bar-row"><div class="analytics-bar-head"><span><b>'+String(i+1).padStart(2,"0")+'</b> '+e(x.label)+'</span><strong>'+fmt(x.value)+'</strong></div><div class="analytics-track"><div style="width:'+Math.max(.5,x.value/max*100)+'%"></div></div></div>').join("")+'</div>'}
function close(){document.getElementById("analytics-modal")?.remove();document.removeEventListener("keydown",onKey);lastModal?.focus?.()}
function onKey(ev){if(ev.key==="Escape")close()}
function openMetric(metric,trigger){lastModal=trigger;close();lastModal=trigger;const root=document.createElement("div");root.id="analytics-modal";root.className="analytics-modal-overlay";root.innerHTML='<section class="analytics-modal-panel" role="dialog" aria-modal="true" aria-labelledby="analytics-modal-title"><header><div><small>ANALYSE PYTHON · DATASET DE DÉMONSTRATION</small><h2 id="analytics-modal-title">'+e(metric.title)+'</h2><p>'+e(metric.subtitle)+'</p></div><button id="analytics-close" class="analytics-close" aria-label="Fermer">×</button></header><div class="analytics-modal-content"><div class="analytics-modal-summary"><strong>'+e(num(metric.value))+(metric.unit?" "+e(metric.unit):"")+'</strong><span>'+e(metric.status==="pending"?"Non calculable avec les données actuelles":"Valeur calculée par Python")+'</span></div>'+bars(metric.rows)+'<div class="analytics-method"><strong>Méthodologie</strong><p>'+e(metric.note||"")+'</p><small>Source : '+e(metric.source)+' · Calcul Python (serveur ou navigateur selon les données)</small></div></div></section>';document.body.appendChild(root);root.onclick=ev=>{if(ev.target===root)close()};document.getElementById("analytics-close").onclick=close;document.addEventListener("keydown",onKey);document.getElementById("analytics-close").focus()}
async function get(){if(cache)return cache;if(!loading)loading=fetch(source,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{if(d.origin!=="python"||!Array.isArray(d.metrics))throw Error("Analytics format invalid");cache=d;return d});return loading}
let pythonLoader=null,pythonSource=null,instance=null;
function pythonRuntime(){if(pythonLoader)return pythonLoader;pythonLoader=(async()=>{
if(!window.loadPyodide){await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src="https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";script.onload=resolve;script.onerror=()=>reject(Error("Runtime Python indisponible"));document.head.appendChild(script)})}
const py=await window.loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"});
const response=await fetch("./scripts/build_stats.py",{cache:"no-store"});if(!response.ok)throw Error("Script Python indisponible");
pythonSource=await response.text();instance=py;return py
})();return pythonLoader}
async function pythonStats(records){const py=await pythonRuntime();py.globals.set("poc_records_json",JSON.stringify(records));py.globals.set("poc_source",pythonSource);const response=await fetch("./data/graph-relations.json",{cache:"no-store"});py.globals.set("poc_metadata_json",response.ok?await response.text():"{}");
const code=["import json","module_globals={'__name__':'poc1_stats','__file__':'/home/pyodide/scripts/build_stats.py'}","module_globals[\'poc_metadata_json\']=poc_metadata_json","exec(poc_source,module_globals)","json.dumps(module_globals['compute'](json.loads(poc_records_json)),ensure_ascii=False)"].join("\n");
const result=await py.runPythonAsync(code);
return JSON.parse(result)}
function show(host,data,records,mode){if(!host.isConnected)return;const local=records.filter(x=>x.local_only||String(x.id).startsWith("LOCAL-")).length;const note=mode==="local"?'<span class="analytics-source">Calcul Python dans le navigateur · '+records.length+' chaînes, dont '+local+' locales. Données de démonstration.</span>':'<span class="analytics-local-note">Calcul Python local en cours pour '+records.length+' chaînes…</span>';
host.innerHTML='<div class="analytics-section-head"><div><h2>Statistiques et analyses</h2><p>Vue compacte · cliquez sur une statistique pour l’agrandir</p></div><div class="analytics-section-source">'+note+'</div></div><div class="analytics-grid">'+data.metrics.map(tile).join("")+'</div>';host.querySelectorAll("[data-metric]").forEach(btn=>btn.onclick=()=>{const metric=data.metrics.find(x=>x.key===btn.dataset.metric);if(metric)openMetric(metric,btn)})}
async function render(records){const host=document.getElementById("analytics-host");if(!host)return;try{
const initial=await get();if(!host.isConnected)return;
const isLocal=records.length!==initial.record_count||records.some(x=>x.local_only||String(x.id).startsWith("LOCAL-"));
if(!isLocal){show(host,initial,records,"local");return}
show(host,initial,records,"pending");
try{const fresh=await pythonStats(records);if(host.isConnected)show(host,fresh,records,"local")}
catch(error){if(host.isConnected)host.innerHTML='<div class="analytics-error">Le recalcul Python local n’a pas abouti. Les statistiques sont indisponibles pour les chaînes ajoutées dans ce navigateur. <small>'+e(error.message)+'</small></div>';console.error("Poc1 local Python:",error)}
}catch(err){if(host.isConnected)host.innerHTML='<div class="analytics-error">Statistiques Python indisponibles. <small>'+e(err.message)+'</small></div>';console.error("Poc1 Python analytics:",err)}}
window.PocAnalytics={render};
})();
