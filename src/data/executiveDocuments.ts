/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExportFileOption {
  label: string;
  url: string;
  formatBadge: string;
  toolName: string;
}

export interface ExecutiveDocument {
  id: string;
  refCode: string;
  title: string;
  subtitle: string;
  classification: string;
  dateLabel: string;
  principal: string;
  tools: string[];
  toolAttribution: string;
  exportableTo: string;
  exportFiles: ExportFileOption[];
  summary: string;
  downloadUrl: string;
  category: 'C-Suite Briefing' | 'Travel & Logistics' | 'Standard Operating Procedure' | 'Project Controls & WBS';
  sections: {
    heading: string;
    subheading?: string;
    bodyMarkdown: string;
  }[];
}

export const SAMPLE_DOCUMENT_NOTICE =
  'Portfolio sample — names, bookings, dates and figures are fictionalised to protect client confidentiality. Structure and workflow reflect real working practice.';

export const EXECUTIVE_DOCUMENTS: ExecutiveDocument[] = [
  {
    id: 'doc-01-briefing-memo',
    refCode: 'EXEC-MEMO-2026-W44',
    title: 'Executive Daily Briefing Memorandum',
    subtitle: 'Daily Operating Dashboard, GMT Diary Choreography & 4-Tier Inbox Triage Report',
    classification: 'CONFIDENTIAL // C-SUITE EYES ONLY',
    dateLabel: 'Mon, 26 Oct 2026 · 08:30 GMT',
    principal: 'Executive Principal (Keynote Speaker & Author)',
    tools: ['Notion Enterprise', 'Superhuman', 'Zoom', 'Telegram', 'Claude AI'],
    toolAttribution: 'Created with: Notion Enterprise & Superhuman · Accelerated via Claude AI Prompt Engineering',
    exportableTo: 'Notion Enterprise · Workspace Export (.html & .md)',
    exportFiles: [
      {
        label: 'Download Notion Page Export (.html)',
        url: '/documents/01_UK_Executive_Morning_Briefing_Memo_Notion_Export.html',
        formatBadge: 'Notion HTML Export',
        toolName: 'Notion',
      },
      {
        label: 'Download Raw Markdown (.md)',
        url: '/documents/01_UK_Executive_Morning_Briefing_Memo.md',
        formatBadge: 'Markdown / Raw',
        toolName: 'Markdown',
      },
    ],
    summary:
      'Daily 08:30 GMT executive briefing synthesizing top 3 non-negotiable priorities, diary buffers, Tier 1 BBC media escalation awaiting 1-tap WhatsApp approval, and YouTube broadcast performance.',
    downloadUrl: '/documents/01_UK_Executive_Morning_Briefing_Memo_Notion_Export.html',
    category: 'C-Suite Briefing',
    sections: [
      {
        heading: '1. Executive Snapshot & Core Focus',
        subheading: 'Top 3 Daily Objectives Defended by EVA',
        bodyMarkdown: `> *"Peace of mind begins when your calendar and operational systems protect your inner stillness."*

Good morning. Your UK diary has been calibrated for Monday with mandatory 15-minute buffers defended between all external engagements. All international timezones (GMT, WAT, EDT) have been cross-verified against daylight saving variances — the UK returned to GMT on 25 Oct while US Eastern stays on EDT until 1 Nov.

**Top 3 Non-Negotiable Objectives Today:**
1. **11:00 GMT:** Global Mentoring Symposium 2026 — Keynote & Speaker Run-of-Show Sign-Off (Zoom Room 1).
2. **15:00 GMT:** US Transatlantic Advisory Board Session & Executive Thought Leadership Strategy Call.
3. **17:00 GMT:** Protected Studio Recording Block — Executive Voiceover Recording (Zero interruptions permitted).`,
      },
      {
        heading: '2. UK Diary Choreography & Timezone Matrix',
        subheading: '08:30 to 19:00 GMT Buffer-Protected Schedule',
        bodyMarkdown: `• **08:30 – 08:45 GMT:** Daily Operational Standup & Priority Alignment (Telegram Voice).
• **09:00 – 10:30 GMT:** Executive Coaching Session: Cohort Alpha (Coaching worksheets pre-shared).
• **10:30 – 11:00 GMT:** Operational Buffer & Mindful Pause (Protected London focus · zero meetings).
• **11:00 – 12:15 GMT:** Global Mentoring Symposium Steering Sync (Slide deck v4.2 pre-loaded in Zoom).
• **12:15 – 13:30 GMT:** Executive Lunch & Physical Well-Being Break (Admin devices muted).
• **13:30 – 14:45 GMT:** 1-on-1 Advisory Retainer (Counterparty dossier loaded on iPad).
• **14:45 – 15:00 GMT:** Transatlantic AV Check (Audio normalized to -14 LUFS; mic frequency verified).
• **15:00 – 16:15 GMT:** US Advisory Call & Podcast Strategy (Automated AI Minutes of Meeting recording).
• **16:15 – 17:00 GMT:** Executive Email Triage Batch (3 pre-drafted replies awaiting 1-tap WhatsApp sign-off).
• **17:00 – 18:30 GMT:** Protected Broadcast Studio Recording Session (Teleprompter prompts pre-loaded).
• **18:30 – 19:00 GMT:** End-of-Day Operations Sync & Evening Debrief (Tuesday calendar locked).`,
      },
      {
        heading: '3. 4-Tier Inbox Triage Report',
        subheading: '64 Emails Filtered · 1 Urgent Escalation Awaiting Sign-Off',
        bodyMarkdown: `**Tier 1: Urgent Escalation (< 1h SLA) — 1 Item Pending**
• **Sender:** BBC Radio Scotland Leadership Spotlight (Series Producer).
• **Opportunity:** Keynote Guest Feature on *"Resilience & Culture in British Enterprise"*.
• **Proposed Window:** Wednesday, 18 Nov 2026 · 14:30 GMT (Virtual studio line).
• **Pre-Drafted Reply (Awaiting 1-tap WhatsApp approval):**
  > *"Dear Producer, The Executive Office welcomes this invitation and the Principal is delighted to share insights on resilience and leadership governance. Our office has reserved Wednesday, 18 November at 14:30 GMT. My desk will liaise regarding the technical audio line test and briefing notes. Warm regards, Alex Morgan, Executive Assistant & Operations Lead."*

**Tier 2: Autonomous Handling by Lead VA (14 Items Handled)**
• 9 Symposium registration queries answered with receipts and stage guides.
• 3 Mentee applications vetted against entry criteria; Calendly links dispatched.
• 2 AV vendor invoices reconciled against symposium budget and queued for payment.

**Tier 3: Metrics Digest (17:00 GMT Memo)**
• YouTube Broadcast *"What Is Your Legacy?"* achieved 84% avg retention.
• Instagram Resilience Carousel earned 3.4× higher bookmark rate.`,
      },
      {
        heading: '4. Executive Action Items Checklist',
        subheading: '1-Tap Authorizations Required',
        bodyMarkdown: `[ ] **Approve BBC Radio Scotland Interview:** Reply *"YES BBC"* on WhatsApp.
[ ] **Symposium Slide Deck v4.2 Review:** Pre-loaded in Zoom Room 1.
[ ] **Edinburgh Balmoral Dinner Selection:** Menu choices flagged in Travel Dossier.`,
      },
    ],
  },
  {
    id: 'doc-02-travel-dossier',
    refCode: 'EXEC-TRV-2026-EDI',
    title: 'Confidential Travel & Speaking Dossier',
    subtitle: 'London Kings Cross → Edinburgh Waverley Keynote Mission Logistics Brief',
    classification: 'STRICTLY CONFIDENTIAL // TRAVEL & LOGISTICS DOSSIER',
    dateLabel: 'Thu, 12 Nov – Sat, 14 Nov 2026',
    principal: 'Executive Principal — Keynote Speaker & Leadership Coach',
    tools: ['Canva Pro', 'Google Workspace', 'LNER Business Portal', 'The Balmoral Concierge'],
    toolAttribution: 'Created with: Canva Pro & Google Workspace Travel Desk · Validated via LNER Business Desk',
    exportableTo: 'Canva Pro & Google Docs Format (.html & .md)',
    exportFiles: [
      {
        label: 'Download Canva Dossier Format (.html)',
        url: '/documents/02_Confidential_UK_Travel_Dossier_Canva_Doc.html',
        formatBadge: 'Canva Doc HTML',
        toolName: 'Canva',
      },
      {
        label: 'Download Raw Markdown (.md)',
        url: '/documents/02_Confidential_UK_Travel_Dossier_Edinburgh.md',
        formatBadge: 'Markdown / Raw',
        toolName: 'Markdown',
      },
    ],
    summary:
      'Complete end-to-end travel dossier covering door-to-door transit, LNER First Class solo window seating, Balmoral Castle View Suite, chauffeur GPS tracking, EICC stage AV tech rider, and contingency matrix.',
    downloadUrl: '/documents/02_Confidential_UK_Travel_Dossier_Canva_Doc.html',
    category: 'Travel & Logistics',
    sections: [
      {
        heading: '1. Master Chronology & Door-to-Door Timetable',
        subheading: 'Seamless Executive Itinerary (London ⇄ Edinburgh)',
        bodyMarkdown: `• **Thursday, 12 Nov 2026 (Travel Protocol):**
  - **09:15 GMT:** Chauffeur transfer from London residence to Kings Cross Station.
  - **10:00 GMT:** LNER First Class Departure (Azuma Train · Coach M, Seat 12).
  - **14:22 GMT:** Arrival at Edinburgh Waverley; Chauffeur meet-and-greet at North Bridge exit.
  - **14:45 GMT:** VIP Check-in at The Balmoral Hotel (Executive Castle View Suite).
  - **16:00 GMT:** On-site AV tech walkthrough & stage check at EICC Pentland Suite.
  - **19:00 GMT:** Private Welcome Dinner at Number One Restaurant (Balmoral).

• **Friday, 13 Nov 2026 (Keynote Summit Day):**
  - **07:30 GMT:** In-suite breakfast (Poached eggs, avocado, fresh ginger tea).
  - **08:45 GMT:** Chauffeur transfer to Edinburgh International Conference Centre.
  - **10:30 GMT:** **KEYNOTE ADDRESS: "Culture, Colour & Mentoring — Building Resilience"**.
  - **11:30 GMT:** VIP Panel Moderation & Audience Q&A.
  - **13:00 GMT:** Executive Luncheon with Scottish Business Alliance Chairs.
  - **15:30 GMT:** Media interviews & BBC studio audio hookup.
  - **18:00 GMT:** Return to Balmoral Hotel for evening debrief.

• **Saturday, 14 Nov 2026 (Return Journey):**
  - **11:30 GMT:** LNER First Class Return Departure (Coach M, Seat 14).
  - **15:50 GMT:** Arrival at London Kings Cross; Home chauffeur transfer waiting.`,
      },
      {
        heading: '2. Rail & Ground Transportation Intelligence',
        subheading: 'LNER First Class Azuma & Private Mercedes S-Class Chauffeur',
        bodyMarkdown: `• **Outbound Booking Ref:** \`LNER-849204-UK\` · Coach M, Seat 12 (Solo Window with Executive Worktable, UK 3-pin power, high-speed Wi-Fi pre-configured).
• **Inbound Booking Ref:** \`LNER-849205-UK\` · Coach M, Seat 14.
• **Chauffeur Service:** Little’s Chauffeur Drive Scotland · Driver: Alistair Macleod (+44 7700 900821) · Vehicle: Mercedes-Benz S-Class LWB (\`SF74 XLD\`).
• **Meet Protocol:** Driver waiting at Waverley North Bridge exit holding discrete VIP tablet: \`EXECUTIVE PRINCIPAL\`. Live GPS tracked via VA console.`,
      },
      {
        heading: '3. Accommodation & VIP Hospitality',
        subheading: 'The Balmoral Hotel Edinburgh (1 Princes Street)',
        bodyMarkdown: `• **Reservation Code:** \`BAL-93821-EXEC\` · Direct Concierge: +44 131 556 2414.
• **Suite:** Executive Castle View Suite (Panoramic Edinburgh Castle vista).
• **Secured Amenities:** Early check-in guaranteed at 12:00 GMT; Late checkout secured until 14:00 GMT Saturday.
• **Pre-Arranged Preferences:** Non-feather hypoallergenic pillows, fresh fruit platter, chamomile tea, 24-hour pressing service for keynote attire pre-booked.`,
      },
      {
        heading: '4. Venue Intelligence & AV Tech Rider Checklist',
        subheading: 'EICC Pentland Suite (Auditorium Plenary Setup)',
        bodyMarkdown: `• **Stage Setup:** 18m × 6m elevated keynote stage with lectern and center standing mark.
• **Microphone:** Wireless Sennheiser D6000 Lavalier bodypack clip-on (frequency tested). Spare handheld on lectern.
• **Confidence Monitors:** Dual 65-inch floor confidence monitors showing speaker timer, current slide, and next slide preview.
• **Presentation Clicker:** Dual-channel Logitech Spotlight remote pre-tested; spare AAA batteries carried in VA kit.
• **Keynote Deck:** 16:9 Widescreen 4K pre-loaded on master server + offline USB copy in handbag.`,
      },
      {
        heading: '5. Emergency & Contingency Protocol Matrix',
        subheading: 'Fail-Safe Procedures for Unexpected Disruptions',
        bodyMarkdown: `• **Rail Delay (> 30 min):** Auto-rebooked to next service; Chauffeur notified via SMS gateway live.
• **Rail Strike Fallback:** Standby British Airways ticket held: BA1442 (LHR → EDI, 11:15 departure).
• **Medical Emergency:** Royal Infirmary of Edinburgh (A&E) · 51 Little France Crescent · +44 131 536 1000.
• **24/7 Operations Desk Hotline:** Alex Morgan (+1 (555) 019-2834).`,
      },
    ],
  },
  {
    id: 'doc-03-youtube-sop',
    refCode: 'SOP-OPS-01-V4',
    title: 'Standard Operating Procedure: YouTube Broadcast & 9:16 Kinetic Reels Lifecycle',
    subtitle: '12-Step Broadcast Ingest, Normalization, Kinetic Typography & Multi-Channel Distribution Protocol',
    classification: 'ENTERPRISE OPERATIONAL PROCEDURE // SOP VAULT',
    dateLabel: 'Version 4.2 · Updated Q4 2026',
    principal: 'Executive Thought Leadership & Broadcast Desk',
    tools: ['Asana Enterprise', 'Notion SOP Wiki', 'CapCut Pro', 'Premiere Pro', 'YouTube Studio'],
    toolAttribution: 'Created with: Asana Enterprise & Notion Team Wiki · Production Pipeline for CapCut Pro & Premiere Pro',
    exportableTo: 'Asana · Official CSV Project Import (.csv)',
    exportFiles: [
      {
        label: 'Download Asana SOP Project (.csv)',
        url: '/documents/03_Asana_SOP_YouTube_Reels_Workflow_Import.csv',
        formatBadge: 'Asana CSV Import',
        toolName: 'Asana',
      },
      {
        label: 'Download Master SOP Playbook (.md)',
        url: '/documents/03_SOP_01_YouTube_Broadcast_and_Kinetic_Reels_Lifecycle.md',
        formatBadge: 'Markdown / Raw',
        toolName: 'Markdown',
      },
    ],
    summary:
      'Standard Operating Procedure detailing the 12-step publication protocol: cloud vaulting, -14 LUFS loudness mastering, word-by-word kinetic typography, 9:16 vertical reel extraction, SEO tags, and multi-channel publication.',
    downloadUrl: '/documents/03_Asana_SOP_YouTube_Reels_Workflow_Import.csv',
    category: 'Standard Operating Procedure',
    sections: [
      {
        heading: '1. Production Lifecycle Overview',
        subheading: 'Turnkey 12-Step Publishing Architecture',
        bodyMarkdown: `The goal of SOP-01 is to deliver broadcast-grade video and audio content with zero missed deadlines and zero executive friction for the Executive Principal.

**5 Core Production Phases:**
1. **Phase 1: Ingestion & Audio Hygiene:** Cloud vaulting, folder taxonomy, and -14 LUFS audio loudness calibration.
2. **Phase 2: Editing & Pacing:** Three-point narrative cut, kinetic word-by-word subtitles, and 9:16 vertical extraction.
3. **Phase 3: SEO, Thumbnail & QA Gate:** High-CTR title formulas, 12 timestamps, 3-element thumbnail check, and pre-flight QA.
4. **Phase 4: Multi-Channel Dispatch:** Wednesday 16:30 GMT release, Telegram digest, and Instagram Reel.
5. **Phase 5: Archival & Audit:** 7-day retention audit and briefing memo synthesis.`,
      },
      {
        heading: '2. Audio Engineering Standards (-14 LUFS Compliance)',
        subheading: 'Broadcast Loudness & Frequency Isolation',
        bodyMarkdown: `• **High-Pass Filter:** 80 Hz cutoff (attenuates low-frequency mic rumble).
• **Speech Clarity Boost:** +2.0 dB at 3.2 kHz (enhances vocal intelligibility).
• **De-Esser:** -24 dB threshold on sibilant frequencies (6.5 kHz – 8 kHz).
• **Integrated Loudness Target:** **-14.0 LUFS (±0.5 LUFS)**.
• **Maximum True Peak:** **-1.0 dBTP** (Prevents clipping during YouTube AAC transcoding).
• **Ambient Music Bed:** Sidechain compressed, sitting at **-24 dB** under spoken dialogue.`,
      },
      {
        heading: '3. Kinetic Typography & 9:16 Reel Protocol',
        subheading: 'High-Retention Short-Form Repurposing',
        bodyMarkdown: `• **Font System:** Inter Semi-Bold (White primary text) + Playfair Display Italic (Orange \`#FF6B35\` emphasis).
• **Rhythm:** 3 to 5 words displayed simultaneously; active word highlighted in gold.
• **Safe Zones:** Subtitles positioned at Y-axis 78% (above caption overlay and clear of platform engagement buttons).
• **Hook Extraction:** Extract 45 to 85 second narrative nuggets containing a distinct emotional or coaching breakthrough.`,
      },
      {
        heading: '4. YouTube SEO & Chapter Architecture',
        subheading: 'Search Engine Optimization & Timestamp Formatting',
        bodyMarkdown: `• **Title Formula:** \`[High-Emotion Question / Hook] | Executive Leadership Series Ep. [XX]\`
• **First 3 Lines:** Compelling hook and thesis statement above the "Show More" fold.
• **Clickable Timestamps:** Minimum 5 to 8 chapter markers formatted as:
  \`00:00 - The Core Question\`
  \`01:45 - What True Resilience Requires\`
  \`04:30 - The 3 Principles for Navigating Change\`
• **Hashtags:** \`#ExecutiveLeadership #Resilience #UKCoaching #ThoughtLeadership #Governance\``,
      },
    ],
  },
  {
    id: 'doc-04-project-controls',
    refCode: 'ASANA-SPEC-2026-SYM',
    title: 'Asana Master Project Schedule Specification (Global Symposium 2026)',
    subtitle: 'Turnkey Asana Enterprise Project Schedule, WBS Levels 1–4, and Dependency Logic Table',
    classification: 'ENTERPRISE PROJECT CONTROLS // ASANA WORKFLOW',
    dateLabel: 'Baseline Freeze: 01 Sep 2026 · Live Date: 18 Nov 2026',
    principal: 'Executive Principal (Principal Sponsor) · Alex Morgan (Lead VA & Project Scheduler)',
    tools: ['Asana Enterprise', 'Notion', 'Google Sheets'],
    toolAttribution: 'Created with: Asana Enterprise (Turnkey Import Engine) · Designed with Enterprise Project Rigor',
    exportableTo: 'Asana · Official CSV Project Import (.csv)',
    exportFiles: [
      {
        label: 'Download Asana Master Project Import (.csv)',
        url: '/documents/04_Asana_Master_Project_Symposium_Schedule_Import.csv',
        formatBadge: 'Asana CSV Import',
        toolName: 'Asana',
      },
      {
        label: 'Download Raw Project Specification (.md)',
        url: '/documents/04_Project_Controls_Master_Schedule_Specification.md',
        formatBadge: 'Markdown / Raw',
        toolName: 'Markdown',
      },
    ],
    summary:
      'Enterprise Asana project schedule specification establishing WBS Levels 1–4, 16-activity CPM schedule logic, zero-float critical path governance, RACI matrix, and Earned Value Management audit (SPI = 1.04, CPI = 1.07).',
    downloadUrl: '/documents/04_Asana_Master_Project_Symposium_Schedule_Import.csv',
    category: 'Project Controls & WBS',
    sections: [
      {
        heading: '1. Project Charter & Controls Overview',
        subheading: 'Triple Constraints Baseline Governance',
        bodyMarkdown: `The Global Mentoring Symposium 2026 connects 400+ delegates across the UK, West Africa, and North America.
• **Scope Baseline:** 1 Plenary Keynote, 3 Masterclass Breakouts, 14 Speaker Dossiers, 24 Media Assets.
• **Schedule Baseline:** 86 Calendar Days (01 Sep – 25 Nov 2026), 0 Days Schedule Slippage on the Primary Critical Path.
• **Budget Baseline:** £48,500 across platform, AV tech rider, speaker hospitality, and broadcast marketing.
• **Project Management Engine:** Configured in **Asana Enterprise** with full dependencies, custom fields, and automated notification triggers.`,
      },
      {
        heading: '2. Work Breakdown Structure (WBS Level 1 to 4)',
        subheading: 'Hierarchical Deliverable Architecture',
        bodyMarkdown: `• **WBS 1.0 Project Governance & PMO:** Asana Project Setup, Baseline Schedule Freeze, Weekly Executive Variance Reports, Float Defense.
• **WBS 2.0 Speaker Curation & Dossiers:** Speaker Contracting (NDA & Releases), Confidential Briefing Dossiers, Line Checks.
• **WBS 3.0 Creative Identity & Marketing:** Master Identity in Canva, 9:16 Video Reels in CapCut, Asana Editorial Engine.
• **WBS 4.0 Platform Infrastructure & AV Rider:** Zoom Events VIP Hub, -14 LUFS Audio Calibration, Dual Confidence Monitors.
• **WBS 5.0 Live Event Execution:** VIP Green Room, Livestream Broadcast, Q&A Triage, Stage Buffer Defense.
• **WBS 6.0 Post-Summit Synthesis:** Master Video Cutdown, Delegate Impact Digest, Notion Mentee Onboarding.`,
      },
      {
        heading: '3. Critical Path Method (CPM) Activity Schedule',
        subheading: '16 Key Schedule Activities with Float Analysis',
        bodyMarkdown: `• **ACT-1010:** Project Charter & Baseline (3d, Float: 0d) · **CRITICAL PATH**
• **ACT-1020:** Asana Master Project Setup & Dependency Calibration (4d, Float: 0d) · **CRITICAL PATH**
• **ACT-2010:** Speaker Longlist Selection (7d, Float: 2d)
• **ACT-2020:** Speaker Contracting & Releases (10d, Float: 2d)
• **ACT-2030:** Confidential Speaker Dossiers Assembly (8d, Float: 0d) · **CRITICAL PATH**
• **ACT-3010:** Visual Identity & Conference Slates (6d, Float: 7d)
• **ACT-4010:** Virtual Stage & Registration Setup (5d, Float: 0d) · **CRITICAL PATH**
• **ACT-4020:** AV Technical Rider & Bench Test (3d, Float: 0d) · **CRITICAL PATH**
• **ACT-2040:** International Speaker Dry-Run Rehearsal (4d, Float: 0d) · **CRITICAL PATH**
• **ACT-5010:** Stage Dress Rehearsal & Buffer Test (2d, Float: 0d) · **CRITICAL PATH**
• **ACT-5020:** **SYMPOSIUM LIVE STAGE TRANSMISSION (18-Nov-26 · MILESTONE)**
• **ACT-6010:** Master Video Cutdown & YouTube Release (5d, Float: 0d) · **CRITICAL PATH**`,
      },
      {
        heading: '4. Earned Value Management (EVM) Performance Audit',
        subheading: 'Audited at Day 50 of the 75-Day Schedule',
        bodyMarkdown: `• **Planned Value (PV):** £48,500.00
• **Earned Value (EV):** £50,440.00
• **Actual Cost (AC):** £47,200.00
• **Schedule Variance (SV = EV - PV):** **+£1,940.00**
• **Cost Variance (CV = EV - AC):** **+£3,240.00**
• **Schedule Performance Index (SPI):** **1.04 (Ahead of Schedule)**
• **Cost Performance Index (CPI):** **1.07 (Under Budget)**

*Analysis:* The symposium project is operating **4% ahead of schedule** and **7% under budget**, enabled by automated Asana dependencies and prompt-engineered AI research for speaker briefing dossiers.`,
      },
    ],
  },
];
