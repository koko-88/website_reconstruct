import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stringify } from 'yaml';
import { runCli } from '../../../../node_modules/.cache/prodshape-recovery-bridge.mjs';

const root = process.cwd();
const session = 'hbc-canonical-product';
const inputDir = `.specify/productshape/recovery-inputs/${session}`;
const recoveryDir = `.specify/productshape/recoveries/${session}`;
const ref = 'reference/haunted-boulder-city-v2/rev-2.0.0-real-01';
const packet = 'implementation-scope/pre-build-packet';
const candidates = [];
async function cli(args) {
  const output = [];
  const errors = [];
  const code = await runCli(args, { cwd:root, out:x=>output.push(x), err:x=>errors.push(x) });
  if (code !== 0) throw new Error(`${args.join(' ')}: ${errors.join('\n')} ${output.join('\n')}`);
  return output.join('\n');
}
const descriptors = JSON.parse(await cli(['schema', '--format', 'json']));
await writeFile(`${inputDir}/schemas.json`, JSON.stringify(descriptors, null, 2) + '\n');
const templates = new Map();
for (const kind of descriptors.kinds) templates.set(kind.kind, await cli(['template',kind.kind]));
await writeFile(`${inputDir}/templates.json`,JSON.stringify(Object.fromEntries(templates),null,2)+'\n');

function candidate(id, type, title, fields, sections, source, confidence='high', recoveredFrom='documentation') {
  const template = templates.get(type);
  if (!template) throw new Error(`No installed template for ${type}`);
  const required = descriptors.kinds.find(k=>k.kind===type).bodySections;
  for (const heading of required) if (!sections[heading]) throw new Error(`${id} lacks ${heading}`);
  const fm = {id,type,title,status:'draft',...fields,provenance:{source,confidence,'recovered-from':recoveredFrom}};
  const content = `---\n${stringify(fm)}---\n\n${required.map(h=>`## ${h}\n\n${sections[h]}`).join('\n\n')}\n`;
  candidates.push({id,type,content,source,confidence});
}
const ctx='BC-LOCAL-FIDELITY';
candidate('ACT-VISITOR','actor','Visitor of the local reference-equivalent experience',{'actor-kind':'human'}, {
  Purpose:'Declared: enter and traverse the bounded local reference-equivalent experience.',
  Goals:'Declared: reach ready home; read narrative and information; operate menu, chapters, topics, disclosures and the ticket host.',
  Responsibilities:'Observed intent: initiate reversible pointer, keyboard, scroll or touch interactions in the evidenced environments.',
  Boundaries:'Declared: no authentication, external submission, purchase, payment or account management is part of this product.'
},'PRODUCT.md Whole-product purpose and visitor outcomes; '+ref+'/state-route-matrix.md SR-01..32');
candidate(ctx,'bounded-context','Local reference-fidelity product vocabulary',{}, {
  Responsibility:'Inferred grouping: describe the bounded local fixture and its observable host experience, without proposing software service boundaries.',
  Language:'Declared vocabulary: reference-equivalent fixture, host dialog, source-declared mechanism, observed behaviour, target adaptation and allowed unknown.',
  Boundaries:'Declared: later target adaptation and distribution are separate phase decisions. Exact provider commerce and external page designs are excluded.',
  'External Relationships':'Declared: host-side outbound link roles remain in scope; remote sites/providers are boundary destinations. No external integration or backend architecture is selected.'
},'PRODUCT.md Whole-product purpose / Local reference-validation mode / Exclusions','medium','inference');
for (const [id,title,definition,distinguish,usage] of [
  ['TERM-REFERENCE-FIXTURE','Reference-equivalent fixture','Declared: the dated local content/topology/state fixture used to compare observable design and experience.','Real target data and an implementation-generated acceptance baseline.','Declared: retains three chapters, eight topics, nine disclosures and three local rows for current validation.'],
  ['TERM-HOST-DIALOG','Ticket host dialog','Declared: the invitation-triggered visible overlay/panel and its host-owned lifecycle, status, close/reopen, focus and scroll relationships.','Provider inventory, dates, selection, booking, purchase, payment and backend outcomes.','Declared: acceptance uses TF-06 host scope and excludes TX-01 commerce. Unselected interior fixtures remain Q-0005.'],
  ['TERM-SOURCE-DECLARATION','Source-declared mechanism','Declared: a rule present in retained source bytes; it proves the declaration, not that every branch or exact timing was observed.','Retained runtime observation, policy decision, inference and unknown.','Declared: packet S timings/formulas guide independent implementation; O observations retain original environments and limits.']
]) candidate(id,'domain-term',title,{'defined-in':ctx},{Definition:definition,'Distinguish From':distinguish,Usage:usage},'PRODUCT.md Fixture cardinality / TF-06 / TX-01; '+packet+'/README.md Precedence; '+packet+'/motion.md O/S/L');
candidate('CON-LOCAL-BOUNDARY','constraint','Local-only host fidelity and excluded commerce',{'applies-to':[ctx]}, {
  Constraint:'Declared: validate the reference-equivalent host experience locally. Exclude exact Eventbrite inventory/date selection/booking/payment, external transactions/submissions/accounts/messages, external destination designs and telemetry fidelity. No first-party form/search/pagination system is evidenced.',
  Rationale:'Declared: FC-TARGET-DESIGN-01 changes prospective obligations without rewriting sealed historical missing-commerce facts or old gates.',
  Consequences:'Declared: no backend or selectable-commerce fixture may be invented; current evidence assets may be local fixtures but do not authorize source-code copying, publication or redistribution.'
},'PRODUCT.md TX-01 / Local reference-validation mode / U-01 reassessment; AGENTS.md Canonical ownership');
candidate('CON-EVIDENCE-BOUNDS','constraint','Evidence conditions and uncertain internals',{'applies-to':[ctx],'uses-terms':['TERM-SOURCE-DECLARATION']}, {
  Constraint:'Declared: claims remain bounded to inspected Windows Chromium/DPR1 environments, width/height/input/preference conditions and named states. Zoom, AT, physical devices, other engines, dark/RTL/DPR2+, provider/worker internals and old/current media/font byte equality remain unknown.',
  Rationale:'Declared: observations and source equality do not prove uninspected parity, fixed ambient phase or current historical raster identity.',
  Consequences:'Declared: use named revealed baselines and matched conditions; preserve unknowns and reopen only materially affected obligations. No claimed universal canvas/GPU absence.'
},'PRODUCT.md TU-01; '+ref+'/environment-matrix.md; '+ref+'/non-dom-rendering.md; '+packet+'/authority-crosswalk.md');
candidate('CON-ADAPTATION-INPUTS','constraint','Concrete input and adaptation decisions',{'applies-to':[ctx]}, {
  Constraint:'Declared: later target content/data/brand/actions require explicit TA-01 mappings; affected distributed/adapted assets require applicable TR-01 sources/licenses or documented replacements. Missing imagery/video bytes need an available fixture or concrete deviation.',
  Rationale:'Declared: rights, available input bytes, evidence readiness, adaptation readiness and implementation admission are separate decisions.',
  Consequences:'Declared: preserve fixture geometry/type/crop relationships or record deviations with measured consequences. Real purchases/submissions remain outside authority. Roadmap review still gates implementation; Q-0001 records stale PRODUCT gate wording.'
},'PRODUCT.md Asset and implementation-input availability / TA-01 / TR-01 / Separate readiness decisions');
candidate('BR-FAQ-SETTLED','business-rule','Zero or one settled FAQ answer',{}, {
  Rule:'Declared and reported observed: nine distinct disclosures have zero or one desired/settled expanded answer. Opening another closes the previous intent.',
  Rationale:'Declared: COR-01 reconciles misleading historical multiple-open prose against source and retained runtime state.',
  Examples:'Reported observed: retained desktop samples for FAQ1..9 each end with only the activated answer. Declared: rapid reversals begin from current animated values and prevent stale completion handlers.',
  Exceptions:'Declared: two native details.open attributes may transiently overlap during the old exit. This is not a second settled answer. FAQ7 retains two paragraphs; reduced/no-WAAPI settles immediately.'
},packet+'/corrections.md COR-01; '+packet+'/motion.md M-09; '+ref+'/public/app.js 658..740');

const useCases = [
  {slug:'ENTRY',title:'Enter and reach ready home',owner:'P-01',trigger:'Declared: a fresh root visit or root-brand reset.',pre:'Declared: a fresh anonymous fixture; motion preference selected before navigation.',flow:'Declared: show normal loader, part mist, release hero and reach ready home; preserve typography, imagery and default header. Loader status is polite and its progress decorative.',alt:'Declared: fresh reduced entry dismisses quickly. Source-declared 7s head fallback clears the loading class if application initialization never arrives. In-page #home is a separate path.',failure:'Unknown: natural outage not observed. The head fallback does not guarantee complete application initialization or all-image readiness.',post:'Declared: loader absent and named home content ready under matched comparison conditions.',sources:'PRODUCT.md P-01 / Entry; '+packet+'/motion.md M-01; '+ref+'/public/index.html 12'},
  {slug:'INFORMATION',title:'Read information and follow host-side destinations',owner:'P-02/P-05/P-09',trigger:'Declared: scroll/reveal about, venue, local, creator or footer; activate a named outbound link.',pre:'Declared: use the reference-equivalent section sequence and content.',flow:'Declared: reveal intro/photo, facts and readable copy; preserve decode/settle/full-exit rearm, venue/directions, three indexed local rows, creator/proof/footer presentation and link roles.',alt:'Declared: narrow facts keep three cells with internal rearrangement; reduced retains readable static content; destinations remain external contracts.',failure:'Unknown: final real-target destinations/endorsements and missing visual fixture inputs are not selected. Do not fabricate external destination results.',post:'Declared: information remains legible and host link attributes preserved; footer #home returns in-page.',sources:'PRODUCT.md P-02/05/09; '+packet+'/motion.md M-05/M-06; '+packet+'/typography-assets.md; '+ref+'/public/index.html 533..632'},
  {slug:'STORIES',title:'Progress and reverse the three story chapters',owner:'P-03',trigger:'Declared: scroll through stories or activate a chapter button in wide normal mode.',pre:'Declared: Ghosts, Dark history and UFO reference fixture; width and preference independently established.',flow:'Reported observed/declared: 0→1→2→1→0 preserves track/scenery/count/selected controls and history palette. Controls do not create a new URL fragment. Normal UFO scrubs and reverses over its still.',alt:'Declared: narrow or reduced uses vertical chapters/hidden controls. Unready/failed video keeps the still. Fresh reduced leaves media unassigned.',failure:'Unknown/bounded: exact reusable MP4 absent; playback/seek may fail. Source selection is at first load; fresh reduced-to-normal may skip initialization, Q-0004.',post:'Declared: readable chapter and coherent progression state; still/media relationships remain visible without asserting hidden decoder equivalence.',sources:'PRODUCT.md P-03; '+packet+'/motion.md M-06/M-07/M-12; '+ref+'/state-route-matrix.md SR-03..06'},
  {slug:'TOPICS',title:'Traverse topic-selected scenery and feedback',owner:'P-04',trigger:'Declared: scroll highlights into view; approach the guide/Ghost Meter row with fine pointer.',pre:'Declared: eight ordered literal IDs and COR-03 image bindings.',flow:'Declared: normal nearest-row selection updates corresponding scenery and current title. Hover fill/glitch feedback alone does not select another image. Preserve forward/reverse selection and cooldown relationships.',alt:'Declared: touch obtains selection glitch through scrolling. Fresh reduced keeps dam; switched reduced retains last selection and removes transforms/glitch.',failure:'Unknown: not every topic has an individual settled raster; common anatomy and explicit bindings are evidence, not invented pixel proof.',post:'Declared: selected row and image binding coherent; atmospheric transitions retain evidenced character.',sources:'PRODUCT.md P-04; '+packet+'/corrections.md COR-03; '+packet+'/motion.md M-08; '+ref+'/public/index.html 557..578'},
  {slug:'FAQ',title:'Open close and interrupt plan disclosures',owner:'P-06',trigger:'Declared: activate a summary using pointer, Enter or Space.',pre:'Declared: nine distinct closed disclosures on fresh reset.',flow:'Declared/reported observed: expand chosen answer; opening another closes previous intent; close or reverse continuously from current height/opacity/filter/transform; remeasure content-driven height.',alt:'Declared: reduced/no-WAAPI settles immediately; transient native-open overlap is allowed during old exit; FAQ7 has two paragraphs.',failure:'Declared: stale animation completions must not overwrite current intent. Fixture text about refunds/booking is not implemented business enforcement.',post:'Declared: zero or one settled answer, coherent icon/expanded/inert relationship and readable distinct content.',sources:'PRODUCT.md P-06; '+packet+'/corrections.md COR-01; '+packet+'/motion.md M-09'},
  {slug:'MENU',title:'Open close and reverse global menu',owner:'P-07',trigger:'Declared: activate Menu/Close or Escape.',pre:'Declared: closed/default header and hidden nav on fresh root.',flow:'Declared/reported observed: unhide and stagger rows/footer; expanded state and Close label; first-link focus and scroll lock. Close clears intent/lock and finishes exit before hidden; Escape returns toggle focus.',alt:'Declared: narrow stacked versus wide left/right layout; reduced immediate transitions/hide; reopen cancels pending hide.',failure:'Unknown: focus eligibility during closing and combined overlay arbitration remain Q-0006/7; do not claim source trap means passing runtime focus.',post:'Declared: named fully open or fully hidden endpoint with correct labels and default header relationship.',sources:'PRODUCT.md P-07; '+packet+'/motion.md M-10; '+ref+'/public/app.js 39..79'},
  {slug:'NAVIGATION',title:'Navigate fragments history and root reset',owner:'P-07/PX-02',trigger:'Declared: activate an observed section/inline/footer/brand link or use browser history/reload.',pre:'Declared: eight named section IDs in one root shell, unnamed highlights/footer; actual observed href inventory.',flow:'Declared: traverse actual fragment destinations, correct scroll and evidenced focus/history relationship. Root brand removes fragment and starts a fresh visit; footer #home remains in-page.',alt:'Declared: fine-pointer smoothing can focus destination/push hash; wheel interrupts tween; touch/keyboard/scrollbar/native reduced paths remain independently assessed.',failure:'Unknown: input-specific focus and reset/persistence for each history transition need Q-0008. No extra menu rows, pages or global state reset is inferred.',post:'Declared: destination and URL match evidenced contract; explicit fresh root resets visit state.',sources:'PRODUCT.md PJ-02 / Scrolling-input; '+packet+'/motion.md M-06/M-10; '+ref+'/public/app.js 568..657'},
  {slug:'TICKET',title:'Operate ticket invitation and host dialog lifecycle',owner:'P-08',trigger:'Declared: activate the ticket invitation, or enter the explicit tickets=preview query.',pre:'Declared: bounded non-transactional host scope; local interior fixture remains unselected Q-0005.',flow:'Declared/reported observed: open/loading/visible host; focus close control and lock page; close with Escape/button/veil; restore valid prior focus/scroll; reopen retains mounted state and cancels pending hide.',alt:'Declared: narrow full-viewport panel; reduced no fog/immediate hide; preview schedules auto-open at source-declared 600ms; controlled script-block fallback is simulated evidence.',failure:'Unknown: loading/ready/fallback/retry local data contract and overlay interactions. Iframe presence is not appearance readiness; no natural outage, successful purchase or provider-empty state is inferred.',post:'Declared: host closes/reopens coherently; exact commerce excluded and observed Tab escape remains a defect whose target disposition is Q-0010.',sources:'PRODUCT.md P-08 / TF-06 / TX-01; '+packet+'/motion.md M-11; '+ref+'/state-route-matrix.md SR-25..32'}
];
for (const u of useCases) {
  const fields={'primary-actor':'ACT-VISITOR','bounded-context':ctx,'uses-terms':['TERM-REFERENCE-FIXTURE']};
  if(u.slug==='FAQ') fields['governed-by']=['BR-FAQ-SETTLED'];
  if(u.slug==='TICKET') fields['uses-terms'].push('TERM-HOST-DIALOG');
  candidate(`UC-${u.slug}`,'use-case',u.title,fields,{Goal:`Declared: ${u.title}; current product owner ${u.owner}.`,Trigger:u.trigger,Preconditions:u.pre,'Main Flow':u.flow,'Alternative Flows':u.alt,'Failure Conditions':u.failure,Postconditions:u.post},u.sources);
  candidate(`FR-${u.slug}`,'functional-requirement',u.title,{'derived-from':[`UC-${u.slug}`],verification:[{id:`VERIFY-${u.slug}`,scenario:`Reference-equivalent fixture: exercise ${u.slug.toLowerCase()} in its named normal, narrow/touch and reduced branches; assert ${u.post.replace(/^Declared: /,'')} Keep questions in Failure Conditions unresolved; this seed has not been executed.`}]},{Requirement:u.flow+'\n\n'+u.alt,Rationale:`Declared: current ${u.owner} observable contract. ${u.failure}`},u.sources);
}
candidate('FR-PAGE-PROGRESS','functional-requirement','Candidate page scroll-progress relationship',{'derived-from':['UC-NAVIGATION'],verification:[{id:'VERIFY-PROGRESS',scenario:'Candidate for owner confirmation: compare top, middle and end progress with the measured document scroll range, including after resize or disclosure height change and under reduced motion. No new runtime result is claimed.'}]},{Requirement:'Source-declared: fixed decorative aria-hidden top progress strip scales by clamped nonnegative scrollY divided by measured document scroll range. This is separate from loader decorative progress. Product adoption/acceptance ownership remains Q-0003.',Rationale:'Inferred omission: generic P-10/PX-02 ownership does not explicitly name this visible feedback surface. Candidate is not an accepted scope expansion.'},ref+'/public/index.html 505; '+ref+'/public/styles.css 5; '+ref+'/public/app.js 450..461','medium','inference');
const journeys=[
 ['FRESH-ENTRY','Fresh root reaches ready home',['ENTRY'],'PJ-01'],
 ['FRAGMENT-NAVIGATION','Menu and fragment traversal',['MENU','NAVIGATION'],'PJ-02'],
 ['STORY-PROGRESSION','Forward and reverse story progression',['STORIES'],'PJ-03'],
 ['FAQ-INTERACTION','Read and reverse a plan disclosure',['FAQ'],'PJ-04'],
 ['TICKET-HOST','Open close and reopen ticket host',['TICKET'],'PJ-05'],
 ['OUTBOUND-INFORMATION','Read venue local and outbound information',['INFORMATION'],'PJ-06']
];
for(const [slug,title,steps,pj] of journeys) candidate(`JRN-${slug}`,'journey',title,{'primary-actor':'ACT-VISITOR',steps:steps.map(s=>({'use-case':`UC-${s}`}))},{'Intended Outcome':`Declared: ${title}, corresponding to current ${pj}.`,'Entry Conditions':'Declared: reference-equivalent local fixture and named evidence environment.','Journey Narrative':`Declared: ${steps.map(s=>useCases.find(u=>u.slug===s).flow).join('\n\n')}`,'Variants and Branches':'Declared: use-case branches preserve width/input/preference and fresh-versus-switched distinctions; unresolved questions do not acquire invented answers.','Completion Conditions':'Declared: the use-case postconditions hold within the bounded host contract; no transaction or uninspected parity is claimed.'},'PRODUCT.md Routes entry points and critical journeys; '+packet+'/motion.md');
for (const [slug,title,attribute,requirement,measurement,source] of [
 ['VISUAL','Named-state visual and typography fidelity','visual fidelity','Declared: preserve visual hierarchy, final-cascade geometry, crop/layers and actual typography metrics/wraps in reference-equivalent fixtures. Broad full-page agreement cannot substitute for revealed named states.','Declared: compare matching environment and named baselines; calibrate numerical tolerances before evaluation, not by hiding failures. F-02 corrects packet summary; final source and dated measurements remain distinct.','PRODUCT.md TF-01/02; '+packet+'/authority-crosswalk.md; '+packet+'/typography-assets.md'],
 ['MOTION','Temporal input responsive and motion character','experience fidelity','Declared: preserve state ordering, reversal/interruption, timing relationships, native versus fine-pointer scroll paths, width/height boundaries, reduced preference history and independent ambient character.','Declared: use temporal/state checkpoints, exact boundary widths and native/emulated input conditions; random phase is assessed by ranges/character. M-01..12 and Q-0004/6/8/12 delimit claims.','PRODUCT.md TF-03/04 / PX-02..04; '+packet+'/motion.md; '+ref+'/environment-matrix.md'],
 ['ACCESSIBILITY','Bounded operable semantics focus and motion preference','accessibility','Declared: preserve loader status, meaningful names/roles/state, skip link, keyboard disclosures/menu and evidenced focus/return relationships; hidden endpoints excluded from focus. Reference defects are evidence, not mandatory failures.','Declared: keyboard/focus/state checks in bounded Chromium scope. Closing focus and dialog defect disposition remain Q-0007/10; record any approved deviation and its consequences. No uninspected AT parity.','PRODUCT.md TF-05 / PX-05; '+packet+'/motion.md M-09..12; '+ref+'/state-route-matrix.md SR-30']
]) candidate(`QR-${slug}`,'quality-requirement',title,{'quality-attribute':attribute,'applies-to':[ctx],verification:[{id:`VERIFY-${slug}`,scenario:measurement}]},{Requirement:requirement,Measurement:measurement},source);
candidate('SB-FAQ-REPLACE','structured-behaviour','Opening another answer replaces settled FAQ intent',{illustrates:['UC-FAQ','BR-FAQ-SETTLED'],given:['The reference-equivalent FAQ has one settled expanded answer','Normal motion is enabled'],when:'The visitor activates a different FAQ summary',then:['The newly activated answer becomes the sole desired expanded answer','The previous answer exits continuously from its current animated state','After transitions settle only the newly activated answer is expanded']},{Intent:'Reported observed/source-declared and prospectively corrected: reproduce the single-settled-answer contract rather than erroneous historical prose.',Boundaries:'Declared: native details.open can overlap transiently; no fixed answer height or fabricated animation runtime is asserted.'},packet+'/corrections.md COR-01; '+packet+'/motion.md M-09');
candidate('SB-ROOT-RETURN','structured-behaviour','Root brand and in-page home return are different',{illustrates:['UC-ENTRY','UC-NAVIGATION'],given:['The visitor has traversed the reference-equivalent document'],when:'The visitor activates the root brand link',then:['The visit navigates to the root without the section fragment','Fresh entry behaviour applies for the current motion preference']},{Intent:'Declared: preserve fresh navigation reset and avoid treating the brand root link as an in-page #home shortcut.',Boundaries:'Declared: footer #home instead remains in-document. Browser back/forward persistence details remain Q-0008, not assumed.'},'PRODUCT.md PJ-01 / PJ-02; '+packet+'/motion.md M-06; '+ref+'/public/app.js 237..241');

const dirs={'actor':'actors','bounded-context':'domain/bounded-contexts','domain-term':'domain/terms','business-rule':'business-rules','constraint':'requirements/constraints','use-case':'use-cases','functional-requirement':'requirements/functional','journey':'journeys','quality-requirement':'requirements/quality','structured-behaviour':'behaviours'};
await mkdir(`${inputDir}/candidate-markdown`,{recursive:true});
for(const c of candidates) {
  const sourceFile=`${inputDir}/candidate-markdown/${c.id.toLowerCase()}.md`;
  await writeFile(sourceFile,c.content);
  await cli(['speckit-product','recover-candidate','--session',session,'--path',`${dirs[c.type]}/${c.id.toLowerCase()}.md`,'--file',sourceFile]);
}
const questions=Array.from({length:12},(_,i)=>({text:`Review F-${String(i+1).padStart(2,'0')} in audit.md: ${[
  'Which current roadmap review gate should PRODUCT pointers name?',
  'Confirm prospective correction of hero geometry summary against final CSS cascade.',
  'Is page scroll-progress explicitly required, and which owner accepts it?',
  'Which switched preference behaviours are retained, corrected or deliberately left unknown?',
  'What exact non-transactional local host interior and loading/ready/fallback fixture is accepted?',
  'What is the product disposition for loader/menu/dialog overlap and focus/Escape arbitration?',
  'What focus and pointer eligibility is accepted during overlay closing before native hidden?',
  'What focus/reset/persistence relationships apply to each navigation transition and input mode?',
  'Which concrete available inputs or measured deviations satisfy each missing visual/media fixture?',
  'Is correcting the observed dialog Tab escape required before local acceptance?',
  'Which owner accepts the ticket review cue and which accepts creator-media proof?',
  'What visibility/cancellation rule applies separately to each effect and overlay clock?'
][i]}`,context:`Evidence, impact and responsible canonical owner are recorded in ${recoveryDir}/audit.md F-${String(i+1).padStart(2,'0')}. No answer was supplied by the human and no contradiction is resolved silently.`,recommendation:'Review the cited declaration/observation and decide in its existing canonical owner; keep the question open until explicit review.'}));
const findings=[];
const ids=candidates.map(c=>c.id);
const map={
 'E-0001':['CON-LOCAL-BOUNDARY','CON-EVIDENCE-BOUNDS'],'E-0002':['CON-LOCAL-BOUNDARY','CON-EVIDENCE-BOUNDS'],
 'E-0003':ids.filter(x=>x!=='FR-PAGE-PROGRESS'),'E-0005':['CON-EVIDENCE-BOUNDS','QR-VISUAL','QR-MOTION'],
 'E-0006':['QR-VISUAL','QR-MOTION','FR-ENTRY','FR-MENU','FR-TICKET','FR-INFORMATION'],
 'E-0007':['BR-FAQ-SETTLED','FR-FAQ','FR-TOPICS','CON-LOCAL-BOUNDARY','SB-FAQ-REPLACE'],
 'E-0008':['CON-ADAPTATION-INPUTS','QR-VISUAL','QR-MOTION'],'E-0009':['CON-EVIDENCE-BOUNDS'],
 'E-0010':ids.filter(x=>x!=='FR-PAGE-PROGRESS'&&(/^(UC|FR|QR|SB|JRN|BR)-/.test(x)||x==='TERM-SOURCE-DECLARATION')),
 'E-0011':['QR-VISUAL','CON-ADAPTATION-INPUTS','FR-INFORMATION','FR-TOPICS'],
 'E-0012':['QR-VISUAL','CON-EVIDENCE-BOUNDS'],'E-0013':['CON-ADAPTATION-INPUTS'],
 'E-0014':['CON-EVIDENCE-BOUNDS','QR-MOTION'],'E-0015':['CON-EVIDENCE-BOUNDS','CON-LOCAL-BOUNDARY'],
 'E-0016':['QR-VISUAL','QR-MOTION','QR-ACCESSIBILITY','FR-NAVIGATION','FR-TICKET'],
 'E-0017':['CON-EVIDENCE-BOUNDS','TERM-SOURCE-DECLARATION'],'E-0018':['CON-ADAPTATION-INPUTS','TERM-SOURCE-DECLARATION'],
 'E-0019':['CON-EVIDENCE-BOUNDS','CON-LOCAL-BOUNDARY'],'E-0020':['ACT-VISITOR','CON-LOCAL-BOUNDARY','QR-VISUAL','QR-MOTION'],
 'E-0021':ids.filter(x=>/^(UC|FR|QR|SB|JRN)-/.test(x)&&x!=='FR-PAGE-PROGRESS'),
 'E-0022':['CON-EVIDENCE-BOUNDS','QR-VISUAL'],
 'E-0023':ids.filter(x=>/^(UC|FR|SB|BR)-/.test(x)),
 'E-0024':['TERM-REFERENCE-FIXTURE','FR-PAGE-PROGRESS','FR-INFORMATION','FR-TOPICS','FR-ENTRY','FR-TICKET'],
 'E-0025':['FR-PAGE-PROGRESS','QR-VISUAL','QR-MOTION','QR-ACCESSIBILITY']
};
for(let i=1;i<=28;i++) {
  const source=`E-${String(i).padStart(4,'0')}`;
  if(i===4) findings.push({source,classification:'out-of-scope',reason:'Decomposition and execution context only by explicit human authorization; no product behavioural claim or candidate is derived from roadmap feature declarations.',note:'F-01 compares current context status against PRODUCT pointer; it does not promote ROADMAP to product evidence.',complete:true});
  else if(i>=26) findings.push({source,classification:'no-product-intent',reason:'Reconstruction methodology, skill interface metadata or reusable blank acceptance template. These govern evidence discipline but add no HBC product behaviour.',complete:true});
  else {
    const artifacts=[...new Set(map[source])];
    findings.push({source,classification:'represented',artifacts,note:'Current policy versus historical observations/source declarations are explicitly separated in candidates and audit.md. Source mechanisms are independently recovered, never copied into runtime code. Metadata/telemetry/fixture business prose do not add backend product requirements.',complete:false});
    if(i===3) for(const q of [1,3,4,5,6,7,8,9,10,11,12]) findings.push({source,classification:q===1?'contradiction':'question',question:`Q-${String(q).padStart(4,'0')}`,note:`Audit F-${String(q).padStart(2,'0')}: source-policy uncertainty or acceptance ownership gap; no new behaviour adopted.`,complete:false});
    if(i===11||i===25) findings.push({source,classification:'contradiction',question:'Q-0002',note:'Packet says final hero height100svh/max1400 (narrow max1050); source CSS286 later declares height:auto/max-height:none and narrow rule retains no cap. Source not new runtime observation.',complete:false});
    if(i===7||i===16||i===21) findings.push({source,classification:'contradiction',note:'Historical SR-23/AC2-05 multiple-open prose conflicts with COR-01 and source-declared zero/one desired/settled state. Current authority already supplies prospective disposition; old facts/prose remain immutable.',complete:false});
    findings.push({source,complete:true});
  }
}
const leads=[
 {kind:'repo',source:'E-0010',description:'Next authorized batch: inspect inherited-v1 E-050/E-080/E-085/E-086/E-090 and preference traces to independently corroborate FAQ, focus, timing and switched-history claims; do not treat report summaries as newly executed proof.'},
 {kind:'repo',source:'E-0012',description:'Next authorized batch: independently read E2-013 canonical phase assessment and E2-014 exact geometry plus named image sidecars/pixels. Parent manifest validation does not validate appearance.'},
 {kind:'user',source:'E-0011',description:'Resolve available-media fixture inputs and concrete visual/video deviations for affected surfaces. No new download or external source is authorized; keep missing inputs separate from local reuse permission.'}
];
await writeFile(`${inputDir}/batch-01.json`,JSON.stringify({questions,leads,findings,retractions:[],familyProbes:[]},null,2)+'\n');
const changeSections={
 Problem:'Declared: PRODUCT.md is the existing canonical narrative, but no accepted ProductShape graph exists. Independently recover its evidence-supported product meaning and expose omissions, contradictions, unsupported choices, missing state ownership and ambiguity. This is not an excuse to replace current policy or use pre-roadmap specs as product authority.',
 'Intended Product Outcome':'A reviewable draft initial graph grounded in the authorized 28-source batch, with provenance/confidence, source/runtime/policy distinctions and twelve open findings. No accepted-model delta is produced.',
 Rationale:'The user authorized this bounded recovery from repository evidence and explicitly restricted authority. ROADMAP is context only. Frozen evidence and canonical owners stay unchanged. One round stops before lower-tier continuation or human approval/apply.',
 'Affected Product Areas':'P-01..P-10 and TF/TA/TR/TX/TU relationships as described in audit.md; product-area IDs do not determine implementation features.',
 'Open Questions':questions.map((q,i)=>`- Q-${String(i+1).padStart(4,'0')}: ${q.text}`).join('\n'),
 'Product Acceptance':'Candidate acceptance is pending. Structural overlay validation, source mapping, draft provenance and unchanged accepted-model snapshot must pass; all semantic questions remain open. No built-product fidelity, roadmap approval, adaptation readiness or asset license decision is claimed.',
 'Out of Scope':'Applying/approving/archiving product changes; editing docs/product/model, PRODUCT.md or ROADMAP.md; implementation; reference recapture; live network/provider calls; external writes; exact commerce; forbidden sources and product authority from any specs.'
};
await mkdir(`${recoveryDir}/product`,{recursive:true});
await writeFile(`${recoveryDir}/product/change.md`,`---\n${stringify({id:'CHG-INITIAL',type:'product-change',title:'Independent bounded HBC canonical-product recovery',status:'draft','base-revision':'0000000',operations:{add:ids.sort(),modify:[],remove:[]}})}---\n\n${descriptors.kinds.find(k=>k.kind==='product-change').bodySections.map(h=>`## ${h}\n\n${changeSections[h]}`).join('\n\n')}\n`);
await writeFile(`${inputDir}/candidate-index.json`,JSON.stringify(candidates.map(({id,type,source,confidence})=>({id,type,source,confidence})),null,2)+'\n');
console.log(JSON.stringify({draftCandidates:candidates.length,questions:questions.length,batchSources:28}));
