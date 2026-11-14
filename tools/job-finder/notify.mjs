// Phone pushes through ntfy, shared by index.mjs (alerts on GitHub Actions) and apply-queue.mjs (the agent on this PC).
// The topic comes from NTFY_TOPIC, or locally from the git-ignored data/ntfy-topic.txt. The topic name is the only secret.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TOPIC_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'ntfy-topic.txt');
const topic = process.env.NTFY_TOPIC || (existsSync(TOPIC_PATH) ? readFileSync(TOPIC_PATH, 'utf8').trim() : '');

// Publishes through ntfy's JSON API so titles can hold any characters.
export async function notify(msg) {
  if (!topic) { console.log(`  [no ntfy topic, not sent] ${msg.title}: ${msg.message}`); return; }
  const res = await fetch('https://ntfy.sh/', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, ...msg }), signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`ntfy HTTP ${res.status}: ${await res.text()}`);
}
