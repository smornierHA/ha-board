import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const parts = [1, 2, 3, 4].map(i =>
  fs.readFileSync(path.join(here, `baseline-source.b64.part0${i}`), 'utf8').trim()
);
const original = Buffer.from(parts.join(''), 'base64');
const expected = '1b5c73ab13404648494df0edf85fe9b5d1de39786926acbd66d398e0bd3191f6';
const actual = crypto.createHash('sha256').update(original).digest('hex');
if (actual !== expected) throw new Error(`Baseline source integrity failure: ${actual}`);

const temp = path.join(os.tmpdir(), `ha-board-baseline-${process.pid}.mjs`);
try {
  fs.writeFileSync(temp, original);
  const run = spawnSync(process.execPath, [temp], {
    stdio: 'inherit',
    env: {
      ...process.env,
      POC_SOURCE_DIR: process.env.POC_SOURCE_DIR || path.resolve(here, '../src'),
      POC_REPORT_DIR: process.env.POC_REPORT_DIR || path.resolve(here, '../artifacts')
    }
  });
  if (run.error) throw run.error;
  process.exitCode = run.status ?? 1;
} finally {
  try { fs.unlinkSync(temp); } catch (_) {}
}
