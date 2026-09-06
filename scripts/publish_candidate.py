"""Publish an integrated, tested candidate without moving existing releases/tags."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def main():
    if os.environ.get('GITHUB_EVENT_NAME') != 'push' or os.environ.get('GITHUB_REF') != 'refs/heads/main':
        raise SystemExit('Candidate publication is restricted to the main push job after contracts.')
    sha = os.environ['GITHUB_SHA']
    if not re.fullmatch('[a-f0-9]{40}', sha) or run('git', 'rev-parse', 'HEAD') != sha:
        raise SystemExit('Checkout SHA mismatch')
    run('git', 'diff', '--exit-code', '--', 'dist')
    manifest = json.loads(Path('dist/manifest.json').read_text())
    version = manifest['package_version']
    if not re.fullmatch(r'\d+\.\d+\.\d+-rc\.\d+', version):
        raise SystemExit('Stable publication requires a separate reviewed acceptance record.')
    bundle = Path('dist/ha-board.js').read_bytes()
    if hashlib.sha256(bundle).hexdigest() != manifest['sha256']:
        raise SystemExit('Bundle digest mismatch')
    repo = os.environ['GITHUB_REPOSITORY']
    tag = 'v' + version
    # Listing failures abort. No failed authentication/request is interpreted as absence.
    releases = json.loads(run('gh', 'api', '--paginate', '--slurp', f'repos/{repo}/releases?per_page=100'))
    existing = next((r for page in releases for r in page if r['tag_name'] == tag), None)
    if existing:
        ref = json.loads(run('gh', 'api', f'repos/{repo}/git/ref/tags/{tag}'))
        if ref['object']['type'] != 'commit':
            raise SystemExit('Unexpected tag type; manual inspection required')
        run('git', 'merge-base', '--is-ancestor', ref['object']['sha'], sha)
        with tempfile.TemporaryDirectory() as tmp:
            run('gh', 'release', 'download', tag, '--repo', repo, '--pattern', 'ha-board.js', '--dir', tmp)
            if Path(tmp, 'ha-board.js').read_bytes() != bundle:
                raise SystemExit('Version already exists with different bytes; increment the candidate version.')
        print('Existing release bytes verified; no asset or tag overwritten.')
        return
    # Refuse to reuse a pre-existing tag, including a tag without a release.
    tags = json.loads(run('gh', 'api', f'repos/{repo}/git/matching-refs/tags/{tag}'))
    if any(t['ref'] == f'refs/tags/{tag}' for t in tags):
        raise SystemExit('Tag already exists without a release; inspect before resuming.')
    with tempfile.TemporaryDirectory() as tmp:
        proof = Path(tmp, 'provenance.json')
        proof.write_text(json.dumps({'commit': sha, 'tree': run('git', 'rev-parse', 'HEAD^{tree}'),
            'run_url': f"https://github.com/{repo}/actions/runs/{os.environ['GITHUB_RUN_ID']}",
            'manifest': manifest, 'ha_acceptance': 'pending'}, indent=2)+'\n')
        run('gh', 'release', 'create', tag, 'dist/ha-board.js', 'dist/manifest.json', str(proof),
            '--repo', repo, '--target', sha, '--prerelease', '--title', f'HA-BOARD {version}',
            '--notes-file', 'docs/RELEASE-NOTES.md')
    print(f'Published candidate {tag} from {sha}; HA acceptance is still pending.')


if __name__ == '__main__':
    main()
