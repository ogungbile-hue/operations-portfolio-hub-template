# PROJECT CONTROLS & MASTER SCHEDULE SPECIFICATION

> **Portfolio sample — names, bookings, dates and figures are fictionalised to protect client confidentiality. Structure and workflow reflect real working practice.**

## WORK BREAKDOWN STRUCTURE (WBS) & CRITICAL PATH METHOD (CPM) AUDIT

```
PROJECT IDENTIFIER:    ASANA-SPEC-2026-SYM
PROJECT NAME:          Global Mentoring Symposium 2026 (UK & Global Virtual Assembly)
PRINCIPAL SPONSOR:     Executive Principal (UK Executive Leadership & Author Desk)
PROJECT CONTROLS LEAD: Alex Morgan — Operations Partner & Project Scheduler
SOFTWARE PLATFORMS:    Asana · Notion · Google Sheets (Gantt & Float Tracker)
METHODOLOGIES APPLIED: Critical Path Method (CPM) · Earned Value Management (EVM) · WBS Level 4
BASELINE FREEZE DATE:  01 September 2026
SYMPOSIUM LIVE DATE:   18 November 2026
```

---

## 1. PROJECT CHARTER & EXECUTIVE CONTROLS OVERVIEW
The Global Mentoring Symposium 2026 is an international hybrid leadership summit connecting 400+ delegates across the United Kingdom, West Africa, and North America. This document defines the engineering schedule controls, critical path governance, and earned value performance standards designed and administered by Alex Morgan.

### Triple Constraints Baseline:
* **Scope Baseline:** 1 Plenary Keynote, 3 Masterclass Breakouts, 14 Speaker Dossiers, 24 Media Deliverables, and 1 Post-Summit Resource Package.
* **Schedule Baseline:** 86 Calendar Days (01 Sep 2026 – 25 Nov 2026), 0 Days Schedule Slippage on the Primary Critical Path.
* **Budget Baseline:** £48,500 (Allocated across AV technical rider, platform infrastructure, speaker hospitality, and broadcast marketing).

---

## 2. HIERARCHICAL WORK BREAKDOWN STRUCTURE (WBS LEVEL 1 TO 4)

```
WBS 1.0  PROJECT GOVERNANCE & PMO
  1.1 Charter Authorization & Stakeholder Register
  1.2 Baseline Schedule Freeze (Asana Timeline)
  1.3 Weekly Executive Progress Reports & Variance Control
  1.4 Risk Management & Contingency Float Monitoring

WBS 2.0  SPEAKER CURATION, INTELLIGENCE & DOSSIERS
  2.1 Keynote & Panelist Longlist Selection (Principal Sign-Off)
  2.2 Formal Speaker Invitations & Contracting (NDA & Media Release)
  2.3 Confidential Speaker Briefing Dossiers & Bio Collection
  2.4 Pre-Summit Technical Line Checks & Rehearsals

WBS 3.0  CREATIVE IDENTITY & MULTI-CHANNEL COLLATERAL
  3.1 Master Conference Visual Identity (Canva / Figma)
  3.2 Event Posters, Delegate Badges & Print Slates
  3.3 9:16 Vertical Promo Video Reels (CapCut / Premiere Pro)
  3.4 Multi-Channel Editorial Distribution Calendar (Asana Engine)

WBS 4.0  PLATFORM INFRASTRUCTURE & AV TECHNICAL RIDER
  4.1 Virtual Stage Configuration (Zoom Events VIP Hub)
  4.2 Broadcast Sound Engineering & Leveling Calibration (-14 LUFS)
  4.3 Dual Confidence Monitor Configuration & Remote Clicker QA
  4.4 Redundant Internet & Backup Audio Feed Routing

WBS 5.0  LIVE EVENT EXECUTION & STAGE DIRECTION
  5.1 Green Room VIP Reception & Speaker Standby
  5.2 Plenary Keynote Livestream & Master Audio Recording
  5.3 Interactive Q&A Triage & Real-Time Audience Polling
  5.4 Stage Timekeeping & Buffer Defense

WBS 6.0  POST-SUMMIT SYNTHESIS & LEGACY ARCHIVE
  6.1 Master Recording Post-Production & Chapter Timestamping
  6.2 Delegate Impact Digest & Executive Report Card
  6.3 Mentoring Cohort Intake Onboarding (Notion CRM)
  6.4 Project Closeout, Lessons Learned & Schedule Debrief
```

---

## 3. MASTER CPM ACTIVITY SCHEDULE & GANTT LOGIC TABLE

*Note: All logic set up as Asana task dependencies and cross-checked in a Google Sheets float tracker. Relationships follow standard Finish-to-Start (FS), Start-to-Start (SS), and Finish-to-Finish (FF) protocols.*

| Activity ID | WBS Code | Activity Description | Dur (Days) | Predecessors | Early Start | Early Finish | Late Start | Late Finish | Total Float | Critical Path? |
|---|---|---|---|---|---|---|---|---|---|---|
| **ACT-1010** | 1.1 | Project Charter & Stakeholder Baseline | 3 | None | 01-Sep-26 | 03-Sep-26 | 01-Sep-26 | 03-Sep-26 | 0 d | **YES [CRITICAL]** |
| **ACT-1020** | 1.2 | Asana Master Project Setup & Dependency Calibration | 4 | ACT-1010 (FS) | 04-Sep-26 | 07-Sep-26 | 04-Sep-26 | 07-Sep-26 | 0 d | **YES [CRITICAL]** |
| **ACT-2010** | 2.1 | Speaker Longlist & Curation Matrix | 7 | ACT-1020 (FS) | 08-Sep-26 | 14-Sep-26 | 10-Sep-26 | 16-Sep-26 | 2 d | NO |
| **ACT-2020** | 2.2 | Speaker Contracting & Legal Releases | 10 | ACT-2010 (FS) | 15-Sep-26 | 24-Sep-26 | 17-Sep-26 | 26-Sep-26 | 2 d | NO |
| **ACT-2030** | 2.3 | Confidential Speaker Dossiers Assembly | 8 | ACT-2020 (FS) | 25-Sep-26 | 02-Oct-26 | 25-Sep-26 | 02-Oct-26 | 0 d | **YES [CRITICAL]** |
| **ACT-3010** | 3.1 | Visual Identity & Conference Slates | 6 | ACT-1020 (FS) | 08-Sep-26 | 13-Sep-26 | 15-Sep-26 | 20-Sep-26 | 7 d | NO |
| **ACT-3020** | 3.2 | Promotional Posters & Delegate Kits | 8 | ACT-3010 (FS) | 14-Sep-26 | 21-Sep-26 | 21-Sep-26 | 28-Sep-26 | 7 d | NO |
| **ACT-3030** | 3.3 | 9:16 Video Reels (CapCut & Kinetic Subtitles) | 10 | ACT-3010 (SS+3) | 11-Sep-26 | 20-Sep-26 | 18-Sep-26 | 27-Sep-26 | 7 d | NO |
| **ACT-3040** | 3.4 | Asana Content Editorial Matrix Launch | 45 | ACT-3020 (FS) | 22-Sep-26 | 05-Nov-26 | 29-Sep-26 | 12-Nov-26 | 7 d | NO |
| **ACT-4010** | 4.1 | Virtual Stage & Registration Setup | 5 | ACT-2030 (FS) | 03-Oct-26 | 07-Oct-26 | 03-Oct-26 | 07-Oct-26 | 0 d | **YES [CRITICAL]** |
| **ACT-4020** | 4.2 | AV Technical Rider & Lavalier Bench Test | 3 | ACT-4010 (FS) | 08-Oct-26 | 10-Oct-26 | 08-Oct-26 | 10-Oct-26 | 0 d | **YES [CRITICAL]** |
| **ACT-2040** | 2.4 | Dry-Run Rehearsals with International Speakers | 4 | ACT-4020 (FS) | 11-Oct-26 | 14-Oct-26 | 11-Oct-26 | 14-Oct-26 | 0 d | **YES [CRITICAL]** |
| **ACT-5010** | 5.1 | Final Stage Dress Rehearsal & Buffer Test | 2 | ACT-2040 (FS) | 15-Oct-26 | 16-Oct-26 | 15-Oct-26 | 16-Oct-26 | 0 d | **YES [CRITICAL]** |
| **ACT-5020** | 5.2 | SYMPOSIUM LIVE STAGE TRANSMISSION | 1 | ACT-5010 (FS) | 18-Nov-26 | 18-Nov-26 | 18-Nov-26 | 18-Nov-26 | 0 d | **YES [MILESTONE]** |
| **ACT-6010** | 6.1 | Master Video Cutdown & YouTube Release | 5 | ACT-5020 (FS) | 19-Nov-26 | 23-Nov-26 | 19-Nov-26 | 23-Nov-26 | 0 d | **YES [CRITICAL]** |
| **ACT-6020** | 6.2 | Post-Summit Impact Report & Closeout | 2 | ACT-6010 (FS) | 24-Nov-26 | 25-Nov-26 | 24-Nov-26 | 25-Nov-26 | 0 d | **YES [CLOSEOUT]** |

---

## 4. RESPONSIBILITY ASSIGNMENT MATRIX (RACI)

```
LEGEND:
R = Responsible (Completes the actual work)
A = Accountable (Final operational sign-off and ownership)
C = Consulted (Provides two-way input and expertise)
I = Informed (Kept updated on progress and results)
```

| WBS Element | Alex Morgan (Lead VA / Controls) | Executive Principal (Principal Sponsor) | External AV & Media Crew | Speaker & Delegate Leads |
|---|:---:|:---:|:---:|:---:|
| **1.0 Governance & Scheduling** | **A / R** | **C / I** | I | I |
| **2.0 Speaker Curation & Dossiers** | **R** | **A** | I | C |
| **3.0 Graphic & Video Media** | **A / R** | **C** | C | I |
| **4.0 AV Tech Rider & Live Testing** | **A** | **I** | **R** | C |
| **5.0 Live Stage & Timekeeping** | **A / R** | **C** | R | C |
| **6.0 Post-Summit Synthesis** | **A / R** | **A** | I | I |

---

## 5. EARNED VALUE MANAGEMENT (EVM) PERFORMANCE AUDIT

*Performance metrics audited at Day 50 of the 75-Day schedule:*

```
┌────────────────────────────────────────────────────────┐
│ EARNED VALUE AUDIT SUMMARY (CURRENCY: GBP £)           │
├──────────────────────────────────────┬─────────────────┤
│ Planned Value (PV)                   │ £48,500.00      │
│ Earned Value (EV)                    │ £50,440.00      │
│ Actual Cost (AC)                     │ £47,200.00      │
├──────────────────────────────────────┼─────────────────┤
│ Schedule Variance (SV = EV - PV)     │ +£1,940.00      │
│ Cost Variance (CV = EV - AC)         │ +£3,240.00      │
├──────────────────────────────────────┼─────────────────┤
│ Schedule Performance Index (SPI)     │ 1.04 (Ahead)    │
│ Cost Performance Index (CPI)         │ 1.07 (Under)    │
└──────────────────────────────────────┴─────────────────┘
```

### Analysis & Executive Interpretation:
* **SPI = 1.04:** The symposium operational schedule is running **4% ahead of baseline velocity**, driven by automated Asana task dependencies and prompt-engineered AI drafting for speaker dossiers.
* **CPI = 1.07:** Every £1.00 spent has delivered **£1.07 worth of completed deliverables**, achieved by eliminating external agency outsourcing for video editing and graphic collateral.
* **Estimate at Completion (EAC):** Projected to complete £3,170 below total authorized budget.

---

## 6. SCHEDULE RISK REGISTER & FLOAT DEFENSE CONTROLS

```
┌──────────┬──────────────────────┬─────────┬──────────────────────────────────────────┐
│ Risk ID  │ Threat Event         │ Pre-Mit │ Schedule Mitigation & Defense Strategy   │
├──────────┼──────────────────────┼─────────┼──────────────────────────────────────────┤
│ RSK-01   │ Keynote Speaker Late │ Med /   │ 4-day buffer before final dress rehearsal;│
│          │ Bio Submission       │ High    │ AI pre-compiled bio draft dispatched.   │
├──────────┼──────────────────────┼─────────┼──────────────────────────────────────────┤
│ RSK-02   │ Stage Internet Drop  │ Low /   │ Dual bonded 5G cellular failover router; │
│          │ (Virtual Stage)      │ High    │ Offline local recording running in parallel.│
├──────────┼──────────────────────┼─────────┼──────────────────────────────────────────┤
│ RSK-03   │ Presentation Slide   │ Med /   │ Strict 48-hour pre-summit deadline;      │
│          │ Formatting Error     │ Low     │ Standardized 16:9 master template lock.  │
└──────────┴──────────────────────┴─────────┴──────────────────────────────────────────┘
```

*Project Controls Master Specification compiled and managed by Alex Morgan · Operations Lead*
