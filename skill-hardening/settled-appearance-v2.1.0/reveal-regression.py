from pathlib import Path
p=Path('skills/reference-reconstruction/scripts/test-settled-appearance.mjs');s=p.read_text(encoding='utf-8-sig')
s=s.replace('      await page.evaluate(()=>{scrollTo(0,1600);scrollTo(0,0)});const reset=await waitReady(page,cp);', '      await page.evaluate(()=>scrollTo(0,1600));await page.waitForFunction(()=>getComputedStyle(document.querySelector("#child")).opacity==="1",{},{timeout:1000});\n      await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>getComputedStyle(document.querySelector("#child")).opacity==="0",{},{timeout:1000});const reset=await waitReady(page,cp);')
p.write_text(s,encoding='utf-8')
