export function getWidgetPresets(companyName = 'the selected advertiser') {
  return [
    {
      id: 'competitive-share',
      label: 'Competitive Share',
      prompt: `Create a horizontal bar chart comparing ${companyName} and its main competitors on traffic share using the provided Signal dataset. Use the competitor names from the dataset and show the strongest competitors first.`,
    },
    {
      id: 'traffic-trend',
      label: 'Traffic Trend',
      prompt: `Create a line chart showing the latest available traffic trend for ${companyName} using the provided Signal dataset. Highlight any recent acceleration or slowdown.`,
    },
    {
      id: 'seo-opportunity',
      label: 'SEO Opportunity',
      prompt: `Create a ranked bar chart of the highest-value SEO opportunities for ${companyName} using the provided Signal dataset. Use keyword labels and relative volume where available.`,
    },
  ];
}

export function getPptPresets(companyName = 'the selected advertiser') {
  return [
    {
      id: 'executive-snapshot',
      label: 'Executive Snapshot',
      title: `${companyName} Executive Snapshot`,
      subtitle: 'Controlled studio preset',
      prompt: `Build a six-slide executive deck for ${companyName} using the provided Signal context data. Cover current position, competitive landscape, traffic and search signals, risk areas, and immediate actions. Use the context data directly rather than inventing unsupported claims.`,
    },
    {
      id: 'search-traffic-brief',
      label: 'Search + Traffic',
      title: `${companyName} Search and Traffic Brief`,
      subtitle: 'Controlled studio preset',
      prompt: `Build a five-slide briefing for ${companyName} focused on traffic trend, competitive share, SEO opportunity areas, and the most important takeaways from the supplied Signal context data.`,
    },
    {
      id: 'actions-brief',
      label: 'Actions Brief',
      title: `${companyName} Actions Brief`,
      subtitle: 'Controlled studio preset',
      prompt: `Build a five-slide action-oriented deck for ${companyName} using the provided Signal context data. Separate immediate actions from medium-term actions and explain the evidence behind each recommendation.`,
    },
  ];
}

export function getDefaultWidgetPreset(companyName) {
  return getWidgetPresets(companyName)[0];
}

export function getDefaultPptPreset(companyName) {
  return getPptPresets(companyName)[0];
}
