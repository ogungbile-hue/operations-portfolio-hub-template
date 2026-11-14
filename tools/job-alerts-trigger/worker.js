// Starts the "Job alerts" GitHub workflow every 30 minutes. GitHub's own scheduler only fired every 3–7 hours.
// Secrets: GITHUB_TOKEN (fine-grained, this repo only, Actions: read and write). Optional NTFY_TOPIC for failure pings.
const REPO = 'your-org/operations-hub';
const WORKFLOW = 'job-alerts.yml';

export default {
  async scheduled(event, env) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'job-alerts-trigger',
      },
      body: JSON.stringify({ ref: 'main' }),
    });
    if (res.ok) return;

    const detail = `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`;
    console.error(`Workflow dispatch failed, ${detail}`);
    // At most one ping per 6 hours, so an expired token doesn't send 48 a day.
    if (env.NTFY_TOPIC && new Date(event.scheduledTime).getUTCHours() % 6 === 0 && new Date(event.scheduledTime).getUTCMinutes() < 30) {
      await fetch('https://ntfy.sh/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: env.NTFY_TOPIC, title: 'Job alerts trigger failed', tags: ['warning'],
          message: `Cloudflare couldn't start the GitHub workflow (${detail}). If it's 401, the GitHub token has expired.`,
        }),
      });
    }
    throw new Error(detail);
  },
};
