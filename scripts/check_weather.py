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
assert json.loads((root/'hacs.json').read_text())=={'name':'HA-BOARD','filename':'ha-board.js'}
print('Weather source/export/distribution integrity; no external runtime import; fictional defaults; Personnes unchanged.')
