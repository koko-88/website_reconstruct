from pathlib import Path
p=Path('skills/reference-reconstruction/scripts/settled-appearance.mjs');s=p.read_text(encoding='utf-8-sig')
s=s.replace("      reasons=['sample-operation:'+error.message];", "      reasons=[...new Set([...reasons,'sample-operation:'+error.message])];")
p.write_text(s,encoding='utf-8')
p=Path('skill-hardening/settled-appearance-v2.1.0/final-evidence.mjs');s=p.read_text(encoding='utf-8-sig')
s=s.replace("const verification=JSON.parse", "const testLog=fs.readFileSync(root+'/tests-installed-final.log','utf8');\nconst testSummary=Object.fromEntries(['tests','pass','fail','skipped','cancelled'].map(k=>[k,Number(testLog.match(new RegExp('ℹ '+k+' (\\\\d+)'))?.[1]??NaN)]));\nif(testSummary.tests!==25||testSummary.pass!==25||testSummary.fail!==0||testSummary.skipped!==0||testSummary.cancelled!==0)throw Error('Installed synthetic validation is not passing');\nconst verification=JSON.parse")
s=s.replace('...verification,contract,artifacts,limit:', '...verification,testSummary,contract,artifacts,limit:')
p.write_text(s,encoding='utf-8')
