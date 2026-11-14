/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Download,
  Eye,
  FileSpreadsheet,
  Film,
  Filter,
  Layers,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
  Play,
  Pause,
  Send,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Video,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  Share2,
  ExternalLink,
  ShieldAlert,
  Briefcase,
  Inbox,
  Plane,
  FileText,
  CheckSquare,
  ShieldCheck,
  MessageCircle,
  UserCheck,
  Menu,
  Github,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  filterCalendarSlots,
  filterMilestoneRecords,
  MEDIA_CATEGORIES,
  MILESTONE_STATUSES,
  type VisualMediaItem,
  type CalendarSlot,
  type DistributionChannel,
  type DistributionStatus,
  type MilestoneStatus,
} from '../utils/portfolioLogic';
import { Ticker } from './ui/Ticker';
import { ArchitecturalBadge } from './ui/ArchitecturalBadge';
import { ExecutiveDocumentViewer } from './ExecutiveDocumentViewer';
import { EXECUTIVE_DOCUMENTS, SAMPLE_DOCUMENT_NOTICE } from '../data/executiveDocuments';
import { EXPERIENCE, CREDENTIALS, TESTIMONIAL } from '../data/background';
import { PROFILE } from '../config/profile';

// Contact details live in src/config/profile.ts; update them there.
const CONTACT_EMAIL = PROFILE.email;
const WHATSAPP_NUMBER = PROFILE.phoneRaw;
const WHATSAPP_DISPLAY = PROFILE.phoneDisplay;
const WHATSAPP_URL = PROFILE.whatsappUrl;
const WHATSAPP_INTRO_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  `Hi ${PROFILE.firstName}, I reviewed your Executive Virtual Assistant portfolio and would like to discuss a role.`
)}`;
const GITHUB_URL = PROFILE.githubUrl;

const NAV_SECTIONS = [
  { id: 'roles', num: '00', label: 'Roles', title: 'Roles & Specializations' },
  { id: 'va-systems', num: '01', label: 'Documents', title: 'Executive Documents & Tools' },
  { id: 'media-delivery', num: '02', label: 'Creative', title: 'Visual Media & 9:16 Video Reels' },
  { id: 'editorial-systems', num: '03', label: 'Schedule', title: 'A Typical Publishing Week' },
  { id: 'milestone-tracker', num: '04', label: 'Milestones', title: 'Client Workstreams & Milestones' },
  { id: 'background', num: '05', label: 'Experience', title: 'Experience & Credentials' },
  { id: 'contact-direct', num: '06', label: 'Contact', title: 'Direct Contact' },
];

const DAY_NAMES: Record<CalendarSlot['day'], string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const CHANNEL_BADGE: Record<DistributionChannel, string> = {
  Telegram: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  Instagram: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  YouTube: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
};

const SLOT_STATUS_BADGE: Record<DistributionStatus, string> = {
  Published: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
  Scheduled: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  Ready: 'text-accent border-accent/40 bg-accent/10',
};

const MILESTONE_STATUS_BADGE: Record<MilestoneStatus, string> = {
  Ongoing: 'text-sky-400 border-sky-400/40 bg-sky-400/10',
  Completed: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
};

interface PublicHubProps {
  onNavigate: (path: string) => void;
}

export default function PublicHub({ onNavigate }: PublicHubProps) {
  const { visualMedia, videoReels, calendarSlots, milestones } = usePortfolio();

  // Visual Media Filter State
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('All');
  const [selectedMediaItem, setSelectedMediaItem] = useState<VisualMediaItem | null>(null);

  // Executive Document Viewer State
  const [isDocViewerOpen, setIsDocViewerOpen] = useState<boolean>(false);
  const [activeDocId, setActiveDocId] = useState<string>('doc-01-briefing-memo');

  const openDoc = (docId: string) => {
    setActiveDocId(docId);
    setIsDocViewerOpen(true);
  };

  // Video Reel Interactive Play State
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [mutedReelIds, setMutedReelIds] = useState<Record<string, boolean>>({});
  const [reelProgressMap, setReelProgressMap] = useState<Record<string, number>>({});

  // Ticker for active playing reel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeReelId) {
      interval = setInterval(() => {
        setReelProgressMap((prev) => {
          const current = prev[activeReelId] || 15;
          return {
            ...prev,
            [activeReelId]: current >= 100 ? 0 : current + 2,
          };
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [activeReelId]);

  const toggleReelPlayback = (reelId: string) => {
    setActiveReelId((prev) => (prev === reelId ? null : reelId));
  };

  const toggleReelMute = (reelId: string) => {
    setMutedReelIds((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  // Calendar State
  const [channelFilter, setChannelFilter] = useState<'All' | DistributionChannel>('All');
  // Milestone State
  const [milestoneStatusFilter, setMilestoneStatusFilter] = useState<'All' | MilestoneStatus>('All');
  // Contact State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactScope, setContactScope] = useState('Operations & Digital Media Support');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactDelivery, setContactDelivery] = useState<'sent' | 'mailto'>('mailto');

  // Derived Filtered Data
  const filteredMediaItems = useMemo(() => {
    if (mediaCategoryFilter === 'All') return visualMedia;
    return visualMedia.filter((item) => item.category === mediaCategoryFilter);
  }, [mediaCategoryFilter, visualMedia]);

  const filteredSlots = useMemo(
    () => filterCalendarSlots(calendarSlots, channelFilter, 'All'),
    [calendarSlots, channelFilter]
  );

  const filteredMilestones = useMemo(
    () => filterMilestoneRecords(milestones, '', 'All', milestoneStatusFilter),
    [milestones, milestoneStatusFilter]
  );

  // Handlers
  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT_EMAIL).catch(() => { });
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const briefText = () =>
    [
      `Name / Title: ${contactName.trim()}`,
      `Reply-to Email: ${contactEmail.trim() || 'Not provided'}`,
      `Company / Organization: ${contactOrg.trim() || 'Not provided'}`,
      `Mandate Scope: ${contactScope.trim() || 'Not provided'}`,
      '',
      contactMessage.trim(),
    ].join('\n');

  const handleSendBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) {
      setContactError('Please provide your name and a brief overview of your operational or media requirements.');
      return;
    }
    setContactError('');

    // Deliver the brief straight to the inbox via FormSubmit (no account needed;
    // the first submission emails CONTACT_EMAIL a one-time activation link).
    setContactSending(true);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          organization: contactOrg.trim(),
          scope: contactScope.trim(),
          message: contactMessage.trim(),
          _subject: `Portfolio brief from ${contactName.trim()}`,
          _replyto: contactEmail.trim(),
          _template: 'table',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true') {
        throw new Error(data.message || `FormSubmit responded ${res.status}`);
      }
      setContactDelivery('sent');
      setContactSubmitted(true);
      return;
    } catch {
      // Fall through to the email-app handoff so the brief is never lost.
    } finally {
      setContactSending(false);
    }

    const subject = `Portfolio brief from ${contactName.trim()}${contactOrg.trim() ? ` (${contactOrg.trim()})` : ''}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText())}`;
    setContactDelivery('mailto');
    setContactSubmitted(true);
  };

  // Fixed Navbar Scroll Spy & Active Section State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('roles');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const sectionIds = NAV_SECTIONS.map((sec) => sec.id);

      const navOffset = 140;
      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            currentSection = id;
          }
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        currentSection = 'contact-direct';
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      // Desktop has no top bar; mobile keeps a sticky one.
      const navHeight = window.innerWidth >= 1024 ? 32 : 64;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - navHeight);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  // Pointer-following spotlight, written straight to CSS vars to avoid re-renders.
  const spotlightRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = spotlightRef.current;
      if (!el) return;
      el.style.setProperty('--sx', `${e.clientX}px`);
      el.style.setProperty('--sy', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setActiveSection('roles');
    window.history.pushState(null, '', '#top');
  };

  return (
    <div className="theme-split relative min-h-screen font-sans overflow-x-clip w-full max-w-full">
      {/* Soft spotlight that follows the pointer (desktop only) */}
      <div ref={spotlightRef} className="spotlight pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden="true" />

      {/* ─────────────────────────────────────────
          MOBILE TOP BAR (below lg)
      ───────────────────────────────────────── */}
      <nav
        aria-label="Section Navigation"
        className={`lg:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-xl transition-shadow ${isScrolled
          ? 'bg-[var(--bg)]/90 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.9)]'
          : 'bg-[var(--bg)]/70'
          }`}
      >
        <a href="#top" onClick={handleLogoClick} className={`flex flex-col no-underline min-w-0 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--heading)] whitespace-nowrap">
            {PROFILE.fullName}
          </span>
          <span className="text-[11px] text-[var(--muted)] whitespace-nowrap">
            Executive VA &amp; Operations
          </span>
        </a>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setContactSubmitted(false);
              setIsContactModalOpen(true);
            }}
            className="btn-main text-[11px] py-2 px-3 whitespace-nowrap cursor-pointer"
          >
            <span>Hire {PROFILE.firstName}</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--dim2)] text-[var(--heading)] hover:border-accent transition-colors cursor-pointer"
            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {isMobileNavOpen && (
          <ul
            id="mobile-nav"
            className="absolute top-full left-0 right-0 list-none m-0 px-6 py-4 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--dim2)] grid grid-cols-1 sm:grid-cols-2 gap-1"
          >
            {NAV_SECTIONS.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => {
                    handleNavClick(e, sec.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`side-nav-link py-2 ${activeSection === sec.id ? 'active' : ''}`}
                >
                  <span className="side-nav-line" aria-hidden="true" />
                  <span>{sec.label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 md:px-12 lg:px-16 lg:flex lg:justify-between lg:gap-12 xl:gap-16">
        {/* ─────────────────────────────────────────
            LEFT PANEL (fixed on desktop)
        ───────────────────────────────────────── */}
        <aside className="pt-10 pb-2 lg:flex lg:sticky lg:top-0 lg:max-h-screen lg:w-[32%] xl:w-[30%] lg:shrink-0 lg:flex-col lg:justify-between lg:py-24">
          <div>
            <a href="#top" onClick={handleLogoClick} className="no-underline">
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-[var(--heading)] hover:text-accent transition-colors">
                {PROFILE.fullName}
              </h1>
            </a>
            <h2 className="mt-3 text-lg xl:text-xl font-medium tracking-tight text-[var(--heading)]">
              Executive VA &amp; Operations
            </h2>
            <p className="mt-4 max-w-xs leading-relaxed text-[var(--muted)]">
              Over five years of remote executive support. Every detail handled.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5" />
              <span>{PROFILE.location}</span>
            </div>

            <nav aria-label="Main Navigation" className="hidden lg:block mt-14">
              <ul className="list-none m-0 p-0 w-max">
                {NAV_SECTIONS.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      onClick={(e) => handleNavClick(e, sec.id)}
                      className={`side-nav-link py-2.5 ${activeSection === sec.id ? 'active' : ''}`}
                      title={`${sec.num} · ${sec.title}`}
                    >
                      <span className="side-nav-line" aria-hidden="true" />
                      <span>{sec.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-8 lg:mt-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
              Get in touch
            </div>
            <div className="flex items-center gap-4 lg:mb-6">
              <a href={`mailto:${CONTACT_EMAIL}`} className="social-icon" title={CONTACT_EMAIL} aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
              <a href={WHATSAPP_INTRO_URL} target="_blank" rel="noopener noreferrer" className="social-icon" title="Chat directly on WhatsApp" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
            {/* On mobile the sticky top bar already carries this button */}
            <div className="hidden lg:block">
              <button
                type="button"
                onClick={() => {
                  setContactSubmitted(false);
                  setIsContactModalOpen(true);
                }}
                className="btn-main cursor-pointer"
              >
                <span>Hire {PROFILE.firstName}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* ─────────────────────────────────────────
            RIGHT COLUMN (scrolling content)
        ───────────────────────────────────────── */}
        <main className="min-w-0 lg:flex-1 lg:py-12">

      {/* ─────────────────────────────────────────
          HERO SECTION (Architectural Layout)
      ───────────────────────────────────────── */}
      <header id="top" className="scroll-mt-16 lg:scroll-mt-8 relative pt-12 pb-8">
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8 2xl:gap-10 items-start">
          {/* Left Hero Column */}
          <div className="2xl:col-span-7 flex flex-col">
            <div className="sec-label mb-2.5 flex items-center gap-2">
              <span>EXECUTIVE VIRTUAL ASSISTANT &amp; OPERATIONS PARTNER</span>
            </div>

            <h2 className="mb-4 space-y-0.5">
              <span className="hl hl-1">Executive Virtual Assistant</span>
              <span className="hl hl-2">&amp; Operations Partner</span>
              <span className="hl hl-4">For Founders &amp; Busy Executives.</span>
            </h2>

            <p className="font-editorial text-lg sm:text-xl text-white/95 leading-snug mb-2.5 max-w-[58ch]">
              Over five years as a remote executive and media assistant — diary, inbox, travel, events, and a YouTube channel, end to end.
            </p>

            <p className="font-mono-clean text-xs sm:text-[13px] text-[var(--muted)] leading-relaxed max-w-[64ch] mb-5">
              For founders, creators and busy executives who want one reliable person handling the details. I combine careful administrative work (diary management across timezones, inbox triage, travel planning and event logistics) with AI-assisted drafting (Claude, ChatGPT, Gemini) and automations I build myself, so routine admin runs faster and nothing slips.
            </p>

            {/* Stack Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="chip hi">Multi-Timezone Diaries (GMT · ET · WAT)</span>
              <span className="chip hi">Executive Inbox &amp; Confidential Triage</span>
              <span className="chip hi">AI-Assisted Drafting (Claude · GPT · Gemini)</span>
              <span className="chip hi">Workflow Automation &amp; Custom Tools</span>
              <span className="chip hi">YouTube Media Engine &amp; 9:16 Video Reels</span>
            </div>

          </div>

          {/* Right Hero Column: Architectural Element Tile & Impact Strip */}
          <div className="2xl:col-span-5 flex flex-col items-start md:flex-row md:items-start gap-4 2xl:flex-col">
            <div className="element-tile w-full max-w-[380px]">
              <div className="el-corner tl" />
              <div className="el-corner tr" />
              <div className="el-corner bl" />
              <div className="el-corner br" />

              <div className="relative aspect-[4/3] mt-1 mb-4 overflow-hidden border border-[var(--dim2)] bg-black">
                <img
                  src={PROFILE.avatarUrl}
                  alt={PROFILE.fullName}
                  width={640}
                  height={800}
                  className="w-full h-full object-cover object-[50%_22%]"
                />
              </div>
              <div className="el-name">{PROFILE.fullName}</div>
              <div className="font-mono-clean text-[9px] uppercase tracking-wider text-accent mb-3">
                Executive Virtual Assistant &amp; Operations Partner
              </div>

              <div className="el-divider" />

              <div className="el-data">
                <div className="el-row">
                  <span>Role</span>
                  <span className="va">Executive Virtual Assistant (EVA)</span>
                </div>
                <div className="el-row">
                  <span>Timezones</span>
                  <span className="va">GMT/BST · US Eastern · WAT</span>
                </div>
                <div className="el-row">
                  <span>Core Stack</span>
                  <span>Notion · Asana · Google Workspace</span>
                </div>
                <div className="el-row">
                  <span>AI &amp; Automation</span>
                  <span className="va">Claude · ChatGPT · Custom Scripts</span>
                </div>
                <div className="el-row">
                  <span>Turnaround</span>
                  <span className="va">Same-Day on Routine Requests</span>
                </div>
                <div className="el-row">
                  <span>Availability</span>
                  <span>Open to Remote Roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Infinite Ticker Ribbon */}
      <Ticker />

      {/* ─────────────────────────────────────────
          SECTION 00: TARGET ROLES & CAPABILITIES
      ───────────────────────────────────────── */}
      <section id="roles" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24">
        <div className="sec-label">
          <span>00 / EXECUTIVE VA SPECIALIZATIONS &amp; ARCHETYPES</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mb-3">
              Core Specializations &amp; <em className="text-accent not-italic">Executive VA Competencies</em>
            </h2>
            <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
              Skills built over five years of executive support: inbox and diary management, project tracking, event logistics, video and design work, and the automations that keep it all running smoothly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="arch-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono-clean text-[9px] uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" />
                <span>Specialization 01</span>
              </div>
              <h3 className="font-editorial text-xl text-white mb-2 leading-snug">
                Executive Virtual Assistant &amp; Right Hand
              </h3>
              <p className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed mb-4">
                Over five years handling confidential day-to-day affairs for an executive client. Diary management across international timezones, inbox triage, follow-ups, and meeting briefs prepared ahead of time.
              </p>
            </div>
            <div className="font-mono-clean text-[9px] uppercase tracking-wider text-white/80 border-t border-[var(--dim1)] pt-3 flex items-center justify-between">
              <span>Tools: Google Workspace · Zoom</span>
              <button
                type="button"
                onClick={() => openDoc('doc-01-briefing-memo')}
                className="text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Memo ↗</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="arch-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono-clean text-[9px] uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3 h-3" />
                <span>Specialization 02</span>
              </div>
              <h3 className="font-editorial text-xl text-white mb-2 leading-snug">
                Operations, Project Tracking &amp; AI
              </h3>
              <p className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed mb-4">
                Projects planned in Asana and Notion with clear owners, dependencies and deadlines. Contact lists and databases kept accurate through regular audits. AI tools (Claude, ChatGPT, Gemini) used for fast research, meeting summaries and first drafts, always reviewed before anything goes out.
              </p>
            </div>
            <div className="font-mono-clean text-[9px] uppercase tracking-wider text-white/80 border-t border-[var(--dim1)] pt-3 flex items-center justify-between">
              <span>Tools: Asana · Notion · HubSpot CRM · Google Sheets</span>
              <button
                type="button"
                onClick={() => openDoc('doc-04-project-controls')}
                className="text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Asana Project &amp; WBS Spec ↗</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="arch-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono-clean text-[9px] uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
                <Film className="w-3 h-3" />
                <span>Specialization 03</span>
              </div>
              <h3 className="font-editorial text-xl text-white mb-2 leading-snug">
                Creative &amp; Digital Media
              </h3>
              <p className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed mb-4">
                Creative work handled in-house, without outsourcing: 9:16 vertical reels with word-by-word captions, audio levelling (-14 LUFS), voice clips, event flyers, and presentation decks.
              </p>
            </div>
            <div className="font-mono-clean text-[9px] uppercase tracking-wider text-white/80 border-t border-[var(--dim1)] pt-3">
              Tools: CapCut · Premiere Pro · Canva · Figma · Adobe Audition
            </div>
          </div>

          {/* Card 4 */}
          <div className="arch-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono-clean text-[9px] uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
                <Share2 className="w-3 h-3" />
                <span>Specialization 04</span>
              </div>
              <h3 className="font-editorial text-xl text-white mb-2 leading-snug">
                Events &amp; Content Distribution
              </h3>
              <p className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed mb-4">
                Virtual event and symposium support: speaker run-of-shows, attendee lists, YouTube publishing with descriptions and timestamps, and a steady weekly posting schedule across channels.
              </p>
            </div>
            <div className="font-mono-clean text-[9px] uppercase tracking-wider text-white/80 border-t border-[var(--dim1)] pt-3">
              Tools: YouTube Studio · Meta Business · Telegram · Mailchimp · Eventbrite
            </div>
          </div>

          {/* Card 5: Systems & Automation (full width) */}
          <div className="arch-card p-6 md:col-span-2 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            <div className="xl:col-span-8">
              <div className="font-mono-clean text-[9px] uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Specialization 05</span>
              </div>
              <h3 className="font-editorial text-xl text-white mb-2 leading-snug">
                Systems &amp; Automation — Less Manual Admin, Fewer Things That Slip
              </h3>
              <p className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed">
                I build the tools behind the work: automated scheduling and reminder flows, Notion and Asana dashboards, inbox rules, spreadsheet scripts, and AI-assisted drafting set up around how you already work. Repetitive tasks get automated, so more of my time goes to your priorities.
              </p>
            </div>
            <div className="xl:col-span-4 font-mono-clean text-[10px] text-white/80 space-y-2 xl:border-l xl:border-[var(--dim1)] xl:pl-6">
              <div className="uppercase tracking-wider text-[9px] text-[var(--muted)]">Tools</div>
              <div>JavaScript / TypeScript · Google Apps Script · Notion &amp; Asana APIs · AI APIs</div>
              <div className="uppercase tracking-wider text-[9px] text-[var(--muted)] pt-2">Built</div>
              <div>A private automation that mirrors new Instagram posts to X, hands-free</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SECTION 01: EXECUTIVE VA OPERATING SYSTEM (EVA-OS)
      ───────────────────────────────────────── */}
      <section id="va-systems" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24">
        <div className="sec-label">
          <span>01 / EXECUTIVE DOCUMENTS &amp; TOOLS USED</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mb-2">
              Executive Documents &amp; <em className="text-accent not-italic">Tools Used</em>
            </h2>
            <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)]">
              Turnkey operational documents created with enterprise tools, ready for direct workspace import.
            </p>
            <p className="font-mono-clean text-[11px] text-amber-300/90 mt-2 max-w-2xl">
              {SAMPLE_DOCUMENT_NOTICE}
            </p>
          </div>
          <div className="font-mono-clean text-xs text-[var(--muted)]">
            <span className="text-emerald-400 font-semibold">{EXECUTIVE_DOCUMENTS.length} Documents</span> · Tool-Native Exports Ready
          </div>
        </div>

        {/* Clean, Simple List of Documents & Tools Used (No Writeups) */}
        <div className="space-y-3 font-mono-clean text-xs">
          {EXECUTIVE_DOCUMENTS.map((doc, idx) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 border border-[var(--dim1)] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent/50 transition-all grid grid-cols-1 xl:grid-cols-12 gap-4 items-start xl:items-center rounded-lg"
            >
              {/* Left Column: Index, Ref Code & Title (5 cols) */}
              <div className="xl:col-span-5 flex items-start gap-3 sm:gap-4 min-w-0">
                <span className="font-mono-clean text-xs text-accent font-bold shrink-0 bg-accent/10 rounded-md px-2.5 py-1">
                  0{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold whitespace-nowrap">
                      {doc.refCode}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/70 whitespace-nowrap">
                      {doc.category}
                    </span>
                  </div>
                  <h3 className="font-editorial text-base sm:text-lg lg:text-xl text-white leading-snug">
                    {doc.title}
                  </h3>
                </div>
              </div>

              {/* Middle Column: Tools Used (Badges) (4 cols) */}
              <div className="xl:col-span-4 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Tools Used:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {doc.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="pill"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Quick Action Buttons (3 cols) */}
              <div className="xl:col-span-3 flex flex-wrap items-center justify-start xl:justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openDoc(doc.id)}
                  className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer text-accent border-accent/30 hover:border-accent"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                {doc.exportFiles.length > 0 && (
                  <a
                    href={doc.exportFiles[0].url}
                    download
                    className="btn-main text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                    title={`Export ${doc.exportFiles[0].label}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export {doc.exportFiles[0].toolName}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SECTION 02: CREATIVE & VIDEO PRODUCTION
      ───────────────────────────────────────── */}
      <section id="media-delivery" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24">
        <div className="sec-label">
          <span>02 / HIGH-RESOLUTION CREATIVE &amp; VIDEO PRODUCTION</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mb-3">
              High-Impact Creative Assets &amp; <em className="text-accent not-italic">Video Production</em>
            </h2>
            <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
              Design and video work produced for my client's events, broadcasts and community channels—from conference posters and educational carousels to captioned vertical reels.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', ...MEDIA_CATEGORIES.filter((c) => visualMedia.some((item) => item.category === c))].map((cat) => {
              const active = mediaCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMediaCategoryFilter(cat)}
                  className={`chip ${active ? 'hi' : ''} cursor-pointer`}
                >
                  {cat === 'All' ? 'All Deliverables' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. VISUAL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
          {filteredMediaItems.map((item) => (
            <div
              key={item.id}
              className="arch-card flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedMediaItem(item)}
            >
              <div>
                {/* Visual Image Container with Corner Brackets */}
                <div className="relative aspect-[4/5] bg-black rounded-md border border-[var(--dim2)] overflow-hidden mb-4">
                  <div className="el-corner tl" />
                  <div className="el-corner tr" />
                  <div className="el-corner bl" />
                  <div className="el-corner br" />

                  {item.imageSrc ? (
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full p-4 flex flex-col justify-between"
                      style={{ backgroundColor: item.palette?.bg || '#0a0a0a' }}
                    >
                      <span className="font-mono-clean text-[10px] text-accent">
                        {item.aspectLabel}
                      </span>
                      <p className="font-editorial text-sm text-white">{item.title}</p>
                      <span className="font-mono-clean text-[9px] text-[var(--muted)]">
                        {item.dimensions}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs border border-white/10 px-2 py-0.5 font-mono-clean text-[9px] uppercase tracking-wider text-white">
                    {item.category}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="btn-ghost text-[10px] py-1.5 px-3">
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>Inspect Asset</span>
                    </span>
                  </div>
                </div>

                <div className="font-mono-clean text-[9px] uppercase tracking-[0.14em] text-accent mb-1">
                  {item.clientOrSeries}
                </div>
                <h3 className="font-editorial text-lg text-white group-hover:text-accent transition-colors leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="font-mono-clean text-xs text-[var(--muted)] line-clamp-2 mb-4">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--dim1)] flex items-center justify-between font-mono-clean text-[10px] text-[var(--muted)]">
                <span>{item.dimensions}</span>
                <span className="text-white">{item.turnaround || item.aspectLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. EMBEDDED SHORT-FORM VIDEO REELS */}
        <div className="pt-8 border-t border-[var(--dim1)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="sec-label mb-2">
                <span>02.1 / SHORT-FORM VIDEO PRODUCTION</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                Embedded <em className="text-accent not-italic">Short-Form Video Reels</em>
              </h3>
              <p className="font-mono-clean text-xs text-[var(--muted)] max-w-xl mt-1">
                Dynamic 9:16 vertical video engineered with kinetic word-by-word captions, synced background audio visualizers, and cross-channel distribution formatting.
              </p>
            </div>
            <div className="font-mono-clean text-xs text-[var(--muted)] border border-[var(--dim2)] px-3 py-1.5">
              High-Fidelity 9:16 Mobile Viewport
            </div>
          </div>

          {/* Verified Executive Client Showcase Banner */}
          <div className="mb-10 p-5 rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0 shadow-lg shadow-accent/10">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono-clean text-xs font-bold uppercase tracking-wider text-accent">
                    Production Portfolio: Executive Thought Leadership
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono-clean text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Client Deliverables
                  </span>
                </div>
                <p className="font-mono-clean text-xs text-white/80 max-w-2xl mt-1 leading-relaxed">
                  End-to-end digital media editing, kinetic subtitling, and multi-channel publication strategy for UK executive coaching and keynote broadcasts. Click any mobile viewport below to stream the live master reels.
                </p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@drnikeaddsvhaalu5280/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/15 hover:bg-accent/25 border border-accent/40 text-accent font-mono-clean text-xs font-bold transition-all shadow-sm shrink-0"
            >
              Explore Broadcast Channel <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {videoReels.map((reel) => {
              const isPlaying = activeReelId === reel.id;
              const isMuted = !!mutedReelIds[reel.id];
              const progress = reelProgressMap[reel.id] || 25;

              return (
                <div
                  key={reel.id}
                  className="arch-card p-6 flex flex-col items-center"
                >
                  {/* Smartphone Frame (9:16 Chassis) */}
                  <div className="relative w-[280px] h-[496px] bg-slate-950 rounded-[38px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-4 group">
                    {/* Top Island / Camera Notch */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 z-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
                    </div>

                    {/* Progress Bar at Top */}
                    <div className="relative z-30 w-full h-1 bg-white/20 rounded-full overflow-hidden mt-6">
                      <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${isPlaying ? progress : 30}%` }}
                      />
                    </div>

                    {/* Video Content: Live YouTube Embed or Fallback Video / Poster */}
                    {reel.youtubeId && isPlaying ? (
                      <div className="absolute inset-0 z-20 bg-black flex flex-col">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${reel.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&rel=0&modestbranding=1`}
                          title={reel.title}
                          className="w-full h-full object-cover border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                        <button
                          type="button"
                          onClick={() => toggleReelPlayback(reel.id)}
                          className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-black/85 hover:bg-black text-white flex items-center justify-center border border-white/20 text-xs cursor-pointer shadow-lg transition-transform hover:scale-105"
                          title="Close Stream"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : reel.videoUrl ? (
                      <video
                        src={reel.videoUrl}
                        poster={reel.posterUrl}
                        playsInline
                        loop
                        muted={isMuted}
                        className="absolute inset-0 w-full h-full object-cover"
                        ref={(el) => {
                          if (el) {
                            if (isPlaying && el.paused) {
                              el.play().catch(() => { });
                            } else if (!isPlaying && !el.paused) {
                              el.pause();
                            }
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--accent) 15%, transparent), rgba(0,0,0,0.92))${(() => { const poster = reel.posterUrl || (reel.youtubeId ? `https://img.youtube.com/vi/${reel.youtubeId}/hqdefault.jpg` : ''); return poster ? `, url('${poster}')` : ''; })()}`,
                          filter: isPlaying ? 'none' : 'brightness(80%)',
                        }}
                        onClick={() => toggleReelPlayback(reel.id)}
                      />
                    )}

                    {/* Audio Wave Visualizer (When Playing) */}
                    {isPlaying && !reel.youtubeId && (
                      <div className="absolute top-14 right-4 z-20 flex items-end gap-1 h-6">
                        <span className="w-1 bg-accent animate-pulse h-4" />
                        <span className="w-1 bg-accent animate-pulse h-6 delay-75" />
                        <span className="w-1 bg-accent animate-pulse h-3 delay-150" />
                        <span className="w-1 bg-accent animate-pulse h-5 delay-100" />
                      </div>
                    )}

                    {/* Center Kinetic Caption Overlay (When not playing YouTube) */}
                    {(!reel.youtubeId || !isPlaying) && (
                      <div
                        className="relative z-10 my-auto text-center px-4 cursor-pointer"
                        onClick={() => toggleReelPlayback(reel.id)}
                      >
                        <div className="font-mono-clean text-[10px] text-accent uppercase tracking-wider mb-2 font-bold">
                          {reel.badgeLabel}
                        </div>
                        <p className="font-editorial text-base sm:text-lg text-white font-bold drop-shadow-md leading-snug">
                          {reel.captionPreview}
                        </p>
                        <div className="mt-3 inline-block bg-black/70 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono-clean text-white/90">
                          {reel.retentionMetric}
                        </div>
                      </div>
                    )}

                    {/* Bottom Controls inside Phone (When not playing YouTube) */}
                    {(!reel.youtubeId || !isPlaying) && (
                      <div className="relative z-10 space-y-2">
                        <div className="flex items-center justify-between text-xs text-white/90">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleReelPlayback(reel.id)}
                              className="w-9 h-9 rounded-full bg-accent text-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-accent/25"
                              title="Play Video Stream"
                            >
                              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReelMute(reel.id)}
                              className="w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black/90 transition-colors"
                              title={isMuted ? 'Unmute' : 'Mute'}
                            >
                              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono-clean text-[11px] text-white/80 bg-black/60 px-2 py-0.5 rounded">
                              {reel.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Caption & Metadata Outside Phone */}
                  <div className="mt-6 text-center space-y-2 max-w-sm flex flex-col items-center">
                    <span className="font-mono-clean text-[10px] text-accent uppercase tracking-wider px-2 py-0.5 rounded border border-accent/30 bg-accent/5">
                      {reel.clientOrSeries}
                    </span>
                    <h4 className="font-editorial text-lg text-white font-medium">{reel.title}</h4>
                    <p className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed">
                      {reel.summary}
                    </p>
                    <div className="font-mono-clean text-[11px] text-[var(--muted)] pt-1 flex flex-wrap items-center justify-center gap-2">
                      <span className="text-white/80">{reel.tools.join(', ')}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold">{reel.turnaround}</span>
                    </div>

                    {reel.youtubeId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${reel.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono-clean text-accent hover:underline pt-1 group/yt"
                      >
                        <span>Verify on YouTube</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/yt:translate-x-0.5 group-hover/yt:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SECTION 03: EDITORIAL & CONTENT SYSTEMS
      ───────────────────────────────────────── */}
      <section id="editorial-systems" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24">
        <div className="sec-label">
          <span>03 / EDITORIAL BROADCAST &amp; CONTENT SYSTEMS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mb-3">
              A Typical Publishing <em className="text-accent not-italic">Week</em>
            </h2>
            <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
              How a week of content runs across Telegram, Instagram and YouTube, with each post tracked from Ready ➔ Scheduled ➔ Published. Statuses shown as of Wednesday morning.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Telegram', 'Instagram', 'YouTube'] as const).map((chan) => (
              <button
                key={chan}
                type="button"
                onClick={() => setChannelFilter(chan)}
                className={`chip ${channelFilter === chan ? 'hi' : ''} cursor-pointer`}
              >
                {chan}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Architectural Editorial Table */}
        <div className="hidden md:block rounded-lg border border-[var(--dim2)] bg-white/[0.01] overflow-x-auto">
          <table className="w-full text-left font-mono-clean text-xs">
            <thead className="border-b border-[var(--dim2)] bg-white/[0.02] text-[var(--muted)] text-[9px] uppercase tracking-[0.16em]">
              <tr>
                <th className="py-3 px-4">Day &amp; Time</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Title &amp; Reference</th>
                <th className="py-3 px-4">Caption Outline</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dim1)]">
              {filteredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-white font-medium">{DAY_NAMES[slot.day]}</div>
                    <div className="text-[10px] text-[var(--muted)]">{slot.time}</div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${CHANNEL_BADGE[slot.channel]}`}>
                      {slot.channel}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-white font-editorial text-sm">{slot.title}</div>
                    <div className="text-[10px] text-[var(--muted)]">{slot.assetRef}</div>
                  </td>

                  <td className="py-4 px-4 max-w-md">
                    <p className="text-[var(--muted)] line-clamp-2 leading-relaxed">
                      {slot.copyPreview}
                    </p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 ${SLOT_STATUS_BADGE[slot.status]}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{slot.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Stacked Cards */}
        <ul className="md:hidden list-none m-0 p-0 space-y-3 font-mono-clean text-xs">
          {filteredSlots.map((slot) => (
            <li key={slot.id} className="rounded-lg border border-[var(--dim2)] bg-white/[0.01] p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-white font-medium">
                  {DAY_NAMES[slot.day]} <span className="text-[var(--muted)]">· {slot.time}</span>
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider inline-flex items-center gap-1 ${SLOT_STATUS_BADGE[slot.status]}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {slot.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${CHANNEL_BADGE[slot.channel]}`}>
                  {slot.channel}
                </span>
                <span className="text-[10px] text-[var(--muted)]">{slot.assetRef}</span>
              </div>
              <div className="text-white font-editorial text-sm">{slot.title}</div>
              <p className="text-[var(--muted)] leading-relaxed">{slot.copyPreview}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────────────────────────────────
          SECTION 04: CLIENT WORKSTREAMS
      ───────────────────────────────────────── */}
      <section id="milestone-tracker" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24">
        <div className="sec-label">
          <span>04 / CLIENT WORKSTREAMS &amp; MILESTONES</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mb-3">
              Client Workstreams &amp; <em className="text-accent not-italic">Milestone Ledger</em>
            </h2>
            <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
              The main workstreams I've run for my client: ongoing duties I still handle, and projects I've delivered.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['All', ...MILESTONE_STATUSES] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setMilestoneStatusFilter(st)}
                className={`chip ${milestoneStatusFilter === st ? 'hi' : ''} cursor-pointer`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {filteredMilestones.length === 0 ? (
          <div className="border border-[var(--dim2)] bg-white/[0.01] p-8 text-center font-mono-clean text-xs text-[var(--muted)]">
            No workstreams match this filter.
          </div>
        ) : (
          <>
            {/* Desktop: Workstream Table */}
            <div className="hidden md:block rounded-lg border border-[var(--dim2)] bg-white/[0.01] overflow-x-auto">
              <table className="w-full text-left font-mono-clean text-xs">
                <thead className="border-b border-[var(--dim2)] bg-white/[0.02] text-[var(--muted)] text-[9px] uppercase tracking-[0.16em]">
                  <tr>
                    <th className="py-3 px-4">Workstream</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Timeframe</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--dim1)]">
                  {filteredMilestones.map((ms) => (
                    <tr key={ms.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 max-w-xl">
                        <div className="text-white font-editorial text-sm">{ms.milestoneTarget}</div>
                        <div className="text-[11px] text-[var(--muted)] leading-relaxed mt-0.5">{ms.leadNote}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-[var(--muted)]">{ms.category}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-white/80">{ms.period}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 ${MILESTONE_STATUS_BADGE[ms.completionStatus]}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{ms.completionStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Stacked Cards */}
            <ul className="md:hidden list-none m-0 p-0 space-y-3 font-mono-clean text-xs">
              {filteredMilestones.map((ms) => (
                <li key={ms.id} className="rounded-lg border border-[var(--dim2)] bg-white/[0.01] p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{ms.category}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider inline-flex items-center gap-1 ${MILESTONE_STATUS_BADGE[ms.completionStatus]}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {ms.completionStatus}
                    </span>
                  </div>
                  <div className="text-white font-editorial text-sm">{ms.milestoneTarget}</div>
                  <p className="text-[var(--muted)] leading-relaxed">{ms.leadNote}</p>
                  <div className="text-[10px] text-white/70">{ms.period}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ─────────────────────────────────────────
          SECTION 05: EXPERIENCE & CREDENTIALS
      ───────────────────────────────────────── */}
      <section id="background" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24">
        <div className="sec-label">
          <span>05 / EXPERIENCE &amp; CREDENTIALS</span>
        </div>

        <div className="mb-10">
          <h2 className="font-editorial text-3xl sm:text-4xl text-white mb-3">
            Experience &amp; <em className="text-accent not-italic">Credentials</em>
          </h2>
          <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Executive support alongside a background in project documentation, cost reporting and software—so the details are handled with structure, and the tools get built when they're missing.
          </p>
        </div>

        {TESTIMONIAL && (
          <figure className="arch-card p-6 sm:p-8 mb-10 max-w-4xl">
            <blockquote className="font-editorial text-lg sm:text-xl text-white leading-relaxed">
              “{TESTIMONIAL.quote}”
            </blockquote>
            <figcaption className="mt-4 font-mono-clean text-[11px] uppercase tracking-wider text-accent">
              {TESTIMONIAL.author}
              <span className="text-[var(--muted)] normal-case tracking-normal"> · {TESTIMONIAL.title}</span>
            </figcaption>
          </figure>
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-10">
          {/* Experience Timeline */}
          <ol className="2xl:col-span-7 list-none m-0 p-0 space-y-2">
            {EXPERIENCE.map((exp) => (
              <li key={exp.id} className="arch-card p-5 grid grid-cols-1 sm:grid-cols-8 gap-2 sm:gap-6">
                <div className="sm:col-span-2 font-mono-clean text-[10px] uppercase tracking-wider text-[var(--muted)] pt-1 flex sm:flex-col items-center sm:items-start gap-2">
                  {exp.ongoing && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />}
                  <span>{exp.period}</span>
                </div>
                <div className="sm:col-span-6">
                <h3 className="font-editorial text-lg text-white leading-snug">{exp.role}</h3>
                <div className="font-mono-clean text-[11px] text-white/70 mb-2">{exp.organization}</div>
                <ul className="list-none m-0 p-0 space-y-1 font-mono-clean text-xs text-[var(--muted)] leading-relaxed">
                  {exp.highlights.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-accent shrink-0">›</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                </div>
              </li>
            ))}
          </ol>

          {/* Credentials */}
          <div className="2xl:col-span-5">
            <div className="font-mono-clean text-[10px] uppercase tracking-wider text-[var(--muted)] mb-3">
              Certifications &amp; Education
            </div>
            <ul className="list-none m-0 p-0 space-y-3">
              {CREDENTIALS.map((cred) => (
                <li key={cred.id} className="arch-card p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-editorial text-base text-white leading-snug">{cred.title}</div>
                    <div className="font-mono-clean text-[11px] text-[var(--muted)] mt-0.5">{cred.issuer}</div>
                  </div>
                  <span className="font-mono-clean text-[10px] uppercase tracking-wider text-emerald-400 whitespace-nowrap shrink-0">
                    {cred.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SECTION 06: DIRECT EXECUTIVE VA ENGAGEMENT
      ───────────────────────────────────────── */}
      <section id="contact-direct" className="scroll-mt-16 lg:scroll-mt-8 py-16 lg:py-24 text-center">
        <div className="sec-label justify-center mb-6">
          <span>06 / DIRECT EXECUTIVE ENGAGEMENT</span>
        </div>

        <h2 className="font-editorial text-3xl sm:text-5xl text-white mb-4">
          Accelerate Leadership Throughput &amp; <em className="text-accent not-italic">Reclaim Executive Focus.</em>
        </h2>

        <p className="font-mono-clean text-xs sm:text-sm text-[var(--muted)] max-w-xl mx-auto mb-8 leading-relaxed">
          Currently accepting new remote engagements as an Executive Virtual Assistant, Operations Partner
          or Digital Media Coordinator, for teams in any timezone. Every message gets a reply within 24 hours.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            type="button"
            onClick={() => {
              setContactSubmitted(false);
              setIsContactModalOpen(true);
            }}
            className="btn-main cursor-pointer"
          >
            <span>Submit Mandate Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href={WHATSAPP_INTRO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost border-emerald-500/40 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Quick Chat</span>
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="btn-ghost cursor-pointer"
          >
            {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedEmail ? 'Email Copied!' : 'Copy Direct Email'}</span>
          </button>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8 border-t border-[var(--dim1)] font-mono-clean text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-[var(--muted)]">Email</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white hover:text-accent transition-colors whitespace-nowrap">
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-[var(--muted)]">WhatsApp Direct</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              {WHATSAPP_DISPLAY}
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-[var(--muted)]">Location &amp; Timezone</span>
            <span className="text-white">{PROFILE.timezone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-[var(--muted)]">Availability</span>
            <span className="text-emerald-400">Open to Remote Roles</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          FOOTER (Architectural Styling)
      ───────────────────────────────────────── */}
      <footer className="py-10 border-t border-[var(--dim1)] flex flex-col xl:flex-row items-center justify-between gap-4 font-mono-clean text-xs text-[var(--muted)]">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ArchitecturalBadge size={24} isStatic centerText="AM" legendText="EVA" />
          <span className="font-editorial text-white text-sm">{PROFILE.fullName.toUpperCase()}</span>
          <span>·</span>
          <span>Executive Virtual Assistant &amp; Operations Partner</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>Designed &amp; built by {PROFILE.fullName}</span>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub ↗
          </a>
          <a href="#top" className="hover:text-white transition-colors">
            Back to Top ↑
          </a>
        </div>
      </footer>
        </main>
      </div>

      {/* ─────────────────────────────────────────
          MODAL: HIGH-RESOLUTION ASSET LIGHTBOX
      ───────────────────────────────────────── */}
      {selectedMediaItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[var(--bg)] rounded-xl border border-[var(--dim2)] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="el-corner tl" />
            <div className="el-corner tr" />
            <div className="el-corner bl" />
            <div className="el-corner br" />

            <button
              type="button"
              onClick={() => setSelectedMediaItem(null)}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Media */}
            <div className="flex-1 bg-black border border-[var(--dim2)] overflow-hidden flex items-center justify-center">
              {selectedMediaItem.imageSrc ? (
                <img
                  src={selectedMediaItem.imageSrc}
                  alt={selectedMediaItem.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              ) : (
                <div className="p-8 text-center font-mono-clean text-xs text-[var(--muted)]">
                  Vector Graphic Representation
                </div>
              )}
            </div>

            {/* Lightbox Metadata */}
            <div className="w-full md:w-80 flex flex-col justify-between font-mono-clean text-xs space-y-4">
              <div>
                <span className="text-[10px] text-accent uppercase tracking-wider">
                  {selectedMediaItem.category}
                </span>
                <h3 className="font-editorial text-2xl text-white mt-1">
                  {selectedMediaItem.title}
                </h3>
                <p className="text-[var(--muted)] text-xs mt-3 leading-relaxed">
                  {selectedMediaItem.summary}
                </p>
              </div>

              <div className="space-y-2 border-t border-[var(--dim1)] pt-4">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Client / Context</span>
                  <span className="text-white">{selectedMediaItem.clientOrSeries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Dimensions</span>
                  <span className="text-white">{selectedMediaItem.dimensions}</span>
                </div>
                {selectedMediaItem.turnaround && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Turnaround</span>
                    <span className="text-accent">{selectedMediaItem.turnaround}</span>
                  </div>
                )}
                {selectedMediaItem.tools.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Tools</span>
                    <span className="text-white">{selectedMediaItem.tools.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Deliverables</span>
                  <span className="text-white">{selectedMediaItem.deliverables}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMediaItem(null)}
                className="btn-main w-full justify-center mt-4 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          MODAL: EXECUTIVE BRIEF / CONTACT
      ───────────────────────────────────────── */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[var(--bg)] rounded-xl border border-[var(--dim2)] max-w-md w-full p-6 md:p-8 space-y-4 font-mono-clean text-xs">
            <div className="el-corner tl" />
            <div className="el-corner tr" />
            <div className="el-corner bl" />
            <div className="el-corner br" />

            <div className="flex items-center justify-between border-b border-[var(--dim1)] pb-3">
              <h3 className="font-editorial text-xl text-white">Executive Mandate Brief</h3>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="text-[var(--muted)] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-editorial text-2xl text-white">
                  {contactDelivery === 'sent' ? 'Brief Sent' : 'Almost There'}
                </h4>
                <p className="text-[var(--muted)] text-xs max-w-sm mx-auto leading-relaxed">
                  {contactDelivery === 'sent' ? (
                    <>Thank you! Your brief is in my inbox and I will respond within 24 hours.</>
                  ) : (
                    <>
                      Your email app should now be open with the brief ready — just press send. If nothing opened,
                      send it via WhatsApp below or email{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline">{CONTACT_EMAIL}</a>.
                    </>
                  )}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ${PROFILE.firstName}, here is a brief from your portfolio site:\n\n${briefText()}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-main text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp ↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="btn-ghost text-xs cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendBrief} className="space-y-4">
                {contactError && (
                  <div className="p-2 border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs">
                    {contactError}
                  </div>
                )}

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Your Name / Executive Title</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Founder, CEO, or Head of Talent"
                    className="w-full rounded-md bg-white/[0.04] border border-[var(--dim2)] text-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Your Email (for my reply)</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-md bg-white/[0.04] border border-[var(--dim2)] text-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={contactOrg}
                    onChange={(e) => setContactOrg(e.target.value)}
                    placeholder="e.g. Venture Studio, Tech Startup, or Agency"
                    className="w-full rounded-md bg-white/[0.04] border border-[var(--dim2)] text-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Mandate Scope</label>
                  <input
                    type="text"
                    value={contactScope}
                    onChange={(e) => setContactScope(e.target.value)}
                    className="w-full rounded-md bg-white/[0.04] border border-[var(--dim2)] text-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Overview &amp; Timeline</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe immediate deliverables or invite for interview..."
                    className="w-full rounded-md bg-white/[0.04] border border-[var(--dim2)] text-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[var(--dim1)]">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="btn-ghost cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={contactSending} className="btn-main cursor-pointer disabled:opacity-60">
                    {contactSending ? 'Sending…' : 'Submit Brief'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          EXECUTIVE DOCUMENT VIEWER & VAULT MODAL
      ───────────────────────────────────────── */}
      <ExecutiveDocumentViewer
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        initialDocId={activeDocId}
      />
    </div>
  );
}
