#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, subprocess

root = Path(__file__).resolve().parents[1]
sources = [root / "src/candidate/person-history-map-card-v14.js", root / "src/candidate/person-rich-card-v34.js"]
banner = "/* HA-BOARD 0.1.2-rc.1 | History 1.4.2 | Rich 3.4.7 */\n"
bundle = banner + "\n".join(p.read_text(encoding="utf-8").rstrip() for p in sources) + "\n"
target = root / "dist/ha-board.js"
target.parent.mkdir(exist_ok=True)
target.write_text(bundle, encoding="utf-8", newline="\n")
manifest = {"package_version":"0.1.2-rc.1","entrypoint":"dist/ha-board.js","sha256":hashlib.sha256(bundle.encode()).hexdigest(),"components":{"person-history-map-card-v14":"1.4.2","person-rich-card-v34":"3.4.7"}}

# Independent opt-in resource. Never import/register weather from ha-board.js.
weather = (root / 'src/candidate/weather-combined-forecast-card.js').read_bytes()
(root / 'dist/weather-combined-forecast-card.js').write_bytes(weather)
subprocess.run(['node', str(root / 'scripts/build_garage.mjs')], cwd=root, check=True)
notice_sources = {
    'THIRD-PARTY-NOTICES.md': root / 'THIRD-PARTY-NOTICES.md',
    'home-assistant-frontend-Apache-2.0.txt': root / 'third_party/home-assistant-frontend-Apache-2.0.txt',
    'lit-BSD-3-Clause.txt': root / 'third_party/lit-BSD-3-Clause.txt',
}
for name, source in notice_sources.items():
    (root / 'dist' / name).write_bytes(source.read_bytes())
manifest['package_version'] = '0.3.0-rc.1'
manifest['components']['weather-combined-forecast-card'] = '0.2.0-rc.1'
manifest['components']['garage-control-card'] = '1.1.0'
manifest['artifacts'] = [
    {'file': name, 'bytes': len((root/'dist'/name).read_bytes()),
     'sha256': hashlib.sha256((root/'dist'/name).read_bytes()).hexdigest()}
    for name in ['ha-board.js', 'weather-combined-forecast-card.js', 'garage-control-card.js']
]
manifest['notices'] = [
    {'file': name, 'bytes': len((root/'dist'/name).read_bytes()),
     'sha256': hashlib.sha256((root/'dist'/name).read_bytes()).hexdigest()}
    for name in notice_sources
]
manifest['persons_distribution_version'] = '0.1.2-rc.1'
manifest['weather_opt_in'] = True
manifest['garage_opt_in'] = True
(root / 'dist' / 'garage-provenance.json').write_bytes((root / 'garage-provenance.json').read_bytes())
manifest['metadata'] = [
    {'file': 'garage-provenance.json', 'bytes': len((root/'dist/garage-provenance.json').read_bytes()),
     'sha256': hashlib.sha256((root/'dist/garage-provenance.json').read_bytes()).hexdigest()}
]
(root / 'dist/manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
print('Independent weather artifact:', manifest['artifacts'][1])
