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
if __name__=='__main__':unittest.main()
