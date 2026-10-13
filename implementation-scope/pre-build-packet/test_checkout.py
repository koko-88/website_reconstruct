"""Verify Git checkout bytes against the immutable evidence digest without changing Git state."""
import hashlib
import json
from pathlib import Path
import subprocess
import unittest
import shutil
import tempfile
import re
from urllib.parse import unquote

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

class PortableDocumentationTests(unittest.TestCase):
    def test_current_linked_docs_exist_without_ignored_workstation_outputs(self):
        # Follow the same repository link syntax as verify.py. Only tracked current files
        # and native instruction adapters are copied, never artifacts or workstation inventories.
        names = git('ls-files', '-z', '--cached', '--others', '--exclude-standard').decode().split('\0')
        with tempfile.TemporaryDirectory(prefix='factory-doc-checkout-') as directory:
            checkout = Path(directory)
            for name in names:
                source = ROOT / name
                if source.is_file() and not source.is_symlink():
                    target = checkout / name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(source, target)
            pending = [checkout / name for name in ['AGENTS.md', 'README.md', 'PRODUCT.md', 'ROADMAP.md',
                       'LOGIC_VERIFICATION.md', 'IMPLEMENTATION_VERIFICATION.md', 'CLAUDE.md',
                       '.cursor/rules/factory.mdc', '.clinerules/00-factory.md'] if (checkout / name).is_file()]
            pending += list((checkout / 'implementation-scope/pre-build-packet').glob('*.md'))
            seen = set()
            while pending:
                source = pending.pop().resolve()
                if source in seen: continue
                seen.add(source)
                for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)', source.read_text(encoding='utf-8-sig')):
                    target = target.strip('<>')
                    if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', target): continue
                    pathpart = unquote(target).partition('#')[0]
                    destination = (source.parent / pathpart).resolve() if pathpart else source
                    self.assertTrue(destination.is_file(), f'{source.relative_to(checkout)} -> {target}: absent from portable checkout')
                    if destination.suffix == '.md' and checkout in destination.parents: pending.append(destination)

if __name__ == '__main__':
    unittest.main()
