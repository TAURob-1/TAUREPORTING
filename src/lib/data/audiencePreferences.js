export const AGE_PREFERENCES = [
  { ageGroup: '16-24', platforms: 'TikTok, Instagram, YouTube', content: 'Short-form, trending, music', habits: 'Mobile-first, evening peaks' },
  { ageGroup: '25-34', platforms: 'YouTube, Instagram, Spotify', content: 'On-demand, lifestyle, comedy', habits: 'Streaming dominant, flexible schedules' },
  { ageGroup: '35-44', platforms: 'Facebook, YouTube, TV', content: 'News, drama, family', habits: 'Mixed linear + streaming, primetime' },
  { ageGroup: '45-54', platforms: 'Facebook, TV, Radio', content: 'News, drama, talk radio', habits: 'Linear TV and morning radio' },
  { ageGroup: '55+', platforms: 'TV, Radio, Facebook', content: 'News, soaps, classic drama', habits: 'Linear-first, daytime heavy' },
];

export const GENDER_PREFERENCES = [
  { platform: 'Sky Sports', maleSkew: '75%', femaleSkew: '25%', notes: 'Heavy male skew' },
  { platform: 'ITV Soaps', maleSkew: '30%', femaleSkew: '70%', notes: 'Strong female primetime' },
  { platform: 'Gaming (Twitch/YouTube)', maleSkew: '65%', femaleSkew: '35%', notes: 'Male skew with steady female growth' },
  { platform: 'Instagram', maleSkew: '40%', femaleSkew: '60%', notes: 'Visual-first and creator-led' },
  { platform: 'TikTok', maleSkew: '45%', femaleSkew: '55%', notes: 'Slight female skew' },
];

export const INCOME_PREFERENCES = [
  { platform: 'Sky Premium', affluent: 'High', mid: 'Medium', mass: 'Low' },
  { platform: 'Amazon Prime Video', affluent: 'High', mid: 'High', mass: 'Medium' },
  { platform: 'ITV/Channel 4', affluent: 'Medium', mid: 'High', mass: 'High' },
  { platform: 'Spotify Premium', affluent: 'Medium', mid: 'High', mass: 'Medium' },
  { platform: 'ITVX/All4 (Free Streaming)', affluent: 'Low', mid: 'Medium', mass: 'High' },
];
