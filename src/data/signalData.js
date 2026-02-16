// Signal Intelligence Data for Advertiser
// Source: TAU Signal competitive intelligence platform

export const signalData = {
  // Traffic & Market Share
  traffic: {
    currentMonth: {
      visits: 452000,
      month: 'Dec 2024',
      change: '+32.5%'
    },
    trend: [
      { month: 'Oct', visits: 337000 },
      { month: 'Nov', visits: 341000 },
      { month: 'Dec', visits: 452000 }
    ],
    marketShare: {
      advertiser: { visits: 452000, share: 88.4, trend: 'up' },
      endurance: { visits: 37000, share: 7.2, trend: 'stable' },
      carchex: { visits: 20000, share: 3.9, trend: 'down' },
      protectmycar: { visits: 2000, share: 0.4, trend: 'down' }
    }
  },

  // SEO Performance
  seo: {
    totalKeywords: 29840,
    topTenKeywords: 34,
    highVolumeGaps: 236,
    keywordDistribution: [
      { position: 'Top 3', count: 18, color: '#10b981' },
      { position: '4-10', count: 16, color: '#3b82f6' },
      { position: '11-20', count: 89, color: '#8b5cf6' },
      { position: '21-50', count: 342, color: '#f59e0b' },
      { position: '51+', count: 29375, color: '#6b7280' }
    ],
    opportunities: [
      {
        keyword: 'best car warranty',
        volume: 18100,
        currentRank: 15,
        difficulty: 'Medium',
        gap: true
      },
      {
        keyword: 'extended car warranty',
        volume: 12100,
        currentRank: 8,
        difficulty: 'High',
        gap: false
      },
      {
        keyword: 'vehicle service contract',
        volume: 8900,
        currentRank: null,
        difficulty: 'Low',
        gap: true
      },
      {
        keyword: 'car protection plan',
        volume: 6600,
        currentRank: 22,
        difficulty: 'Medium',
        gap: true
      }
    ]
  },

  // Competitive Intelligence
  competitive: {
    competitors: [
      {
        name: 'Advertiser',
        traffic: 452000,
        keywords: 29840,
        spend: 150000,
        social: { facebook: 146000, instagram: 73000, twitter: 12000 },
        aiVisible: 0,
        position: 'leader'
      },
      {
        name: 'Endurance',
        traffic: 37000,
        keywords: 8240,
        spend: 45000,
        social: { facebook: 28000, instagram: 15000, twitter: 3000 },
        aiVisible: 12,
        position: 'challenger'
      },
      {
        name: 'Carchex',
        traffic: 20000,
        keywords: 5120,
        spend: 28000,
        social: { facebook: 18000, instagram: 8000, twitter: 1500 },
        aiVisible: 8,
        position: 'follower'
      },
      {
        name: 'ProtectMyCar',
        traffic: 2000,
        keywords: 1840,
        spend: 12000,
        social: { facebook: 5000, instagram: 2000, twitter: 500 },
        aiVisible: 3,
        position: 'niche'
      }
    ],
    strengths: [
      'Dominant market share (88.4%)',
      'Massive keyword coverage (29.8K)',
      'Strong social presence (219K total)',
      'Established brand recognition'
    ],
    weaknesses: [
      'Zero AI visibility (competitors ahead)',
      '236 high-volume keyword gaps',
      'Lower top-10 keyword concentration',
      'Room for spend efficiency gains'
    ]
  },

  // AI Readiness & Visibility
  aiReadiness: {
    advertiser: {
      score: 0,
      citations: 0,
      coverage: '0%',
      status: 'Not Indexed',
      color: '#dc2626'
    },
    competitors: [
      { name: 'Endurance', score: 12, citations: 45, coverage: '12%', color: '#f59e0b' },
      { name: 'Carchex', score: 8, citations: 28, coverage: '8%', color: '#f59e0b' },
      { name: 'ProtectMyCar', score: 3, citations: 9, coverage: '3%', color: '#ef4444' }
    ],
    opportunities: [
      {
        channel: 'ChatGPT',
        impact: 'High',
        effort: 'Medium',
        priority: 1,
        description: 'Optimize for AI search results and citations'
      },
      {
        channel: 'Perplexity',
        impact: 'High',
        effort: 'Low',
        priority: 2,
        description: 'Structure content for AI-friendly indexing'
      },
      {
        channel: 'Claude',
        impact: 'Medium',
        effort: 'Low',
        priority: 3,
        description: 'Build authoritative content hub'
      },
      {
        channel: 'Gemini',
        impact: 'Medium',
        effort: 'Medium',
        priority: 4,
        description: 'Enhanced schema markup and entities'
      }
    ],
    potential: {
      newVisits: 68000,
      monthlyValue: '$340K',
      conversionLift: '+15-25%',
      timeframe: '6-9 months'
    }
  },

  // Spend Analysis
  spend: {
    advertiser: {
      estimated: { min: 75000, max: 224000, average: 150000 },
      channels: [
        { name: 'Search', amount: 65000, share: 43 },
        { name: 'Display', amount: 35000, share: 23 },
        { name: 'Social', amount: 28000, share: 19 },
        { name: 'Video', amount: 22000, share: 15 }
      ],
      efficiency: 'Good',
      cpa: '$42-$58'
    },
    competitive: [
      { name: 'Advertiser', spend: 150000, traffic: 452000, efficiency: 100 },
      { name: 'Endurance', spend: 45000, traffic: 37000, efficiency: 82 },
      { name: 'Carchex', spend: 28000, traffic: 20000, efficiency: 71 },
      { name: 'ProtectMyCar', spend: 12000, traffic: 2000, efficiency: 17 }
    ],
    recommendations: [
      'Shift 10-15% of search budget to AI visibility initiatives',
      'Increase video spend in high-intent markets',
      'Test AI-native content formats (conversational, Q&A)',
      'Optimize CPA through AI-powered audience targeting'
    ]
  },

  // Key Insights
  insights: [
    {
      category: 'Market Position',
      insight: 'Advertiser dominates with 88.4% market share, but competitors are investing in AI visibility',
      impact: 'High',
      urgency: 'Medium'
    },
    {
      category: 'AI Opportunity',
      insight: 'Zero AI visibility presents massive untapped channel worth $340K/month',
      impact: 'Critical',
      urgency: 'High'
    },
    {
      category: 'SEO Gaps',
      insight: '236 high-volume keywords where competitors rank but Advertiser doesn\'t',
      impact: 'High',
      urgency: 'Medium'
    },
    {
      category: 'Spend Efficiency',
      insight: 'Advertiser leads efficiency metrics, but AI optimization could reduce CPA 15-20%',
      impact: 'Medium',
      urgency: 'Low'
    }
  ],

  // Summary Stats for Quick View
  summary: {
    marketPosition: 'Dominant Leader',
    aiOpportunity: '$340K/month',
    seoGaps: 236,
    competitiveAdvantage: '12.2x larger than nearest competitor',
    urgentAction: 'AI Visibility Strategy'
  }
};
