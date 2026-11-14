import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterShowcaseItems,
  filterCalendarSlots,
  nextDistributionStatus,
  filterMilestoneRecords,
  computeMilestoneSummary,
  type ShowcaseItem,
  type CalendarSlot,
  type MilestoneRecord,
} from './portfolioLogic.ts';

const sampleShowcase: ShowcaseItem[] = [
  {
    id: 'g1',
    title: 'Faith & Leadership Conference Promo',
    category: 'Promotional & Event Graphics',
    tools: ['Figma', 'Canva'],
    clientOrSeries: 'Global Leadership Forum',
    turnaround: '18 Hours',
    deliverables: '14 Static & Carousel Assets',
    dimensions: '1080×1350 · 1920×1080',
    metrics: '98.5% Brand QA Pass',
    summary: 'Keynote promotional suite.',
    palette: { bg: '#F8FAFC', accent: '#065F46', ink: '#0F172A' },
    aspectLabel: '4:5 Portrait Suite',
  },
  {
    id: 'v1',
    title: 'Weekly Recap Reel with Motion Captions',
    category: 'Short-Form Video Production',
    tools: ['CapCut', 'Canva'],
    clientOrSeries: 'Sunday Broadcast Recap',
    turnaround: '6 Hours',
    deliverables: '3 Vertical Reels (9:16)',
    dimensions: '1080×1920 · 60fps',
    metrics: '74% Avg. Watch Completion',
    summary: 'High-retention vertical edit.',
    palette: { bg: '#F1F5F9', accent: '#1E293B', ink: '#0F172A' },
    aspectLabel: '9:16 Vertical Reel',
    duration: '00:58',
  },
];

const sampleSlots: CalendarSlot[] = [
  {
    id: 'c1',
    day: 'Mon',
    time: '08:30 WAT',
    channel: 'Instagram',
    title: 'Keynote Speaker Carousel',
    copyPreview: 'Registration closes in 48 hours for the Global Leadership Summit.',
    status: 'Published',
    assetRef: 'FIG-204',
  },
  {
    id: 'c2',
    day: 'Wed',
    time: '18:00 WAT',
    channel: 'YouTube',
    title: 'Weekly Recap Reel with Motion Captions',
    copyPreview: 'Key takeaways from this week’s executive leadership session.',
    status: 'Scheduled',
    assetRef: 'CAP-118',
  },
];

const sampleMilestones: MilestoneRecord[] = [
  {
    id: 'm1',
    category: 'Events',
    milestoneTarget: 'Q4 Conference Speaker & Media Run-of-Show',
    completionStatus: 'Completed',
    period: 'Delivered project',
    leadNote: 'All 18 speaker slide decks verified with the covenant team.',
  },
  {
    id: 'm2',
    category: 'Operations',
    milestoneTarget: 'Monthly Partner Attribution & Payout Ledger',
    completionStatus: 'Ongoing',
    period: 'Since 2021',
    leadNote: 'UTM tracking links audited.',
  },
];

test('filterShowcaseItems filters by category and tool accurately', () => {
  const graphicsAll = filterShowcaseItems(sampleShowcase, 'Promotional & Event Graphics', 'All');
  assert.equal(graphicsAll.length, 1);
  assert.equal(graphicsAll[0].id, 'g1');

  const videoCapCut = filterShowcaseItems(sampleShowcase, 'Short-Form Video Production', 'CapCut');
  assert.equal(videoCapCut.length, 1);
  assert.equal(videoCapCut[0].id, 'v1');

  const graphicsCapCut = filterShowcaseItems(sampleShowcase, 'Promotional & Event Graphics', 'CapCut');
  assert.equal(graphicsCapCut.length, 0);
});

test('filterCalendarSlots filters by channel and status', () => {
  assert.equal(filterCalendarSlots(sampleSlots, 'All', 'All').length, 2);
  assert.equal(filterCalendarSlots(sampleSlots, 'Instagram', 'All').length, 1);
  assert.equal(filterCalendarSlots(sampleSlots, 'All', 'Scheduled').length, 1);
  assert.equal(filterCalendarSlots(sampleSlots, 'YouTube', 'Published').length, 0);
});

test('nextDistributionStatus cycles statuses predictably', () => {
  assert.equal(nextDistributionStatus('Ready'), 'Scheduled');
  assert.equal(nextDistributionStatus('Scheduled'), 'Published');
  assert.equal(nextDistributionStatus('Published'), 'Ready');
});

test('filterMilestoneRecords matches search query, category, and status', () => {
  const bySearch = filterMilestoneRecords(sampleMilestones, 'covenant', 'All', 'All');
  assert.equal(bySearch.length, 1);
  assert.equal(bySearch[0].id, 'm1');

  const byTarget = filterMilestoneRecords(sampleMilestones, 'ledger', 'All', 'All');
  assert.equal(byTarget.length, 1);
  assert.equal(byTarget[0].id, 'm2');

  const byCategory = filterMilestoneRecords(sampleMilestones, '', 'Operations', 'All');
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].id, 'm2');

  const byStatus = filterMilestoneRecords(sampleMilestones, '', 'All', 'Ongoing');
  assert.equal(byStatus.length, 1);
  assert.equal(byStatus[0].id, 'm2');
});

test('computeMilestoneSummary counts ongoing and completed workstreams', () => {
  const summary = computeMilestoneSummary(sampleMilestones);
  assert.equal(summary.total, 2);
  assert.equal(summary.ongoingCount, 1);
  assert.equal(summary.completedCount, 1);
});
