import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const FIXTURE_DIR = join(__dirname, '..', 'fixtures', 'uploads');

export function ensureUploadFixtures(): { textFile: string; largeFile: string; emptyFile: string } {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  const textFile = join(FIXTURE_DIR, 'sample.txt');
  const largeFile = join(FIXTURE_DIR, 'large.bin');
  const emptyFile = join(FIXTURE_DIR, 'empty.txt');

  writeFileSync(textFile, 'Hello from LetCode QA suite\n');
  writeFileSync(emptyFile, '');
  if (!require('fs').existsSync(largeFile) || require('fs').statSync(largeFile).size !== 256 * 1024) {
    writeFileSync(largeFile, Buffer.alloc(256 * 1024, 7));
  }

  return { textFile, largeFile, emptyFile };
}
