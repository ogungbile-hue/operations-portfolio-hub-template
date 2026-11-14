// Job finder v1: fetch remote listings, filter, score against profile.json, track in data/jobs.csv.
// With --alert it instead pushes new matches to a phone through ntfy (run on a schedule by .github/workflows/job-alerts.yml).
// Finds and ranks only. Applying is done by the Antigravity job-apply skill (.agents/skills/job-apply) using apply-queue.mjs.
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CSV_PATH, readJobs, writeJobs } from './csv.mjs';
import { notify } from './notify.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(DIR, 'data', 'alert-state.json');
const FETCH_PATH = path.join(DIR, 'data', 'fetch-state.json'); // source → last fetch, for --throttle
const LINKEDIN_DIR = path.join(DIR, 'data', 'applications', 'linkedin'); // jobs the agent copied from LinkedIn alert emails
const linkedinFiles = []; // read this run; deleted once jobs.csv is saved
const ALERT = process.argv.includes('--alert');
const THROTTLE = process.argv.includes('--throttle');
const UA = 'Mozilla/5.0 (personal job-finder; manual review only)';

const profile = JSON.parse(await readFile(path.join(DIR, 'profile.json'), 'utf8'));
const cutoff = Date.now() - profile.maxAgeDays * 864e5;

// ---------- helpers ----------
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = (terms) => new RegExp(`(?<![a-z0-9])(${terms.map(escapeRe).join('|')})(?![a-z0-9])`, 'i');
const decode = (s = '') => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const stripHtml = (s = '') => decode(s).replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

async function get(url, type = 'json') {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return type === 'json' ? res.json() : res.text();
}

// Normalised job: { title, company, location, salary, url, date (ms), text, source }

// ---------- sources ----------
const sources = {
  // One call; the free API currently returns only its 10 latest jobs and ignores search/limit.
  async Remotive() {
    const data = await get('https://remotive.com/api/remote-jobs');
    return data.jobs.map((j) => ({
      title: j.title, company: j.company_name, location: j.candidate_required_location,
      salary: j.salary, url: j.url, date: Date.parse(j.publication_date + 'Z'),
      text: `${j.category} ${(j.tags || []).join(' ')} ${j.job_type} ${stripHtml(j.description)}`,
    }));
  },

  async RemoteOK() {
    const data = await get('https://remoteok.com/api');
    return data.filter((j) => j.id).map((j) => ({
      title: j.position, company: j.company, location: j.location,
      salary: j.salary_min ? `$${j.salary_min}-${j.salary_max}` : '', url: j.url,
      date: Date.parse(j.date), text: `${(j.tags || []).join(' ')} ${stripHtml(j.description)}`,
    }));
  },

  async WeWorkRemotely() {
    const cats = ['remote-customer-support-jobs', 'all-other-remote-jobs', 'remote-sales-and-marketing-jobs', 'remote-management-and-finance-jobs'];
    const out = [];
    for (const cat of cats) {
      const xml = await get(`https://weworkremotely.com/categories/${cat}.rss`, 'text');
      for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const tag = (t) => decode(item.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1] || '').trim();
        const full = tag('title');
        const i = full.indexOf(': ');
        out.push({
          title: i > 0 ? full.slice(i + 2) : full, company: i > 0 ? full.slice(0, i) : '',
          location: tag('region'), salary: '', url: tag('link') || tag('guid'),
          date: Date.parse(tag('pubDate')), text: `${tag('category')} ${tag('type')} ${tag('skills')} ${stripHtml(tag('description'))}`,
        });
      }
    }
    return out;
  },

  async Himalayas() {
    const out = [];
    for (const term of profile.searchTerms) {
      const data = await get(`https://himalayas.app/jobs/api/search?q=${encodeURIComponent(term)}&sort=recent`);
      for (const j of data.jobs || []) {
        const sal = j.minSalary ? `${j.currency || ''} ${j.minSalary}-${j.maxSalary || ''} ${j.salaryPeriod || ''}`.trim() : '';
        out.push({
          title: j.title, company: j.companyName,
          location: j.locationRestrictions?.length ? j.locationRestrictions.join(', ') : 'Worldwide',
          salary: sal, url: j.applicationLink?.replace(/\?utm_source=api$/, '') || j.guid,
          date: j.pubDate * 1000, text: `${j.employmentType} ${(j.categories || []).join(' ')} ${stripHtml(j.description || j.excerpt)}`,
        });
      }
    }
    return out;
  },

  async WorkingNomads() {
    const data = await get('https://www.workingnomads.com/api/exposed_jobs/');
    return data.map((j) => ({
      title: j.title, company: j.company_name, location: j.location, salary: '', url: j.url,
      date: Date.parse(j.pub_date), text: `${j.category_name} ${j.tags} ${stripHtml(j.description)}`,
    }));
  },

  // LinkedIn is never fetched: it rate-limits even single signed-out requests and bans automation on accounts.
  // The job-apply agent copies each job in the LinkedIn job-alert emails (job Gmail) to data/applications/linkedin/<id>.json
  // as {"id", "title", "company", "location", "salary"?}; this reads those files. The email has no description, so these
  // score from the title only, and apply-queue.mjs queues them in their own `linkedin` tier whatever the score.
  async 'LinkedIn alert'() {
    if (ALERT || !existsSync(LINKEDIN_DIR)) return [];
    const out = [];
    for (const f of (await readdir(LINKEDIN_DIR)).filter((n) => n.endsWith('.json'))) {
      const file = path.join(LINKEDIN_DIR, f);
      linkedinFiles.push(file);
      try {
        const j = JSON.parse(await readFile(file, 'utf8'));
        const id = String(j.id || f.replace(/\.json$/, '')).match(/\d{6,}/)?.[0];
        if (!id || !j.title) { console.warn(`  LinkedIn alert  ${f}: needs "id" and "title" (skipped)`); continue; }
        out.push({
          title: j.title, company: j.company || '', location: j.location || '', salary: j.salary || '',
          url: `https://www.linkedin.com/jobs/view/${id}/`, date: Date.now(), text: '',
        });
      } catch (err) { console.warn(`  LinkedIn alert  ${f}: ${err.message} (skipped)`); }
    }
    return out;
  },

  // ---- VA staffing agencies (public ATS endpoints). Postings are evergreen, so `agency` skips the age cutoff. ----

  // Athena's public Workday board (the JSON the careers page itself loads). Hires EAs in PH, LatAm and Kenya.
  async Athena() {
    const base = 'https://athenago.wd108.myworkdayjobs.com';
    const out = [];
    for (let offset = 0, total = 1; offset < total && offset < 200; offset += 20) {
      const res = await fetch(`${base}/wday/cxs/athenago/athena/jobs`, {
        method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ appliedFacets: {}, limit: 20, offset, searchText: '' }), signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for Athena Workday`);
      const data = await res.json();
      total = data.total;
      for (const j of data.jobPostings || []) {
        const days = /today/i.test(j.postedOn) ? 0 : /yesterday/i.test(j.postedOn) ? 1 : Number(j.postedOn?.match(/\d+/)?.[0] ?? 0);
        out.push({
          title: j.title, company: 'Athena', location: j.locationsText, salary: '', url: `${base}/athena${j.externalPath}`,
          date: Date.now() - days * 864e5, text: `${j.timeType} ${j.title}`, agency: true,
        });
      }
    }
    return out;
  },

  async Boldly() {
    return greenhouse('boldly', 'Boldly');
  },

  // Scale Army hires across Africa and LatAm; many roles list Nigeria as a secondary location.
  async ScaleArmy() {
    return ashby('Scale Army Careers', 'Scale Army');
  },

  // BruntWork hires worldwide. The /jobs page embeds its listings as data (robots.txt only blocks /api/).
  async BruntWork() {
    const html = (await get('https://apply.bruntworkcareers.co/jobs', 'text')).replace(/\\"/g, '"');
    const out = new Map();
    for (const [, category, list] of html.matchAll(/"category":"([^"]*)","jobs":\[(.*?)\]/g)) {
      for (const [, id, title, type] of list.matchAll(/"jobId":"(\d+)","title":"[^"]*","alternativeTitle":"([^"]*)","clientTimezoneRegion":"[^"]*","type":"([^"]*)"/g)) {
        out.set(id, {
          title: JSON.parse(`"${title}"`), company: 'BruntWork', location: 'Worldwide', salary: '',
          url: `https://apply.bruntworkcareers.co/jobs/${id}`, date: Date.now(), text: `${category} ${type}`, agency: true, detail: true,
        });
      }
    }
    return [...out.values()];
  },

  // Open API; please credit Jobicy and poll at most hourly.
  async Jobicy() {
    const out = [];
    for (const industry of ['admin-support', 'management']) {
      const data = await get(`https://jobicy.com/api/v2/remote-jobs?count=50&industry=${industry}`);
      for (const j of data.jobs || []) {
        const sal = j.salaryMin ? `${j.salaryCurrency || ''} ${j.salaryMin}-${j.salaryMax || ''} ${j.salaryPeriod || ''}`.trim() : '';
        out.push({
          title: decode(j.jobTitle), company: decode(j.companyName), location: j.jobGeo, salary: sal, url: j.url,
          date: Date.parse(j.pubDate), text: `${(j.jobIndustry || []).join(' ')} ${(j.jobType || []).join(' ')} ${j.jobLevel} ${stripHtml(j.jobExcerpt)}`,
        });
      }
    }
    return out;
  },
};

// --alert runs every 30 minutes. These sources ask for fewer calls (or make many per run), so they're fetched less often.
const alertEveryMin = { Remotive: 360, Jobicy: 60, Himalayas: 60 };
// --throttle is the hourly run on the PC (apply-queue.mjs refresh). Remotive is already polled every 6 hours by --alert,
// so the PC fetches it once a day to keep the combined total near its ~4 calls a day.
const localEveryMin = { ...alertEveryMin, Remotive: 1440 };

async function ashby(board, company) {
  const data = await get(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}`);
  return data.jobs.filter((j) => j.isListed !== false).map((j) => {
    const places = [j.location, ...(j.secondaryLocations || []).map((l) => l.location)].join(', ');
    return {
      title: j.title, company, location: j.workplaceType && j.workplaceType !== 'Remote' ? `${j.workplaceType}: ${places}` : places,
      salary: '', url: j.jobUrl, date: Date.parse(j.publishedAt), text: j.descriptionPlain || '', agency: true,
    };
  });
}

async function greenhouse(board, company) {
  const data = await get(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`);
  return data.jobs.map((j) => ({
    title: j.title, company, location: j.location?.name, salary: '', url: j.absolute_url,
    date: Date.parse(j.first_published || j.updated_at), text: stripHtml(j.content), agency: true,
  }));
}

// ---------- filter & score ----------
const titleRe = new RegExp(`(?<![a-z0-9])(${profile.searchTerms.map(escapeRe).join('|')})s?(?![a-z0-9])`, 'i'); // allow plurals
const excludeTitleRe = wordRe(profile.excludeTitle);
const workplaceRe = wordRe(profile.excludeWorkplace);
const openLocRe = wordRe(profile.openLocations);
const residencyRe = new RegExp([
  /\b(must|need to|required to|should)\s+(be\s+)?(reside|live|located|based)\b[^.]{0,40}\b(the us|u\.s\.?|usa|united states|canada|eu|europe|uk|united kingdom)\b/, // "the us", so "talk with us" doesn't count
  /\b(us|usa|u\.s\.|canada|eu|uk)[- ](based\s+)?(residents|candidates|applicants)\s+only\b/,
  // Work authorisation and citizenship: an honest "no" on the form is an automatic rejection.
  /\b(must|need to|required to)\s+(be\s+)?(legally\s+)?(authori[sz]ed|eligible|permitted)\s+to\s+work\s+in\s+(the\s+)?(us|u\.s\.?|usa|united states|canada|uk|united kingdom|eu|european union)\b/,
  /\b(us|u\.s\.|american|uk|british|canadian)\s+citizens?(hip)?\s+(only|is\s+required|required)\b/,
  /\bsecurity clearance\b/,
].map((r) => r.source).join('|'), 'i');
const cvRes = Object.fromEntries(Object.entries(profile.cvs).map(([cv, terms]) => [cv, new RegExp(terms.map(escapeRe).join('|'), 'gi')]));
const skillRes = Object.entries(profile.skills).map(([k, w]) => [wordRe([k]), w]);

function locationRule(job) {
  const loc = (job.location || '').trim();
  if (workplaceRe.test(`${job.title} ${loc}`)) return null;
  if (residencyRe.test(job.text)) return null;
  // "South Africa" alone is a country restriction, not "Africa".
  if (!loc || /^remote$/i.test(loc) || openLocRe.test(loc.replace(/south africa/gi, ''))) return loc || 'Not stated';
  // On LinkedIn the location is often just where the company sits ("United States (Remote)"), and some of those hire
  // contractors anywhere. Keep them, marked, and the agent reads the employer's own posting before applying. On the
  // other boards the location is the employer's own "we only hire in…" list, so those stay dropped.
  if (job.source === 'LinkedIn alert') return `Check: ${loc}`;
  return null; // restricted to specific countries/regions that exclude Nigeria
}

function score(job) {
  const title = job.title.toLowerCase();
  const hay = `${title} ${job.text}`.toLowerCase();
  let pts = 0;
  for (const [re, w] of skillRes) if (re.test(hay)) pts += w;
  const s = Math.min(100, 30 + pts);
  const counts = Object.entries(cvRes).map(([cv, re]) => [cv, (title.match(re) || []).length * 3 + (hay.match(re) || []).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return { score: s, cv: counts[0][0] };
}

// ---------- alerts ----------
async function sendAlerts(jobs) {
  const MAX = 8;
  for (const j of jobs.slice(0, MAX)) {
    await notify({
      title: `${j.title} · ${j.company}`.slice(0, 200),
      message: `Score ${j.score} · ${j.cv} CV · ${j.location_rule}${j.salary ? ' · ' + j.salary : ''} · via ${j.source}`,
      click: j.url, tags: ['briefcase'], priority: j.score >= 60 ? 4 : 3,
    });
  }
  if (jobs.length > MAX) {
    const rest = jobs.slice(MAX);
    await notify({ title: `+${rest.length} more new matches`, message: rest.map((j) => `${j.title} · ${j.company}`).join('\n').slice(0, 3000), tags: ['briefcase'] });
  }
}

// ---------- main ----------
const today = new Date().toISOString().slice(0, 10);
const now = Date.now();
// seen: job URL or company|title key → last time it matched. lastFetch: source → last successful fetch.
const state = !ALERT ? null : existsSync(STATE_PATH) ? JSON.parse(await readFile(STATE_PATH, 'utf8')) : { seen: {}, lastFetch: {} };
const firstAlertRun = ALERT && !state.startedAt;
const throttled = ALERT || THROTTLE;
const lastFetch = ALERT ? state.lastFetch : THROTTLE && existsSync(FETCH_PATH) ? JSON.parse(await readFile(FETCH_PATH, 'utf8')) : {};
const everyMin = ALERT ? alertEveryMin : localEveryMin;
const due = Object.entries(sources).filter(([name]) => !throttled || now - (lastFetch[name] || 0) >= ((everyMin[name] || 0) - 5) * 6e4);
const all = [];
console.log('Fetching sources...');
await Promise.all(due.map(async ([name, fn]) => {
  try {
    const jobs = await fn();
    jobs.forEach((j) => (j.source = name));
    all.push(...jobs);
    if (throttled) lastFetch[name] = now;
    console.log(`  ${name.padEnd(15)} ${jobs.length} listings`);
  } catch (err) {
    console.warn(`  ${name.padEnd(15)} FAILED: ${err.message} (skipped)`);
  }
}));
if (THROTTLE) await writeFile(FETCH_PATH, JSON.stringify(lastFetch));

const existing = ALERT ? [] : await readJobs();
const seenUrls = new Set(existing.map((r) => r.url));
const key = (company, title) => `${company}|${title}`.toLowerCase().replace(/[^a-z0-9|]/g, '');
const seenKeys = new Set(existing.map((r) => key(r.company, r.title)));

const perSource = {};
const stats = { total: all.length, old: 0, offTopic: 0, senior: 0, location: 0, dupe: 0 };
const fresh = [];
for (const job of all) {
  if (!job.title || !job.url) continue;
  if (!job.agency && !(job.date >= cutoff)) { stats.old++; continue; }
  if (!titleRe.test(job.title)) { stats.offTopic++; continue; }
  if (excludeTitleRe.test(job.title)) { stats.senior++; continue; }
  // Listings marked `detail` carry no description, so every one would score the bare 30. Read the job page once, when it's new.
  if (job.detail) {
    const k = key(job.company, job.title);
    const known = ALERT ? state.seen[job.url] || state.seen[k] : seenUrls.has(job.url) || seenKeys.has(k);
    if (!known) {
      try { job.text += ' ' + stripHtml((await get(job.url, 'text')).replace(/<script[\s\S]*?<\/script>/gi, '')).slice(0, 20000); }
      catch (err) { console.warn(`  ${job.source} page FAILED: ${err.message} (scored from title only)`); }
    }
  }
  const rule = locationRule(job);
  if (rule === null) { stats.location++; continue; }
  const k = key(job.company, job.title);
  if (ALERT) {
    const alerted = state.seen[job.url] || state.seen[k];
    state.seen[job.url] = state.seen[k] = now;
    if (alerted) { stats.dupe++; continue; }
  }
  if (seenUrls.has(job.url) || seenKeys.has(k)) { stats.dupe++; continue; }
  seenUrls.add(job.url); seenKeys.add(k);
  fresh.push({ ...job, ...score(job), location_rule: rule });
  perSource[job.source] = (perSource[job.source] || 0) + 1;
}
fresh.sort((a, b) => b.score - a.score);

console.log(`\nChecked ${stats.total}: ${stats.old} older than ${profile.maxAgeDays} days, ${stats.offTopic} off-topic, ${stats.senior} senior/engineering, ${stats.location} location-restricted/onsite, ${stats.dupe} already tracked or duplicate.`);
console.log(`Passed filters by source: ${Object.entries(perSource).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
await mkdir(path.dirname(CSV_PATH), { recursive: true });

if (ALERT) {
  // The first run (or a run after the saved state was lost) only records what's already open, so it doesn't flood the phone.
  if (firstAlertRun) {
    state.startedAt = now;
    await notify({ title: 'Job alerts are on', message: `Watching ${fresh.length} current matches. You'll get a ping for each new one.`, tags: ['white_check_mark'] });
    console.log(`First run: recorded ${fresh.length} current matches without alerting.\n`);
  } else {
    await sendAlerts(fresh);
    console.log(`Sent alerts for ${fresh.length} new jobs.\n`);
  }
  // Forget jobs that haven't matched for 60 days; they've aged out of every source by then.
  for (const [id, t] of Object.entries(state.seen)) if (now - t > 60 * 864e5) delete state.seen[id];
  await writeFile(STATE_PATH, JSON.stringify(state));
} else {
  const newRows = fresh.map((j) => ({
    date_found: today, score: j.score, cv: j.cv, title: j.title, company: j.company, location_rule: j.location_rule,
    salary: j.salary || '', url: j.url, source: j.source, status: 'new', applied_on: '', follow_up_on: '',
  }));
  await writeJobs([...existing, ...newRows]);
  console.log(`Added ${newRows.length} new jobs to ${path.relative(process.cwd(), CSV_PATH)} (${existing.length} kept from before).\n`);
  // Every LinkedIn file read has now been added, filtered out or found to be a duplicate.
  for (const f of linkedinFiles) await unlink(f).catch(() => {});
}
for (const j of fresh.slice(0, 20)) {
  console.log(`${String(j.score).padStart(3)}  [${j.cv}]  ${j.title} | ${j.company} | ${j.location_rule}${j.salary ? ' | ' + j.salary : ''}`);
  console.log(`     ${j.url}  (${j.source})`);
}
if (!fresh.length) console.log('No new matching jobs this run.');
