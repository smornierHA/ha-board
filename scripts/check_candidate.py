"""Verify candidate source bytes against the committed candidate manifest."""
from pathlib import Path
import hashlib, json
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'candidate-manifest.json').read_text())
for item in manifest['sources']:
    data=(ROOT/item['path']).read_bytes()
    assert len(data)==item['bytes'], item['path']
    assert hashlib.sha256(data).hexdigest()==item['sha256'], item['path']
print('Candidate hashes verified. This proves source integrity, not Home Assistant acceptance.')
