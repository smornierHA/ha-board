"""Integrity, distribution closure, isolation and privacy for the weather pilot."""
from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parents[1]
p=json.loads((root/'weather-provenance.json').read_text())
for key in ['public_export','candidate','distribution']:
 item=p[key];data=(root/item['path']).read_bytes()
 assert len(data)==item['bytes'] and hashlib.sha256(data).hexdigest()==item['sha256'],key
assert (root/p['candidate']['path']).read_bytes()==(root/p['distribution']['path']).read_bytes()
people=(root/'dist/ha-board.js').read_bytes()
assert hashlib.sha256(people).hexdigest()=='80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6'
assert b'weather-combined-forecast-card' not in people
for path in [root/p[k]['path'] for k in ['public_export','candidate','distribution']]+[root/'examples/weather-demo.html']:
 text=path.read_text()
 assert not re.search(r'(?:^|\n)\s*import\s|import\s*\(["\']https?://',text),path
 for domain,entity in re.findall(r'\b(sensor|weather|input_number)\.([a-z0-9_]+)',text):
  assert entity.startswith('example'),(path,domain)
 assert not re.search(r'\b(?:192\.168\.|10\.\d+\.\d+\.|172\.(?:1[6-9]|2\d|3[01])\.)',text),path
 assert '/api/image/serve/' not in text,path
m=json.loads((root/'dist/manifest.json').read_text())
assert {a['file'] for a in m['artifacts']}=={'ha-board.js','weather-combined-forecast-card.js'}
for a in m['artifacts']:
 data=(root/'dist'/a['file']).read_bytes()
 assert hashlib.sha256(data).hexdigest()==a['sha256'] and len(data)==a['bytes']
assert {a['file'] for a in m['notices']}=={'THIRD-PARTY-NOTICES.md','home-assistant-frontend-Apache-2.0.txt'}
for a in m['notices']:
 data=(root/'dist'/a['file']).read_bytes()
 assert hashlib.sha256(data).hexdigest()==a['sha256'] and len(data)==a['bytes']
assert (root/'dist/THIRD-PARTY-NOTICES.md').read_bytes()==(root/'THIRD-PARTY-NOTICES.md').read_bytes()
assert (root/'dist/home-assistant-frontend-Apache-2.0.txt').read_bytes()==(root/'third_party/home-assistant-frontend-Apache-2.0.txt').read_bytes()
candidate=(root/p['candidate']['path']).read_text()
weather_icons=candidate[candidate.index('  _weatherIconSvg('):candidate.index('  _formatTimeLabel(',candidate.index('  _weatherIconSvg('))]
assert len(re.findall(r'<path class=',weather_icons))==16
assert 'Home Assistant frontend weather icon paths are provided under Apache-2.0' in candidate
assert p['license_review']=='verified'
assert p['license_evidence']['distributed_notices']==[a['file'] for a in m['notices']]
review=json.loads((root/p['license_evidence']['review']).read_text())
assert review['home_assistant_frontend']['commit']=='18f79dfc919e2019102c4fde0606fdb449f4cc15'
assert review['home_assistant_frontend']['source_sha256']=='42b4defdb2c27aa38c3d9e0651c66ed3bd5de757b44e5a5d4b3b6eedc3437eb2'
assert review['clock_weather_card']['normalized_identical_non_comment_lines_min_40_chars']==0
assert hashlib.sha256((root/'third_party/home-assistant-frontend-Apache-2.0.txt').read_bytes()).hexdigest()=='2e1faa05bb91574fa388220185f57b3607701714053971f704a3b32bceb9851b'
hacs=json.loads((root/'evidence/weather-hacs-path-2026-09-09.json').read_text())
fixture=root/hacs['update_dashboard_resources']['installed_method_test_fixture']
assert hashlib.sha256(fixture.read_bytes()).hexdigest()==hacs['update_dashboard_resources']['fixture_sha256']
assert json.loads((root/'hacs.json').read_text())=={'name':'HA-BOARD','filename':'ha-board.js'}
print('Weather source/export/distribution integrity; no external runtime import; fictional defaults; Personnes unchanged.')
