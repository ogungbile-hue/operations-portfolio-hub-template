export type ShowcaseCategory = 'Promotional & Event Graphics' | 'Short-Form Video Production';
export type CreativeTool = 'Figma' | 'Canva' | 'CapCut';

export interface ShowcaseItem {
  id: string;
  title: string;
  category: ShowcaseCategory;
  tools: CreativeTool[];
  clientOrSeries: string;
  turnaround: string;
  deliverables: string;
  dimensions: string;
  metrics: string;
  summary: string;
  palette: {
    bg: string;
    accent: string;
    ink: string;
  };
  aspectLabel: string;
  duration?: string;
  captionPreview?: string;
}

export const MEDIA_CATEGORIES = [
  'Event Flyers & Posters',
  'Social Media Posts',
  'Banners & Thumbnails',
  'Carousels & Reports',
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export interface VisualMediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  imageSrc?: string;
  tools: string[];
  clientOrSeries: string;
  turnaround: string;
  deliverables: string;
  dimensions: string;
  metrics: string;
  summary: string;
  aspectLabel: string;
  palette?: {
    bg: string;
    accent: string;
    ink: string;
  };
}

export interface VideoReelItem {
  id: string;
  title: string;
  badgeLabel: string;
  tools: string[];
  clientOrSeries: string;
  duration: string;
  turnaround: string;
  retentionMetric: string;
  captionPreview: string;
  summary: string;
  accentColor?: 'emerald' | 'amber' | 'blue' | 'purple';
  videoUrl?: string;
  posterUrl?: string;
  youtubeId?: string;
  channelUrl?: string;
}

export type DistributionChannel = 'Instagram' | 'YouTube' | 'Telegram';
export type DistributionStatus = 'Ready' | 'Scheduled' | 'Published';

export interface CalendarSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  channel: DistributionChannel;
  title: string;
  copyPreview: string;
  status: DistributionStatus;
  assetRef: string;
}

export const MILESTONE_CATEGORIES = [
  'Executive Support',
  'Media & Content',
  'Events',
  'Operations',
] as const;

export type MilestoneCategory = (typeof MILESTONE_CATEGORIES)[number];

export const MILESTONE_STATUSES = ['Ongoing', 'Completed'] as const;

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export interface MilestoneRecord {
  id: string;
  category: MilestoneCategory;
  milestoneTarget: string;
  completionStatus: MilestoneStatus;
  /** Free-text timeframe, e.g. "Since 2021" or "Delivered project". */
  period: string;
  leadNote: string;
}

export const INITIAL_VISUAL_MEDIA_ITEMS: VisualMediaItem[] = [
  {
    id: 'flyer-03',
    title: '“Rivers of Living Water” Power Night Flyer',
    category: 'Event Flyers & Posters',
    imageSrc: '/assets/rivers_of_living_water_flyer.jpg',
    tools: [],
    clientOrSeries: 'Arena of Witness Christian Network',
    turnaround: '',
    deliverables: 'Event Flyer for Social Media',
    dimensions: '1080×1300 px',
    metrics: 'Monthly event promotion',
    summary:
      'Monthly power-night flyer built around custom water-styled lettering and a clean speaker cut-out, with date, time and venue set in easy-to-scan tiles.',
    aspectLabel: 'Portrait Event Flyer',
  },
  {
    id: 'social-01',
    title: '“Call for Volunteers” Campaign Post',
    category: 'Social Media Posts',
    imageSrc: '/assets/global_bamboo_call_for_volunteer.jpg',
    tools: [],
    clientOrSeries: 'Global Bamboo Initiative · Annual Expo 2.0',
    turnaround: '',
    deliverables: 'Recruitment Post for Instagram & LinkedIn',
    dimensions: '1080×1055 px',
    metrics: 'Volunteer recruitment',
    summary:
      'Recruitment post from a sustainability expo campaign: bold headline, a clear call to students across construction and environment disciplines, and the brand’s green pattern system carried through every post in the series.',
    aspectLabel: 'Square Campaign Post',
  },
  {
    id: 'social-02',
    title: '“Happy New Month” Corporate Post',
    category: 'Social Media Posts',
    imageSrc: '/assets/blessed_hands_new_month_post.jpg',
    tools: [],
    clientOrSeries: 'Blessed Hands Mega Construction',
    turnaround: '',
    deliverables: 'Monthly Brand Post for Social Media',
    dimensions: '1080×1080 px',
    metrics: 'Monthly brand engagement',
    summary:
      'Corporate new-month greeting for a construction company: on-site photography, a strong type lockup and a short brand message on excellence and integrity.',
    aspectLabel: 'Square Brand Post',
  },
  {
    id: 'flyer-02',
    title: '“Weekly Fitness Saturdays” Programme Flyer',
    category: 'Event Flyers & Posters',
    imageSrc: '/assets/fitness_saturdays_flyer.jpg',
    tools: [],
    clientOrSeries: 'Youth Wellness Programme · The Nest Resource Centre',
    turnaround: '',
    deliverables: 'Promotional Flyer for Print & Social Media',
    dimensions: '905×1280 px',
    metrics: 'Weekly programme promotion',
    summary:
      'Bold promotional flyer for a weekly community fitness programme: instructor-led sessions, free medical check-ups and guest coaches. Dynamic diagonal layout, partner logos and an icon-led schedule that stays readable on phones.',
    aspectLabel: 'Portrait Promotional Flyer',
  },
  {
    id: 'invite-01',
    title: '40th Graduation Anniversary & Reunion Gala Invitation',
    category: 'Event Flyers & Posters',
    imageSrc: '/assets/reunion_gala_invitation.jpg',
    tools: [],
    clientOrSeries: 'Old Students Association · Class of 1986',
    turnaround: '',
    deliverables: 'Formal Invitation Card (Print-Ready)',
    dimensions: '5040×3600 px print file',
    metrics: 'Formal event invitation',
    summary:
      'Formal invitation for a 40th anniversary reunion gala: crest-led layout, gold and burgundy palette, and a clear hierarchy for date, venue, guest speakers and royal fathers of the day. Contact numbers removed for this portfolio.',
    aspectLabel: 'Landscape Invitation Card',
  },
];

export const INITIAL_VIDEO_REELS: VideoReelItem[] = [
  {
    id: 'dr-nike-01',
    title: 'What Is Your Legacy? Executive Purpose & Intentional Living',
    badgeLabel: '9:16 REEL · EXECUTIVE PURPOSE',
    tools: ['CapCut', 'Premiere Pro', 'Canva'],
    clientOrSeries: 'Executive Purpose & Coaching Series',
    duration: '01:52',
    turnaround: '< 4 Hours Turnaround',
    retentionMetric: 'Edited · Captioned · Published',
    captionPreview:
      '“What is your legacy? Have you thought about it? The seeds you plant today define tomorrow’s shade.”',
    summary:
      'Executive short-form video produced with kinetic word-by-word typography, audio loudness normalization (-14 LUFS), and narrative retention hooks.',
    accentColor: 'emerald',
    youtubeId: 'nw1oVS2gDVw',
    channelUrl: 'https://www.youtube.com/@drnikeaddsvhaalu5280',
    posterUrl: 'https://img.youtube.com/vi/nw1oVS2gDVw/hqdefault.jpg',
  },
  {
    id: 'dr-nike-02',
    title: 'Goal Setting & Building Resilience Under High Pressure',
    badgeLabel: '9:16 REEL · MASTERCLASS',
    tools: ['CapCut', 'Figma', 'Adobe Audition'],
    clientOrSeries: 'Executive Resilience Coaching Series',
    duration: '01:40',
    turnaround: '< 5 Hours Turnaround',
    retentionMetric: 'Edited · Captioned · Published',
    captionPreview:
      '“Resilience isn’t just bouncing back—it is purposeful goal-setting through life’s turbulence.”',
    summary:
      'High-tempo educational reel structuring core mental fortitude principles. Clean jump-cut editing, rhythmic subtitle timing, and branded channel lower-thirds.',
    accentColor: 'amber',
    youtubeId: 'QLvI8O9iuS8',
    channelUrl: 'https://www.youtube.com/@drnikeaddsvhaalu5280',
    posterUrl: 'https://img.youtube.com/vi/QLvI8O9iuS8/hqdefault.jpg',
  },
  {
    id: 'dr-nike-03',
    title: 'Resilience & Heritage — “Conversations in a Box” with Chi',
    badgeLabel: 'INTERVIEW · STUDIO SERIES',
    tools: ['Premiere Pro', 'CapCut', 'Canva'],
    clientOrSeries: 'Executive Studio Dialogue Series',
    duration: '03:52',
    turnaround: 'Same-Day Master Cut',
    retentionMetric: 'Featured Dialogue',
    captionPreview:
      '“Conversations in a Box: Unpacking personal resilience, creative identity, and intentional growth.”',
    summary:
      'Multi-speaker dialogue editing capturing studio reflections on personal resilience, creative identity, and intentional growth. Dynamic visual cuts between speakers, sound balance, and strategic callouts.',
    accentColor: 'purple',
    youtubeId: 'lVz1IlC4A6k',
    channelUrl: 'https://www.youtube.com/@drnikeaddsvhaalu5280',
    posterUrl: 'https://img.youtube.com/vi/lVz1IlC4A6k/hqdefault.jpg',
  },
  {
    id: 'dr-nike-04',
    title: 'Bridge Over Troubled Waters — Mindful Well-being Reflection',
    badgeLabel: 'VOICE POP · MINDFULNESS',
    tools: ['CapCut', 'Adobe Audition'],
    clientOrSeries: 'Executive Mindful Voice Pops',
    duration: '01:05',
    turnaround: '< 3 Hours Fast Delivery',
    retentionMetric: 'Edited · Audio Enhanced',
    captionPreview:
      '“Peace of mind begins when you choose to pause, reflect, and protect your inner stillness.”',
    summary:
      'Atmospheric pacing, mindful voiceover audio enhancements, and aesthetic visual framing for weekly executive wellness community.',
    accentColor: 'blue',
    youtubeId: 'pc-gCBrpSGw',
    channelUrl: 'https://www.youtube.com/@drnikeaddsvhaalu5280',
    posterUrl: 'https://img.youtube.com/vi/pc-gCBrpSGw/hqdefault.jpg',
  },
];

export const INITIAL_CALENDAR_SLOTS: CalendarSlot[] = [
  {
    id: 'cal-1',
    day: 'Mon',
    time: '08:30 GMT',
    channel: 'Telegram',
    title: 'Monday Reflection & Weekly Community Announcements',
    copyPreview:
      'Short reflection drawn from the latest broadcast, plus this week’s event reminders and registration links for the community channel.',
    status: 'Published',
    assetRef: 'TG-ANN-44',
  },
  {
    id: 'cal-2',
    day: 'Mon',
    time: '14:00 GMT',
    channel: 'Instagram',
    title: 'Executive Purpose & Legacy 9:16 Kinetic Highlight Reel',
    copyPreview:
      'Short-form quote cut from keynote address with kinetic subtitle motion. Direct link to full video replay.',
    status: 'Published',
    assetRef: 'IG-REEL-01',
  },
  {
    id: 'cal-3',
    day: 'Tue',
    time: '11:00 GMT',
    channel: 'Instagram',
    title: '5 Principles for Building Resilience — 8-Slide Carousel',
    copyPreview:
      'Translating core resilience pillars into a scannable educational carousel. Includes swipe-through prompts and takeaway summary.',
    status: 'Published',
    assetRef: 'IG-CAR-18',
  },
  {
    id: 'cal-4',
    day: 'Wed',
    time: '16:30 GMT',
    channel: 'YouTube',
    title: 'Weekly Broadcast Episode Release & Timestamps',
    copyPreview:
      'Episode release: SEO description copy, chapter markers, thumbnail QA, and community tab post.',
    status: 'Scheduled',
    assetRef: 'YT-EP-04',
  },
  {
    id: 'cal-5',
    day: 'Thu',
    time: '09:00 GMT',
    channel: 'Telegram',
    title: 'Mentoring Cohort Check-In & Resource Pack',
    copyPreview:
      'Mentee progress check-in, reflection prompts, and scheduling links for 1-on-1 advisory sessions.',
    status: 'Scheduled',
    assetRef: 'TG-MENTOR-07',
  },
  {
    id: 'cal-6',
    day: 'Fri',
    time: '12:00 GMT',
    channel: 'Instagram',
    title: 'Mindful Reflection Reel for the Weekend',
    copyPreview:
      'Weekend wellness reminder: audio levelling, atmospheric visual framing, and a weekend pause prompt for the community.',
    status: 'Ready',
    assetRef: 'IG-REEL-04',
  },
  {
    id: 'cal-7',
    day: 'Sat',
    time: '17:00 GMT',
    channel: 'YouTube',
    title: 'Speaker Behind-the-Scenes Short',
    copyPreview:
      'Conversations in a Box studio clip highlighting creative resilience. Chapter marks and companion poll queued.',
    status: 'Ready',
    assetRef: 'YT-SHRT-12',
  },
  {
    id: 'cal-8',
    day: 'Sun',
    time: '19:30 GMT',
    channel: 'Telegram',
    title: 'Week-Ahead Content Preview & Episode Teaser',
    copyPreview:
      'Preview of the coming week’s episode and reels, with a short teaser clip and a reminder to subscribe.',
    status: 'Scheduled',
    assetRef: 'TG-PREV-09',
  },
];

export const INITIAL_MILESTONES: MilestoneRecord[] = [
  {
    id: 'ms-03',
    category: 'Executive Support',
    milestoneTarget: 'Executive Diary & Multi-Timezone Calendar',
    completionStatus: 'Ongoing',
    period: 'Since 2021',
    leadNote: 'Scheduling across GMT/BST, US Eastern and WAT for appointments, coaching sessions and speaking engagements.',
  },
  {
    id: 'ms-04',
    category: 'Executive Support',
    milestoneTarget: 'Executive Inbox Management & 4-Tier Triage',
    completionStatus: 'Ongoing',
    period: 'Since 2021',
    leadNote: 'Triage of coaching applicants and keynote inquiries, with priority replies drafted in the client’s voice for approval.',
  },
  {
    id: 'ms-05',
    category: 'Executive Support',
    milestoneTarget: 'Domestic & International Speaking Tour Logistics',
    completionStatus: 'Ongoing',
    period: 'Since 2021',
    leadNote: 'Flight and rail bookings, hotel reservations, venue briefs, and contingency plans for each trip.',
  },
  {
    id: 'ms-02',
    category: 'Media & Content',
    milestoneTarget: 'YouTube Channel Management (24+ Videos Published)',
    completionStatus: 'Ongoing',
    period: 'Since 2021',
    leadNote: 'Long-form broadcasts and vertical reels edited with kinetic subtitles, levelled audio, and SEO titles, descriptions and timestamps.',
  },
  {
    id: 'ms-01',
    category: 'Events',
    milestoneTarget: 'Global Mentoring Symposium & Virtual Summit Operations',
    completionStatus: 'Completed',
    period: 'Delivered project',
    leadNote: 'Delegate RSVPs, speaker briefing slates, and the live run-of-show across GMT and WAT timezones.',
  },
  {
    id: 'ms-06',
    category: 'Operations',
    milestoneTarget: 'Operational Knowledge Vault & Repeatable SOP Playbooks',
    completionStatus: 'Completed',
    period: 'Delivered project',
    leadNote: 'Documented SOPs for weekly podcast release, speaker onboarding, social media publishing, and confidential data hygiene.',
  },
];

export function filterShowcaseItems(
  items: ShowcaseItem[],
  category: ShowcaseCategory,
  toolFilter: 'All' | CreativeTool
): ShowcaseItem[] {
  return items.filter((item) => {
    const matchesCategory = item.category === category;
    const matchesTool = toolFilter === 'All' || item.tools.includes(toolFilter);
    return matchesCategory && matchesTool;
  });
}

export function filterCalendarSlots(
  slots: CalendarSlot[],
  channelFilter: 'All' | DistributionChannel,
  statusFilter: 'All' | DistributionStatus
): CalendarSlot[] {
  return slots.filter((slot) => {
    const matchesChannel = channelFilter === 'All' || slot.channel === channelFilter;
    const matchesStatus = statusFilter === 'All' || slot.status === statusFilter;
    return matchesChannel && matchesStatus;
  });
}

export function nextDistributionStatus(current: DistributionStatus): DistributionStatus {
  if (current === 'Ready') return 'Scheduled';
  if (current === 'Scheduled') return 'Published';
  return 'Ready';
}

export function filterMilestoneRecords(
  records: MilestoneRecord[],
  searchQuery: string,
  categoryFilter: string,
  statusFilter: string
): MilestoneRecord[] {
  const q = searchQuery.trim().toLowerCase();
  return records.filter((rec) => {
    const matchesQuery =
      q === '' ||
      rec.category.toLowerCase().includes(q) ||
      rec.milestoneTarget.toLowerCase().includes(q) ||
      rec.leadNote.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || rec.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || rec.completionStatus === statusFilter;
    return matchesQuery && matchesCategory && matchesStatus;
  });
}

export function computeMilestoneSummary(records: MilestoneRecord[]): {
  total: number;
  ongoingCount: number;
  completedCount: number;
} {
  const completedCount = records.filter((r) => r.completionStatus === 'Completed').length;
  return {
    total: records.length,
    ongoingCount: records.length - completedCount,
    completedCount,
  };
}
