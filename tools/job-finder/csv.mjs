// data/jobs.csv helpers shared by index.mjs and apply-queue.mjs. The file is UTF-8 with a BOM and CRLF so Excel opens it cleanly.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const CSV_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'jobs.csv');
export const COLUMNS = ['date_found', 'score', 'cv', 'title', 'company', 'location_rule', 'salary', 'url', 'source', 'status', 'applied_on', 'follow_up_on'];

const csvCell = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return head ? body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))) : [];
}

export async function readJobs() {
  return existsSync(CSV_PATH) ? parseCsv((await readFile(CSV_PATH, 'utf8')).replace(/^﻿/, '')) : [];
}

export async function writeJobs(rows) {
  const lines = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))];
  await writeFile(CSV_PATH, '﻿' + lines.join('\r\n') + '\r\n');
}
