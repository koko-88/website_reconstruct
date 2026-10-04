from pathlib import Path
p=Path('skills/reference-reconstruction/assets/capture-plan.example.json')
s=Path('skill-hardening/settled-appearance-v2.1.0/before/assets/capture-plan.example.json').read_text(encoding='utf-8-sig')
s=s.replace('      "timeoutMs": 10000,','      "appearance": {"scope": "viewport", "assertions": [{"selector": "main", "visible": true, "minOpacity": 0.99}]},\n      "timeoutMs": 10000,')
p.write_text(s,encoding='utf-8')
