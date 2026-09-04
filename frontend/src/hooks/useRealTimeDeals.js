import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Mock deals for initial real-time demonstration
export const INITIAL_DEALS = [
  {
    dealId: 'deal-9801',
    brandName: 'Aura Skincare Lab',
    brandLogo: '✨',
    campaignName: 'Hydra-Glow Monsoon Launch',
    category: 'Beauty & Lifestyle',
    city: 'Mumbai',
    compensationRange: { min: 45000, max: 70000, currency: 'INR' },
    requiredDeliverables: ['1x 4K Cinematic Reel (60s)', '3x Aesthetic Story Sequences', 'Raw B-Roll Handoff'],
    matchScore: 98,
    deadlineDate: '2026-09-18',
    status: 'OPEN',
    brandTier: 'Tier 1 Enterprise',
    matchCriteria: {
      audienceAffinity: '99%',
      visualTone: 'High Fashion Clean',
      historicalPunctuality: '100%'
    }
  },
  {
    dealId: 'deal-9802',
    brandName: 'Nordic Sound Labs',
    brandLogo: '🎧',
    campaignName: 'Spatial Audio Studio Campaign',
    category: 'Consumer Tech',
    city: 'Bengaluru',
    compensationRange: { min: 80000, max: 120000, currency: 'INR' },
    requiredDeliverables: ['2x Dedicated Product Reels', '1x YouTube Short Integration'],
    matchScore: 94,
    deadlineDate: '2026-09-24',
    status: 'MATCHING',
    brandTier: 'Global Tech Sponsor',
    matchCriteria: {
      audienceAffinity: '95%',
      visualTone: 'Dark Cyberpunk Studio',
      historicalPunctuality: '98%'
    }
  },
  {
    dealId: 'deal-9803',
    brandName: 'Raw Athletics Co.',
    brandLogo: '⚡',
    campaignName: 'Carbon Fiber Apparel Showcase',
    category: 'Fitness & Streetwear',
    city: 'Delhi NCR',
    compensationRange: { min: 55000, max: 85000, currency: 'INR' },
    requiredDeliverables: ['1x Dynamic Workout Reel', '4x Editorial Photos for Lookbook'],
    matchScore: 89,
    deadlineDate: '2026-10-02',
    status: 'OPEN',
    brandTier: 'Performance Brand',
    matchCriteria: {
      audienceAffinity: '91%',
      visualTone: 'High Contrast Kinetic',
      historicalPunctuality: '96%'
    }
  }
];

const SIMULATION_POOL = [
  {
    dealId: 'deal-live-101',
    brandName: 'Zenith Camera Systems',
    brandLogo: '🎥',
    campaignName: 'Cinema FX High-Speed Masterclass',
    category: 'Film & Tech',
    city: 'Bengaluru',
    compensationRange: { min: 95000, max: 150000, currency: 'INR' },
    requiredDeliverables: ['1x Behind-The-Scenes Studio Reel', '2x Grading Workflow Shorts'],
    matchScore: 99,
    deadlineDate: '2026-09-30',
    status: 'OPEN',
    brandTier: 'Flagship Partner',
    matchCriteria: { audienceAffinity: '99%', visualTone: 'Cinema Grade', historicalPunctuality: '100%' }
  },
  {
    dealId: 'deal-live-102',
    brandName: 'Komorebi Organics',
    brandLogo: '🌿',
    campaignName: 'Matcha Rituals Global Campaign',
    category: 'Wellness & Food',
    city: 'Hyderabad',
    compensationRange: { min: 40000, max: 65000, currency: 'INR' },
    requiredDeliverables: ['1x Aesthetic Morning Routine Reel', '5x Hi-Res Product Shots'],
    matchScore: 92,
    deadlineDate: '2026-10-08',
    status: 'OPEN',
    brandTier: 'Direct-to-Consumer Leader',
    matchCriteria: { audienceAffinity: '94%', visualTone: 'Warm Organic Linen', historicalPunctuality: '95%' }
  }
];

/**
 * Enterprise React Hook for Real-Time Deal Subscriptions & WebSocket Event Streams
 * Follows suggestionv2.md architecture (Section 1.A)
 */
export const useRealTimeDeals = (creatorId = 'creator-verified-01') => {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [activeNotification, setActiveNotification] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Real-time channel subscription (Supabase Broadcast Channel + Event Listener)
  useEffect(() => {
    let channel;
    try {
      channel = supabase
        .channel(`creator:${creatorId}:deals`)
        .on('broadcast', { event: 'DEAL_MATCHED' }, (payload) => {
          if (payload?.newDeal) {
            setDeals((prev) => [payload.newDeal, ...prev.filter(d => d.dealId !== payload.newDeal.dealId)]);
            setActiveNotification(payload.newDeal);
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('Real-time Supabase deals channel fallback mode:', err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [creatorId]);

  // Trigger simulated live incoming deal
  const simulateIncomingDeal = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SIMULATION_POOL.length);
    const template = SIMULATION_POOL[randomIndex];
    const simulatedDeal = {
      ...template,
      dealId: `deal-live-${Date.now()}`,
      matchScore: Math.floor(88 + Math.random() * 12),
      status: 'OPEN'
    };

    setDeals((prev) => [simulatedDeal, ...prev.filter(d => d.dealId !== simulatedDeal.dealId)]);
    setActiveNotification(simulatedDeal);
  }, []);

  // Accept a deal in the state machine
  const acceptDeal = useCallback((dealId) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.dealId === dealId ? { ...deal, status: 'ACCEPTED' } : deal
      )
    );
    if (activeNotification?.dealId === dealId) {
      setActiveNotification(null);
    }
  }, [activeNotification]);

  // Decline or close notification
  const clearNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  return {
    deals,
    activeNotification,
    clearNotification,
    simulateIncomingDeal,
    acceptDeal,
    isSimulating,
    setIsSimulating
  };
};

export default useRealTimeDeals;
