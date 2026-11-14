# STANDARD OPERATING PROCEDURE (SOP-01)

> **Portfolio sample — names, bookings, dates and figures are fictionalised to protect client confidentiality. Structure and workflow reflect real working practice.**

## YOUTUBE BROADCAST LIFECYCLE & 9:16 KINETIC REEL EXTRACTION

```
DOCUMENT ID:       SOP-OPS-01-V4
VERSION:           4.2 (Production Standard)
EFFECTIVE DATE:    October 2026
REVISION CYCLE:    Quarterly
OWNER / OPERATOR:  Alex Morgan — Executive Virtual Assistant & Media Lead
PRINCIPAL:         Executive Principal — UK Leadership Coach & Author Desk
PRIMARY CHANNELS:  YouTube Broadcast Desk · Instagram Reels · Telegram
CORE TOOL STACK:   CapCut Pro · Adobe Premiere Pro · Canva · YouTube Studio · Drive Vault
```

---

## 1. PURPOSE & OPERATIONAL SCOPE
This Standard Operating Procedure establishes the step-by-step methodology for producing, quality-checking, optimizing for search (SEO), and publishing broadcast-grade video content for the **Executive Thought Leadership Channel**. It guarantees:
1. Zero missed broadcast windows across 52 weeks of the editorial calendar.
2. Consistent audio mastering compliant with YouTube broadcast loudness (-14 LUFS).
3. High-retention short-form repurposing into vertical 9:16 kinetic reels within 4 hours of raw footage ingest.
4. Autonomous execution by the Executive VA with zero friction for the principal.

---

## 2. REPEATABLE 12-STEP PRODUCTION WORKFLOW

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PHASE 1: INGESTION & AUDIO HYGIENE                   │
│ Step 01: Cloud Ingestion ➔ Step 02: Audio Normalization (-14 LUFS)     │
├────────────────────────────────────────────────────────────────────────┤
│                   PHASE 2: EDITING & PACKAGING                         │
│ Step 03: Long-Form Cut ➔ Step 04: Kinetic Subtitles ➔ Step 05: 9:16 Reel │
├────────────────────────────────────────────────────────────────────────┤
│                   PHASE 3: SEO, THUMBNAIL & METADATA                   │
│ Step 06: Title & SEO Copy ➔ Step 07: 16:9 Thumbnail ➔ Step 08: QA Gate │
├────────────────────────────────────────────────────────────────────────┤
│                   PHASE 4: MULTI-CHANNEL DISTRIBUTION                  │
│ Step 09: Release (16:30 GMT) ➔ Step 10: Repurposing ➔ Step 11: Triage  │
├────────────────────────────────────────────────────────────────────────┤
│                   PHASE 5: ARCHIVAL & ANALYTICS                        │
│ Step 12: Performance Audit & Executive Memo Synthesis                  │
└────────────────────────────────────────────────────────────────────────┘
```

### STEP 01 · Raw Footage Ingestion & Cloud Vaulting
* **Directory Path:** `Google Drive > Executive Vault > 02_Video_Productions > 2026_Broadcasts > [Episode_Folder]`
* **Folder Naming Convention:** `YYYY-MM-DD_EP[XX]_[Topic_Slug]` (e.g., `2026-10-26_EP25_Resilience_Under_Pressure`)
* **File Naming Standard:**
  * Raw Camera A: `EP25_CAM_A_RAW.mp4`
  * Raw Audio Master: `EP25_AUDIO_LAV_MASTER.wav`
* **Backup Verification:** Master footage must be mirrored to local drive and cloud before raw camera SD cards are cleared.

### STEP 02 · Audio Engineering & Loudness Normalization (-14 LUFS)
* Import `AUDIO_LAV_MASTER.wav` into Adobe Premiere Pro / Audition.
* Apply Parametric Equalizer:
  * High-Pass Filter at **80 Hz** (attenuates low-frequency room rumble).
  * Subtle bell boost at **3.2 kHz (+2.0 dB)** to enhance vocal presence and clarity.
* Noise Suppression: Apply DeEsser (threshold: -24 dB) and light spectral noise reduction (10% reduction, zero artifact distortion).
* **Loudness Compliance:**
  * Target Integrated Loudness: **-14.0 LUFS (±0.5 LUFS)**.
  * Maximum True Peak: **-1.0 dBTP** (Prevents clipping during YouTube AAC transcoding).
* Export audio stem as `EP25_AUDIO_MASTER_NORMALIZED.wav`.

### STEP 03 · Long-Form Broadcast Assembly & Pacing
* Assemble master sequence in 1080p Full HD (1920×1080, 29.97 fps, square pixels).
* Cut dead air, false starts, and filler words while preserving the Principal’s natural executive cadence.
* Apply brand overlay assets:
  * Intro Stinger (3 seconds): Minimalist brand emblem transition.
  * Speaker Lower-Third: `Executive Principal | Leadership Coach & Keynote Speaker`.
  * Chapter Break Slates: Muted slate with Playfair Display serif header.
* Color Grading: Apply curated LUT (Warm Natural tone, Rec.709 color profile, skin tone vector verified).

### STEP 04 · Kinetic Typography & Word-by-Word Captioning
* Import dialogue sequences into CapCut Pro / Premiere Essential Graphics.
* Font Pairing Specification:
  * Primary Kinetic Font: **Inter Semi-Bold** (All Caps or Sentence Case with yellow highlight).
  * Key Emphasis Callout: **Playfair Display Italic** in brand accent `#FF6B35`.
* Display Rules:
  * Max 3 to 5 words on screen simultaneously for high retention.
  * Active spoken word highlighted in bright amber/gold.
  * Positioned at lower-third center (Y-axis: 78%), avoiding YouTube Shorts / Instagram UI buttons.

### STEP 05 · Vertical 9:16 High-Retention Reel Extraction
* Identify 1 to 2 "golden nuggets" (45 to 85 seconds) containing a powerful philosophical insight, relatable anecdote, or actionable resilience step.
* Format for 9:16 Vertical Video (1080×1920 px):
  * Crop and center speaker framing.
  * Insert kinetic subtitle styling.
  * Background Audio: Royalty-free ambient bed mixed at **-24 dB** under speech.
* Export as `EP25_REEL_01_Purpose_9x16.mp4` (H.264, 15 Mbps target bitrate).

### STEP 06 · YouTube SEO, Chapter Timestamps & Description Copy
* **Title Formula:** `[High-Emotion Hook / Question] | Executive Leadership Series Ep. [XX]`
  * *Example:* `What Is Your Legacy? Executive Purpose & Intentional Living | Ep. 24`
* **Description Architecture:**
  * *Lines 1–3 (Above the "Show More" fold):* Compelling summary hook and core takeaway.
  * *Lines 4–15 (Timestamps):* Clickable chapter markers formatted as:
    ```
    00:00 - The Question That Keeps Leaders Awake
    01:24 - What Defines True Legacy?
    04:12 - Why Intentionality Outweighs Motivation
    08:45 - The Resilience Bank Account Framework
    12:30 - Three Decisions to Make Today
    ```
  * *Lines 16–25 (Links & Community):* Official links to keynote series registration and Telegram executive community channel.
* **Tag Taxonomy:** 15 focused tags including `ExecutiveLeadership`, `CorporateGovernance`, `ExecutiveCoachingUK`, `ResilienceUnderPressure`, `LeadershipMentorship`.

### STEP 07 · High-CTR Thumbnail Design Standard
* Dimensions: 1280×720 px (16:9), under 2 MB, PNG or high-quality JPG.
* The 3-Element Visual Rule:
  1. **Subject:** High-resolution portrait of the Principal with expressive, engaged eye contact.
  2. **Text Hook:** Maximum 3 to 4 bold words in high contrast typography (e.g., `BUILD RESILIENCE NOW`).
  3. **Branding:** Discrete brandmark in bottom corner, avoiding the timestamp overlay zone.

### STEP 08 · Executive QA Gate & Pre-Flight Checklist
Before scheduling publication, verify every item on this pre-flight checklist:
- [x] Audio loudness verified at -14 LUFS; zero distortion on mobile speaker test.
- [x] Subtitles verified for 100% spelling accuracy, proper nouns, and timing sync.
- [x] Description links verified and clickable (HTTPS secured).
- [x] End-screen cards added (Subscribe button + "Next Recommended Video").
- [x] Thumbnail tested on light and dark mode YouTube previews for legibility.

### STEP 09 · Scheduled Broadcast Release (Wednesday 16:30 GMT)
* Set release schedule to **Wednesday at 16:30 UK time (17:30 WAT / 11:30 EST; 12:30 EDT during the late-Oct and March weeks when US and UK clock changes differ)** to maximize UK evening commute and transatlantic workday reach.
* Publish premier announcement post on YouTube Community Tab 2 hours prior to broadcast.

### STEP 10 · Multi-Channel Repurposing Matrix
* **Telegram Channel (Wednesday 16:35 GMT):** Dispatch direct YouTube link, 2-paragraph executive takeaway, and downloadable 1-page PDF summary.
* **Instagram Reel (Thursday 14:00 GMT):** Publish 9:16 vertical reel with audio tag and call-to-action to watch full episode on YouTube.
* **LinkedIn Article (Friday 09:00 GMT):** Publish written essay synthesized from episode transcript in the Principal’s thought leadership voice.

### STEP 11 · Comment Moderation & Community Triage
* Monitor comments during the first 120 minutes post-release.
* "Heart" and reply to high-value delegate reflections.
* Escalate coaching inquiries directly to the Tier 2 onboarding queue.

### STEP 12 · Performance Audit & Executive Briefing Integration
* At 7 days post-release, compile key analytics:
  * Views, Impression Click-Through Rate (CTR, target: > 6.5%).
  * Average Percentage Viewed (target: > 45% for long-form, > 75% for 9:16 reels).
* Synthesize findings into 3 bullet points for the Principal's weekly morning briefing memorandum.

---
*Standard Operating Procedure authorized for live production by Alex Morgan · Executive VA*
