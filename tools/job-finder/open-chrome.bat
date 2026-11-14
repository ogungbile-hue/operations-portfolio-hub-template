@echo off
rem Opens the agent's browser profile (the one chrome-devtools-mcp uses) in a visible window, e.g. to sign in to Gmail again.
rem Close it before the agent's next run: two Chromes can't share one profile.
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="%USERPROFILE%\.cache\chrome-devtools-mcp\chrome-profile" "https://myaccount.google.com"
