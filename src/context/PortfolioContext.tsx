/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type VisualMediaItem,
  type VideoReelItem,
  type CalendarSlot,
  type MilestoneRecord,
  type MilestoneStatus,
  nextDistributionStatus,
  INITIAL_VISUAL_MEDIA_ITEMS,
  INITIAL_VIDEO_REELS,
  INITIAL_CALENDAR_SLOTS,
  INITIAL_MILESTONES,
} from '../utils/portfolioLogic';

interface PortfolioStore {
  visualMedia: VisualMediaItem[];
  videoReels: VideoReelItem[];
  calendarSlots: CalendarSlot[];
  milestones: MilestoneRecord[];
}

interface PortfolioContextType extends PortfolioStore {
  // Visual Media Actions
  addVisualMedia: (item: Omit<VisualMediaItem, 'id'>) => void;
  updateVisualMedia: (id: string, updates: Partial<VisualMediaItem>) => void;
  deleteVisualMedia: (id: string) => void;

  // Video Reel Actions
  addVideoReel: (reel: Omit<VideoReelItem, 'id'>) => void;
  updateVideoReel: (id: string, updates: Partial<VideoReelItem>) => void;
  deleteVideoReel: (id: string) => void;

  // Content Calendar Actions
  addCalendarSlot: (slot: Omit<CalendarSlot, 'id'>) => void;
  updateCalendarSlot: (id: string, updates: Partial<CalendarSlot>) => void;
  deleteCalendarSlot: (id: string) => void;
  cycleSlotStatus: (id: string) => void;

  // Milestone Actions
  addMilestone: (record: Omit<MilestoneRecord, 'id'>) => void;
  updateMilestone: (id: string, updates: Partial<MilestoneRecord>) => void;
  deleteMilestone: (id: string) => void;
  cycleMilestoneStatus: (id: string) => void;

  // Global Actions
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'portfolio_hub_store_v1';

// Fingerprint of the seed data shipped in code. A stored copy saved against a
// different seed is discarded, so content edits reach every returning visitor.
function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

const SEED_FINGERPRINT = hashString(
  JSON.stringify([INITIAL_VISUAL_MEDIA_ITEMS, INITIAL_VIDEO_REELS, INITIAL_CALENDAR_SLOTS, INITIAL_MILESTONES])
);

const PortfolioContext = createContext<PortfolioContextType | null>(null);

function loadInitialData(): PortfolioStore {
  if (typeof window === 'undefined') {
    return {
      visualMedia: INITIAL_VISUAL_MEDIA_ITEMS,
      videoReels: INITIAL_VIDEO_REELS,
      calendarSlots: INITIAL_CALENDAR_SLOTS,
      milestones: INITIAL_MILESTONES,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed.seedFingerprint === SEED_FINGERPRINT &&
        Array.isArray(parsed.visualMedia) &&
        Array.isArray(parsed.videoReels) &&
        Array.isArray(parsed.calendarSlots) &&
        Array.isArray(parsed.milestones)
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse portfolio store from localStorage', err);
  }

  return {
    visualMedia: INITIAL_VISUAL_MEDIA_ITEMS,
    videoReels: INITIAL_VIDEO_REELS,
    calendarSlots: INITIAL_CALENDAR_SLOTS,
    milestones: INITIAL_MILESTONES,
  };
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<PortfolioStore>(loadInitialData);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...store, seedFingerprint: SEED_FINGERPRINT }));
    } catch (err) {
      console.error('Failed to persist portfolio store', err);
    }
  }, [store]);

  // Visual Media Handlers
  const addVisualMedia = (item: Omit<VisualMediaItem, 'id'>) => {
    const newItem: VisualMediaItem = {
      ...item,
      id: `media-${Date.now()}`,
    };
    setStore((prev) => ({
      ...prev,
      visualMedia: [newItem, ...prev.visualMedia],
    }));
  };

  const updateVisualMedia = (id: string, updates: Partial<VisualMediaItem>) => {
    setStore((prev) => ({
      ...prev,
      visualMedia: prev.visualMedia.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const deleteVisualMedia = (id: string) => {
    setStore((prev) => ({
      ...prev,
      visualMedia: prev.visualMedia.filter((m) => m.id !== id),
    }));
  };

  // Video Reel Handlers
  const addVideoReel = (reel: Omit<VideoReelItem, 'id'>) => {
    const newReel: VideoReelItem = {
      ...reel,
      id: `reel-${Date.now()}`,
    };
    setStore((prev) => ({
      ...prev,
      videoReels: [...prev.videoReels, newReel],
    }));
  };

  const updateVideoReel = (id: string, updates: Partial<VideoReelItem>) => {
    setStore((prev) => ({
      ...prev,
      videoReels: prev.videoReels.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  };

  const deleteVideoReel = (id: string) => {
    setStore((prev) => ({
      ...prev,
      videoReels: prev.videoReels.filter((r) => r.id !== id),
    }));
  };

  // Calendar Handlers
  const addCalendarSlot = (slot: Omit<CalendarSlot, 'id'>) => {
    const newSlot: CalendarSlot = {
      ...slot,
      id: `cal-${Date.now()}`,
    };
    setStore((prev) => ({
      ...prev,
      calendarSlots: [...prev.calendarSlots, newSlot],
    }));
  };

  const updateCalendarSlot = (id: string, updates: Partial<CalendarSlot>) => {
    setStore((prev) => ({
      ...prev,
      calendarSlots: prev.calendarSlots.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteCalendarSlot = (id: string) => {
    setStore((prev) => ({
      ...prev,
      calendarSlots: prev.calendarSlots.filter((s) => s.id !== id),
    }));
  };

  const cycleSlotStatus = (id: string) => {
    setStore((prev) => ({
      ...prev,
      calendarSlots: prev.calendarSlots.map((s) =>
        s.id === id ? { ...s, status: nextDistributionStatus(s.status) } : s
      ),
    }));
  };

  // Milestone Handlers
  const addMilestone = (record: Omit<MilestoneRecord, 'id'>) => {
    const newRecord: MilestoneRecord = {
      ...record,
      id: `ms-${Date.now()}`,
    };
    setStore((prev) => ({
      ...prev,
      milestones: [newRecord, ...prev.milestones],
    }));
  };

  const updateMilestone = (id: string, updates: Partial<MilestoneRecord>) => {
    setStore((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const deleteMilestone = (id: string) => {
    setStore((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const cycleMilestoneStatus = (id: string) => {
    setStore((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => {
        if (m.id !== id) return m;
        const nextStatus: MilestoneStatus = m.completionStatus === 'Ongoing' ? 'Completed' : 'Ongoing';
        return { ...m, completionStatus: nextStatus };
      }),
    }));
  };

  const resetToDefaults = () => {
    const fresh: PortfolioStore = {
      visualMedia: INITIAL_VISUAL_MEDIA_ITEMS,
      videoReels: INITIAL_VIDEO_REELS,
      calendarSlots: INITIAL_CALENDAR_SLOTS,
      milestones: INITIAL_MILESTONES,
    };
    setStore(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {}
  };

  return (
    <PortfolioContext.Provider
      value={{
        ...store,
        addVisualMedia,
        updateVisualMedia,
        deleteVisualMedia,
        addVideoReel,
        updateVideoReel,
        deleteVideoReel,
        addCalendarSlot,
        updateCalendarSlot,
        deleteCalendarSlot,
        cycleSlotStatus,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        cycleMilestoneStatus,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextType {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
