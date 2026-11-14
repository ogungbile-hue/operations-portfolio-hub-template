# Runs one unattended job-apply pass with the Antigravity CLI. Windows Task Scheduler starts it every hour.
# Only commands approved word for word in ~/.gemini/antigravity-cli/settings.json are allowed, so the skill
# records statuses through `apply-queue.mjs updates` (see .agents/skills/job-apply/SKILL.md).
$ErrorActionPreference = 'Stop'
$repo = Resolve-Path "$PSScriptRoot\..\.."
$agy = "$env:USERPROFILE\.gemini\bin\agy.exe"
$project = if ($env:AGY_PROJECT_ID) { $env:AGY_PROJECT_ID } else { '<YOUR_AGY_PROJECT_ID>' }
$logDir = "$PSScriptRoot\data\agent-runs"
New-Item -ItemType Directory -Force $logDir | Out-Null
$log = Join-Path $logDir ((Get-Date -Format 'yyyy-MM-dd-HHmm') + '.log')

# chrome-visible attaches to this Chrome (--browserUrl in mcp_config.json) instead of launching its own,
# so forms handed over to the user stay open after the run ends. Start it if it isn't running.
try { Invoke-RestMethod 'http://127.0.0.1:9222/json/version' -TimeoutSec 3 | Out-Null }
catch {
  Start-Process "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" -ArgumentList @(
    '--remote-debugging-port=9222', "--user-data-dir=`"$env:USERPROFILE\.gemini\antigravity\chrome_dev_tools`"", '--no-first-run')
  Start-Sleep -Seconds 5
}

$prompt = 'Job Applications hourly run. Read and follow .agents/skills/job-apply/SKILL.md and .agents/rules/job-applications.md exactly. ' +
  'The queue was refreshed just before this run, so skip the refresh in step 1 and start with list. ' +
  'Use chrome-devtools for applying and chrome-visible only for hand-overs. End with the summary the skill asks for.'

Set-Location $repo
"=== $(Get-Date -Format s) start" | Out-File $log -Encoding utf8
# Windows PowerShell turns a native program's stderr into errors, which 'Stop' would make fatal.
$ErrorActionPreference = 'Continue'
# Refreshed here rather than by the agent, which sent the slow fetch to the background and ended its run without waiting.
node tools/job-finder/apply-queue.mjs refresh 2>&1 | Out-File $log -Append -Encoding utf8
# agy gets a console of its own: when it shuts down its tools it sends Ctrl+C, which in a shared console
# also killed this script before the summary reached the log.
$out = "$log.out"; $err = "$log.err"
$p = Start-Process $agy -ArgumentList @('-p', "`"$prompt`"", '--project', $project, '--print-timeout', '50m') `
  -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError $err -Wait -PassThru
foreach ($f in $out, $err) { if (Test-Path $f) { Get-Content $f -Encoding utf8 | Out-File $log -Append -Encoding utf8; Remove-Item $f } }
"=== $(Get-Date -Format s) end, exit $($p.ExitCode)" | Out-File $log -Append -Encoding utf8
# Rewrites data/linkedin-batch.md each run and sends the day's one Easy Apply push from 07:00.
node tools/job-finder/apply-queue.mjs digest 2>&1 | Out-File $log -Append -Encoding utf8

# Keep two weeks of logs.
Get-ChildItem $logDir -Filter *.log | Where-Object LastWriteTime -lt (Get-Date).AddDays(-14) | Remove-Item
