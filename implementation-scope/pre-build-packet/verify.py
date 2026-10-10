"""Local evidence handoff checks. No browser, network, capture, or application code execution."""
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import unquote
from html.parser import HTMLParser
import argparse, hashlib, json, re, sys

packet = Path(__file__).resolve().parent
root = packet.parents[1]
v2 = root / 'reference/haunted-boulder-city-v2/rev-2.0.0-real-01'
receipt = packet / 'verification.json'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('baseline', nargs='?', help='Optional reference-tree snapshot relative to the repository')
parser.add_argument('--output', type=Path, help='Write results to a new file; default is stdout only')
args = parser.parse_args()
if args.output:
    args.output = args.output.resolve()
    if args.output.exists() or args.output == receipt.resolve() or (root / 'reference').resolve() in args.output.parents:
        parser.error('Output must be a new file outside frozen/sealed evidence and historical receipts')
failures = []
checks = {}
def check(name, condition, detail):
    checks[name] = {'result': 'PASS' if condition else 'FAIL', 'detail': detail}
    if not condition: failures.append(name)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def tree_rows():
    return sorted([{'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)}
                   for p in (root/'reference').rglob('*') if p.is_file()], key=lambda x:x['path'])
def digest(rows):
    return hashlib.sha256(json.dumps(rows,sort_keys=True,separators=(',',':')).encode()).hexdigest()

now_rows = tree_rows()
if args.baseline:
    baseline = sorted(load(root/args.baseline),key=lambda x:x['path'])
    before_digest = digest(baseline)
    unchanged = baseline == now_rows
else:
    previous = load(receipt)
    before_digest = previous['immutableReference']['beforeTreeSHA256']
    unchanged = before_digest == digest(now_rows)
check('reference_byte_identity',unchanged,{'files':len(now_rows),'beforeSHA256':before_digest,'afterSHA256':digest(now_rows)})

manifest_errors=[]; manifest_entries=0
for manifest in [v2/'manifest.json',root/'reference/haunted-boulder-city/observations/artifact-manifest.json']:
    base = manifest.parent if manifest.name=='manifest.json' else manifest.parent.parent
    for row in load(manifest)['files']:
        p = base/row['path']; manifest_entries+=1
        if not p.is_file() or p.stat().st_size!=row['bytes'] or sha(p)!=row['sha256']:
            manifest_errors.append(row['path'])
check('sealed_and_frozen_manifest_hashes',not manifest_errors,{'entries':manifest_entries,'mismatches':manifest_errors})

entries=load(packet/'evidence-map.json')['entries']
errors=[]
for key,entry in entries.items():
    p=root/entry['path']
    if not p.is_file(): errors.append(key)
    elif 'lines' in entry:
        a,b=entry['lines']
        if not 1<=a<=b<=len(p.read_text(encoding='utf-8').splitlines()): errors.append(key+' line bounds')
check('evidence_locator_paths_and_line_bounds',not errors,{'locators':len(entries),'errors':errors})

required_source={
'JS-LOADER':['1600 - performance.now()','3600','parting ? 260','parting ? 1500'],
'JS-TOPICS':['.52','rect.height * .4','cooldown = 5000','glitch(900)'],
'JS-UFO':['duration - .05','1 / 48',"rootMargin: '100% 0px'"],
'JS-FOG':['function addFog',"rootMargin: '80px'",'visibilitychange'],
'JS-SPIRIT':['brightDuration: 2800','faintDuration: 4600','[20000, 45000]','dipChance: .4','threshold: .45'],
'JS-FACTS':['k * 150','index * 190','index * 44','700','intersectionRatio >= .3'],
'JS-RENDER':['fraction - .16','/ .68','transition * transition * (3 - 2 * transition)','Math.sin(Math.PI * transition) ** 2','rect.height * .09','((1 + .16) / 2)','/ .75'],
'JS-SCROLL':['WEIGHT = .28','900 + distance / 2.5','1 - (1 - t) ** 4'],
'JS-FAQ':['item.close()','desiredOpen ? 620 : 420','desiredOpen ? 550 : 260','run === generation','answer.inert = !desiredOpen'],
'JS-MENU':['reduceMotion.matches ? 0 : 600','clearTimeout(menuTimer)'],
'JS-MODAL':['reduceMotion.matches ? 0 : 500','10000','setTimeout(openBoxOffice, 600)'],
'CSS-MENU':['transition-delay:.26s','transition-delay:.62s'],
'CSS-SPIRIT':['@keyframes spirit-rise','@keyframes spirit-dip'],
'CSS-GLITCH':['.72s steps(1, end)'],
'HTML-TOPICS':['data-topic="guide"','data-topic-image="guide"']
}
source_errors=[]
for key,needles in required_source.items():
    entry=entries[key]; a,b=entry['lines']; text='\n'.join((root/entry['path']).read_text(encoding='utf-8').splitlines()[a-1:b])
    source_errors += [key+': '+needle for needle in needles if needle not in text]
check('source_mechanics_traceability',not source_errors,{'sourceSystems':len(required_source),'errors':source_errors})

audit=load(packet/'anchor-audit.json')
matrix=(root/audit['matrixPath']).read_text(encoding='utf-8')
matrix_rows={}
for line in matrix.splitlines():
    if re.match(r'\| SR-\d+ \|',line):
        cells=[x.strip() for x in line.split('|')[1:-1]]
        matrix_rows[cells[0]]=(cells[1],cells[6])
purpose_errors=[r['id'] for r in audit['rows'] if matrix_rows.get(r['id'])!=(r['purpose'],r['acceptance'])]
check('all_SR_purposes_and_acceptance_cells',not purpose_errors and len(audit['rows'])==46 and len(matrix_rows)==46,{'rows':len(audit['rows']),'mismatches':purpose_errors})

def sr_expand(cell):
    nums=[]
    for match in re.finditer(r'(?:SR-)?(\d+)(?:\.\.(\d+))?',cell):
        a=int(match[1]); b=int(match[2]) if match[2] else a
        nums.extend(range(a,b+1))
    return sorted(set(nums))
contract=(root/'PRODUCT.md').read_text(encoding='utf-8')
contract_errors=[]; audited=[]
for line in contract.splitlines():
    if re.match(r'\| (TF-\d+|TR-01|TU-01) /',line):
        cells=[x.strip() for x in line.split('|')[1:-1]]
        key=cells[0].split(' /')[0]; evidence=cells[3]
        segments=re.findall(r'SR-[\d./]+',evidence)
        actual=sorted({n for segment in segments for n in sr_expand(segment)})
        expected=sorted(audit['obligationSRMembership'][key])
        if actual!=expected: contract_errors.append({'id':key,'actual':actual,'expected':expected})
        audited.append(key)
    for n in re.findall(r'SR-(\d+)',line):
        if 'SR-'+n not in matrix_rows: contract_errors.append('unknown SR-'+n)
check('writable_contract_SR_membership',not contract_errors and len(audited)==8,{'obligations':audited,'errors':contract_errors})

class TopicBindings(HTMLParser):
    """Read topic labels and original asset bindings without backtracking over HTML."""
    def __init__(self):
        super().__init__()
        self.topics = []
        self.images = {}
        self.topic = None
        self.heading = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'li' and attrs.get('class', '').startswith('topic'):
            self.topic = attrs.get('data-topic')
        if tag == 'h3' and self.topic is not None:
            self.heading = []
        image = attrs.get('data-topic-image')
        source = attrs.get('src', '')
        if image is not None and source.startswith('/assets/'):
            self.images[image] = source.removeprefix('/assets/')

    def handle_data(self, data):
        if self.heading is not None:
            self.heading.append(data)

    def handle_endtag(self, tag):
        if tag == 'h3' and self.heading is not None:
            self.topics.append((self.topic, ''.join(self.heading)))
            self.heading = None
        if tag == 'li':
            self.topic = None

html=(v2/'public/index.html').read_text(encoding='utf-8')
bindings = TopicBindings()
bindings.feed(html)
bindings.close()
topics = bindings.topics
images = bindings.images
expected_topics=[('dam','HOOVER DAM'),('ghost','GHOST DOG'),('murderer','FIRST MURDERER'),('sky','AREA 51'),('bodies','BURIED BODIES'),('celebs','STRANGE CELEBS'),('guide','GHOST METER'),('esp','ESP')]
expected_images={'dam':'hoover-dam.webp','ghost':'ghost-dog.webp','murderer':'first-murderer.webp','sky':'flying-saucer.webp','bodies':'dam-workers.webp','celebs':'strange-celebs.webp','guide':'buried-bodies.webp','esp':'esp-gambling.webp'}
check('topic_label_identifier_image_crosswalk',topics==expected_topics and images==expected_images,{'rows':len(topics),'imageBindings':len(images)})

runtime=load(v2/'inherited-v1/observations/E-050-1440-journeys.json')
faq=[]
for row in runtime['log']:
    m=re.fullmatch(r'FAQ (\d) open',row['action'])
    if m: faq.append(([i+1 for i,d in enumerate(row['state']['details']) if d['open']],int(m[1])))
reversal=load(v2/'inherited-v1/observations/E-080-reversal-focus-ufo.json')
interruption=next(x for x in reversal['log'] if x['action']=='FAQ interruption closes')
check('FAQ_correction_grounded_in_runtime',len(faq)==9 and all(actual==[wanted] for actual,wanted in faq) and not any(x['open'] for x in interruption['state']['details']),{'settledDesktopSamples':len(faq),'interruptedEndAllClosed':True})

assessment=load(v2/'observations/E2-013-capture-assessment.json')
phases={r['qualifiedId']:r['canonicalAssessment'] for r in assessment['rows']}
canonical=['raw-run-01/D--HOME','raw-run-01/M--HOME','raw-run-01/D--FAQ','raw-run-01/M--FAQ','raw-run-01/M--TICKETS','raw-repair-01/D-REPAIR--REOPEN','raw-run-01/R--HOME','raw-run-01/R--UFO']
canonical += [f'raw-repair-02/{size}-MENU-REPAIR--{state}' for size in ['D','M'] for state in ['OPEN','CLOSED']]
superseded=['raw-run-01/D--MENU','raw-run-01/M--MENU','raw-run-01/D--MENU-CLOSED','raw-run-01/M--MENU-CLOSED','raw-run-01/D--TICKETS','raw-repair-01/D-REPAIR--PROVIDER']
canonical_errors=[k for k in canonical if phases[k]!='settled']
canonical_errors += [k for k in superseded if phases[k]=='settled']
check('canonical_and_superseded_phase_precedence',not canonical_errors,{'canonical':len(canonical),'superseded':len(superseded),'errors':canonical_errors})

# Follow local links from writable entry points through linked evidence Markdown.
pending=list(packet.glob('*.md'))+[root/p for p in ['AGENTS.md','PRODUCT.md','ROADMAP.md','LOGIC_VERIFICATION.md','IMPLEMENTATION_VERIFICATION.md']]
seen=set(); path_errors=[]; fragment_errors=[]; link_count=0
def slug(h):
    h=re.sub(r'[`*_]','',h.strip()).lower()
    return re.sub(r'[^\w\- ]','',h).replace(' ','-')
while pending:
    p=pending.pop().resolve()
    if p in seen: continue
    seen.add(p)
    text=p.read_text(encoding='utf-8-sig')
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',text):
        target=target.strip('<>')
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:',target): continue
        pathpart,_,fragment=unquote(target).partition('#')
        dest=(p.parent/pathpart).resolve() if pathpart else p
        link_count+=1
        if not dest.is_file():
            if dest==receipt: continue
            path_errors.append({'from':str(p.relative_to(root)),'target':target}); continue
        if fragment and dest.suffix=='.md':
            headings={slug(x) for x in re.findall(r'^#+ (.+)$',dest.read_text(encoding='utf-8-sig'),re.M)}
            if fragment not in headings: fragment_errors.append({'from':str(p.relative_to(root)),'target':target})
        if dest.suffix=='.md' and root in dest.parents: pending.append(dest)
check('all_linked_repository_paths_and_Markdown_anchors',not path_errors and not fragment_errors,{'links':link_count,'MarkdownFiles':len(seen),'pathErrors':path_errors,'fragmentErrors':fragment_errors})

check('independent_gates_preserved',('Current local reference-validation: NOT REQUIRED as a precondition' in contract and 'Public/distributed target release or real adaptation: BLOCKED' in contract and 'PENDING / not yet ready' in contract and 'TX-01' in contract),{'localValidationAssetGate':'NOT REQUIRED as precondition','publicReleaseAssetGate':'BLOCKED until TR-01 decisions complete','targetAdaptation':'PENDING','principle':'Local fixture validation does not grant public reuse or target-adaptation authority'})

result={'packetId':'IP-HBC-01','verifiedAtUTC':datetime.now(timezone.utc).isoformat(),'result':'FAIL' if failures else 'PASS','failures':failures,'immutableReference':{'files':len(now_rows),'beforeTreeSHA256':before_digest,'afterTreeSHA256':digest(now_rows)},'checks':checks}
if args.output:
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('x', encoding='utf-8') as output:
        output.write(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'result':result['result'],'checks':len(checks),'failures':{name:checks[name]['detail'] for name in failures}},ensure_ascii=False))
sys.exit(1 if failures else 0)
