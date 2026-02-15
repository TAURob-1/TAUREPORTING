// Channel inventory for campaign planning
// Shows available impressions across CTV and traditional TV platforms

export const channelInventory = {
  ctv: [
    {
      name: 'YouTube (CTV)',
      platform: 'CTV',
      impressions: 3200000,
      cpm: 24,
      reach: '10.4M households',
      color: '#FF0000',
      icon: 'YT'
    },
    {
      name: 'Roku',
      platform: 'CTV',
      impressions: 2400000,
      cpm: 26,
      reach: '8.2M households',
      color: '#9333ea',
      icon: 'R'
    },
    {
      name: 'Hulu',
      platform: 'CTV',
      impressions: 1800000,
      cpm: 32,
      reach: '5.1M households',
      color: '#10b981',
      icon: 'H'
    },
    {
      name: 'Amazon Fire TV',
      platform: 'CTV',
      impressions: 1600000,
      cpm: 28,
      reach: '4.8M households',
      color: '#f97316',
      icon: 'AF'
    },
    {
      name: 'Disney+',
      platform: 'CTV',
      impressions: 1200000,
      cpm: 38,
      reach: '3.6M households',
      color: '#113CCF',
      icon: 'D+'
    },
    {
      name: 'Peacock',
      platform: 'CTV',
      impressions: 1100000,
      cpm: 28,
      reach: '3.2M households',
      color: '#0ea5e9',
      icon: 'Pk'
    },
    {
      name: 'TikTok (CTV)',
      platform: 'CTV',
      impressions: 950000,
      cpm: 22,
      reach: '2.8M households',
      color: '#000000',
      icon: 'TT'
    },
    {
      name: 'Tubi',
      platform: 'CTV',
      impressions: 1400000,
      cpm: 16,
      reach: '4.2M households',
      color: '#0891b2',
      icon: 'Tu'
    },
    {
      name: 'Netflix',
      platform: 'CTV',
      impressions: 800000,
      cpm: 42,
      reach: '2.4M households',
      color: '#E50914',
      icon: 'N'
    },
    {
      name: 'Paramount+',
      platform: 'CTV',
      impressions: 750000,
      cpm: 30,
      reach: '2.2M households',
      color: '#4f46e5',
      icon: 'P+'
    },
    {
      name: 'Samsung TV+',
      platform: 'CTV',
      impressions: 650000,
      cpm: 18,
      reach: '2.0M households',
      color: '#1428A0',
      icon: 'S+'
    },
    {
      name: 'Max (HBO)',
      platform: 'CTV',
      impressions: 600000,
      cpm: 40,
      reach: '1.8M households',
      color: '#5822B4',
      icon: 'MX'
    },
    {
      name: 'Pluto TV',
      platform: 'CTV',
      impressions: 1100000,
      cpm: 15,
      reach: '3.4M households',
      color: '#1e40af',
      icon: 'PL'
    },
    {
      name: 'LG Channels',
      platform: 'CTV',
      impressions: 480000,
      cpm: 20,
      reach: '1.5M households',
      color: '#a21caf',
      icon: 'LG'
    },
    {
      name: 'Vizio WatchFree+',
      platform: 'CTV',
      impressions: 420000,
      cpm: 17,
      reach: '1.3M households',
      color: '#854d0e',
      icon: 'VZ'
    },
    {
      name: 'Fubo',
      platform: 'CTV',
      impressions: 380000,
      cpm: 34,
      reach: '1.1M households',
      color: '#0369a1',
      icon: 'FU'
    },
    {
      name: 'ESPN+',
      platform: 'CTV',
      impressions: 520000,
      cpm: 36,
      reach: '1.6M households',
      color: '#b91c1c',
      icon: 'E+'
    },
    {
      name: 'Apple TV+',
      platform: 'CTV',
      impressions: 350000,
      cpm: 40,
      reach: '1.0M households',
      color: '#525252',
      icon: 'A+'
    }
  ],
  
  traditional: [
    {
      name: 'Cable News Networks',
      platform: 'Linear TV',
      impressions: 3200000,
      cpm: 45,
      reach: '12.4M households',
      color: '#374151',
      icon: 'CN'
    },
    {
      name: 'Broadcast Networks (ABC/CBS/NBC/FOX)',
      platform: 'Linear TV',
      impressions: 4800000,
      cpm: 52,
      reach: '18.2M households',
      color: '#1f2937',
      icon: 'BC'
    },
    {
      name: 'Sports Networks (ESPN/FS1)',
      platform: 'Linear TV',
      impressions: 2800000,
      cpm: 58,
      reach: '9.6M households',
      color: '#111827',
      icon: 'SP'
    },
    {
      name: 'Cable Entertainment',
      platform: 'Linear TV',
      impressions: 2400000,
      cpm: 38,
      reach: '8.8M households',
      color: '#4b5563',
      icon: 'CE'
    }
  ]
};

// Calculate total available inventory
export function getTotalInventory() {
  const ctvTotal = channelInventory.ctv.reduce((sum, ch) => sum + ch.impressions, 0);
  const tvTotal = channelInventory.traditional.reduce((sum, ch) => sum + ch.impressions, 0);
  
  return {
    ctv: ctvTotal,
    traditional: tvTotal,
    total: ctvTotal + tvTotal
  };
}

// Format impressions for display
export function formatImpressions(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

// Calculate estimated budget for selected channels
export function calculateBudget(selectedChannels) {
  return selectedChannels.reduce((total, channel) => {
    return total + (channel.impressions / 1000 * channel.cpm);
  }, 0);
}
