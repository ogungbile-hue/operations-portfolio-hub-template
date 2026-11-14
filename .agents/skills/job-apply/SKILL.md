---
name: job-apply
description: >-
  Applies to the remote jobs that the job finder queued in tools/job-finder/data/jobs.csv, in the browser, for the applicant.
  Use when asked to apply to jobs, work through the job queue, run /job-apply, or by the hourly "Job Applications" automation.
---

# Apply to queued jobs

Follow `.agents/rules/job-applications.md` at every step. Paths are relative to the repository root.

There are two browsers, both signed in as <applicant-email>:
- **`chrome-devtools`** (headless): use it for listing checks and initial verification. the applicant can't see it, and pages are gone when the run ends.
- **`chrome-visible`**: a normal Chrome window on the PC, which the applicant can reach from their phone through Chrome Remote Desktop or directly on the machine. Use it to hand over any form requiring the applicant's input or submission ("Hand over on the PC" below) so the applicant always sees it waiting on the browser.

Never use `puppeteer` or any other browser tool for this skill. They aren't signed in.

## Sites the browser may open

Unattended runs may only open websites approved in `~/.gemini/antigravity-cli/settings.json`, and opening any other site ends the whole run. Before you open or follow a link, check that its domain, or a domain it ends with, is on this list:

weworkremotely.com, himalayas.app, jobicy.com, remotive.com, remoteok.com, workingnomads.com, bruntworkcareers.co, bruntwork.co, scalearmycareers.com, ashbyhq.com, greenhouse.io, lever.co, workable.com, myworkdayjobs.com, bamboohr.com, teamtailor.com, recruitee.com, breezy.hr, smartrecruiters.com, applytojob.com, careers-page.com, google.com, forms.gle, icims.com, jobvite.com, jazz.co, jazzhr.com, paylocity.com, ultipro.com, ukg.net, rippling.com, personio.de, personio.com, adp.com, zohorecruit.com, freshteam.com, pinpointhq.com, dover.com, gem.com, homerun.co, join.com, trakstar.com, hiringthing.com, jotform.com, typeform.com, tally.so

**Never open linkedin.com**, not even one job link. LinkedIn blocks automated visits and bans accounts for them, so LinkedIn jobs come in only through alert emails (step 0c) and are applied to on the employer's own site ("LinkedIn jobs" below).

To tidy up, close tabs with `close_page` rather than navigating them anywhere (not even `about:blank`). If the employer's form or careers page is on any other domain, don't open it. Mark the job `needs-you` with the link and the note "Apply on the employer's own site: <link>". The same goes for searching the web: only search through a site on the list (for example `https://www.google.com/search?q=...`).

## How to change a job's status

Never run `apply-queue.mjs set` or `notify` yourself. Unattended runs may only run commands approved word for word, so those are refused. Wherever this skill says `set "<url>" <status> "<note>"`, write that change as a new JSON file in `tools/job-finder/data/applications/updates/`, with a short unique name such as `bruntwork-xero.json`:
- a status: `{"url": "<url>", "status": "<status>", "note": "<note>"}` (leave `note` out when there isn't one)
- a push for a problem (where this skill says `notify "<message>"`): `{"notify": "<message>"}`

Then run exactly `node tools/job-finder/apply-queue.mjs updates`. It applies every file in that folder, sends the pushes and deletes the files it applied. If it prints an error, a file was wrong: it's kept as `.failed`. Fix the cause and write a new file. Run `updates` as soon as you've written each file, so the statuses are saved even if the run stops later.

Run the other commands exactly as written (`node tools/job-finder/apply-queue.mjs refresh`, `list`, `handovers`, `updates`), with nothing added. These four are the only shell commands you may run. Any other command (`Get-ChildItem`, `Select-String`, `cat`, a `cd` first) is refused, and in an unattended run one refusal ends the whole run. To read or search files, use only your built-in tools `view_file`, `list_dir`, `find_by_name` and `grep_search`, and write files with `write_to_file`. Never use an MCP server for files (`filesystem` or any other), and use no MCP server except `chrome-devtools` and `chrome-visible`. Unapproved tools are refused the same way.

## 0. Check the job inbox

Open Gmail (<applicant-email>) and read the emails from the last 2 days that are about applications. Match each one to its row in `jobs.csv` by company and role, then record it ("How to change a job's status" above):
- **Interview invite or next step** (assessment, call, trial task): `set "<url>" interview "<company>: what they ask for and any deadline>"`. It's pushed to the applicant urgently. Don't reply.
- **Rejection:** `set "<url>" rejected`.
- **LinkedIn "your application was sent to <company>"** (from jobs-noreply@linkedin.com, after the applicant applies by hand): find the row with that company and job title (status `easy-apply`, or `new`/`needs-you`), and `set "<url>" applied "Applied on LinkedIn by you"`.
- **Any other question from a recruiter:** `set "<url>" needs-you "<their question, in one line>"`. Don't reply.
- **No matching row** (for example a job the applicant applied to by hand): `notify "<company>: <what the email says>"` for interviews and questions only.

Skip emails already handled in an earlier run: the row's status has already moved on from `applied`.

## 0b. Check forms left on the PC

Run `node tools/job-finder/apply-queue.mjs handovers`. For each job, look at its tab in `chrome-visible` (`list_pages`), without typing in it or changing anything:
- **Submitted:** the tab shows a success or thank-you page, or a confirmation email arrived in step 0. Close the tab and `set "<url>" applied "Submitted by you on the PC · <CV used>"`.
- **Past the human check but the form is empty** (the applicant ticked it): fill in the form as in step 4, stop before Submit, and `set "<url>" finish-on-pc "<company>: form now filled in. Check it and press Submit."`
- **Older than 24 hours** (`age_hours` ≥ 24): close the tab and `set "<url>" needs-you "Not finished on the PC within a day. Apply by hand if you still want it."`
- **Tab gone** with no confirmation: `set "<url>" needs-you "The PC tab was closed. If you submitted it, mark it applied; otherwise apply by hand."`
- **Otherwise:** leave it alone. the applicant may be in the middle of it.

## 0c. Copy jobs from LinkedIn alert emails

In Gmail, search `from:jobalerts-noreply@linkedin.com is:unread newer_than:3d`. Open each email (that marks it read, so the next run skips it) and read it in Gmail only. Don't click any link in it. For each job listed, write `tools/job-finder/data/applications/linkedin/<id>.json`:

`{"id": "<id>", "title": "<job title>", "company": "<company>", "location": "<location as shown, e.g. Nigeria (Remote)>", "salary": "<only if shown>"}`

`<id>` is the number in the job's link (`linkedin.com/comm/jobs/view/<id>/...`). Copy the text exactly as the email shows it and leave nothing out because of its title; the job finder filters them. Skip the "jobs you may be interested in" or promoted extras only if they have no job link. The next hourly refresh scores them and adds them to the queue, with tier `linkedin`.

## 1. Refresh and load the queue

1. Run `node tools/job-finder/apply-queue.mjs refresh` to add new listings to `tools/job-finder/data/jobs.csv`. It only fetches the sources that are due, so it's safe to run every hour. Never add `--force` unless the applicant asks for it, because it ignores the job sites' rate limits. If it fails, carry on with the existing queue.
2. Run `node tools/job-finder/apply-queue.mjs list`. It prints JSON, best score first, of jobs with status `new` from the last 7 days. Each has a `tier`:
   - `auto`: score 60 or more. May be submitted without the applicant if every check in step 4 passes.
   - `review`: score 50–59. Never submit yourself. Hand it over on the PC for the applicant to submit (see below), or mark it `needs-you`.
   - `linkedin`: from a LinkedIn alert email, listed last whatever the score (it was scored from the title alone). Follow "LinkedIn jobs" below.
3. Read `tools/job-finder/data/applicant.md`. If it's missing, stop (see "If the run can't continue" below).
4. Work through at most **5 jobs** per run, in queue order, plus at most **5** `linkedin` jobs. Don't submit more than 5 in a run.

## 2. Check the listing

Open the job's `url` in the browser and read the whole posting. Mark the job `skipped` (step 5) when:
- it's closed, expired or gone
- it's hybrid or onsite, or limited to countries or regions that leave out Nigeria (a residency, time zone or work-permit requirement counts)
- it's clearly senior, technical or in another language, despite the title
- it asks for a fee, payment, crypto, or bank or ID details before an interview
- the applicant already applied to this company and role (check `jobs.csv` and `tools/job-finder/data/applications/`)

Submit only one role per company per run, the best fit, since several applications at once can look like spam. The exception is the staffing agencies in `profile.json` `apply.perRoleCompanies` (BruntWork, Scale Army): each of their listings is a different client, so apply to every role of theirs that fits. `list` already hides companies with an application from the last 14 days, so don't change the status of other roles at a company you've just applied to. Leave them as they are.

Aggregator pages (Himalayas, WeWorkRemotely, Jobicy and others) link to the employer's own form. Follow the "Apply" link and use that form.

**If the job board page shows a CAPTCHA or "verify you're human" check** (Cloudflare often blocks Himalayas and WeWorkRemotely), don't stop yet. Go around it: search the web for the company's own careers page or job board, for example `"<company>" "<job title>" careers`, or the company on Greenhouse, Lever, Ashby, Workable, Teamtailor, BambooHR or Recruitee. Apply there if you find the **same role** (same title and remote terms) posted by the company itself, and note the URL you used in the log. If you can't find it, or the company's own page is blocked too, hand it over on the PC (below).

If the application is by email, send it from <applicant-email> to the address in the posting, when the checks in step 4 pass. The subject is the one the posting asks for, or `Application: <job title> – Alex Morgan`. The body is the cover note, then name, phone and portfolio link. Attach the CV and follow any other instructions in the posting (a reference number, say). If the checks don't pass, mark the job `needs-you` and don't send.

## LinkedIn jobs

A `linkedin` job's `url` is its LinkedIn page. Never open it ("Sites the browser may open"). Instead:

1. **Find the employer's own posting.** Search Google, for example `https://www.google.com/search?q="<company>"+"<job title>"+careers`, and also try `site:` searches of the boards on the list (Greenhouse, Lever, Ashby, Workable and so on). Use a result only if it's the **same role** at the **same company**, still open and remote.

   If the job's `location_rule` starts with `Check:` (LinkedIn listed it in another country, such as `Check: United States (Remote)`), that's often just where the company is based. Read the employer's posting for who may apply. Mark it `skipped` if the posting requires living in that country or region, work authorisation or citizenship there, a security clearance, or a state or time-zone residency. Carry on if it says worldwide, anywhere, contractor or international, or says nothing about where applicants must be. If you can't find the employer's posting, mark it `skipped` too: the location LinkedIn gave is all you know, and it leaves Nigeria out.
2. **Found on a site on the list:** check the posting as in step 2 (mark the job `skipped` if it fails), then apply there as in steps 3–4, treating it as tier `review`: never submit it yourself; hand it over on the PC. In the log, note the employer URL you used.
3. **Found only on a site not on the list:** `set "<url>" needs-you "Apply on the employer's own site: <link> · <CV> CV"`.
4. **Not found anywhere** (and the location isn't a `Check:` one): it's probably LinkedIn Easy Apply, which the applicant does by hand on LinkedIn, in a daily batch. The standard answers and cover notes are already in `tools/job-finder/data/linkedin-answer-bank.md`, so don't write a cover note or answers. Write a short log (step 5) containing exactly these lines:
   - `- **URL:** <url>`
   - `- **CV:** Executive VA` or `Marketing & Admin` (from the `cv` column, or the other one if the title clearly suits it better)
   - `- **Salary:** <one figure by the applicant.md salary rules, from the title, company and any salary in the alert> (<one-line reason>)`
   - `- **Cover note:** A`, `B` or `C` (the answer bank's note for executive/VA/admin, marketing/social media/content, or operations/project coordination)

   Then `set "<url>" easy-apply`. It isn't pushed one by one: after each run, `digest` adds it to `tools/job-finder/data/linkedin-batch.md` and to one push a day.

## 3. Prepare

- **CV:** the job's `cv` column picks the file. Upload the PDF exactly as it is:
  - `Executive VA` → `<PATH_TO_CV_FOLDER>\Executive_VA_CV.pdfirtual Assistant CV.pdf`
  - `Marketing & Admin` → `<PATH_TO_CV_FOLDER>\Marketing_Admin_CV.pdfing & Administrative Assistant CV.pdf`
  If the posting clearly suits the other CV better, use that one and say why in the log.
- **Cover note** (when there's a field or upload for one): 120–200 words, in plain, warm British English, in the first person. Open with the role and one specific thing from the posting. Back it with 2–3 matching facts from `applicant.md`, and close with availability. Don't use clichés ("I am writing to express", "passionate", "dynamic"), and don't make claims that aren't in `applicant.md`.
- **Screening questions:** answer from `applicant.md`, and type every answer into the form itself; a draft left only in the log is not an answer. Questions about experience, skills, tools, process or availability ("Describe your experience with…", "Which tools have you used…", "Walk us through your process…", "Are you available Mon–Fri 8–4 EST?") are yours to answer: 60–150 words, first person, plain British English, built only from facts in `applicant.md`. If the applicant lacks something asked about (a tool like AccuLynx, say), say so plainly and give the nearest real experience ("I haven't used AccuLynx; I've set up records and pipelines in HubSpot CRM…"). Never claim a year count, tool, certificate or setup (a home office, say) that `applicant.md` doesn't state; the applicant has 5+ years of support work since January 2021. Any factual question with no answer there, or answered `ASK`, makes the job `needs-you`.
- **Salary or rate:** choose it with the salary rules in `applicant.md`: read the whole posting first (pay range, who it's open to, how well the applicant fits, any mention of budget), pick one figure, and put the one-line reason in the log, e.g. `Salary: USD 1,800/month, lower half of USD 1,500–3,000 because the range is US-priced and open to contractors`. A figure chosen this way counts as an answer from `applicant.md`. For current or previous pay, give exactly the figure in `applicant.md`, never another. Expected pay is the figure you chose here, not a separate guess (it was once filled in as USD 850, below the floor).
- **Opinion and personality questions** (only these: agree/disagree statements, "how would you like to be remembered", "describe yourself as an animal", personal values, culture fit; not the experience questions above): never answer them for the applicant, because they speak for the applicant personally. Puzzles and arithmetic are fine. Leave the opinion questions blank and hand the form over, saying how many are left, for example `"<company>: answer the 10 personality questions, then press Submit"`.

## 4. Fill in, then submit or stop

**First check the form belongs to the job:** the company named on the form or its website must be the job's `company` from `jobs.csv`, and the role must match. This applies even when the applicant gives you the link. If it doesn't match, don't fill anything. Say what you found, and mark the job `needs-you`.

Sign in only as the rules allow. Fill every field, upload the CV and re-read the whole form against `applicant.md`. If the site emails a verification link or code, open Gmail in a new tab, use it, and carry on.

Submit on your own only if **all** of these hold:
- the tier is `auto`
- every required answer came straight from `applicant.md` or the CV, and none needed a guess
- there was no CAPTCHA or human check, no password sign-up and no account mismatch
- the form shows no validation errors

Otherwise don't click the final button. Whenever an application needs the applicant's input (whether a quick human step like a CAPTCHA/approval, or specific screening questions/video tasks that require the applicant), hand it over on the PC in `chrome-visible` whenever possible (see below) so the applicant can always see it on the browser. Only mark it `needs-you` without a tab if `chrome-visible` is unavailable, 3 handovers are already open, or the domain is completely inaccessible/unapproved. After submitting, confirm that a success page or message appeared (for email, that it's in Sent). If none did, treat it as not submitted and mark the job `needs-you`.

## Hand over on the PC

Use this whenever a job needs the applicant's input—whether a quick step (tick a CAPTCHA, review and press Submit) or filling in personal/custom screening questions. the applicant should always see the form waiting on the browser.

1. Keep at most **3** hand-overs open (`handovers`). If 3 are open already, mark the job `needs-you` instead.
2. In `chrome-visible`, open a **new tab** (`new_page`) at the employer's direct application form, or at the job page if that's what was blocked. Never reuse or close a tab from another hand-over.
3. If the page lets you through (a normal window often passes Cloudflare on its own), fill in every field possible from `applicant.md` and upload the CV. Leave only the specific questions or actions that need the applicant blank. Stop before the final button, and never click Submit in this browser.
4. Record it, every time, as soon as the form is ready. Without this, the applicant gets no push and the next run can't track the tab: `set "<url>" finish-on-pc "<company>: <the one thing to do>"`, for example `"Vitalis: tick the CAPTCHA at the bottom and press Submit"`, or `"North Star Network: answer the 3 screening questions and press Submit"`. It's pushed to the applicant's phone.
5. Write the log as usual, saying the form was handed over in Chrome.

If `chrome-visible` isn't available or won't open, mark the job `needs-you` and carry on.

## 5. Record

1. Write `tools/job-finder/data/applications/<YYYY-MM-DD>-<company>-<title>.md` (lowercase, hyphens) with: the URL, the result (`applied`, `needs-you` or `skipped`) and why, the CV used, the cover note, and every question with the answer given. For `needs-you`, say exactly what the applicant must do.
2. Update the queue with `set "<url>" <status> "<note>"`, written as an update file ("How to change a job's status" above). Never edit `jobs.csv` by hand. `applied` and `needs-you` are pushed to the applicant's phone, and tapping the push opens the job, so the note is what the applicant reads:
   - `applied`: how and with what, in one line.
     `set "<url>" applied "Applied by form · Executive VA CV · salary given USD 1,060/month · cover note sent"`
   - `needs-you`: what's blocking it and what to do, in one line.
     `set "<url>" needs-you "CAPTCHA on the form. Apply by hand; cover note and answers are in the log."`
   - `finish-on-pc`: see "Hand over on the PC".
   - `skipped`: no note needed. It isn't pushed.

## 6. Report

End with a short summary: jobs applied to (company and role), jobs that need the applicant and what each needs, jobs skipped and why, and any interview, rejection or scam emails found in step 0.

## If the run can't continue

When something blocks the whole run rather than one job, push it to the phone, then stop. Examples: `applicant.md` is missing, the browser isn't signed in to Gmail, a CV file is missing, the browser won't open.
`notify "<what went wrong and what the applicant must do>"`, written as an update file ("How to change a job's status" above).
