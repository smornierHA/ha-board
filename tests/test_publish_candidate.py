import importlib.util
from pathlib import Path
import os
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('publish_candidate', Path(__file__).resolve().parents[1]/'scripts/publish_candidate.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class PublicationGate(unittest.TestCase):
    def test_pr_cannot_publish(self):
        with patch.dict(os.environ, {'GITHUB_EVENT_NAME':'pull_request','GITHUB_REF':'refs/pull/1/merge'}),patch.object(m,'run') as command:
            with self.assertRaises(SystemExit):m.main()
            command.assert_not_called()
    def test_wrong_checkout_cannot_publish(self):
        with patch.dict(os.environ, {'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40}),patch.object(m,'run',return_value='b'*40):
            with self.assertRaisesRegex(SystemExit,'SHA mismatch'):m.main()
    def test_stable_cannot_be_published_automatically(self):
        with patch.dict(os.environ, {'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40}),patch.object(m,'run',return_value='a'*40),patch.object(Path,'read_text',return_value='{"package_version":"1.0.0"}'):
            with self.assertRaisesRegex(SystemExit,'Stable publication'):m.main()
    def test_artifact_drift_cannot_publish(self):
        with patch.dict(os.environ, {'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40}),patch.object(m,'run',return_value='a'*40),patch.object(Path,'read_text',return_value='{"package_version":"0.1.0-rc.2","sha256":"incorrect"}'),patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(SystemExit,'digest mismatch'):m.main()

class WeatherPublication(unittest.TestCase):
    def test_every_artifact_in_manifest_is_uploaded(self):
        import json,tempfile
        root=Path(__file__).resolve().parents[1]
        manifest=json.loads((root/'dist/manifest.json').read_text())
        commands=[]
        def command(*args):
            commands.append(args)
            if args[:3]==('git','rev-parse','HEAD'):return 'a'*40
            if args[:3]==('git','rev-parse','HEAD^{tree}'):return 'b'*40
            if args[:3]==('gh','api','--paginate'):return '[[]]'
            if args[:2]==('gh','api'):return '[]'
            return ''
        original=Path.read_text
        def read(p,*a,**kw):
            if p.name=='weather-provenance.json':return '{"license_review":"verified"}'
            return original(p,*a,**kw)
        with patch.dict(os.environ,{'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40,'GITHUB_REPOSITORY':'example/repo','GITHUB_RUN_ID':'123'}),patch.object(m,'run',side_effect=command),patch.object(Path,'read_text',read):
            import contextlib,io
            with contextlib.redirect_stdout(io.StringIO()):m.main()
        upload=next(c for c in commands if c[:3]==('gh','release','create'))
        for artifact in manifest['artifacts']:self.assertIn('dist/'+artifact['file'],upload)
        self.assertIn('dist/manifest.json',upload)
        self.assertTrue(any(str(x).endswith('/provenance.json') for x in upload))
    def test_license_reserve_blocks_release_before_network(self):
        with patch.dict(os.environ,{'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40}),patch.object(m,'run',return_value='a'*40) as command:
            with self.assertRaisesRegex(SystemExit,'license provenance review pending'):m.main()
            self.assertFalse(any(c.args[0]=='gh' for c in command.call_args_list))
    def test_weather_drift_blocks_release(self):
        original=Path.read_bytes
        def read(p):return b'corrupt weather' if p.name=='weather-combined-forecast-card.js' else original(p)
        with patch.dict(os.environ,{'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40}),patch.object(m,'run',return_value='a'*40),patch.object(Path,'read_bytes',read):
            with self.assertRaisesRegex(SystemExit,'Artifact digest mismatch'):m.main()

    def test_existing_release_verifies_all_assets_and_never_overwrites(self):
        self._existing_release('identical')
    def test_existing_release_rejects_changed_weather(self):
        self._existing_release('changed')
    def test_existing_release_missing_weather_is_not_absence(self):
        self._existing_release('missing')
    def _existing_release(self, scenario):
        import json,contextlib,io
        manifest=json.loads(Path('dist/manifest.json').read_text())
        commands=[]
        def command(*args):
            commands.append(args)
            if args[:3]==('git','rev-parse','HEAD'):return 'a'*40
            if args[:3]==('gh','api','--paginate'):return json.dumps([[{'tag_name':'v'+manifest['package_version']} ]])
            if args[:2]==('gh','api'):return json.dumps({'object':{'type':'commit','sha':'b'*40}})
            if args[:3]==('gh','release','download'):
                folder=Path(args[args.index('--dir')+1])
                for name in ['ha-board.js','weather-combined-forecast-card.js','manifest.json']:
                    if scenario=='missing' and name.startswith('weather-'):continue
                    data=Path('dist',name).read_bytes()
                    if scenario=='changed' and name.startswith('weather-'):data+=b'drift'
                    (folder/name).write_bytes(data)
                (folder/'provenance.json').write_text(json.dumps({'commit':'b'*40,'manifest':manifest}))
            return ''
        original=Path.read_text
        def read(p,*a,**kw):
            if p.name=='weather-provenance.json':return '{"license_review":"verified"}'
            return original(p,*a,**kw)
        with patch.dict(os.environ,{'GITHUB_EVENT_NAME':'push','GITHUB_REF':'refs/heads/main','GITHUB_SHA':'a'*40,'GITHUB_REPOSITORY':'example/repo'}),patch.object(m,'run',side_effect=command),patch.object(Path,'read_text',read),contextlib.redirect_stdout(io.StringIO()):
            if scenario=='identical':m.main()
            elif scenario=='changed':
                with self.assertRaisesRegex(SystemExit,'different bytes'):m.main()
            else:
                with self.assertRaises(FileNotFoundError):m.main()
        self.assertFalse(any(c[:3]==('gh','release','create') for c in commands))
        self.assertFalse(any('upload' in c or '--clobber' in c for c in commands))

if __name__=='__main__':unittest.main()
