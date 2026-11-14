# Job finder (v1)

Finds fresh remote assistant/admin/coordinator roles, filters out ones I can't take, scores them against my skills and tracks them in a CSV. The finder itself never applies. Applying is handled by an Antigravity agent (see [Applying with Antigravity](#applying-with-antigravity)) or by hand.

## Run

```bash
node tools/job-finder/index.mjs
```

Needs Node 18+ and has no dependencies. Each run:

1. Fetches listings from the last 7 days: Remotive API, RemoteOK API, Jobicy API, We Work Remotely RSS (customer support, all other, sales & marketing, management & finance), Himalayas API (one search per term, most recent first) and the Working Nomads API. It also fetches current postings from VA agencies (see below). If a source fails, it is logged and skipped. LinkedIn, Upwork and OnlineJobs.ph are deliberately not scraped.

   LinkedIn comes in through its job-alert emails instead, and nothing here ever requests linkedin.com: it rate-limits even single signed-out requests and restricts accounts for automation. Set up the alerts in LinkedIn (signed in as <your-job-search-email@example.com>, Remote, daily, by email). Each hourly agent run copies the jobs from unread alert emails into `data/applications/linkedin/<id>.json`, and the next refresh adds them as source `LinkedIn alert` (scored from the title only, then the files are deleted). `apply-queue.mjs list` puts them last in their own `linkedin` tier whatever the score. The agent looks for each one on the employer's own site and hands it over. If it's only on LinkedIn, the agent marks it `easy-apply` with the CV, salary and cover-note type in its log. After every run, `apply-queue.mjs digest` rewrites `data/linkedin-batch.md` (the jobs to Easy Apply by hand, Nigeria-listed first) and, from 07:00, sends one push a day listing them. Standard answers and cover notes are in `data/linkedin-answer-bank.md`. LinkedIn's "your application was sent" email marks the job applied on the next run. Leave the alert emails unread: opening one marks it as handled.
2. Keeps titles that match `searchTerms`, then drops:
   - senior and engineering titles (`excludeTitle`)
   - hybrid and onsite roles (`excludeWorkplace`)
   - roles restricted to countries or regions that exclude Nigeria. A location must be empty, "Remote", or contain one of `openLocations` such as Worldwide, Anywhere, Africa or EMEA. "South Africa" alone counts as restricted.
   - duplicates (same company + title, or a URL that's already tracked)
3. Scores each role: 30 + the weights of the `skills` keywords found in the title and description, capped at 100. It also picks the CV whose `cvs` keywords match best.
4. Appends new jobs to `data/jobs.csv`. Rows already in the file are never changed, so you can edit `status`, `applied_on` and `follow_up_on` freely (for example `new` → `applied` → `interview` / `rejected`).
5. Prints the top 20 new jobs.

`data/` is git-ignored because it's personal tracking data.

## Phone alerts

`.github/workflows/job-alerts.yml` runs `node tools/job-finder/index.mjs --alert` on GitHub Actions every 30 minutes, so it works while the PC is off. GitHub's own scheduler only fired every 3–7 hours, so a Cloudflare Worker (`tools/job-alerts-trigger`) starts the workflow on time. The workflow's GitHub schedule is kept as a 6-hourly fallback. It uses the same filters as a normal run, but instead of writing `data/jobs.csv` it sends each new match to the [ntfy](https://ntfy.sh) app on my phone. Tapping a notification opens the listing.

- Most sources are checked every run. Jobicy and Himalayas are checked hourly and Remotive every 6 hours, to stay within their terms and keep request counts low.
- The first run records what's already open and sends only "Job alerts are on", so it doesn't flood the phone. This also happens if the saved state is lost.
- At most 8 alerts are sent per run, plus one "+N more" summary. Matches scoring 60 or higher are sent at high priority.
- What has been alerted is kept in the Actions cache (`data/alert-state.json`), never committed.
- This uses about 1,560 of the 2,000 free Actions minutes a month for a private repo.

Setup:

1. Install ntfy (Android or iOS) and subscribe to the topic stored in the `NTFY_TOPIC` repository secret. The topic name is the only thing protecting the feed, so keep it private.
2. Set the secret: `gh secret set NTFY_TOPIC`.
3. Start a run from the Actions tab (Job alerts → Run workflow), or wait for the next scheduled one.
4. Deploy the trigger: from `tools/job-alerts-trigger`, run `npx wrangler deploy`. Then add its secrets with `npx wrangler secret put GITHUB_TOKEN` and `npx wrangler secret put NTFY_TOPIC`. `GITHUB_TOKEN` is a fine-grained token limited to this repo with **Actions: Read and write** permission. When the token expires, the Worker sends a "trigger failed" ping (at most every 6 hours) and only the fallback schedule keeps running until it's replaced.

To test locally without sending anything, run `node tools/job-finder/index.mjs --alert` with `NTFY_TOPIC` unset and no `data/ntfy-topic.txt`. Notifications are printed instead of sent. Delete `data/alert-state.json` afterwards.

## Applying with Antigravity

The `job-apply` skill (`.agents/skills/job-apply/SKILL.md`) has the Antigravity agent work through the queue in its browser. Its hard limits are in `.agents/rules/job-applications.md`.

- `apply-queue.mjs refresh` runs the finder with `--throttle`, so it's safe every hour. Sources are fetched only when due: Jobicy and Himalayas hourly, Remotive once a day (the alerts already poll it every 6 hours), the rest every run. `--force` fetches them all. `list` prints the queue: `new` jobs from the last 7 days scoring at least `apply.reviewMinScore`, excluding `apply.skipSources`. `set <url> <status>` updates a row, and `updates` applies the changes the agent wrote to `data/applications/updates/`.
- Jobs scoring at least `apply.autoSubmitMinScore` (60) may be submitted without me, but only when every answer comes from `data/applicant.md`, there's no CAPTCHA or password sign-up, and the account is <your-job-search-email@example.com>. Everything else is filled in and left as `needs-you`.
- At most 5 jobs per run. Each one gets a log in `data/applications/` with the cover note and every answer given.
- `data/applicant.md` holds my contact details and standard answers, so it lives in the git-ignored `data/` folder. Anything marked `ASK` is never guessed.
- It can use the job inbox (<your-job-search-email@example.com>) fully: it reads replies, uses email verification links and sends email applications. It never answers recruiters. Interview invites and questions come to me instead.
- When a CAPTCHA or my approval is the only thing missing, it fills in the form in a visible Chrome (the `chrome-visible` browser tool, using the `chrome_dev_tools` profile) and sends "Finish on PC". I then finish it from my phone through Chrome Remote Desktop. At most 3 are open at once, and unfinished ones are closed after 24 hours (`handovers` lists them).
- `set <url> applied|needs-you|finish-on-pc|interview "<note>"` pushes the job and the note to the same ntfy topic as the job alerts, and tapping the push opens the job. `skipped` and `rejected` stay quiet. A problem that stops the whole run is pushed with `notify "<message>"`. On this PC the topic is read from `data/ntfy-topic.txt`.

Setup:

1. Put the ntfy topic name (the one the phone app is subscribed to) in `tools/job-finder/data/ntfy-topic.txt`.
2. Sign in to Gmail as <your-job-search-email@example.com> in Antigravity's browser, so "Sign in with Google" works.
3. Replace the `ASK` answers in `data/applicant.md` that you're happy to give.
4. In Antigravity, run the skill once by hand and watch the run.
5. Run `tools/job-finder/install-schedule.ps1` once. It creates the hourly Windows task "Job Applications", which runs `run-agent.ps1` while I'm signed in to Windows. Each run's output goes to `data/agent-runs/`. (Antigravity's own `/automation` sidecars never ran on this version.)

Unattended runs (`agy -p`) refuse any tool or command that isn't allowed in `~/.gemini/antigravity-cli/settings.json`, and one refusal ends the run. Command rules there match the whole command word for word, so the agent runs only four fixed commands (`refresh`, `list`, `handovers`, `updates`). It records statuses and pushes by writing JSON files to `data/applications/updates/`, which `apply-queue.mjs updates` applies. `run-agent.ps1` keeps a visible Chrome open on port 9222 with the `chrome_dev_tools` profile, and `chrome-visible` attaches to it (`--browserUrl` in `~/.gemini/config/mcp_config.json`), so hand-over tabs outlive the run.

## Edit the profile

Everything tunable is in `profile.json`:

- `searchTerms`: title phrases a job must contain (plurals match too).
- `skills`: keyword → weight. Raise the weight for skills you want to rank higher.
- `cvs`: keywords that pick between the "Executive VA" and "Marketing & Admin" CVs.
- `openLocations`, `excludeTitle`, `excludeWorkplace`: the filters above.
- `maxAgeDays`: how far back to look.

Keep only skills and keywords in `profile.json`, never CV text or contact details.

## VA staffing agencies

Fetched automatically through their public ATS endpoints (one or two requests per run). Agency postings are evergreen, so they skip the 7-day cutoff, and URL tracking stops repeats. They still go through the location filter: a plain "Remote" location passes, but a city or country lock does not.

| Agency | Endpoint | Notes |
|---|---|---|
| Athena | Workday (`athenago.wd108.myworkdayjobs.com`) | EA roles are tied to Nairobi, Quezon City, Guatemala City and similar hubs, so they're usually filtered out |
| Boldly | Greenhouse (`boldly`) | Currently US & UK only |
| Scale Army | Ashby (`Scale Army Careers`) | Hires across Africa and LatAm. Many roles list Nigeria as a secondary location, which passes the filter |
| BruntWork | Listings embedded in https://apply.bruntworkcareers.co/jobs (no `/api/` calls, which robots.txt disallows) | Hires worldwide. The page shows about 30 featured roles across categories, not the full list |

Jobicy (https://jobicy.com, open API) is also fetched for the "Admin & Virtual Assistance" and "Product & Operations" categories. Its terms ask for credit and no more than hourly polling.

Titles naming a language other than English (bilingual, Spanish, French and so on) are excluded through `excludeTitle`.

Apply directly. These have no fetchable listings, or their listings can't be fetched within their rules. Check them by hand now and then:

| Agency | Careers URL | Why it isn't automated |
|---|---|---|
| BruntWork (full list) | https://apply.bruntworkcareers.co/jobs | Only the featured roles are fetched. Browse each category's "See all" by hand |
| Virtual Staff Finder | https://www.virtualstafffinder.com/careers/ | Application/talent-pool form only |
| Wing Assistant | https://wingassistant.com/careers/ | Google Form application, and its JazzHR board is inactive |
| Prialto | https://www.prialto.com/careers/jobs | Generic "Apply Here" page with no per-job listings. Hubs in the Philippines, Guatemala and others |
| Persona Talent | https://careers.personatalent.com/ | Talent sign-up flow, hires globally including Africa |
| Somewhere | https://somewhere.com/jobs | Talent-pool sign-up, no public job feed |
| Belay | https://belaysolutions.com/jobs | US residents only (Fountain application forms), so not eligible |

Checked and left out: Sourcefit (Breezy board, onsite in the Philippines and Dominican Republic), Cyberbacker and Assistantly (Workable accounts with no live jobs).

## Notes

- Remotive's free API currently returns only its 10 latest jobs. Its terms ask for at most about four calls a day and a link back to Remotive.
- Most VA listings are locked to the US or the Philippines, so expect only a handful of new matches per run. Running the tracker by hand once a day is plenty. Phone alerts cover the time in between.
