from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
required = ['AGENTS.md', 'PROJECT.md', 'PROMPT-DEMARRAGE.md', 'SOURCES.md',
            'MAINTENANCE.md', 'docs/STATUS.md', 'docs/ROADMAP.md',
            'docs/ARCHITECTURE.md', 'docs/RUNBOOK.md', 'docs/CI-CONTRACT.md',
            'docs/COMPATIBILITY.md', 'docs/GARAGE-OPTIONS.md',
            'docs/GARAGE-PROVENANCE.md', 'garage-provenance.json',
            'source-manifest.json']
errors = [p for p in required if not (root / p).is_file() or not (root / p).read_text(encoding='utf-8').strip()]
manifest = json.loads((root / 'source-manifest.json').read_text(encoding='utf-8'))
if not manifest.get('sources'):
    errors.append('source-manifest.json: sources manquantes')
distribution = json.loads((root / 'dist/manifest.json').read_text(encoding='utf-8'))
readme = (root / 'README.md').read_text(encoding='utf-8')
version = distribution['package_version']
if f'/releases/tag/v{version})' not in readme:
    errors.append('README.md: lien de release absent pour la version du manifeste')
for artifact in distribution.get('artifacts', []):
    if f"/hacsfiles/ha-board/{artifact['file']}" not in readme:
        errors.append(f"README.md: ressource distribuée absente: {artifact['file']}")
components = distribution.get('components', {})
if components.get('garage-control-card') != '1.1.0':
    errors.append('dist/manifest.json: version Garage attendue 1.1.0 absente')
cards = (root / 'docs/CARDS.md').read_text(encoding='utf-8')
if 'Garage Control Card' not in readme or 'custom:garage-control-card' not in cards:
    errors.append('README.md: catalogue Garage incomplet')
notes = (root / 'docs/RELEASE-NOTES.md').read_text(encoding='utf-8')
if notes.splitlines()[0] != f'# HA-BOARD {version}':
    errors.append('docs/RELEASE-NOTES.md: titre courant différent de la version du manifeste')
if errors:
    raise SystemExit('Documents incomplets: ' + ', '.join(errors))
print('Documents présents ; README HACS, modules et notes alignés au manifeste. Ceci ne valide ni le produit ni le cache HACS.')
