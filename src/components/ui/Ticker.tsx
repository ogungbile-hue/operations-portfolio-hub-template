import React from 'react';

const TICKER_ITEMS = [
  "Executive Virtual Assistant (EVA) & Operations Partner",
  "Executive Inbox & Multi-Timezone Calendar Management",
  "Confidential Briefing Packs & Meeting Follow-ups",
  "Event & Campaign Design (Canva & Figma)",
  "Short-Form Vertical 9:16 Video Reels with Dynamic Captions",
  "Cross-Platform Publishing (Telegram · Instagram · YouTube)",
  "Workflow Automation & Custom Tools",
  "Notion Workspaces & SOP Playbooks",
  "Global Remote Alignment (WAT · GMT · ET)",
  "Open to New Remote Engagements",
];

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker">
        {items.map((text, i) => (
          <div key={`${text}-${i}`} className="t-item">
            <span className="t-dot" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
