(function(){
"use strict";
const KEY="poc1-corpus-translations-v2",LANG="poc1-corpus-lang-v2";
const glossaryRaw=`
Demande de décision préjudicielle|Petición de decisión prejudicial|Request for a preliminary ruling
Marque de l’Union européenne|Marca de la Unión Europea|European Union trade mark
Renvoi préjudiciel|Cuestión prejudicial|Preliminary reference
Pourvoi|Recurso de casación|Appeal on a point of law
Recours en annulation|Recurso de anulación|Action for annulment
Procédure d’opposition|Procedimiento de oposición|Opposition proceedings
Rapprochement des législations|Aproximación de las legislaciones|Approximation of laws
Fonction publique|Función pública|Civil service
Union bancaire|Unión bancaria|Banking union
Union économique et monétaire|Unión Económica y Monetaria|Economic and Monetary Union
Politique d’asile|Política de asilo|Asylum policy
Procédure d’annulation|Procedimiento de anulación|Annulment procedure
Protection des consommateurs|Protección de los consumidores|Consumer protection
Obligation de motivation|Obligación de motivación|Obligation to state reasons
Coopération judiciaire en matière pénale|Cooperación judicial en materia penal|Judicial cooperation in criminal matters
Environnement|Medio ambiente|Environment
Fonds de résolution unique|Fondo Único de Resolución|Single Resolution Fund
Politique étrangère et de sécurité commune|Política exterior y de seguridad común|Common foreign and security policy
Radiation|Archivo del asunto|Removal from the register
Champ d’application|Ámbito de aplicación|Scope
Concurrence|Competencia|Competition
Politique sociale|Política social|Social policy
Coopération judiciaire en matière civile|Cooperación judicial en materia civil|Judicial cooperation in civil matters
Égalité de traitement|Igualdad de trato|Equal treatment
Directive 93/13/CEE|Directiva 93/13/CEE|Directive 93/13/EEC
Directive 2006/112/CE|Directiva 2006/112/CE|Directive 2006/112/EC
Manquement d’État|Incumplimiento de Estado|Failure of a Member State to fulfil obligations
Harmonisation des législations fiscales|Armonización de las legislaciones fiscales|Harmonisation of tax legislation
Motif relatif de refus|Motivo de denegación relativo|Relative ground for refusal
Proportionnalité|Proporcionalidad|Proportionality
Procédure de nullité|Procedimiento de nulidad|Invalidity proceedings
Notion|Concepto|Concept
Système commun de taxe sur la valeur ajoutée|Sistema común del impuesto sobre el valor añadido|Common system of value added tax
Contrôles aux frontières, asile et immigration|Controles fronterizos, asilo e inmigración|Border checks, asylum and immigration
Liberté d’établissement|Libertad de establecimiento|Freedom of establishment
Erreur d’appréciation|Error de apreciación|Error of assessment
Recours en annulation et en indemnité|Recurso de anulación e indemnización|Action for annulment and damages
Fonctionnaires|Funcionarios|Officials
Libre circulation des personnes|Libre circulación de personas|Free movement of persons
Aides d’État|Ayudas de Estado|State aid
Gel des fonds|Congelación de fondos|Freezing of funds
Espace de liberté, de sécurité et de justice|Espacio de libertad, seguridad y justicia|Area of freedom, security and justice
Transports aériens|Transportes aéreos|Air transport
Union douanière|Unión aduanera|Customs union
Rejet de la demande|Desestimación de la solicitud|Rejection of the application
Libre prestation des services|Libre prestación de servicios|Freedom to provide services
Travailleurs|Trabajadores|Workers
Droit institutionnel|Derecho institucional|Institutional law
Fiscalité|Fiscalidad|Taxation
Responsabilité non contractuelle|Responsabilidad extracontractual|Non-contractual liability
Droit de propriété|Derecho de propiedad|Right to property
États membres|Estados miembros|Member States
Protection juridictionnelle effective|Tutela judicial efectiva|Effective judicial protection
Sécurité juridique|Seguridad jurídica|Legal certainty
Protection des données|Protección de datos|Data protection
Droit de l’Union|Derecho de la Unión|EU law
Principes|Principios|Principles
Droits fondamentaux|Derechos fundamentales|Fundamental rights
Principes généraux|Principios generales|General principles
Procédure|Procedimiento|Procedure
Dispositions de procédure|Disposiciones procesales|Procedural provisions
Conditions de recevabilité|Requisitos de admisibilidad|Admissibility requirements
Décisions administratives|Decisiones administrativas|Administrative decisions
Notification|Notificación|Notification
Portée|Alcance|Scope
Objet|Objeto|Subject matter
Mots-clés (Greffe)|Palabras clave (Secretaría)|Keywords (Registry)
Indicateurs Décision|Indicadores de decisión|Decision indicators
Descripteur du préexamen|Descriptor del examen preliminar|Pre-examination descriptor
Indicateur du préexamen|Indicador del examen preliminar|Pre-examination indicator
Recours|Recurso|Action
Recevabilité|Admisibilidad|Admissibility
Irrecevabilité|Inadmisibilidad|Inadmissibility
Délai|Plazo|Time limit
Compétence|Competencia|Jurisdiction
Compétence de la Cour|Competencia del Tribunal de Justicia|Jurisdiction of the Court
Interprétation|Interpretación|Interpretation
Conditions|Condiciones|Conditions
Critères|Criterios|Criteria
Définition|Definición|Definition
Décision|Decisión|Decision
Arrêt|Sentencia|Judgment
Ordonnance|Auto|Order
Motivation|Motivación|Statement of reasons
Droit à un recours effectif|Derecho a la tutela judicial efectiva|Right to an effective remedy
Violation|Infracción|Infringement
Discrimination|Discriminación|Discrimination
Égalité de traitement entre les femmes et les hommes|Igualdad de trato entre mujeres y hombres|Equal treatment between women and men
Droits de la défense|Derechos de defensa|Rights of the defence
Obligation|Obligación|Obligation
Droits|Derechos|Rights
Taxes|Impuestos|Taxes
Marché intérieur|Mercado interior|Internal market
Libre circulation des marchandises|Libre circulación de mercancías|Free movement of goods
Libre circulation des capitaux|Libre circulación de capitales|Free movement of capital
Protection internationale|Protección internacional|International protection
Droit d’asile|Derecho de asilo|Right of asylum
Directive|Directiva|Directive
Règlement|Reglamento|Regulation
Accord|Acuerdo|Agreement
Validité|Validez|Validity
Effets|Efectos|Effects
Effet direct|Efecto directo|Direct effect
Principe de primauté|Principio de primacía|Principle of primacy
Principe de proportionnalité|Principio de proporcionalidad|Principle of proportionality
État de droit|Estado de Derecho|Rule of law
Marchés publics|Contratación pública|Public procurement
Concentration|Concentración|Merger
Ententes|Prácticas colusorias|Collusive practices
Abus de position dominante|Abuso de posición dominante|Abuse of a dominant position
Fiscalité indirecte|Fiscalidad indirecta|Indirect taxation
Taxe sur la valeur ajoutée|Impuesto sobre el valor añadido|Value added tax
TVA|IVA|VAT
Agriculture|Agricultura|Agriculture
Transports|Transportes|Transport
Politique commune des transports|Política común de transportes|Common transport policy
Énergie|Energía|Energy
Services|Servicios|Services
Concurrence déloyale|Competencia desleal|Unfair competition
Propriété intellectuelle|Propiedad intelectual|Intellectual property
Marques|Marcas|Trade marks
Droit des marques|Derecho de marcas|Trade mark law
Dessins et modèles|Dibujos y modelos|Designs
Brevet|Patente|Patent
Mesures provisoires|Medidas provisionales|Interim measures
Délai de recours|Plazo para recurrir|Time limit for bringing proceedings
Preuve|Prueba|Evidence
Charge de la preuve|Carga de la prueba|Burden of proof
Décision définitive|Decisión definitiva|Final decision
Intérêt à agir|Interés para ejercitar la acción|Interest in bringing proceedings
Qualité pour agir|Legitimación activa|Standing to bring proceedings
Droits antérieurs|Derechos anteriores|Earlier rights
Risque de confusion|Riesgo de confusión|Likelihood of confusion
Caractère distinctif|Carácter distintivo|Distinctive character
Usage sérieux|Uso efectivo|Genuine use
Publication|Publicación|Publication
Déchéance|Caducidad|Revocation
Réexamen|Reexamen|Review
Délai de prescription|Plazo de prescripción|Limitation period
Règles de procédure|Normas procesales|Rules of procedure
Droit à être entendu|Derecho a ser oído|Right to be heard
Contrôle juridictionnel|Control jurisdiccional|Judicial review
Contrôle de légalité|Control de legalidad|Review of legality
Mesures d’instruction|Diligencias de prueba|Measures of inquiry
`;
const glossaryExtra="Clauses abusives dans les contrats conclus avec les consommateurs|Cláusulas abusivas en los contratos celebrados con consumidores|Unfair terms in consumer contracts\nMécanisme de résolution unique des établissements de crédit et de certaines entreprises d’investissement (MRU)|Mecanismo Único de Resolución de entidades de crédito y determinadas empresas de inversión (MUR)|Single Resolution Mechanism for credit institutions and certain investment firms (SRM)\nLimitation des effets de l’arrêt attaqué dans le temps|Limitación en el tiempo de los efectos de la sentencia recurrida|Limitation of the temporal effects of the judgment under appeal\nDirective 2013/32/UE|Directiva 2013/32/UE|Directive 2013/32/EU\nMécanisme de résolution unique des établissements de crédit et de certaines entreprises d’investissement|Mecanismo Único de Resolución de entidades de crédito y determinadas empresas de inversión|Single Resolution Mechanism for credit institutions and certain investment firms\nDétermination du niveau cible annuel du FRU|Determinación del nivel objetivo anual del FUR|Determination of the annual target level of the SRF\nRèglement d’exécution (UE) 2015/81|Reglamento de Ejecución (UE) 2015/81|Implementing Regulation (EU) 2015/81\nArticle 8, paragraphe 1, sous b), du règlement (UE) 2017/1001|Artículo 8, apartado 1, letra b), del Reglamento (UE) 2017/1001|Article 8(1)(b) of Regulation (EU) 2017/1001\nProcédures pour l’octroi et le retrait de la protection internationale|Procedimientos comunes para la concesión o retirada de la protección internacional|Procedures for granting and withdrawing international protection\nCompétences d’exécution attribuées au Conseil|Competencias de ejecución atribuidas al Consejo|Implementing powers conferred on the Council\nProcédure d’examen d’une demande de protection internationale|Procedimiento de examen de una solicitud de protección internacional|Procedure for examining an application for international protection\nDécision du CRU sur le calcul des contributions ex ante pour la période de contribution 2023|Decisión de la JUR sobre el cálculo de las contribuciones ex ante correspondientes al período de contribución de 2023|SRB decision calculating ex ante contributions for the 2023 contribution period\nÉtablissement des voies de recours nécessaires pour assurer une protection juridictionnelle effective|Establecimiento de las vías de recurso necesarias para garantizar una tutela judicial efectiva|Establishment of the remedies necessary to ensure effective judicial protection\nObligations|Obligaciones|Obligations\nMesures restrictives prises au regard de la situation en Ukraine|Medidas restrictivas adoptadas habida cuenta de la situación en Ucrania|Restrictive measures adopted in view of the situation in Ukraine\nConcept de pays d’origine sûr|Concepto de país de origen seguro|Concept of a safe country of origin\nAllocations familiales|Prestaciones familiares|Family benefits\nAccès aux documents|Acceso a los documentos|Access to documents\nArt. 69, par. 1 et 2, du règlement n° 806/2014|Artículo 69, apartados 1 y 2, del Reglamento n.º 806/2014|Article 69(1) and (2) of Regulation No 806/2014\nDemande d’un ressortissant d’un pays d’origine sûr|Solicitud de un nacional de un país de origen seguro|Application by a national of a safe country of origin\nDemande considérée comme manifestement infondée par les États membres|Solicitud considerada manifiestamente infundada por los Estados miembros|Application regarded as manifestly unfounded by Member States\nPlafond prévu à l’art. 70, par. 2, premier et quatrième alinéas, du règlement (UE) n° 806/2014|Límite máximo previsto en el artículo 70, apartado 2, párrafos primero y cuarto, del Reglamento (UE) n.º 806/2014|Ceiling laid down in Article 70(2), first and fourth subparagraphs, of Regulation (EU) No 806/2014\nIntervention|Intervención|Intervention\nAvantages sociaux|Ventajas sociales|Social advantages\nDétermination du niveau cible annuel du fonds de résolution unique|Determinación del nivel objetivo anual del Fondo Único de Resolución|Determination of the annual target level of the Single Resolution Fund\nPlafond|Límite máximo|Ceiling\nMarché intérieur de l’électricité|Mercado interior de la electricidad|Internal electricity market\nPrincipe de bonne administration|Principio de buena administración|Principle of good administration\nRejet de l’opposition|Desestimación de la oposición|Rejection of the opposition\nRejet de la demande en nullité|Desestimación de la solicitud de nulidad|Rejection of the application for a declaration of invalidity\nIntérêt à la solution du litige|Interés en la solución del litigio|Interest in the outcome of the dispute\nEffets de la constatation du caractère abusif d’une clause|Efectos de la declaración del carácter abusivo de una cláusula|Effects of a finding that a contractual term is unfair\nDécision sur le calcul des contributions ex ante pour la période de contribution 2023|Decisión sobre el cálculo de las contribuciones ex ante para el período de contribución de 2023|Decision calculating ex ante contributions for the 2023 contribution period\nGel de fonds et de ressources économiques|Inmovilización de fondos y recursos económicos|Freezing of funds and economic resources\nIrrecevabilité manifeste|Inadmisibilidad manifiesta|Manifest inadmissibility\nMotif absolu de refus|Motivo de denegación absoluto|Absolute ground for refusal\nAbsence de caractère distinctif|Falta de carácter distintivo|Lack of distinctive character\nRespect du principe de l’indépendance des juges|Respeto del principio de independencia judicial|Respect for the principle of judicial independence\nDéclaration de nullité|Declaración de nulidad|Declaration of invalidity\nContrôles frontaliers, asile et immigration|Controles fronterizos, asilo e inmigración|Border checks, asylum and immigration\nNotion de « pourvoir à l’entretien » d’un enfant|Concepto de «hacerse cargo de la manutención» de un menor|Concept of providing for the maintenance of a child\nEnfant du conjoint d’un travailleur frontalier|Hijo del cónyuge de un trabajador fronterizo|Child of the spouse of a frontier worker\nPolitique économique et monétaire|Política económica y monetaria|Economic and monetary policy\nRecours en indemnité|Recurso de indemnización|Action for damages\nRecours manifestement dépourvu de tout fondement en droit|Recurso manifiestamente carente de fundamento jurídico|Appeal manifestly unfounded in law\nMesures restrictives prises eu égard aux actions compromettant ou menaçant l’intégrité territoriale, la souveraineté et l’indépendance de l’Ukraine|Medidas restrictivas adoptadas en relación con acciones que menoscaban o amenazan la integridad territorial, la soberanía y la independencia de Ucrania|Restrictive measures in view of actions undermining or threatening the territorial integrity, sovereignty and independence of Ukraine\nDroit d’auteur et droits voisins|Derechos de autor y derechos afines|Copyright and related rights\nTribunal indépendant et impartial, établi par la loi|Tribunal independiente e imparcial establecido previamente por la ley|Independent and impartial tribunal established by law\nPrincipe d’effectivité|Principio de efectividad|Principle of effectiveness\nMaintien du nom du requérant sur la liste|Mantenimiento del nombre del demandante en la lista|Maintaining the applicant's name on the list\nDessin ou modèle communautaire|Dibujo o modelo comunitario|Community design\nSécurité sociale|Seguridad Social|Social security\nAdmission des pourvois|Admisión a trámite de los recursos de casación|Admission of appeals\nArticle 170 ter du règlement de procédure de la Cour|Artículo 170 ter del Reglamento de Procedimiento del Tribunal de Justicia|Article 170b of the Rules of Procedure of the Court\nRèglement (UE) 2016/679|Reglamento (UE) 2016/679|Regulation (EU) 2016/679\nPolitique intérieure de l’Union européenne|Política interior de la Unión Europea|Internal policy of the European Union\nDroit d’être entendu|Derecho a ser oído|Right to be heard\nDérogations|Excepciones|Derogations\nSystème commun de taxe sur la valeur ajoutée (TVA)|Sistema común del impuesto sobre el valor añadido (IVA)|Common system of value added tax (VAT)\nFonds de résolution bancaire unique|Fondo Único de Resolución Bancaria|Single Bank Resolution Fund\nCaractère descriptif|Carácter descriptivo|Descriptive character\nAbsence de risque de confusion|Inexistencia de riesgo de confusión|Absence of likelihood of confusion\nRestrictions|Restricciones|Restrictions\nArticle 3|Artículo 3|Article 3\nCitoyenneté de l’Union|Ciudadanía de la Unión|Citizenship of the Union\nResponsabilité|Responsabilidad|Liability\nEnregistrement international désignant l’Union européenne|Registro internacional que designa a la Unión Europea|International registration designating the European Union\nProcédure de déchéance|Procedimiento de caducidad|Revocation proceedings\nInclusion ? (Question 1)|¿Inclusión? (Pregunta 1)|Inclusion? (Question 1)\n";
const glossaryPriority="Clauses abusives dans les contrats conclus avec les consommateurs|Cláusulas abusivas en los contratos celebrados con consumidores|Unfair terms in consumer contracts\nDirective 2013/32/UE|Directiva 2013/32/UE|Directive 2013/32/EU\nMécanisme de résolution unique des établissements de crédit et de certaines entreprises d’investissement (MRU)|Mecanismo Único de Resolución de entidades de crédito y determinadas empresas de servicios de inversión (MUR)|Single Resolution Mechanism for credit institutions and certain investment firms (SRM)\nLimitation des effets de l’arrêt attaqué dans le temps|Limitación temporal de los efectos de la sentencia recurrida|Limitation in time of the effects of the judgment under appeal\nAdmissibilité ? (Question 1)|¿Admisibilidad? (Pregunta 1)|Admissibility? (Question 1)\nProcédures pour l’octroi et le retrait de la protection internationale|Procedimientos para conceder y retirar la protección internacional|Procedures for granting and withdrawing international protection\nMécanisme de résolution unique des établissements de crédit et de certaines entreprises d’investissement|Mecanismo Único de Resolución de entidades de crédito y determinadas empresas de servicios de inversión|Single Resolution Mechanism for credit institutions and certain investment firms\nObligations|Obligaciones|Obligations\nÉtablissement des voies de recours nécessaires pour assurer une protection juridictionnelle effective|Establecimiento de las vías de recurso necesarias para garantizar una tutela judicial efectiva|Establishment of remedies necessary to ensure effective judicial protection\nDétermination du niveau cible annuel du FRU|Determinación del nivel objetivo anual del Fondo Único de Resolución|Determination of the annual target level of the Single Resolution Fund\nProcédure d’examen d’une demande de protection internationale|Procedimiento de examen de una solicitud de protección internacional|Procedure for examining an application for international protection\nRèglement d’exécution (UE) 2015/81|Reglamento de Ejecución (UE) 2015/81|Implementing Regulation (EU) 2015/81\nConcept de pays d’origine sûr|Concepto de país de origen seguro|Concept of safe country of origin\nAllocations familiales|Prestaciones familiares|Family benefits\nDemande d’un ressortissant d’un pays d’origine sûr|Solicitud de un nacional de un país de origen seguro|Application by a national of a safe country of origin\nAvantages sociaux|Ventajas sociales|Social advantages\nCompétences d’exécution attribuées au Conseil|Competencias de ejecución atribuidas al Consejo|Implementing powers conferred on the Council\nRespect du principe de l’indépendance des juges|Respeto del principio de independencia judicial|Respect for the principle of judicial independence\nEffets de la constatation du caractère abusif d’une clause|Efectos de la declaración del carácter abusivo de una cláusula|Effects of a finding that a term is unfair\nPolitique intérieure de l’Union européenne|Política interior de la Unión Europea|Internal policy of the European Union\nMesures restrictives prises au regard de la situation en Ukraine|Medidas restrictivas adoptadas en relación con la situación en Ucrania|Restrictive measures adopted in view of the situation in Ukraine\nAccès aux documents|Acceso a los documentos|Access to documents\nContrôles frontaliers, asile et immigration|Controles fronterizos, asilo e inmigración|Border controls, asylum and immigration\nMarché intérieur de l’électricité|Mercado interior de la electricidad|Internal electricity market\nDemande considérée comme manifestement infondée par les États membres|Solicitud considerada manifiestamente infundada por los Estados miembros|Application considered manifestly unfounded by the Member States\nIntervention|Intervención|Intervention\nDétermination du niveau cible annuel du fonds de résolution unique|Determinación del nivel objetivo anual del Fondo Único de Resolución|Determination of the annual target level of the Single Resolution Fund\nPlafond|Límite máximo|Ceiling\nPrincipe de bonne administration|Principio de buena administración|Principle of good administration\n";
const dictionary={};for(const line of (glossaryRaw+"\n"+glossaryExtra+"\n"+glossaryPriority).trim().split("\n")){const a=line.split("|");if(a.length===3)dictionary[a[0]]={es:a[1],en:a[2]}}
let overlays={};try{overlays=JSON.parse(localStorage.getItem(KEY))||{}}catch(_){}
let databasePromise=null;
function database(){if(databasePromise)return databasePromise;databasePromise=new Promise(resolve=>{if(typeof indexedDB==="undefined"){resolve(null);return}try{const request=indexedDB.open("poc1-bilingual-translations-v2",1);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains("entries"))db.createObjectStore("entries",{keyPath:"label_fr"})};request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve(null);request.onblocked=()=>resolve(null)}catch(_){resolve(null)}});return databasePromise}
async function loadOverlays(){try{const db=await database();if(!db)return;const rows=await new Promise(resolve=>{const tx=db.transaction("entries","readonly"),req=tx.objectStore("entries").getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>resolve([])});for(const row of rows){if(row?.label_fr&&row.labels)overlays[row.label_fr]={...(overlays[row.label_fr]||{}),...row.labels}}}catch(error){console.warn("Chargement des traductions locales:",error)}}
async function persistTranslation(term,language,value,status="manual-draft"){if(!["es","en"].includes(language)||!term)return;overlays[term]??={};overlays[term][language]=value;overlays[term]["status_"+language]=status;try{const db=await database();if(db){await new Promise((resolve,reject)=>{const tx=db.transaction("entries","readwrite");tx.objectStore("entries").put({label_fr:term,labels:overlays[term]});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});return}localStorage.setItem(KEY,JSON.stringify(overlays))}catch(error){console.warn("Enregistrement des traductions:",error)}}
function coverage(){return Object.fromEntries(["es","en"].map(l=>[l,vocabulary.filter(t=>Boolean(overlays[t.label_fr]?.[l]||dictionary[t.label_fr]?.[l])).length]))}
const lang=()=>{try{const v=localStorage.getItem(LANG);return ["fr","es","en"].includes(v)?v:"fr"}catch(_){return"fr"}};
const setLang=v=>{if(["fr","es","en"].includes(v)){try{localStorage.setItem(LANG,v)}catch(_){}}};
const translate=(term,l=lang())=>{if(l==="fr")return term;const exact=overlays[term]?.[l]||dictionary[term]?.[l];if(exact)return exact;/* Translate compositional labels only when every explicit component is known; never invent legal translations. */const chunks=String(term).split(/(\s*[:;()]\s*)/);if(chunks.length>1){let matched=false,valid=true;const translated=chunks.map(part=>{if(/^\s*[:;()]\s*$/.test(part))return part;const t=part.trim();if(!t)return part;const value=overlays[t]?.[l]||dictionary[t]?.[l];if(!value){valid=false;return part}matched=true;return part.replace(t,value)});if(valid&&matched)return translated.join("")}return term};
function parts(s){const str=String(s??"").trim();if(!str)return [];/* A separator must have whitespace on at least one side. Preserve internal hyphens in identifiers and compounds. */return str.split(/[\s\u00A0]+[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D\u0336][\s\u00A0]*|[\s\u00A0]*[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D\u0336][\s\u00A0]+/u).map(x=>x.trim()).filter(Boolean)}
const translateChain=(s,l=lang())=>parts(s).map(x=>translate(x,l)).join(" - ");
const hash=v=>{let a=2166136261,b=2671060477;for(let i=0;i<v.length;i++){const n=v.charCodeAt(i);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519)}return (a>>>0).toString(16).padStart(8,"0")+(b>>>0).toString(16).padStart(8,"0")};
let vocabulary=[],documents=new Map(),indexations=[],allTypes=[];
async function load(){
await loadOverlays();
const m=await (await fetch("./data/excel-manifest.json",{cache:"no-store"})).json();
if(m.schema_version!=="excel-branch-manifest-v1")throw Error("Manifest incompatible");
const chunks=await Promise.all([m.documents_file,...m.indexation_files].map(async f=>{const r=await fetch("./"+f,{cache:"no-store"});if(!r.ok)throw Error(f);return r.json()}));
const docs=chunks.shift();documents=new Map(docs.map(d=>[String(d.source_document_id),d]));indexations=chunks.flat();
if(indexations.length!==m.profile.indexation_entries)throw Error("Unexpected number of source rows");
const map=new Map(),termMap=new Map(),counter=new Map(),typeSet=new Set();
for(const e of indexations){const text=String(e.indexation_text_fr??e.original_text??"");const terms=Array.isArray(e.maillons_fr)&&e.maillons_fr.length?e.maillons_fr:parts(text);if(!terms.length)continue;const canonical=terms.join(" - ");let rec=map.get(canonical);
if(!rec){const structured=true;rec={id:"CH-"+hash(canonical),reference:"REF-"+hash(canonical),root:terms[0],base_chain:terms[0],selected_terms:terms.slice(1),full_chain_label:canonical,chain_type:structured?"STRUCTURED_CANDIDATE":"FREE_TEXT",term_ids:terms.map(t=>"TERM-"+hash(t)),status:"EC",validity_start_date:"1900-01-01",validity_end_date:"3000-12-31",created_at:"",types_indexation:[],document_ids:[],source_indexation_ids:[],classification:"PROVISIONAL",source:"excel_corpus"};
map.set(canonical,rec);
for(const term of terms){if(!termMap.has(term))termMap.set(term,{term_id:"TERM-"+hash(term),label_fr:term,kind:structured?"STRUCTURED_SEGMENT":"FREE_TEXT",translations:{es:dictionary[term]?.es||null,en:dictionary[term]?.en||null}});counter.set(term,(counter.get(term)||0)+1)}
}
if(!rec.document_ids.includes(String(e.source_document_id)))rec.document_ids.push(String(e.source_document_id));rec.source_indexation_ids.push(String(e.source_chain_id));if(e.type_indexation){typeSet.add(e.type_indexation);if(!rec.types_indexation.includes(e.type_indexation))rec.types_indexation.push(e.type_indexation)}}
vocabulary=[...termMap.values()].sort((a,b)=>(counter.get(b.label_fr)||0)-(counter.get(a.label_fr)||0));
allTypes=[...typeSet].sort((a,b)=>a.localeCompare(b,"fr"));
window.PocBranchData.records=[...map.values()];window.PocBranchData.vocabulary=vocabulary;window.PocBranchData.documents=documents;window.PocBranchData.indexations=indexations;window.PocBranchData.types=allTypes;window.PocBranchData.translationCoverage={es:vocabulary.filter(t=>dictionary[t.label_fr]?.es||overlays[t.label_fr]?.es).length,en:vocabulary.filter(t=>dictionary[t.label_fr]?.en||overlays[t.label_fr]?.en).length};
return window.PocBranchData.records
}

function translationRows(){return vocabulary.map(t=>{const es=overlays[t.label_fr]?.es||dictionary[t.label_fr]?.es||"",en=overlays[t.label_fr]?.en||dictionary[t.label_fr]?.en||"";return {term_id:t.term_id,label_fr:t.label_fr,es,en,status_es:overlays[t.label_fr]?.es?"manual-draft":dictionary[t.label_fr]?.es?"proposed":"missing",status_en:overlays[t.label_fr]?.en?"manual-draft":dictionary[t.label_fr]?.en?"proposed":"missing"}})}
function downloadTranslationCorpus(){const blob=new Blob([JSON.stringify({schema_version:"poc1-translations-v1",note:"Translations in this file are proposals requiring human validation",terms:translationRows()},null,2)],{type:"application/json"}),link=URL.createObjectURL(blob),a=document.createElement("a");a.href=link;a.download="poc1-termes-fr-es-en.json";a.click();setTimeout(()=>URL.revokeObjectURL(link),3000)}
async function uploadTranslationCorpus(file){if(!file)return 0;const data=JSON.parse(await file.text());if(data.schema_version!=="poc1-translations-v1"||!Array.isArray(data.terms))throw Error("Le fichier doit être un export de traduction de Poc1");const known=new Set(vocabulary.map(x=>x.label_fr));let count=0;for(const row of data.terms){if(!known.has(row.label_fr))continue;for(const l of ["es","en"]){if(typeof row[l]!=="string"||!row[l].trim())continue;await persistTranslation(row.label_fr,l,row[l].trim(),"imported-draft");count++}}return count}
function edit(){document.getElementById("branch-translator")?.remove();const layer=document.createElement("div");layer.id="branch-translator";layer.className="branch-translation-overlay";layer.innerHTML='<section class="branch-translation-dialog" role="dialog" aria-modal="true" aria-label="Traductions ES et EN"><header><h2>Traductions des termes · ES / EN</h2><button type="button" id="bt-close" class="btn sm">Fermer</button></header><p>Les traductions proposées sont des équivalences de démonstration, non validées. Les champs vides affichent le français.</p><div class="bt-tools"><span id="bt-coverage"></span><button type="button" id="bt-download" class="btn sm">Exporter FR/ES/EN</button><label class="btn sm">Importer traductions<input id="bt-upload" type="file" accept=".json" hidden></label></div><input id="bt-query" type="search" placeholder="Rechercher un terme en français…" aria-label="Rechercher"><div id="bt-list"></div><small>Les modifications restent enregistrées seulement dans ce navigateur.</small></section>';document.body.appendChild(layer);
function render(){const cc=coverage();document.getElementById("bt-coverage").textContent="ES "+cc.es+"/"+vocabulary.length+" · EN "+cc.en+"/"+vocabulary.length+" · propositions à valider";const q=document.getElementById("bt-query").value.trim().toLocaleLowerCase("fr");const found=vocabulary.filter(v=>v.label_fr.toLocaleLowerCase("fr").includes(q)).slice(0,35);document.getElementById("bt-list").innerHTML=found.map((t,i)=>'<div class="bt-row"><strong>'+escapeHTML(t.label_fr)+'</strong><label>ES<input data-translation="'+i+'" data-lang="es" value="'+escapeHTML(overlays[t.label_fr]?.es||dictionary[t.label_fr]?.es||"")+'"></label><label>EN<input data-translation="'+i+'" data-lang="en" value="'+escapeHTML(overlays[t.label_fr]?.en||dictionary[t.label_fr]?.en||"")+'"></label></div>').join("");document.querySelectorAll("#bt-list input").forEach(inp=>inp.onchange=()=>{const t=found[Number(inp.dataset.translation)];overlays[t.label_fr]??={};void persistTranslation(t.label_fr,inp.dataset.lang,inp.value.trim(),"manual-draft")})}
document.getElementById("bt-query").oninput=render;document.getElementById("bt-download").onclick=downloadTranslationCorpus;document.getElementById("bt-upload").onchange=async e=>{try{const n=await uploadTranslationCorpus(e.target.files?.[0]);render();alert(n+" traductions chargées comme brouillons sur cet appareil.")}catch(error){alert("Erreur d’import : "+error.message)}};render();document.getElementById("bt-close").onclick=()=>{layer.remove();window.PocBranchData.refresh?.()};layer.onclick=e=>{if(e.target===layer){layer.remove();window.PocBranchData.refresh?.()}}}
function escapeHTML(v){return String(v||"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]))}
function stats(records){const count=arr=>{const map=new Map();for(const value of arr)map.set(value,(map.get(value)||0)+1);return map};const paths=records.map(x=>x.chain_type==="FREE_TEXT"?[x.full_chain_label]:(Array.isArray(x.selected_terms)?[...parts(x.base_chain),...x.selected_terms]:parts(x.full_chain_label))),terms=count(paths.flat()),chainNames=count(paths.map(x=>x.join(" - "))),lengths=count(paths.map(x=>x.length)),typeCount=count(records.flatMap(r=>r.types_indexation?.length?r.types_indexation:["Sans type d’indexation"])),dates=count(records.map(r=>String(r.created_at||"").slice(0,7)).filter(x=>/^\\d{4}-\\d{2}$/.test(x)));const ordered=(map,limit)=>[...map].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),"fr")).slice(0,limit).map(([label,value])=>({label:String(label),value}));const lengthRows=[...lengths].sort((a,b)=>a[0]-b[0]).map(([len,value])=>({label:len+" maillons",value}));const block=(key,title,value,subtitle,rows=[],note="",kind="bars")=>({key,title,value,subtitle,rows,kind,note,status:"ready",unit:null,source:"Excel indexation corpus (candidats non validés)"});return {schema_version:1,origin:"excel-derived",record_count:records.length,metrics:[
block("keywords_total","Nombre de termes différents",terms.size,"Nombre de segments distincts observés dans le corpus.",ordered(terms,10),"Segments candidats, non validés comme termes MDM."),
block("keywords_frequency","Nombre total de maillons",paths.reduce((n,x)=>n+x.length,0),"Nombre de segments candidats observés.",ordered(terms,30),"Segmentation provisoire du fichier Excel."),
block("chains_distinct","Nombre de chaînes différentes",records.length,"Nombre de textes d’indexation distincts.",ordered(chainNames,12),"Chaînes d’indexation uniques, candidates à une analyse MDM."),
block("length_range","Distribution de chaînes par nombre de maillons",records.length,"Distribution par nombre de segments.",lengthRows,"Segments provisoires, non validés."),
block("length_min","Longueur minimale des chaînes",Math.min(...lengths.keys()),"Nombre minimal de segments.",lengthRows,"Nombre minimal de segments."),
block("length_max","Longueur maximale des chaînes",Math.max(...lengths.keys()),"Nombre maximal de segments.",lengthRows.slice().reverse(),"Nombre maximal de segments."),
block("indexation_types","Distribution par type d’indexation",[...typeCount.values()].reduce((a,b)=>a+b,0),"Nombre de chaînes par type d’indexation.",ordered(typeCount,30),"Une chaîne peut appartenir à plusieurs types."),
block("monthly_new","Nombre de chaînes créées par mois",dates.get(new Date().toISOString().slice(0,7))||0,"Historique des créations locales quand la date est disponible.",[...dates].sort((a,b)=>a[0].localeCompare(b[0])).map(([label,value])=>({label,value})),"Le fichier Excel ne fournit pas de dates de création des chaînes.","timeline")],warning:"Les unités sont des chaînes d’indexation uniques et des segments provisoires."}}
function graphRecords(records){return records.map(c=>({...c,full_chain_label:c.chain_type==="FREE_TEXT"?translate(c.full_chain_label):translateChain(c.full_chain_label),root:translate(c.root),base_chain:c.chain_type==="FREE_TEXT"?translate(c.base_chain):translateChain(c.base_chain),types_indexation:(c.types_indexation||[]).map(t=>translate(t))}))}
window.PocBranchData={load,records:[],vocabulary,documents,indexations,types:allTypes,translate,translateChain,lang,setLang,parts,edit,stats,graphRecords,dictionary,coverage,persistTranslation,exportTranslations:()=>({...overlays}),downloadTranslationCorpus,uploadTranslationCorpus,translationRows,translationCoverage:{}};
})();