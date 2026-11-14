/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Film,
  Filter,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  Video,
  X,
  AlertCircle,
  FileSpreadsheet,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  MEDIA_CATEGORIES,
  MILESTONE_CATEGORIES,
  MILESTONE_STATUSES,
  type VisualMediaItem,
  type VideoReelItem,
  type CalendarSlot,
  type MilestoneRecord,
  type MediaCategory,
  type DistributionChannel,
  type DistributionStatus,
  type MilestoneCategory,
  type MilestoneStatus,
} from '../utils/portfolioLogic';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

type AdminTab = 'media' | 'reels' | 'calendar' | 'milestones';

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const {
    visualMedia,
    addVisualMedia,
    updateVisualMedia,
    deleteVisualMedia,
    videoReels,
    addVideoReel,
    updateVideoReel,
    deleteVideoReel,
    calendarSlots,
    addCalendarSlot,
    updateCalendarSlot,
    deleteCalendarSlot,
    cycleSlotStatus,
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    cycleMilestoneStatus,
    resetToDefaults,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('media');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // MODAL STATES
  // -------------------------------------------------------------
  // Visual Media Modals
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<VisualMediaItem | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState<MediaCategory>('Event Flyers & Posters');
  const [mediaImageSrc, setMediaImageSrc] = useState('');
  const [mediaTools, setMediaTools] = useState('Canva, Figma');
  const [mediaClient, setMediaClient] = useState('');
  const [mediaTurnaround, setMediaTurnaround] = useState('16 Hours');
  const [mediaDeliverables, setMediaDeliverables] = useState('');
  const [mediaDimensions, setMediaDimensions] = useState('1080×1350 px');
  const [mediaMetrics, setMediaMetrics] = useState('');
  const [mediaSummary, setMediaSummary] = useState('');
  const [mediaAspectLabel, setMediaAspectLabel] = useState('3:4 Editorial Event Poster');
  const [mediaError, setMediaError] = useState('');

  // Video Reel Modals
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<VideoReelItem | null>(null);
  const [reelTitle, setReelTitle] = useState('');
  const [reelBadge, setReelBadge] = useState('9:16 REEL');
  const [reelTools, setReelTools] = useState('CapCut, Canva');
  const [reelClient, setReelClient] = useState('');
  const [reelDuration, setReelDuration] = useState('00:58');
  const [reelTurnaround, setReelTurnaround] = useState('< 6 Hours Post-Event');
  const [reelMetric, setReelMetric] = useState('78% Avg Completion');
  const [reelCaption, setReelCaption] = useState('');
  const [reelSummary, setReelSummary] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelPosterUrl, setReelPosterUrl] = useState('');
  const [reelYoutubeId, setReelYoutubeId] = useState('');
  const [reelChannelUrl, setReelChannelUrl] = useState('');
  const [reelAccent, setReelAccent] = useState<'emerald' | 'amber' | 'blue' | 'purple'>('emerald');
  const [reelError, setReelError] = useState('');

  // Calendar Slot Modals
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<CalendarSlot | null>(null);
  const [slotDay, setSlotDay] = useState<CalendarSlot['day']>('Mon');
  const [slotTime, setSlotTime] = useState('08:30 WAT');
  const [slotChannel, setSlotChannel] = useState<DistributionChannel>('Telegram');
  const [slotTitle, setSlotTitle] = useState('');
  const [slotCopy, setSlotCopy] = useState('');
  const [slotStatus, setSlotStatus] = useState<DistributionStatus>('Scheduled');
  const [slotAssetRef, setSlotAssetRef] = useState('TG-OPS-101');
  const [slotError, setSlotError] = useState('');

  // Milestone Modals
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneRecord | null>(null);
  const [msCategory, setMsCategory] = useState<MilestoneCategory>('Executive Support');
  const [msTarget, setMsTarget] = useState('');
  const [msStatus, setMsStatus] = useState<MilestoneStatus>('Ongoing');
  const [msPeriod, setMsPeriod] = useState('Since 2021');
  const [msLeadNote, setMsLeadNote] = useState('');
  const [msError, setMsError] = useState('');

  // Search & Filter state inside Admin
  const [adminSearch, setAdminSearch] = useState('');

  // -------------------------------------------------------------
  // OPEN MODAL HANDLERS
  // -------------------------------------------------------------
  const handleOpenNewMedia = () => {
    setEditingMedia(null);
    setMediaTitle('');
    setMediaCategory('Event Flyers & Posters');
    setMediaImageSrc('');
    setMediaTools('Canva, Figma');
    setMediaClient('Executive Mentoring Series');
    setMediaTurnaround('16 Hours');
    setMediaDeliverables('Flyer Poster · Keynote Slates');
    setMediaDimensions('1080×1350 px');
    setMediaMetrics('98% Brand QA Pass');
    setMediaSummary('Rapid-turnaround promotional visual asset suite engineered for high visual legibility.');
    setMediaAspectLabel('3:4 Editorial Event Poster');
    setMediaError('');
    setIsMediaModalOpen(true);
  };

  const handleOpenEditMedia = (item: VisualMediaItem) => {
    setEditingMedia(item);
    setMediaTitle(item.title);
    setMediaCategory(item.category);
    setMediaImageSrc(item.imageSrc || '');
    setMediaTools(item.tools.join(', '));
    setMediaClient(item.clientOrSeries);
    setMediaTurnaround(item.turnaround);
    setMediaDeliverables(item.deliverables);
    setMediaDimensions(item.dimensions);
    setMediaMetrics(item.metrics);
    setMediaSummary(item.summary);
    setMediaAspectLabel(item.aspectLabel);
    setMediaError('');
    setIsMediaModalOpen(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaClient.trim()) {
      setMediaError('Please enter both a title and client/series name.');
      return;
    }
    const toolsArray = mediaTools
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingMedia) {
      updateVisualMedia(editingMedia.id, {
        title: mediaTitle.trim(),
        category: mediaCategory,
        imageSrc: mediaImageSrc.trim() || undefined,
        tools: toolsArray.length ? toolsArray : ['Canva'],
        clientOrSeries: mediaClient.trim(),
        turnaround: mediaTurnaround.trim(),
        deliverables: mediaDeliverables.trim(),
        dimensions: mediaDimensions.trim(),
        metrics: mediaMetrics.trim(),
        summary: mediaSummary.trim(),
        aspectLabel: mediaAspectLabel.trim(),
      });
      showToast('Visual media item updated.');
    } else {
      addVisualMedia({
        title: mediaTitle.trim(),
        category: mediaCategory,
        imageSrc: mediaImageSrc.trim() || undefined,
        tools: toolsArray.length ? toolsArray : ['Canva'],
        clientOrSeries: mediaClient.trim(),
        turnaround: mediaTurnaround.trim(),
        deliverables: mediaDeliverables.trim(),
        dimensions: mediaDimensions.trim(),
        metrics: mediaMetrics.trim(),
        summary: mediaSummary.trim(),
        aspectLabel: mediaAspectLabel.trim(),
        palette: { bg: '#064E3B', accent: '#D97706', ink: '#FFFFFF' },
      });
      showToast('New visual deliverable added to grid.');
    }
    setIsMediaModalOpen(false);
  };

  // Video Reel Handlers
  const handleOpenNewReel = () => {
    setEditingReel(null);
    setReelTitle('');
    setReelBadge('9:16 REEL');
    setReelTools('CapCut, Canva');
    setReelClient('Sunday Broadcast Highlights');
    setReelDuration('00:45');
    setReelTurnaround('< 5 Hours Post-Event');
    setReelMetric('80% Avg Completion');
    setReelCaption('“Proactive systems eliminate administrative friction and elevate creative pace.”');
    setReelSummary('Vertical highlight reel with kinetic word-by-word motion captions and sound normalization.');
    setReelVideoUrl('');
    setReelPosterUrl('');
    setReelYoutubeId('');
    setReelChannelUrl('https://www.youtube.com/@drnikeaddsvhaalu5280');
    setReelAccent('emerald');
    setReelError('');
    setIsReelModalOpen(true);
  };

  const handleOpenEditReel = (reel: VideoReelItem) => {
    setEditingReel(reel);
    setReelTitle(reel.title);
    setReelBadge(reel.badgeLabel);
    setReelTools(reel.tools.join(', '));
    setReelClient(reel.clientOrSeries);
    setReelDuration(reel.duration);
    setReelTurnaround(reel.turnaround);
    setReelMetric(reel.retentionMetric);
    setReelCaption(reel.captionPreview);
    setReelSummary(reel.summary);
    setReelVideoUrl(reel.videoUrl || '');
    setReelPosterUrl(reel.posterUrl || '');
    setReelYoutubeId(reel.youtubeId || '');
    setReelChannelUrl(reel.channelUrl || '');
    setReelAccent(reel.accentColor || 'emerald');
    setReelError('');
    setIsReelModalOpen(true);
  };

  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelTitle.trim() || !reelCaption.trim()) {
      setReelError('Please enter both a reel title and kinetic caption preview.');
      return;
    }
    const toolsArray = reelTools
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingReel) {
      updateVideoReel(editingReel.id, {
        title: reelTitle.trim(),
        badgeLabel: reelBadge.trim(),
        tools: toolsArray.length ? toolsArray : ['CapCut'],
        clientOrSeries: reelClient.trim(),
        duration: reelDuration.trim(),
        turnaround: reelTurnaround.trim(),
        retentionMetric: reelMetric.trim(),
        captionPreview: reelCaption.trim(),
        summary: reelSummary.trim(),
        accentColor: reelAccent,
        videoUrl: reelVideoUrl.trim() || undefined,
        posterUrl: reelPosterUrl.trim() || undefined,
        youtubeId: reelYoutubeId.trim() || undefined,
        channelUrl: reelChannelUrl.trim() || undefined,
      });
      showToast('Video reel updated.');
    } else {
      addVideoReel({
        title: reelTitle.trim(),
        badgeLabel: reelBadge.trim(),
        tools: toolsArray.length ? toolsArray : ['CapCut'],
        clientOrSeries: reelClient.trim(),
        duration: reelDuration.trim(),
        turnaround: reelTurnaround.trim(),
        retentionMetric: reelMetric.trim(),
        captionPreview: reelCaption.trim(),
        summary: reelSummary.trim(),
        accentColor: reelAccent,
        videoUrl: reelVideoUrl.trim() || undefined,
        posterUrl: reelPosterUrl.trim() || undefined,
        youtubeId: reelYoutubeId.trim() || undefined,
        channelUrl: reelChannelUrl.trim() || undefined,
      });
      showToast('New vertical video reel added.');
    }
    setIsReelModalOpen(false);
  };

  // Calendar Slot Handlers
  const handleOpenNewSlot = () => {
    setEditingSlot(null);
    setSlotDay('Mon');
    setSlotTime('10:00 WAT');
    setSlotChannel('Telegram');
    setSlotTitle('');
    setSlotCopy('');
    setSlotStatus('Ready');
    setSlotAssetRef(`TG-NEW-${calendarSlots.length + 1}`);
    setSlotError('');
    setIsSlotModalOpen(true);
  };

  const handleOpenEditSlot = (slot: CalendarSlot) => {
    setEditingSlot(slot);
    setSlotDay(slot.day);
    setSlotTime(slot.time);
    setSlotChannel(slot.channel);
    setSlotTitle(slot.title);
    setSlotCopy(slot.copyPreview);
    setSlotStatus(slot.status);
    setSlotAssetRef(slot.assetRef);
    setSlotError('');
    setIsSlotModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim() || !slotCopy.trim()) {
      setSlotError('Please enter both a title and caption outline.');
      return;
    }
    if (editingSlot) {
      updateCalendarSlot(editingSlot.id, {
        day: slotDay,
        time: slotTime.trim(),
        channel: slotChannel,
        title: slotTitle.trim(),
        copyPreview: slotCopy.trim(),
        status: slotStatus,
        assetRef: slotAssetRef.trim(),
      });
      showToast('Distribution slot updated.');
    } else {
      addCalendarSlot({
        day: slotDay,
        time: slotTime.trim(),
        channel: slotChannel,
        title: slotTitle.trim(),
        copyPreview: slotCopy.trim(),
        status: slotStatus,
        assetRef: slotAssetRef.trim(),
      });
      showToast('New distribution slot scheduled.');
    }
    setIsSlotModalOpen(false);
  };

  // Milestone Handlers
  const handleOpenNewMilestone = () => {
    setEditingMilestone(null);
    setMsCategory('Executive Support');
    setMsTarget('');
    setMsStatus('Ongoing');
    setMsPeriod('Since 2021');
    setMsLeadNote('');
    setMsError('');
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (m: MilestoneRecord) => {
    setEditingMilestone(m);
    setMsCategory(m.category);
    setMsTarget(m.milestoneTarget);
    setMsStatus(m.completionStatus);
    setMsPeriod(m.period);
    setMsLeadNote(m.leadNote);
    setMsError('');
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTarget.trim() || !msPeriod.trim()) {
      setMsError('Please enter both a workstream title and a timeframe.');
      return;
    }
    const record = {
      category: msCategory,
      milestoneTarget: msTarget.trim(),
      completionStatus: msStatus,
      period: msPeriod.trim(),
      leadNote: msLeadNote.trim(),
    };
    if (editingMilestone) {
      updateMilestone(editingMilestone.id, record);
      showToast('Milestone record updated.');
    } else {
      addMilestone(record);
      showToast('New milestone record logged.');
    }
    setIsMilestoneModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#FF6B35]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FF6B35] text-black text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-bounce font-mono-clean">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-[var(--dim2)]">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="btn-ghost text-[11px] py-1.5 px-3 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>View Public Hub (/)</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                <h1 className="text-base font-bold text-white tracking-tight font-editorial">
                  Executive Operations Admin
                </h1>
              </div>
              <p className="text-xs text-[var(--muted)] font-mono-clean">
                Executive Operations &amp; Digital Support Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all items back to initial demo defaults? Any custom edits will be reverted.')) {
                  resetToDefaults();
                  showToast('Reverted to default portfolio datasets.');
                }
              }}
              className="btn-ghost text-[11px] py-1.5 px-3 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Defaults</span>
            </button>

            <span className="text-[10px] font-mono-clean uppercase tracking-wider px-2.5 py-1 border border-[#FF6B35]/40 bg-[#FF6B35]/10 text-[#FF6B35]">
              Live Storage Synced
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-[1280px] mx-auto w-full px-6 py-8 flex-1 space-y-8">
        {/* KPI Counter Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="arch-card p-4">
            <p className="text-[9px] font-mono-clean uppercase tracking-wider text-[var(--muted)]">Visual Media Deliverables</p>
            <p className="text-2xl font-semibold text-white font-mono-clean mt-1">
              {visualMedia.length} Items
            </p>
            <p className="text-[11px] text-[#FF6B35] mt-0.5">Flyers, banners, carousels</p>
          </div>

          <div className="arch-card p-4">
            <p className="text-[9px] font-mono-clean uppercase tracking-wider text-[var(--muted)]">Short-Form Video Reels</p>
            <p className="text-2xl font-semibold text-white font-mono-clean mt-1">
              {videoReels.length} Reels
            </p>
            <p className="text-[11px] text-[#FF6B35] mt-0.5">Kinetic captions &amp; audio</p>
          </div>

          <div className="arch-card p-4">
            <p className="text-[9px] font-mono-clean uppercase tracking-wider text-[var(--muted)]">Distribution Dispatches</p>
            <p className="text-2xl font-semibold text-white font-mono-clean mt-1">
              {calendarSlots.length} Slots
            </p>
            <p className="text-[11px] text-[#FF6B35] mt-0.5">Telegram, IG &amp; YouTube</p>
          </div>

          <div className="arch-card p-4">
            <p className="text-[9px] font-mono-clean uppercase tracking-wider text-[var(--muted)]">Client Workstreams</p>
            <p className="text-2xl font-semibold text-white font-mono-clean mt-1">
              {milestones.length} Workstreams
            </p>
            <p className="text-[11px] text-[#FF6B35] mt-0.5">Ongoing duties &amp; projects</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--dim2)] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'media', label: '1. Visual Media Grid', count: visualMedia.length },
              { id: 'reels', label: '2. Video Reels (9:16)', count: videoReels.length },
              { id: 'calendar', label: '3. Content Schedule', count: calendarSlots.length },
              { id: 'milestones', label: '4. Milestone Tracker', count: milestones.length },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as AdminTab)}
                className={`px-4 py-2 text-xs font-mono-clean uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === t.id
                    ? 'bg-[#FF6B35] text-black font-semibold shadow-[0_0_15px_rgba(255,107,53,0.35)]'
                    : 'bg-white/[0.02] border border-[var(--dim2)] text-[var(--muted)] hover:text-white hover:border-[#FF6B35]/40'
                }`}
              >
                <span>{t.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/60 font-mono-clean">
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Specific Add Button */}
          <div>
            {activeTab === 'media' && (
              <button
                type="button"
                onClick={handleOpenNewMedia}
                className="btn-main text-[11px] py-2 px-3 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Visual Deliverable</span>
              </button>
            )}
            {activeTab === 'reels' && (
              <button
                type="button"
                onClick={handleOpenNewReel}
                className="btn-main text-[11px] py-2 px-3 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Video Reel</span>
              </button>
            )}
            {activeTab === 'calendar' && (
              <button
                type="button"
                onClick={handleOpenNewSlot}
                className="btn-main text-[11px] py-2 px-3 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Schedule Slot</span>
              </button>
            )}
            {activeTab === 'milestones' && (
              <button
                type="button"
                onClick={handleOpenNewMilestone}
                className="btn-main text-[11px] py-2 px-3 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Milestone</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: VISUAL MEDIA DELIVERABLES                          */}
        {/* ========================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Manage High-Resolution Graphic Deliverables (Flyers, Banners, Carousels)
              </h2>
              <span className="text-xs text-slate-500 font-mono-tabular">
                Changes immediately sync to public page
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visualMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail preview */}
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                      {item.imageSrc ? (
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full p-4 flex flex-col justify-between"
                          style={{ backgroundColor: item.palette?.bg || '#0F172A' }}
                        >
                          <span className="text-[10px] uppercase font-mono-tabular text-slate-300">
                            {item.aspectLabel}
                          </span>
                          <p className="text-sm font-bold text-white font-editorial">{item.title}</p>
                          <span className="text-xs text-slate-300">{item.dimensions}</span>
                        </div>
                      )}

                      <span className="absolute top-2 left-2 text-[10px] bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded font-semibold">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono-tabular">
                        <span>{item.clientOrSeries}</span>
                        <span className="text-emerald-400">{item.turnaround}</span>
                      </div>

                      <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400 font-mono-tabular">
                        <span className="bg-slate-900 px-2 py-0.5 rounded">
                          Tools: {item.tools.join(', ')}
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-medium">
                          {item.metrics}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 py-3 bg-slate-900/70 border-t border-slate-700/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono-tabular text-slate-500">ID: {item.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMedia(item)}
                        className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove "${item.title}" from portfolio?`)) {
                            deleteVisualMedia(item.id);
                            showToast('Item deleted.');
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2.5 py-1 bg-red-950/40 hover:bg-red-950/80 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: EMBEDDED SHORT-FORM VIDEO REELS                    */}
        {/* ========================================================= */}
        {activeTab === 'reels' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Manage Vertical Video Reels (Kinetic Captions &amp; Pacing)
              </h2>
              <span className="text-xs text-slate-500 font-mono-tabular">
                Interactive simulated players update live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoReels.map((reel) => (
                <div
                  key={reel.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {reel.badgeLabel}
                      </span>
                      <span className="text-xs font-mono-tabular text-slate-400">
                        {reel.duration} · {reel.tools.join(', ')}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white leading-snug font-editorial">
                      {reel.title}
                    </h3>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-mono-tabular text-emerald-400">
                        Kinetic Caption Stream Preview
                      </span>
                      <p className="text-xs italic text-slate-200">{reel.captionPreview}</p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{reel.summary}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">SLA TURNAROUND</span>
                        <span className="font-semibold text-slate-200">{reel.turnaround}</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">METRIC / OUTCOME</span>
                        <span className="font-semibold text-emerald-400">{reel.retentionMetric}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono-tabular text-slate-500">ID: {reel.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditReel(reel)}
                        className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Reel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove reel "${reel.title}"?`)) {
                            deleteVideoReel(reel.id);
                            showToast('Video reel removed.');
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 bg-red-950/40 hover:bg-red-950/80 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONTENT DISTRIBUTION SCHEDULE                      */}
        {/* ========================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Weekly Content Distribution Schedule (Telegram, Instagram, YouTube)
              </h2>
              <span className="text-xs text-slate-500 font-mono-tabular">
                Click status tag to advance state
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-400">
                      <th className="py-3 px-4">Day &amp; Time</th>
                      <th className="py-3 px-3">Platform</th>
                      <th className="py-3 px-4">Content Title &amp; Outline</th>
                      <th className="py-3 px-3">Asset Ref</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 text-xs">
                    {calendarSlots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3 px-4 align-top whitespace-nowrap">
                          <span className="font-semibold text-white block">
                            {slot.day}
                          </span>
                          <span className="font-mono-tabular text-slate-400 mt-0.5 block">
                            {slot.time}
                          </span>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                              slot.channel === 'Telegram'
                                ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                : slot.channel === 'Instagram'
                                ? 'bg-pink-950 text-pink-300 border border-pink-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {slot.channel}
                          </span>
                        </td>
                        <td className="py-3 px-4 align-top max-w-md">
                          <p className="font-semibold text-white leading-snug">{slot.title}</p>
                          <p className="text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {slot.copyPreview}
                          </p>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap font-mono-tabular text-slate-400">
                          {slot.assetRef}
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => cycleSlotStatus(slot.id)}
                            title="Click to cycle status: Ready ➔ Scheduled ➔ Published"
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                              slot.status === 'Published'
                                ? 'bg-emerald-600 text-white'
                                : slot.status === 'Scheduled'
                                ? 'bg-slate-700 text-slate-100'
                                : 'bg-amber-900/60 text-amber-200 border border-amber-700'
                            }`}
                          >
                            {slot.status} ↻
                          </button>
                        </td>
                        <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSlot(slot)}
                              className="p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors cursor-pointer"
                              title="Edit slot"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete slot "${slot.title}"?`)) {
                                  deleteCalendarSlot(slot.id);
                                  showToast('Slot removed.');
                                }
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 rounded transition-colors cursor-pointer"
                              title="Delete slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CLIENT WORKSTREAMS & MILESTONES                   */}
        {/* ========================================================= */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Client Workstreams &amp; Milestones
              </h2>
              <span className="text-xs text-slate-500 font-mono-tabular">
                Ongoing duties and delivered projects
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-400">
                      <th className="py-3 px-4">Workstream &amp; Notes</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Timeframe</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 text-xs">
                    {milestones.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3 px-4 align-top max-w-md">
                          <p className="font-semibold text-white leading-snug">{m.milestoneTarget}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{m.leadNote}</p>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded font-medium text-[11px]">
                            {m.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap font-mono-tabular text-slate-400">
                          {m.period}
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => cycleMilestoneStatus(m.id)}
                            title="Click to toggle Ongoing / Completed"
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                              m.completionStatus === 'Completed'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-sky-700 text-white'
                            }`}
                          >
                            {m.completionStatus} ↻
                          </button>
                        </td>
                        <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMilestone(m)}
                              className="p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors cursor-pointer"
                              title="Edit milestone"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete workstream "${m.milestoneTarget}"?`)) {
                                  deleteMilestone(m.id);
                                  showToast('Milestone record deleted.');
                                }
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 rounded transition-colors cursor-pointer"
                              title="Delete milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT / ADD VISUAL MEDIA DELIVERABLE              */}
      {/* ========================================================= */}
      {isMediaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-editorial">
                {editingMedia ? 'Edit Visual Media Deliverable' : 'Add New Visual Media Deliverable'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              {mediaError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200">
                  {mediaError}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-300 mb-1">Deliverable Title</label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="e.g. Faith & Leadership Annual Summit Poster"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value as MediaCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    {MEDIA_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Client or Series</label>
                  <input
                    type="text"
                    value={mediaClient}
                    onChange={(e) => setMediaClient(e.target.value)}
                    placeholder="e.g. Executive Mentoring Series"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Image URL / Asset Path (e.g. /assets/fitness_saturdays_flyer.jpg or any image URL)
                </label>
                <input
                  type="text"
                  value={mediaImageSrc}
                  onChange={(e) => setMediaImageSrc(e.target.value)}
                  placeholder="/assets/your-image.jpg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Leave blank to use stylized editorial typography canvas.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tools (comma separated)</label>
                  <input
                    type="text"
                    value={mediaTools}
                    onChange={(e) => setMediaTools(e.target.value)}
                    placeholder="Canva, Figma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Turnaround SLA</label>
                  <input
                    type="text"
                    value={mediaTurnaround}
                    onChange={(e) => setMediaTurnaround(e.target.value)}
                    placeholder="16 Hours"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={mediaDimensions}
                    onChange={(e) => setMediaDimensions(e.target.value)}
                    placeholder="1080×1350 px"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Deliverables Package</label>
                  <input
                    type="text"
                    value={mediaDeliverables}
                    onChange={(e) => setMediaDeliverables(e.target.value)}
                    placeholder="A3 Print Flyer · Speaker Cards"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Outcome / Metric</label>
                  <input
                    type="text"
                    value={mediaMetrics}
                    onChange={(e) => setMediaMetrics(e.target.value)}
                    placeholder="4,200+ Registrations Supported"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  value={mediaSummary}
                  onChange={(e) => setMediaSummary(e.target.value)}
                  placeholder="Describe the operational purpose, visual hierarchy, and execution details..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  {editingMedia ? 'Save Changes' : 'Create Deliverable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT / ADD VIDEO REEL                            */}
      {/* ========================================================= */}
      {isReelModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-editorial">
                {editingReel ? 'Edit Short-Form Video Reel' : 'Add New Short-Form Video Reel'}
              </h3>
              <button
                type="button"
                onClick={() => setIsReelModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4 text-xs">
              {reelError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200">
                  {reelError}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-300 mb-1">Reel Title</label>
                <input
                  type="text"
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="e.g. Weekly Sermon Recap Reel with Kinetic Captions"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={reelBadge}
                    onChange={(e) => setReelBadge(e.target.value)}
                    placeholder="9:16 REEL"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={reelDuration}
                    onChange={(e) => setReelDuration(e.target.value)}
                    placeholder="00:58"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tools</label>
                  <input
                    type="text"
                    value={reelTools}
                    onChange={(e) => setReelTools(e.target.value)}
                    placeholder="CapCut, Canva"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Turnaround SLA</label>
                  <input
                    type="text"
                    value={reelTurnaround}
                    onChange={(e) => setReelTurnaround(e.target.value)}
                    placeholder="< 5 Hours Post-Event"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Retention Metric</label>
                  <input
                    type="text"
                    value={reelMetric}
                    onChange={(e) => setReelMetric(e.target.value)}
                    placeholder="76% Avg Completion"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Kinetic Caption Quote (Animated in Reel Viewport)
                </label>
                <textarea
                  rows={2}
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  placeholder="e.g. “Operational excellence is the bridge between vision and measurable impact.”"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none font-editorial italic"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Production Summary</label>
                <textarea
                  rows={2}
                  value={reelSummary}
                  onChange={(e) => setReelSummary(e.target.value)}
                  placeholder="Describe audio loudness normalization, pacing, b-roll cuts, or kinetic text overlays..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Video Stream URL (MP4 / WebM / CDN)
                  </label>
                  <input
                    type="text"
                    value={reelVideoUrl}
                    onChange={(e) => setReelVideoUrl(e.target.value)}
                    placeholder="https://.../reel.mp4 or /assets/video.mp4"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Poster Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={reelPosterUrl}
                    onChange={(e) => setReelPosterUrl(e.target.value)}
                    placeholder="/assets/your-image.jpg"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    YouTube Video ID / URL
                  </label>
                  <input
                    type="text"
                    value={reelYoutubeId}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      const m = val.match(/(?:watch\?v=|\/shorts\/|^)([a-zA-Z0-9_-]{11})/);
                      setReelYoutubeId(m ? m[1] : val);
                    }}
                    placeholder="e.g. nw1oVS2gDVw"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Client / Creator YouTube URL
                  </label>
                  <input
                    type="text"
                    value={reelChannelUrl}
                    onChange={(e) => setReelChannelUrl(e.target.value)}
                    placeholder="https://www.youtube.com/@channelname"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReelModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  {editingReel ? 'Save Reel' : 'Create Video Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT / ADD CALENDAR SLOT                         */}
      {/* ========================================================= */}
      {isSlotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-editorial">
                {editingSlot ? 'Edit Content Distribution Slot' : 'Add Content Distribution Slot'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              {slotError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200">
                  {slotError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Day</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value as CalendarSlot['day'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Platform</label>
                  <select
                    value={slotChannel}
                    onChange={(e) => setSlotChannel(e.target.value as DistributionChannel)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Time (WAT)</label>
                  <input
                    type="text"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    placeholder="08:30 WAT"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={slotStatus}
                    onChange={(e) => setSlotStatus(e.target.value as DistributionStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Ready">Ready</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  placeholder="e.g. Week-Ahead Content Preview & Episode Teaser"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Caption Outline / Copy</label>
                <textarea
                  rows={3}
                  value={slotCopy}
                  onChange={(e) => setSlotCopy(e.target.value)}
                  placeholder="Executive briefing: Q4 milestone targets, speaker run-of-show sign-offs..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Asset Reference Code</label>
                <input
                  type="text"
                  value={slotAssetRef}
                  onChange={(e) => setSlotAssetRef(e.target.value)}
                  placeholder="TG-OPS-101"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  {editingSlot ? 'Save Slot' : 'Confirm Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: EDIT / ADD MILESTONE RECORD                      */}
      {/* ========================================================= */}
      {isMilestoneModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-editorial">
                {editingMilestone ? 'Edit Workstream' : 'Add Workstream'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
              {msError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200">
                  {msError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={msCategory}
                    onChange={(e) => setMsCategory(e.target.value as MilestoneCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    {MILESTONE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={msStatus}
                    onChange={(e) => setMsStatus(e.target.value as MilestoneStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    {MILESTONE_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Timeframe</label>
                  <input
                    type="text"
                    value={msPeriod}
                    onChange={(e) => setMsPeriod(e.target.value)}
                    placeholder="Since 2021 / Delivered project"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Workstream</label>
                <textarea
                  rows={2}
                  value={msTarget}
                  onChange={(e) => setMsTarget(e.target.value)}
                  placeholder="e.g. Executive Inbox Management & 4-Tier Triage"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Note</label>
                <input
                  type="text"
                  value={msLeadNote}
                  onChange={(e) => setMsLeadNote(e.target.value)}
                  placeholder="What the work involves, in one line."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  {editingMilestone ? 'Save Milestone' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
