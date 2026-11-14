// Application queue for the Antigravity job-apply skill (.agents/skills/job-apply).
//   node tools/job-finder/apply-queue.mjs refresh [--force]  → runs index.mjs, skipping sources fetched too recently unless forced
//   node tools/job-finder/apply-queue.mjs list               → JSON of jobs to work on, best first, LinkedIn-alert jobs last
//   node tools/job-finder/apply-queue.mjs set <url> <status> ["note for the phone"]
//                                                            → updates one row (applied also fills applied_on and follow_up_on);
//                                                              applied, needs-you, finish-on-pc and interview are also pushed to the phone
//   node tools/job-finder/apply-queue.mjs handovers          → JSON of forms left filled in on the PC for the user, with their age
//   node tools/job-finder/apply-queue.mjs notify "<message>" → pushes a problem that stopped the whole run
//   node tools/job-finder/apply-queue.mjs updates            → applies the set and notify requests written to data/applications/updates/
//   node tools/job-finder/apply-queue.mjs batch              → writes data/linkedin-batch.md: LinkedIn jobs ready for the applicant to Easy Apply
//   node tools/job-finder/apply-queue.mjs digest             → the same, plus one push a day (from 07:00) listing them; run by run-agent.ps1
// Only status, applied_on and follow_up_on are ever changed, so the agent never has to edit the CSV by hand.
import { readFile, writeFile, readdir, unlink, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readJobs, writeJobs } from './csv.mjs';
import { notify } from './notify.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const HANDOVER_PATH = path.join(DIR, 'data', 'handovers.json'); // url → when the form was left open, for the 24-hour limit
const UPDATES_DIR = path.join(DIR, 'data', 'applications', 'updates'); // see `updates` below
const LOGS_DIR = path.join(DIR, 'data', 'applications');
const BATCH_PATH = path.join(DIR, 'data', 'linkedin-batch.md');
const DIGEST_PATH = path.join(DIR, 'data', 'digest-state.json'); // date of the last daily Easy Apply push
const STATUSES = ['new', 'applied', 'needs-you', 'finish-on-pc', 'easy-apply', 'skipped', 'interview', 'rejected', 'shortlisted'];
// Statuses that are pushed to the phone. skipped and rejected stay quiet; they're in jobs.csv and the logs.
// easy-apply (a LinkedIn job prepared for the applicant to apply to by hand) is collected into one daily push instead (`digest`).
const PUSHES = {
  applied: { label: 'Applied', tag: 'white_check_mark', priority: 3, fallback: (r) => `${r.cv} CV · score ${r.score} · via ${r.source}${r.salary ? ' · ' + r.salary : ''}` },
  'needs-you': { label: 'Needs you', tag: 'raising_hand', priority: 4, fallback: () => 'Open the application log in tools/job-finder/data/applications/ for what to do.' },
  'finish-on-pc': { label: 'Finish on PC', tag: 'computer', priority: 4, fallback: () => 'Filled in and waiting in Chrome on your PC. Open Chrome Remote Desktop, check it and press Submit.' },
  interview: { label: 'Interview', tag: 'tada', priority: 5, fallback: () => 'An interview invite arrived in the job Gmail. Reply soon.' },
};
const profile = JSON.parse(await readFile(path.join(DIR, 'profile.json'), 'utf8'));
const { autoSubmitMinScore, reviewMinScore, followUpDays, skipSources, perRoleCompanies = [] } = profile.apply;
const day = (offset = 0) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);

const [cmd, url, status, note] = process.argv.slice(2);
const handovers = existsSync(HANDOVER_PATH) ? JSON.parse(await readFile(HANDOVER_PATH, 'utf8')) : {};

if (cmd === 'notify' && url) {
  await notify({ title: 'Job agent needs you', message: url.slice(0, 3000), tags: ['warning'], priority: 4 });
  process.exit(0);
}

if (cmd === 'refresh') {
  // --throttle skips sources fetched too recently for their terms (see localEveryMin in index.mjs); --force fetches them all.
  const run = spawnSync(process.execPath, [path.join(DIR, 'index.mjs'), ...(url === '--force' ? [] : ['--throttle'])], { stdio: 'inherit' });
  process.exit(run.status ?? 1);
}

const rows = await readJobs();

if (cmd === 'list') {
  // Older rows have usually closed or been filled, so they're left for manual review.
  const oldest = day(-profile.maxAgeDays);
  // One application per company per 14 days, enforced here rather than left to the agent. Staffing agencies in
  // perRoleCompanies hire for a different client in each listing, so each of their roles counts on its own.
  const companyKey = (c) => c.toLowerCase().replace(/[^a-z0-9]/g, '');
  const perRole = new Set(perRoleCompanies.map(companyKey));
  const recent = new Set(rows.filter((r) => r.status === 'applied' && r.applied_on >= day(-14)).map((r) => companyKey(r.company)).filter((c) => !perRole.has(c)));
  // Jobs from LinkedIn alert emails are scored from the title alone, so they skip the score floor and get their own
  // `linkedin` tier: LinkedIn already matched them to the applicant's alerts, and the agent never opens linkedin.com for them.
  const fromAlert = (r) => r.source === 'LinkedIn alert';
  const toCheck = (r) => (r.location_rule || '').startsWith('Check:');
  const tier = (r) => (fromAlert(r) ? 'linkedin' : Number(r.score) >= autoSubmitMinScore ? 'auto' : 'review');
  const queue = rows
    .filter((r) => r.status === 'new' && r.date_found >= oldest && (fromAlert(r) || Number(r.score) >= reviewMinScore) && !skipSources.includes(r.source))
    .filter((r) => !recent.has(companyKey(r.company)))
    .map((r) => ({ ...r, tier: tier(r) }))
    // LinkedIn jobs last, and among them those listed in another country (`Check: …`), which are less likely to be open to international applicants.
    .sort((a, b) => fromAlert(a) - fromAlert(b) || toCheck(a) - toCheck(b) || b.score - a.score);
  console.log(JSON.stringify(queue, null, 2));
} else if (cmd === 'handovers') {
  const open = rows
    .filter((r) => r.status === 'finish-on-pc')
    .map((r) => ({ url: r.url, title: r.title, company: r.company, age_hours: handovers[r.url] ? +((Date.now() - handovers[r.url]) / 36e5).toFixed(1) : null }));
  console.log(JSON.stringify(open, null, 2));
} else if (cmd === 'set' && url && STATUSES.includes(status)) {
  if (!(await setStatus(url, status, note))) process.exit(1);
} else if (cmd === 'updates') {
  // Unattended agy runs may only run commands approved word for word, so a `set` with a new url and note is refused.
  // The agent writes each change as data/applications/updates/<name>.json instead, either
  // {"url": "...", "status": "...", "note": "..."} or {"notify": "<message>"}, and runs this one fixed command.
  const files = existsSync(UPDATES_DIR) ? (await readdir(UPDATES_DIR)).filter((f) => f.endsWith('.json')).sort() : [];
  let failed = 0;
  for (const f of files) {
    const file = path.join(UPDATES_DIR, f);
    let ok = false;
    try {
      const u = JSON.parse(await readFile(file, 'utf8'));
      if (u.notify) { await notify({ title: 'Job agent needs you', message: String(u.notify).slice(0, 3000), tags: ['warning'], priority: 4 }); ok = true; }
      else if (u.url && STATUSES.includes(u.status)) ok = await setStatus(u.url, u.status, u.note);
      else console.error(`${f}: needs "url" and a status of ${STATUSES.join('|')}, or "notify"`);
    } catch (err) { console.error(`${f}: ${err.message}`); }
    // A failed file is kept, renamed, so it isn't retried every run but can still be read.
    if (ok) await unlink(file); else { failed++; await rename(file, file + '.failed'); }
  }
  console.log(`${files.length - failed} of ${files.length} updates applied`);
  if (failed) process.exit(1);
} else if (cmd === 'batch' || cmd === 'digest') {
  const jobs = await easyApplyJobs();
  await writeFile(BATCH_PATH, batchMarkdown(jobs));
  console.log(`${jobs.length} LinkedIn jobs ready for Easy Apply → ${path.relative(process.cwd(), BATCH_PATH)}`);
  if (cmd === 'digest') await sendDigest(jobs);
} else {
  console.error(`Usage: apply-queue.mjs refresh [--force] | list | handovers | set <url> <${STATUSES.join('|')}> ["note"] | updates | notify "<message>" | batch | digest`);
  process.exit(1);
}

// ---------- LinkedIn Easy Apply batch ----------
// Jobs the agent prepared but can't apply to (LinkedIn's own form), from the last 7 days. Listed in Nigeria first, then best score.
// The CV and salary come from the job's log, which the skill writes with "- **CV:**" and "- **Salary:**" lines.
async function easyApplyJobs() {
  const logs = [];
  for (const f of (await readdir(LOGS_DIR)).filter((n) => n.endsWith('.md'))) {
    const file = path.join(LOGS_DIR, f);
    logs.push({ file, text: await readFile(file, 'utf8'), mtime: (await stat(file)).mtimeMs });
  }
  logs.sort((a, b) => b.mtime - a.mtime);
  const field = (text, name) => text.match(new RegExp(`\\*\\*${name}[^*]*:\\*\\*\\s*(.+)`, 'i'))?.[1].trim() || '';
  return rows
    .filter((r) => r.status === 'easy-apply' && r.date_found >= day(-7))
    .map((r) => {
      const id = r.url.match(/\d{6,}/)?.[0];
      const log = logs.find((l) => l.text.includes(r.url) || (id && l.text.includes(`/jobs/view/${id}`)));
      return { ...r, log: log ? path.basename(log.file) : '', cvUsed: (log && field(log.text, 'CV')) || r.cv, salaryGiven: log ? field(log.text, 'Salary') : '' };
    })
    .sort((a, b) => (a.location_rule || '').startsWith('Check:') - (b.location_rule || '').startsWith('Check:') || b.score - a.score);
}

function batchMarkdown(jobs) {
  const lines = [
    `# LinkedIn Easy Apply: ${jobs.length} job${jobs.length === 1 ? '' : 's'} ready (${day()})`, '',
    'Answers for the questions are in `linkedin-answer-bank.md`. When you apply, LinkedIn emails you a confirmation and the next hourly run marks the job applied.', '',
  ];
  for (const [i, j] of jobs.entries()) {
    lines.push(`${i + 1}. **${j.title}** · ${j.company} · ${j.location_rule}`,
      `   - Apply: ${j.url}`,
      `   - CV: ${j.cvUsed}${j.salaryGiven ? ` · Salary: ${j.salaryGiven}` : ''}`,
      ...(j.log ? [`   - Notes: applications/${j.log}`] : []), '');
  }
  if (!jobs.length) lines.push('Nothing waiting. New ones are added as LinkedIn alert emails arrive.');
  return lines.join('\n');
}

async function sendDigest(jobs) {
  const state = existsSync(DIGEST_PATH) ? JSON.parse(await readFile(DIGEST_PATH, 'utf8')) : {};
  if (!jobs.length || state.last === day() || new Date().getHours() < 7) return;
  const MAX = 15;
  const body = jobs.slice(0, MAX).map((j) => `• ${j.title} · ${j.company}\n  ${j.cvUsed} CV${j.salaryGiven ? ' · ' + j.salaryGiven : ''}\n  ${j.url}`).join('\n');
  await notify({
    title: `${jobs.length} LinkedIn job${jobs.length === 1 ? '' : 's'} ready for Easy Apply`,
    message: `${body}${jobs.length > MAX ? `\n…and ${jobs.length - MAX} more in data/linkedin-batch.md` : ''}\nAnswers: data/linkedin-answer-bank.md`.slice(0, 3900),
    tags: ['briefcase'], priority: 4,
  });
  await writeFile(DIGEST_PATH, JSON.stringify({ last: day() }));
  console.log('Daily Easy Apply push sent.');
}

async function setStatus(url, status, note) {
  const row = rows.find((r) => r.url === url);
  if (!row) { console.error(`No row with url ${url}`); return false; }
  row.status = status;
  if (status === 'applied') { row.applied_on = day(); row.follow_up_on = day(followUpDays); }
  if (status === 'finish-on-pc') handovers[url] = Date.now(); else delete handovers[url];
  await writeJobs(rows);
  await writeFile(HANDOVER_PATH, JSON.stringify(handovers));
  console.log(`${row.company} | ${row.title} → ${status}`);
  // The status is saved first, so a failed push never loses it.
  const push = PUSHES[status];
  if (push) {
    try {
      await notify({
        title: `${push.label}: ${row.title} · ${row.company}`.slice(0, 200),
        message: (note || push.fallback(row)).slice(0, 3000),
        click: row.url, tags: [push.tag], priority: push.priority,
      });
    } catch (err) { console.error(`Push failed: ${err.message}`); }
  }
  return true;
}
