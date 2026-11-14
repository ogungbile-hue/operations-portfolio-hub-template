@echo off
rem Starts Chrome with remote debugging enabled on port 9222 for Antigravity automated browser sessions
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 "--user-data-dir=%USERPROFILE%\.gemini\antigravity\chrome_dev_tools" --no-first-run "about:blank"
