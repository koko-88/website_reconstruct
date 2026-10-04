from pathlib import Path
p=Path('skill-hardening/settled-appearance-v2.1.0/verify-hardening.mjs');s=p.read_text(encoding='utf-8-sig')
s=s.replace("const skill=verify('skills/reference-reconstruction',{files:stage});", "const installedRoot='C:/Users/kerol/.agents/skills/reference-reconstruction';\nconst installed=inventory(installedRoot),installedMatchesStage=JSON.stringify(installed)===JSON.stringify(stage);\nif(!installedMatchesStage)throw Error('Installed skill differs from stage');\nconst skill=verify('skills/reference-reconstruction',{files:stage});\nconst installedVerification=verify(installedRoot,{files:stage});")
s=s.replace('backupMatchesOriginallyInstalled:true,changes}', 'backupMatchesOriginallyInstalled:true,installedMatchesStage,installedVerification,changes}')
s=s.replace("skill:skill.result,changes:","skill:skill.result,installedMatchesStage,changes:")
p.write_text(s,encoding='utf-8')
p=Path('skill-hardening/settled-appearance-v2.1.0/hardening-report.md');s=p.read_text(encoding='utf-8-sig').replace('[Installed synthetic results](tests-installed-serial.log)', '[Installed synthetic results](tests-installed-final.log)');p.write_text(s,encoding='utf-8')
