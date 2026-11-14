# Executive Operations & Digital Media Portfolio Hub (Starter Template)

A modern, production-grade portfolio and operations hub for **Executive Virtual Assistants, Operations Partners, and Project Coordinators**. Built with React 19, TypeScript, and Tailwind CSS, featuring an architectural dark-mode design, interactive executive document viewer, multi-channel distribution schedule, and an integrated autonomous job-hunting engine.

---

## Features & Architecture

### 1. Client-Facing Portfolio (`/`)
- **00 · Roles & Specializations:** High-level summary of operational disciplines, timezones, and tools.
- **01 · Executive Documents & Tools:** Interactive viewer for sample executive deliverables (Briefing Memos, Travel Dossiers, YouTube SOPs, Project Master Schedules) with multi-format downloads (Notion HTML, Canva HTML, Asana CSV, Markdown).
- **02 · Visual Media & Video Reels:** Category-filtered creative design showcase (event posters, campaign flyers, carousels) alongside embedded high-retention video reels with custom playback controls.
- **03 · Publishing Cadence:** Read-only weekly distribution schedule across YouTube, Instagram, and Telegram.
- **04 · Client Milestones:** Transparent ledger of major operational workstreams and completion statuses.
- **05 · Experience & Credentials:** Verified work history, professional certifications, and client testimonials.
- **06 · Direct Contact:** Integrated brief intake form with automated FormSubmit delivery and one-click WhatsApp routing.

### 2. Autonomous Job Finder & Application Suite (`tools/job-finder/`)
- **Multi-Source Remote Job Aggregation:** Aggregates remote listings from WeWorkRemotely, Himalayas, Jobicy, Remotive, and Adzuna.
- **Scoring & CV Routing Engine:** Automatically parses job requirements, scores them against your weighted skills profile (`profile.json`), and tags each role with the optimal CV (e.g. *Executive VA* vs. *Marketing & Admin*).
- **Antigravity Browser Automation:** Automated application workflow using Chrome DevTools with safety checks, auto-submit ceilings, and mobile push notifications via ntfy.

---

## Quick Start & Customization

### 1. Personalize Profile Information
All personal details (name, title, contact email, WhatsApp, GitHub, LinkedIn, avatar) are centralized in a single configuration file:

```typescript
// src/config/profile.ts
export const PROFILE = {
  fullName: 'Your Name',
  firstName: 'Your First Name',
  lastName: 'Your Last Name',
  title: 'Executive Virtual Assistant & Operations Partner',
  location: 'Global Remote',
  email: 'your.email@example.com',
  phoneDisplay: '+1 (555) 000-0000',
  whatsappUrl: 'https://wa.me/15550000000',
  githubUrl: 'https://github.com/your-username',
  avatarUrl: '/assets/profile-portrait.jpg',
  // ...
};
```

### 2. Customize Portfolio Content
- **Avatar & OpenGraph Image:** Replace `public/assets/profile-portrait.jpg` and `public/og-image.jpg` with your own headshot and social banner.
- **Work Experience & Credentials:** Edit `src/data/background.ts`.
- **Media & Publishing Schedule:** Edit `src/utils/portfolioLogic.ts` and add assets to `public/assets/`.
- **Sample Deliverables:** Edit `src/data/executiveDocuments.ts` and source files in `public/documents/`.

### 3. Configure the Job Finder Engine (Optional)
1. Copy `tools/job-finder/data/applicant.example.md` to `tools/job-finder/data/applicant.md` and enter your facts and rate floor.
2. Edit `tools/job-finder/profile.json` to configure target job titles, keywords, and skill weights.
3. Configure your mobile push notifications by setting your private channel in `tools/job-finder/data/ntfy-topic.txt`.

---

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server (http://localhost:3000)
npm run dev

# Run unit tests
npm test

# Type-check TypeScript
npm run lint

# Compile production build
npm run build
```

---

## Deployment

### Cloudflare Pages (Recommended)
1. Push this repository to GitHub.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repository:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
4. Deploy! Single-page app routing works out-of-the-box.

### Vercel / Netlify
Configuration is pre-bundled in `vercel.json`. Connect the repository to Vercel or Netlify and trigger an instant deployment.

---

## Tech Stack
- **Framework:** React 19 · TypeScript · Vite 8
- **Styling:** Tailwind CSS v4 · DM Serif Display, Plus Jakarta Sans, DM Mono
- **Icons:** Lucide React
- **Automation:** Node.js 22 · PowerShell · Antigravity AI Agent Toolkit

---

## License
Apache-2.0
