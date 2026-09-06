"""Check exact imported source bytes and fictional configuration references."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'source-manifest.json').read_text())
for item in manifest['sources']:
    content = (ROOT / item['path']).read_bytes()
    assert len(content) == item['bytes'], item['path']
    assert hashlib.sha256(content).hexdigest() == item['sha256'], item['path']

def check(value):
    if isinstance(value, dict):
        for child in value.values():
            check(child)
    elif isinstance(value, list):
        for child in value:
            check(child)
    elif isinstance(value, str):
        if value.startswith(('person.', 'sensor.', 'binary_sensor.', 'device_tracker.')):
            assert value.split('.', 1)[1].startswith('example_'), 'Real entity reference in examples'
        assert '/api/image/serve/' not in value, 'Private image reference in examples'

for example in (ROOT / 'examples').glob('*.json'):
    check(json.loads(example.read_text()))
print('Exact source hashes and fictional example references verified. No application validation.')
