import {
  channelInventory as usChannelInventory,
  formatImpressions,
  calculateBudget,
} from './channelInventory';

const ukChannelInventory = {
  ctv: [
    {
      name: 'YouTube CTV',
      platform: 'CTV',
      impressions: 2900000,
      cpm: 14,
      reach: '35.6M ad-reachable',
      color: '#FF0000',
      icon: 'YT',
    },
    {
      name: 'ITVX',
      platform: 'CTV',
      impressions: 1800000,
      cpm: 18,
      reach: '22.5M ad-reachable',
      color: '#1D78C1',
      icon: 'IX',
    },
    {
      name: 'C4 Streaming',
      platform: 'CTV',
      impressions: 1500000,
      cpm: 17,
      reach: '18.2M ad-reachable',
      color: '#6A1B9A',
      icon: 'C4',
    },
  ],
  traditional: [
    {
      name: 'ITV Linear',
      platform: 'Linear TV',
      impressions: 2600000,
      cpm: 24,
      reach: '45.0M ad-reachable',
      color: '#1D78C1',
      icon: 'ITV',
    },
    {
      name: 'Channel 4',
      platform: 'Linear TV',
      impressions: 2200000,
      cpm: 22,
      reach: '42.5M ad-reachable',
      color: '#6A1B9A',
      icon: 'C4',
    },
    {
      name: 'Sky',
      platform: 'Linear TV',
      impressions: 1800000,
      cpm: 30,
      reach: '26.0M ad-reachable',
      color: '#0072C9',
      icon: 'SKY',
    },
  ],
};

const US_CHANNEL_TO_PROVIDER_ID = {
  'YouTube (CTV)': 'youtube_ctv',
  Roku: 'roku',
  Hulu: 'hulu',
  'Amazon Fire TV': 'amazon_fire_tv',
  'Disney+': 'disney_plus',
  Peacock: 'peacock',
  'TikTok (CTV)': 'tiktok_ctv',
  Tubi: 'tubi',
  Netflix: 'netflix',
  'Paramount+': 'paramount_plus',
  'Samsung TV+': 'samsung_tv_plus',
  'Max (HBO)': 'max_hbo',
  'Pluto TV': 'pluto_tv',
  'LG Channels': 'lg_channels',
  'Vizio WatchFree+': 'vizio_watchfree',
  Fubo: 'fubo',
  'ESPN+': 'espn_plus',
  'Apple TV+': 'apple_tv_plus',
};

const UK_CHANNEL_TO_PROVIDER_ID = {
  'YouTube CTV': 'youtube_ctv_uk',
  ITVX: 'itvx',
  'C4 Streaming': 'c4_streaming',
  'ITV Linear': 'itv_linear',
  'Channel 4': 'channel4_linear',
  Sky: 'sky_linear',
};

export function getChannelInventory(countryCode = 'US') {
  return countryCode === 'UK' ? ukChannelInventory : usChannelInventory;
}

export function getChannelProviderMap(countryCode = 'US') {
  return countryCode === 'UK' ? UK_CHANNEL_TO_PROVIDER_ID : US_CHANNEL_TO_PROVIDER_ID;
}

export { formatImpressions, calculateBudget };
