from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
required = ['AGENTS.md', 'PROJECT.md', 'PROMPT-DEMARRAGE.md', 'SOURCES.md',
            'MAINTENANCE.md', 'docs/STATUS.md', 'docs/ROADMAP.md',
            'docs/ARCHITECTURE.md', 'docs/RUNBOOK.md', 'docs/CI-CONTRACT.md',
            'docs/COMPATIBILITY.md', 'source-manifest.json']
errors = [p for p in required if not (root / p).is_file() or not (root / p).read_text(encoding='utf-8').strip()]
manifest = json.loads((root / 'source-manifest.json').read_text(encoding='utf-8'))
if not manifest.get('sources'):
    errors.append('source-manifest.json: sources manquantes')
if errors:
    raise SystemExit('Documents incomplets: ' + ', '.join(errors))
print('Documents présents et manifeste JSON lisible. Ceci ne valide pas le produit.')
