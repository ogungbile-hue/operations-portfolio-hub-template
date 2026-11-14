# Creates (or replaces) the hourly "Job Applications" task that runs run-agent.ps1 at the top of every hour.
# It runs only while the user is signed in to Windows, so the visible Chrome for hand-overs is on their desktop.
$script = Join-Path $PSScriptRoot 'run-agent.ps1'
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`""
$next = (Get-Date).Date.AddHours((Get-Date).Hour + 1)
$trigger = New-ScheduledTaskTrigger -Once -At $next -RepetitionInterval (New-TimeSpan -Hours 1)
# A run missed while the PC was off or asleep starts when it's back; a run still going when the next is due is left to finish.
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 55) `
  -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -RunOnlyIfNetworkAvailable
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive
Register-ScheduledTask -TaskName 'Job Applications' -Action $action -Trigger $trigger -Settings $settings -Principal $principal `
  -Description 'Hourly unattended job-apply run with the Antigravity CLI (tools/job-finder/run-agent.ps1).' -Force |
  Select-Object TaskName, State
"First run: $next"
