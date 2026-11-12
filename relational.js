(function(){"use strict";
const $=id=>document.getElementById(id), esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const PAGE=50, STORAGE="poc1-relational-es-en-v1";
let source=null, model={},tab="documents",search="",filterType="",page=0,lang="fr",selected=null,translations={};
try{translations=JSON.parse(localStorage.getItem(STORAGE))||{}}catch(_){}
const names={documents:"DOCUMENTS",indexations:"INDEXATION_CHAINS",references:"REFERENCE_CHAINS",chain_terms:"CHAIN_TERMS",terms:"TERMS",term_translations:"TERM_TRANSLATIONS",chain_types:"CHAIN_INDEX_TYPES",types:"INDEX_TYPES",type_translations:"INDEX_TYPE_TRANSLATIONS",document_translations:"DOCUMENT_TRANSLATIONS",candidates:"TEXT_CANDIDATES",candidate_terms:"CANDIDATE_CHAIN_TERMS",candidate_vocabulary:"CANDIDATE_TERMS"};
const explanations={
 documents:"Un document peut avoir plusieurs entrées d’indexation.",indexations:"Indexation propre au document : texte d’origine, ordre et type. Le lien vers une chaîne de référence est facultatif.",references:"Uniquement les chaînes de référence identifiées et validées, pas automatiquement tous les textes Excel.",chain_terms:"Relations entre chaînes de référence et termes, avec un ordre stable.",terms:"Référentiel des termes identifiés et validés.",term_translations:"Libellés des termes par langue.",chain_types:"Associations entre chaînes de référence et types d’indexation.",types:"Les types d’indexation observés dans le corpus.",type_translations:"Traductions par langue des types d’indexation.",document_translations:"Titres et descriptions multilingues des documents.",candidates:"Textes identiques regroupés à titre d’observation, sans statut de chaîne MDM.",candidate_terms:"Segmentation exploratoire du texte en maillons, à valider avant toute intégration MDM.",candidate_vocabulary:"Vocabulaire provisoire extrait des segments : les identifiants et traductions sont expérimentaux."};
const schema={
 documents:["source_document_id","type_document","jur_code","year","ordre","pro_code"],
 indexations:["source_chain_id","source_document_id","type_indexation","indexation_order","candidate_id","original_text","reference_chain_id","classification"],
 references:["reference_chain_id","reference","status","structure_type"],
 chain_terms:["chain_id","position","term_id"],terms:["term_id","term_kind","parent_term_id","label_fr"],
 term_translations:["term_id","language_code","label","translation_status"],
 chain_types:["chain_id","index_type_id"],types:["index_type_id","code","active","label"],
 type_translations:["index_type_id","language_code","label","translation_status"],
 document_translations:["document_id","language_code","title","description"],
 candidates:["candidate_id","count","candidate_kind","maillons_count","text"],candidate_terms:["candidate_id","position","candidate_term_id"],candidate_vocabulary:["candidate_term_id","label_fr","occurrences","term_kind"]
};
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(translations))}catch(e){console.warn(e)}}
function typeId(value){return "IDX-"+String(value??"").replace(/[^A-Za-z0-9]/g,"").slice(0,18).toUpperCase()}
function stableCandidateId(value,prefix){let a=2166136261,b=2671060477;for(let i=0;i<value.length;i++){const n=value.charCodeAt(i);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519)}return prefix+(a>>>0).toString(16).padStart(8,"0")+(b>>>0).toString(16).padStart(8,"0")}
function build(data){if(data.schema_version!=="import-preview-v1"||!Array.isArray(data.indexation_entries)||!Array.isArray(data.documents))throw Error("Le JSON n'a pas la structure attendue");
source=data;
const documents=data.documents.map(d=>({...d,document_id:String(d.source_document_id)}));
const indexations=data.indexation_entries.map(x=>({...x,source_chain_id:String(x.source_chain_id),source_document_id:String(x.source_document_id)}));
const count=new Map();for(const x of indexations){const k=x.original_text||"";count.set(k,(count.get(k)||0)+1)}
const types=[...new Set(indexations.map(x=>x.type_indexation).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"fr")).map((x,i)=>({index_type_id:"IDX-"+String(i+1).padStart(2,"0"),code:x,active:true,label:x}));
const typeTranslations=[];for(const t of types){for(const l of ["fr","es","en"]){const key="types:"+t.code, label=l==="fr"?t.label:(translations[key]?.[l]||window.PocBranchData?.translate(t.label,l));if(label)typeTranslations.push({index_type_id:t.index_type_id,language_code:l,label,translation_status:l==="fr"?"source":"draft"})}}
const candidates=[...count.entries()].filter(([text])=>text).map(([text,n,i],idx)=>({candidate_id:stableCandidateId(text,"TEXT-"),count:n,text})).sort((a,b)=>b.count-a.count||a.text.localeCompare(b.text,"fr"));
const candidateByText=new Map(candidates.map(c=>[c.text,c.candidate_id]));
const candidateSegments=new Map(indexations.map(e=>[e.original_text,e.maillons_fr]));
indexations.forEach(x=>{x.candidate_id=candidateByText.get(x.original_text)||null});
const vocabulary=new Map(),candidateTerms=[];
for(const c of candidates){const parts=candidateSegments.get(c.text)||window.PocBranchData?.parts(c.text)||[c.text];const structured=parts.length>1;c.candidate_kind=structured?"STRUCTURED_CANDIDATE":"FREE_TEXT_CANDIDATE";c.maillons_count=parts.length;
parts.forEach((label,index)=>{if(!vocabulary.has(label))vocabulary.set(label,{candidate_term_id:stableCandidateId(label,"CTERM-"),label_fr:label,occurrences:0,term_kind:"PROVISIONAL"});const term=vocabulary.get(label);term.occurrences++;candidateTerms.push({candidate_id:c.candidate_id,position:index+1,candidate_term_id:term.candidate_term_id})})}
const candidateVocabulary=[...vocabulary.values()];
model={documents,indexations,references:data.reference_chains||[],chain_terms:data.chain_terms||[],terms:data.terms||[],term_translations:data.term_translations||[],chain_types:data.chain_index_types||[],types,type_translations:typeTranslations,document_translations:data.document_translations||[],candidates,candidate_terms:candidateTerms,candidate_vocabulary:candidateVocabulary};
for(const type of Object.keys(names))if(!Array.isArray(model[type]))model[type]=[];
$("file-name").textContent=indexations.length.toLocaleString("fr-FR")+" indexations · "+documents.length.toLocaleString("fr-FR")+" documents";
stats();tabs();selectTab(tab);editor();draw();
}
function stats(){const values=[["Indexations",model.indexations.length],["Documents",model.documents.length],["Textes distincts",model.candidates.length],["Types d’indexation",model.types.length],["Chaînes de référence validées",model.references.length]];
$("stats").innerHTML=values.map(([n,v])=>'<div class="stat"><strong>'+Number(v).toLocaleString("fr-FR")+'</strong><small>'+esc(n)+'</small></div>').join("")}
function tabs(){$("tabs").innerHTML=Object.entries(names).map(([key,name])=>'<button data-tab="'+key+'" class="'+(tab===key?"active":"")+'">'+name+' <span class="count">'+(model[key]||[]).length+'</span></button>').join("");
$("tabs").querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>selectTab(b.dataset.tab))}
function selectTab(name){tab=name;page=0;selected=null;$("table-heading").textContent=names[name];$("table-explain").textContent=explanations[name];$("record-detail").hidden=true;
document.querySelectorAll(".entity").forEach(el=>el.classList.toggle("active",el.dataset.table===name));tabs();
$("type-filter").hidden=name!=="indexations";$("type-filter").innerHTML='<option value="">Tous les types</option>'+model.types.map(t=>'<option value="'+esc(t.code)+'">'+esc(t.code)+'</option>').join("");filterType="";$("search").value="";search="";renderTable()}
function displayValue(k,v,row){if(k==="label_fr"&&tab==="candidate_vocabulary"&&lang!=="fr")return translations["candidate:"+row.candidate_term_id]?.[lang]||window.PocBranchData?.translate(v,lang)||v;if((k==="text"||k==="original_text")&&lang!=="fr")return window.PocBranchData?.translateChain(v,lang)||v;if(k==="type_indexation"&&lang!=="fr")return translations["types:"+v]?.[lang]||window.PocBranchData?.translate(v,lang)||v;if(k==="label"&&row?.language_code&&row.language_code!=="fr")return v||"";if(k==="label"&&row?.index_type_id&&lang!=="fr"){const type=model.types.find(t=>t.index_type_id===row.index_type_id);return translations["types:"+type?.code]?.[lang]||v}return v}
function currentRows(){const q=search.toLocaleLowerCase("fr");return(model[tab]||[]).filter(r=>(!filterType||r.type_indexation===filterType)&&(!q||Object.values(r).some(v=>String(v??"").toLocaleLowerCase("fr").includes(q))))}
function renderTable(){const rows=currentRows(),start=page*PAGE,cols=schema[tab];
$("thead").innerHTML='<tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr>';
$("tbody").innerHTML=rows.slice(start,start+PAGE).map((r,i)=>'<tr class="clickable" data-pos="'+(start+i)+'">'+cols.map(k=>'<td title="'+esc(r[k])+'">'+esc(displayValue(k,r[k],r)).slice(0,450)+'</td>').join("")+'</tr>').join("");
$("row-count").textContent=rows.length.toLocaleString("fr-FR")+" résultat(s)";$("page-count").textContent=(rows.length?page+1:0)+" / "+Math.max(1,Math.ceil(rows.length/PAGE));$("prev").disabled=page===0;$("next").disabled=start+PAGE>=rows.length;
$("tbody").querySelectorAll("[data-pos]").forEach(tr=>tr.onclick=()=>showDetail(rows[Number(tr.dataset.pos)]))}
function link(label,target,value,key){return '<button type="button" data-related="'+target+'" data-value="'+esc(value)+'" data-key="'+key+'">'+esc(label)+'</button>'}
function showDetail(row){selected=row;const box=$("record-detail");box.hidden=false;let related="";
if(tab==="documents")related=link("Voir les indexations de ce document","indexations",row.source_document_id,"source_document_id");
if(tab==="indexations")related=link("Voir le document","documents",row.source_document_id,"source_document_id")+(row.candidate_id?link("Texte candidat associé","candidates",row.candidate_id,"candidate_id"):"")+(row.reference_chain_id?link("Chaîne de référence validée","references",row.reference_chain_id,"reference_chain_id"):"");
if(tab==="types")related=link("Voir les indexations de ce type","indexations",row.code,"type_indexation");
if(tab==="candidates")related=link("Voir les occurrences","indexations",row.candidate_id,"candidate_id")+link("Voir les maillons candidats","candidate_terms",row.candidate_id,"candidate_id");
if(tab==="candidate_terms")related=link("Voir le terme candidat","candidate_vocabulary",row.candidate_term_id,"candidate_term_id");
if(tab==="candidate_vocabulary")related=link("Voir ses maillons","candidate_terms",row.candidate_term_id,"candidate_term_id");
if(tab==="references")related=link("Voir les maillons","chain_terms",row.reference_chain_id,"chain_id");
box.innerHTML='<h3>Fiche · '+esc(names[tab])+'</h3><div class="detail-grid">'+Object.entries(row).map(([k,v])=>'<div><small>'+esc(k)+'</small><span>'+esc(typeof v==="object"?JSON.stringify(v):v)+'</span></div>').join("")+'</div><div class="relations">'+related+'</div>';
box.querySelectorAll("[data-related]").forEach(b=>b.onclick=()=>{const target=b.dataset.related,key=b.dataset.key,value=b.dataset.value;selectTab(target);$("search").value=value;search=value;page=0;renderTable();$("table-heading").scrollIntoView({behavior:"smooth",block:"start"})})}
function editor(){const type=$("translation-type").value,q=$("translation-search").value.toLocaleLowerCase("fr");const sourceRows=type==="types"?model.types.map(x=>({key:"types:"+x.code,label:x.code})):(type==="candidate_vocabulary"?model.candidate_vocabulary.map(x=>({key:"candidate:"+x.candidate_term_id,label:x.label_fr})):model.terms.map(x=>({key:"terms:"+x.term_id,label:x.label_fr||x.term_id})));const rows=sourceRows.filter(x=>x.label.toLocaleLowerCase("fr").includes(q)).slice(0,60);
$("translation-editor").innerHTML=rows.map((x,i)=>'<div class="translation-row"><strong>'+esc(x.label)+'</strong><label>ES<input data-translate="'+i+'" data-language="es" value="'+esc(translations[x.key]?.es||"")+'" placeholder="Español"></label><label>EN<input data-translate="'+i+'" data-language="en" value="'+esc(translations[x.key]?.en||"")+'" placeholder="English"></label></div>').join("")||(sourceRows.length?'<p>Aucun résultat.</p>':'<p>Aucun terme validé disponible dans le fichier.</p>');
$("translation-editor").querySelectorAll("[data-translate]").forEach(input=>input.onchange=()=>{const x=rows[Number(input.dataset.translate)];translations[x.key]??={};translations[x.key][input.dataset.language]=input.value.trim();save();if(type==="types")build({...source,reference_chains:model.references})})}
function draw(){const el=$("diagram"),svg=$("wires"),pairs=[["documents","indexations"],["documents","document_translations"],["indexations","references"],["indexations","candidates"],["candidates","candidate_terms"],["candidate_terms","candidate_vocabulary"],["references","chain_terms"],["chain_terms","terms"],["terms","term_translations"],["references","chain_types"],["chain_types","types"],["types","type_translations"]];let paths="";
for(const [a,b] of pairs){const n1=el.querySelector('[data-table="'+a+'"]'),n2=el.querySelector('[data-table="'+b+'"]');if(!n1||!n2)continue;const ax=n1.offsetLeft+n1.offsetWidth/2,ay=n1.offsetTop+n1.offsetHeight/2,bx=n2.offsetLeft+n2.offsetWidth/2,by=n2.offsetTop+n2.offsetHeight/2;const dx=Math.abs(ax-bx)>Math.abs(ay-by);let sx,sy,ex,ey;if(dx){sx=ax+(ax<bx?1:-1)*n1.offsetWidth/2;sy=ay;ex=bx+(ax<bx?-1:1)*n2.offsetWidth/2;ey=by}else{sx=ax;sy=ay+(ay<by?1:-1)*n1.offsetHeight/2;ex=bx;ey=by+(ay<by?-1:1)*n2.offsetHeight/2}const mx=(sx+ex)/2,my=(sy+ey)/2;const d=dx?'M '+sx+' '+sy+' L '+mx+' '+sy+' L '+mx+' '+ey+' L '+ex+' '+ey:'M '+sx+' '+sy+' L '+sx+' '+my+' L '+ex+' '+my+' L '+ex+' '+ey;paths+='<path d="'+d+'" fill="none" stroke="#83aacd" stroke-width="1.7" marker-end="url(#arrow)"/>'}
svg.innerHTML='<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#638db6" stroke-width="1"/></marker></defs>'+paths}
function fromWorkbook(file,bytes){if(!window.XLSX)throw Error("Lecteur Excel indisponible. Vérifiez la connexion au réseau.");const wb=XLSX.read(bytes,{type:"array",cellDates:false}),sheet=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(sheet,{defval:null,raw:false});const required=["LNS_DOCUMENT","CHAINE_ID","CHAINE_INDEX","TYPE_INDEX"];if(!rows.length||required.some(key=>!(key in rows[0])))throw Error("Colonnes requises absentes.");
const documents=new Map(),entries=[],typeCounts={},texts=new Set();
for(const r of rows){if(!r.CHAINE_ID||!r.LNS_DOCUMENT)continue;const id=String(r.LNS_DOCUMENT),raw=String(r.CHAINE_INDEX||"").replace(/_x000D_/g,"\\n");texts.add(raw);typeCounts[r.TYPE_INDEX]=(typeCounts[r.TYPE_INDEX]||0)+1;if(!documents.has(id))documents.set(id,{source_document_id:id,type_document:r.TYPE_DOCUMENT,jur_code:r.JUR_COD,year:r.ANNEE,ordre:r.ORDRE,apr_code:r.APR_COD,num_suite:r.NUM_SUITE,natpro_code:r.NATPRO_COD,num_pro:r.NUM_PRO,pro_code:r.PRO_COD});
entries.push({source_chain_id:String(r.CHAINE_ID),source_document_id:id,type_indexation:r.TYPE_INDEX,indexation_order:r.CHAINE_INDEX_ORDRE,original_text:raw,source_language:"fr",reference_chain_id:null,classification:"undetermined",segmentation_validated:false,translations:{es:null,en:null}})}
return {schema_version:"import-preview-v1",notice:"Excel chargé exclusivement dans ce navigateur.",profile:{indexation_entries:entries.length,documents:documents.size,distinct_texts:texts.size,distinct_source_chain_ids:new Set(entries.map(x=>x.source_chain_id)).size,types:typeCounts},documents:[...documents.values()],indexation_entries:entries,reference_chains:[],term_translations:[]}}
$("file").onchange=async()=>{const f=$("file").files?.[0];if(!f)return;try{const isXlsx=/\\.xlsx$/i.test(f.name);const data=isXlsx?fromWorkbook(f,await f.arrayBuffer()):JSON.parse(await f.text());build(data)}catch(err){alert("Impossible de charger les données : "+err.message)}};
$("search").oninput=e=>{search=e.target.value;page=0;renderTable()};$("type-filter").onchange=e=>{filterType=e.target.value;page=0;renderTable()};$("clear-filters").onclick=()=>{$("search").value="";search="";$("type-filter").value="";filterType="";page=0;renderTable()};
$("prev").onclick=()=>{if(page>0)page--;renderTable()};$("next").onclick=()=>{page++;renderTable()};
$("data-lang").onchange=e=>{lang=e.target.value;renderTable()};
$("translation-type").onchange=editor;$("translation-search").oninput=editor;
document.querySelectorAll(".entity").forEach(b=>b.onclick=()=>selectTab(b.dataset.table));
for(const k of Object.keys(names))model[k]=[];tabs();selectTab("documents");draw();
async function loadBranchDataset(){const response=await fetch("./data/excel-manifest.json",{cache:"no-store"});if(!response.ok)return;const manifest=await response.json();if(manifest.schema_version!=="excel-branch-manifest-v1")throw Error("Manifest incompatible");
$("file-name").textContent="Chargement des données de la branche…";
const paths=[manifest.documents_file,...manifest.indexation_files];
const parts=await Promise.all(paths.map(async path=>{const r=await fetch("./"+path,{cache:"no-store"});if(!r.ok)throw Error("Fichier indisponible : "+path);return r.json()}));
const records=parts.slice(1).flat(),documents=parts[0];
if(records.length!==manifest.profile.indexation_entries||documents.length!==manifest.profile.documents)throw Error("Le corpus ne correspond pas au manifeste.");
build({schema_version:"import-preview-v1",notice:manifest.notice,profile:manifest.profile,documents,indexation_entries:records,reference_chains:[],term_translations:[]});
$("file-name").textContent+=" · données publiques de la branche";}
loadBranchDataset().catch(err=>{$("file-name").textContent="Erreur de chargement automatique : "+err.message;console.error("Excel branch dataset:",err)});
})();