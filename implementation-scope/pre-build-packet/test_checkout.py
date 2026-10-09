"""Verify Git checkout bytes against the immutable evidence digest without changing Git state."""
import hashlib
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[2]
GIT = ['git', '-c', f'safe.directory={ROOT.as_posix()}']

def git(*args, data=None):
    return subprocess.run([*GIT, *args], cwd=ROOT, input=data, stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE, check=True).stdout

def digest(files):
    rows = sorted([{'path': name, 'bytes': len(body), 'sha256': hashlib.sha256(body).hexdigest()}
                   for name, body in files.items()], key=lambda row: row['path'])
    return hashlib.sha256(json.dumps(rows, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

class EvidenceCheckoutTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.expected = json.loads((ROOT / 'implementation-scope/pre-build-packet/verification.json')
                                  .read_text(encoding='utf-8-sig'))['immutableReference']['beforeTreeSHA256']
        cls.names = git('ls-files', '-z', '--', 'reference/').decode().rstrip('\0').split('\0')
        stream = git('cat-file', '--batch', data=''.join(f'HEAD:{name}\n' for name in cls.names).encode())
        cls.blobs = {}
        offset = 0
        for name in cls.names:
            end = stream.index(b'\n', offset)
            size = int(stream[offset:end].split()[-1])
            cls.blobs[name] = stream[end + 1:end + 1 + size]
            offset = end + size + 2
        attrs = git('check-attr', '-z', '--stdin', 'text', 'eol', 'filter', 'working-tree-encoding',
                    data=('\0'.join(cls.names) + '\0').encode()).decode().split('\0')
        cls.converted = set()
        for name, attr, value in zip(attrs[0::3], attrs[1::3], attrs[2::3]):
            if attr == 'text' and value != 'unset':
                cls.converted.add(name)
            elif attr != 'text' and value not in ('unset', 'unspecified'):
                cls.converted.add(name)

    def checkout(self, autocrlf):
        files = dict(self.blobs)
        for name in self.converted:
            files[name] = git('-c', f'core.autocrlf={autocrlf}', 'cat-file', '--filters', f'HEAD:{name}')
        return files

    def test_linux_and_windows_checkout_preserve_the_sealed_digest(self):
        for autocrlf in ('false', 'true'):
            with self.subTest(core_autocrlf=autocrlf):
                self.assertEqual(digest(self.checkout(autocrlf)), self.expected)

    def test_line_ending_corruption_is_not_accepted_as_equivalent_evidence(self):
        files = self.checkout('false')
        name = 'reference/haunted-boulder-city/observations/E-093-skill-provenance.json'
        self.assertIn(b'\r\n', files[name])
        files[name] = files[name].replace(b'\r\n', b'\n')
        self.assertNotEqual(digest(files), self.expected)

if __name__ == '__main__':
    unittest.main()
