/**
 * Audience segment definitions with scoring logic
 * Each audience has criteria that score ZIP codes based on demographic fit
 */

export const AUDIENCES = {
  prime_warranty: {
    id: 'prime_warranty',
    name: 'Prime Warranty Buyers',
    description: 'Age 45-64, income $75K+, ideal for extended warranty products',
    icon: '🎯',
    color: '#3b82f6',
    criteria: [
      { field: 'age_45_64_pct', weight: 40, min: 25, target: 35 },
      { field: 'income_75_100k', weight: 25, min: 15, target: 25 },
      { field: 'income_100k_plus', weight: 25, min: 20, target: 35 },
      { field: 'households_middle_pct', weight: 10, min: 40, target: 55 }
    ]
  },
  
  affluent_families: {
    id: 'affluent_families',
    name: 'Affluent Families',
    description: 'High income households with family composition',
    icon: '👨‍👩‍👧‍👦',
    color: '#10b981',
    criteria: [
      { field: 'income_100k_plus', weight: 40, min: 30, target: 50 },
      { field: 'income_150k_plus', weight: 30, min: 15, target: 30 },
      { field: 'households_middle_pct', weight: 20, min: 35, target: 50 },
      { field: 'age_25_44_pct', weight: 10, min: 20, target: 30 }
    ]
  },
  
  suburban_homeowners: {
    id: 'suburban_homeowners',
    name: 'Suburban Homeowners',
    description: 'Middle-age homeowners in suburban areas',
    icon: '🏡',
    color: '#8b5cf6',
    criteria: [
      { field: 'age_45_64_pct', weight: 30, min: 25, target: 35 },
      { field: 'households_middle_pct', weight: 35, min: 40, target: 55 },
      { field: 'income_75_100k', weight: 20, min: 18, target: 28 },
      { field: 'income_100k_plus', weight: 15, min: 15, target: 30 }
    ]
  },
  
  urban_renters: {
    id: 'urban_renters',
    name: 'Urban Renters',
    description: 'Younger urban population, rental households',
    icon: '🏙️',
    color: '#f59e0b',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 25, target: 40 },
      { field: 'households_young_pct', weight: 35, min: 20, target: 35 },
      { field: 'income_50_75k', weight: 15, min: 18, target: 28 },
      { field: 'age_under_25_pct', weight: 10, min: 15, target: 25 }
    ]
  },
  
  budget_conscious: {
    id: 'budget_conscious',
    name: 'Budget Conscious',
    description: 'Lower income households, value-focused consumers',
    icon: '💰',
    color: '#6366f1',
    criteria: [
      { field: 'income_under_50k', weight: 50, min: 35, target: 50 },
      { field: 'income_50_75k', weight: 30, min: 20, target: 30 },
      { field: 'age_25_44_pct', weight: 10, min: 20, target: 35 },
      { field: 'age_45_64_pct', weight: 10, min: 20, target: 35 }
    ]
  },
  
  luxury_market: {
    id: 'luxury_market',
    name: 'Luxury Market',
    description: 'High-income households ($150K+), premium segment',
    icon: '💎',
    color: '#ec4899',
    criteria: [
      { field: 'income_150k_plus', weight: 50, min: 20, target: 40 },
      { field: 'income_100k_plus', weight: 30, min: 35, target: 55 },
      { field: 'households_middle_pct', weight: 15, min: 30, target: 50 },
      { field: 'age_45_64_pct', weight: 5, min: 20, target: 35 }
    ]
  },
  
  senior_market: {
    id: 'senior_market',
    name: 'Senior Market',
    description: 'Age 65+, established households',
    icon: '👴',
    color: '#14b8a6',
    criteria: [
      { field: 'age_65_plus_pct', weight: 50, min: 20, target: 35 },
      { field: 'households_senior_pct', weight: 30, min: 25, target: 40 },
      { field: 'income_75_100k', weight: 10, min: 15, target: 25 },
      { field: 'income_100k_plus', weight: 10, min: 15, target: 30 }
    ]
  },

  young_professionals: {
    id: 'young_professionals',
    name: 'Young Professionals',
    description: '25-34, urban, $50K+, college-educated career starters',
    icon: '💼',
    color: '#0891b2',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 25, target: 40 },
      { field: 'income_50_75k', weight: 25, min: 20, target: 30 },
      { field: 'income_75_100k', weight: 20, min: 15, target: 25 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 30 }
    ]
  },

  auto_enthusiasts: {
    id: 'auto_enthusiasts',
    name: 'Auto Enthusiasts',
    description: 'Multiple vehicles, suburban/rural, middle income households',
    icon: '🚗',
    color: '#dc2626',
    criteria: [
      { field: 'households_middle_pct', weight: 35, min: 40, target: 55 },
      { field: 'age_45_64_pct', weight: 30, min: 22, target: 32 },
      { field: 'income_50_75k', weight: 20, min: 20, target: 30 },
      { field: 'income_75_100k', weight: 15, min: 12, target: 22 }
    ]
  },

  health_wellness: {
    id: 'health_wellness',
    name: 'Health & Wellness',
    description: 'Active lifestyle, higher income, 25-54 demographic',
    icon: '🏃',
    color: '#16a34a',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 22, target: 35 },
      { field: 'income_100k_plus', weight: 30, min: 25, target: 40 },
      { field: 'age_45_64_pct', weight: 20, min: 20, target: 30 },
      { field: 'income_75_100k', weight: 15, min: 18, target: 28 }
    ]
  },

  tech_adopters: {
    id: 'tech_adopters',
    name: 'Tech Early Adopters',
    description: 'Younger, higher income, urban early technology adopters',
    icon: '📱',
    color: '#7c3aed',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 28, target: 42 },
      { field: 'income_100k_plus', weight: 30, min: 25, target: 45 },
      { field: 'income_150k_plus', weight: 20, min: 12, target: 25 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 28 }
    ]
  },

  small_business: {
    id: 'small_business',
    name: 'Small Business Owners',
    description: 'Middle-age, moderate-to-high income entrepreneurs',
    icon: '🏪',
    color: '#ca8a04',
    criteria: [
      { field: 'age_45_64_pct', weight: 35, min: 24, target: 34 },
      { field: 'income_75_100k', weight: 25, min: 18, target: 28 },
      { field: 'income_100k_plus', weight: 25, min: 20, target: 35 },
      { field: 'households_middle_pct', weight: 15, min: 35, target: 50 }
    ]
  },

  new_parents: {
    id: 'new_parents',
    name: 'New Parents',
    description: '25-40, family formation stage, moderate income',
    icon: '👶',
    color: '#f472b6',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 28, target: 42 },
      { field: 'households_young_pct', weight: 25, min: 18, target: 32 },
      { field: 'income_50_75k', weight: 20, min: 18, target: 28 },
      { field: 'income_75_100k', weight: 15, min: 12, target: 22 }
    ]
  },

  sports_fans: {
    id: 'sports_fans',
    name: 'Sports Fans',
    description: 'Male-skewing, middle-age, moderate income, suburban',
    icon: '🏈',
    color: '#ea580c',
    criteria: [
      { field: 'age_45_64_pct', weight: 30, min: 22, target: 33 },
      { field: 'households_middle_pct', weight: 30, min: 38, target: 52 },
      { field: 'income_50_75k', weight: 25, min: 20, target: 30 },
      { field: 'age_25_44_pct', weight: 15, min: 20, target: 30 }
    ]
  },

  entertainment_seekers: {
    id: 'entertainment_seekers',
    name: 'Entertainment Seekers',
    description: 'Younger, urban, moderate income, heavy streaming audience',
    icon: '🎬',
    color: '#a855f7',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 28, target: 42 },
      { field: 'age_under_25_pct', weight: 25, min: 15, target: 28 },
      { field: 'households_young_pct', weight: 25, min: 18, target: 32 },
      { field: 'income_50_75k', weight: 15, min: 18, target: 28 }
    ]
  },

  eco_conscious: {
    id: 'eco_conscious',
    name: 'Eco-Conscious',
    description: 'Higher education proxy (higher income), 25-44, urban',
    icon: '🌱',
    color: '#15803d',
    criteria: [
      { field: 'age_25_44_pct', weight: 30, min: 25, target: 38 },
      { field: 'income_100k_plus', weight: 30, min: 25, target: 42 },
      { field: 'income_150k_plus', weight: 25, min: 12, target: 25 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 28 }
    ]
  },

  hispanic_market: {
    id: 'hispanic_market',
    name: 'Hispanic Market',
    description: 'Younger demographics, growing communities, value-oriented',
    icon: '🌮',
    color: '#d97706',
    criteria: [
      { field: 'age_25_44_pct', weight: 30, min: 25, target: 38 },
      { field: 'age_under_25_pct', weight: 30, min: 18, target: 30 },
      { field: 'income_under_50k', weight: 25, min: 25, target: 40 },
      { field: 'households_young_pct', weight: 15, min: 18, target: 30 }
    ]
  },

  college_students: {
    id: 'college_students',
    name: 'College Students',
    description: 'Under 25, lower income, young household concentrations',
    icon: '🎓',
    color: '#2563eb',
    criteria: [
      { field: 'age_under_25_pct', weight: 45, min: 20, target: 35 },
      { field: 'income_under_50k', weight: 25, min: 30, target: 45 },
      { field: 'households_young_pct', weight: 30, min: 20, target: 35 }
    ]
  },

  // UK Segments (from Old_projects/Atlas improved segments)
  tech_workers_startup: {
    id: 'tech_workers_startup',
    name: 'Tech Workers - Startup',
    description: 'Early-stage tech workers, entrepreneurs, startup employees',
    icon: '💻',
    color: '#8b5cf6',
    ukSegment: true,
    targetPostcodes: ['EC1A', 'EC2A', 'N1', 'E2', 'E8', 'E9'],
    areas: ['Old Street', 'Shoreditch', 'King\'s Cross', 'Hackney Wick'],
    criteria: [
      { field: 'age_25_44_pct', weight: 45, min: 35, target: 50 },
      { field: 'income_75_100k', weight: 30, min: 18, target: 30 },
      { field: 'income_100k_plus', weight: 25, min: 15, target: 30 }
    ]
  },

  tech_workers_corporate: {
    id: 'tech_workers_corporate',
    name: 'Tech Workers - Corporate',
    description: 'Corporate tech workers, large company employees',
    icon: '🏢',
    color: '#3b82f6',
    ukSegment: true,
    targetPostcodes: ['E14', 'EC1', 'EC2', 'EC3', 'EC4', 'W2'],
    areas: ['Canary Wharf', 'City', 'King\'s Cross', 'Paddington'],
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 30, target: 45 },
      { field: 'income_100k_plus', weight: 35, min: 25, target: 45 },
      { field: 'income_150k_plus', weight: 25, min: 10, target: 25 }
    ]
  },

  students_undergraduate: {
    id: 'students_undergraduate',
    name: 'Students - Undergraduate',
    description: 'University undergraduate students',
    icon: '🎓',
    color: '#10b981',
    ukSegment: true,
    targetPostcodes: ['NW1', 'NW5', 'N1', 'N7', 'E15', 'SE1'],
    areas: ['Camden', 'Islington', 'Stratford', 'Elephant & Castle'],
    criteria: [
      { field: 'age_under_25_pct', weight: 50, min: 18, target: 30 },
      { field: 'income_under_50k', weight: 30, min: 35, target: 55 },
      { field: 'households_young_pct', weight: 20, min: 30, target: 45 }
    ]
  },

  students_postgraduate: {
    id: 'students_postgraduate',
    name: 'Students - Postgraduate',
    description: 'University postgraduate students',
    icon: '🎓',
    color: '#14b8a6',
    ukSegment: true,
    targetPostcodes: ['WC1', 'WC2', 'SW7', 'N1', 'N7'],
    areas: ['Bloomsbury', 'South Kensington', 'King\'s Cross', 'Camden'],
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 35, target: 50 },
      { field: 'age_under_25_pct', weight: 30, min: 20, target: 35 },
      { field: 'income_under_50k', weight: 30, min: 30, target: 45 }
    ]
  },

  indian_community: {
    id: 'indian_community',
    name: 'Indian Community',
    description: 'Indian/Punjabi community members',
    icon: '🇮🇳',
    color: '#f59e0b',
    ukSegment: true,
    targetPostcodes: ['UB1', 'UB2', 'HA0', 'HA9', 'HA1', 'HA2', 'W5', 'W13'],
    areas: ['Southall', 'Wembley', 'Harrow', 'Ealing'],
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 30, target: 45 },
      { field: 'income_50_75k', weight: 30, min: 18, target: 28 },
      { field: 'income_75_100k', weight: 20, min: 15, target: 25 },
      { field: 'households_middle_pct', weight: 15, min: 38, target: 50 }
    ]
  },

  bangladeshi_community: {
    id: 'bangladeshi_community',
    name: 'Bangladeshi Community',
    description: 'Bangladeshi community members',
    icon: '🇧🇩',
    color: '#06b6d4',
    ukSegment: true,
    targetPostcodes: ['E1', 'E2', 'E3', 'E6', 'E7', 'E10', 'E11'],
    areas: ['Tower Hamlets', 'Newham', 'Redbridge'],
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 32, target: 45 },
      { field: 'income_under_50k', weight: 30, min: 28, target: 42 },
      { field: 'income_50_75k', weight: 20, min: 18, target: 28 },
      { field: 'households_young_pct', weight: 10, min: 28, target: 40 }
    ]
  },

  caribbean_community: {
    id: 'caribbean_community',
    name: 'Caribbean Community',
    description: 'Caribbean community members',
    icon: '🇯🇲',
    color: '#84cc16',
    ukSegment: true,
    targetPostcodes: ['SW2', 'SW9', 'SE1', 'SE5', 'E8', 'E9', 'N15', 'N17'],
    areas: ['Lambeth', 'Southwark', 'Hackney', 'Tottenham'],
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 30, target: 42 },
      { field: 'income_under_50k', weight: 30, min: 25, target: 40 },
      { field: 'income_50_75k', weight: 20, min: 18, target: 28 },
      { field: 'households_young_pct', weight: 10, min: 28, target: 40 }
    ]
  },

  regeneration_pioneers: {
    id: 'regeneration_pioneers',
    name: 'Regeneration Pioneers',
    description: 'Early adopters in regenerating areas',
    icon: '🏗️',
    color: '#ec4899',
    ukSegment: true,
    targetPostcodes: ['SE8', 'SE15', 'E9', 'SE18'],
    areas: ['Deptford', 'Peckham', 'Hackney Wick', 'Woolwich'],
    criteria: [
      { field: 'age_25_44_pct', weight: 45, min: 32, target: 45 },
      { field: 'income_50_75k', weight: 25, min: 18, target: 28 },
      { field: 'income_75_100k', weight: 20, min: 15, target: 25 },
      { field: 'households_young_pct', weight: 10, min: 28, target: 40 }
    ]
  },

  nappy_valley_families: {
    id: 'nappy_valley_families',
    name: 'Nappy Valley Families',
    description: 'Young families with children',
    icon: '👶',
    color: '#f472b6',
    ukSegment: true,
    targetPostcodes: ['SW4', 'SW11', 'SW12', 'SW15', 'SW17', 'SW18'],
    areas: ['Clapham', 'Battersea', 'Wandsworth', 'Putney'],
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 32, target: 45 },
      { field: 'income_100k_plus', weight: 30, min: 25, target: 45 },
      { field: 'income_150k_plus', weight: 20, min: 12, target: 28 },
      { field: 'households_middle_pct', weight: 10, min: 38, target: 50 }
    ]
  },

  affluent_retirees: {
    id: 'affluent_retirees',
    name: 'Affluent Retirees',
    description: 'Wealthy seniors in premium retirement areas',
    icon: '🏌️',
    color: '#059669',
    ukSegment: true,
    targetPostcodes: ['RH', 'GU', 'HP', 'OX', 'BA', 'TN'],
    areas: ['Surrey', 'Sussex', 'Cotswolds', 'Bath', 'Tunbridge Wells'],
    criteria: [
      { field: 'age_65_plus_pct', weight: 45, min: 22, target: 35 },
      { field: 'income_75_100k', weight: 25, min: 18, target: 30 },
      { field: 'income_100k_plus', weight: 20, min: 15, target: 30 },
      { field: 'households_senior_pct', weight: 10, min: 28, target: 40 }
    ]
  },

  commuter_belt_families: {
    id: 'commuter_belt_families',
    name: 'Commuter Belt Families',
    description: 'Dual-income families in suburban commuter towns',
    icon: '🚂',
    color: '#7c3aed',
    ukSegment: true,
    targetPostcodes: ['AL', 'WD', 'SL', 'RG', 'GU', 'TN', 'BR'],
    areas: ['St Albans', 'Watford', 'Reading', 'Guildford', 'Sevenoaks'],
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 28, target: 40 },
      { field: 'income_75_100k', weight: 30, min: 20, target: 32 },
      { field: 'income_100k_plus', weight: 25, min: 20, target: 35 },
      { field: 'households_middle_pct', weight: 10, min: 42, target: 55 }
    ]
  },

  working_class_urban: {
    id: 'working_class_urban',
    name: 'Working Class Urban',
    description: 'Blue-collar workers in urban and suburban areas',
    icon: '🏭',
    color: '#dc2626',
    ukSegment: true,
    targetPostcodes: ['RM', 'DA', 'SE', 'E6', 'E7', 'IG', 'EN'],
    areas: ['Romford', 'Dartford', 'Barking', 'Enfield'],
    criteria: [
      { field: 'income_under_50k', weight: 40, min: 38, target: 52 },
      { field: 'income_50_75k', weight: 30, min: 20, target: 30 },
      { field: 'age_25_44_pct', weight: 20, min: 28, target: 42 },
      { field: 'households_middle_pct', weight: 10, min: 38, target: 50 }
    ]
  },

  metro_millennials: {
    id: 'metro_millennials',
    name: 'Metro Millennials',
    description: 'Young urban professionals in trendy neighborhoods',
    icon: '🎨',
    color: '#f59e0b',
    ukSegment: true,
    targetPostcodes: ['E2', 'E8', 'E9', 'N4', 'N16', 'SE15', 'SW9'],
    areas: ['Shoreditch', 'Hackney', 'Dalston', 'Peckham', 'Brixton'],
    criteria: [
      { field: 'age_25_44_pct', weight: 45, min: 35, target: 50 },
      { field: 'income_50_75k', weight: 30, min: 20, target: 32 },
      { field: 'income_75_100k', weight: 15, min: 15, target: 25 },
      { field: 'households_young_pct', weight: 10, min: 32, target: 45 }
    ]
  },

  suburban_seniors: {
    id: 'suburban_seniors',
    name: 'Suburban Seniors',
    description: 'Middle-income retirees in established suburbs',
    icon: '👴',
    color: '#0891b2',
    ukSegment: true,
    targetPostcodes: ['HA', 'UB', 'KT', 'CR', 'SM', 'BR', 'TW'],
    areas: ['Harrow', 'Kingston', 'Croydon', 'Sutton', 'Bromley'],
    criteria: [
      { field: 'age_65_plus_pct', weight: 45, min: 20, target: 32 },
      { field: 'age_45_64_pct', weight: 25, min: 25, target: 38 },
      { field: 'income_50_75k', weight: 20, min: 18, target: 28 },
      { field: 'households_senior_pct', weight: 10, min: 28, target: 40 }
    ]
  },

  young_renters: {
    id: 'young_renters',
    name: 'Young Renters',
    description: 'Entry-level professionals in flat-shares',
    icon: '🏠',
    color: '#14b8a6',
    ukSegment: true,
    targetPostcodes: ['SW16', 'SW17', 'SE22', 'SE23', 'N19', 'NW6'],
    areas: ['Streatham', 'Tooting', 'Dulwich', 'Archway', 'Kilburn'],
    criteria: [
      { field: 'age_25_44_pct', weight: 45, min: 32, target: 48 },
      { field: 'income_under_50k', weight: 30, min: 28, target: 42 },
      { field: 'income_50_75k', weight: 15, min: 18, target: 28 },
      { field: 'households_young_pct', weight: 10, min: 30, target: 45 }
    ]
  },

  affluent_suburbanites: {
    id: 'affluent_suburbanites',
    name: 'Affluent Suburbanites',
    description: 'High-income families in leafy suburbs',
    icon: '🌳',
    color: '#10b981',
    ukSegment: true,
    targetPostcodes: ['SW19', 'SW20', 'KT', 'TW', 'HA', 'N20', 'EN'],
    areas: ['Wimbledon', 'Kingston', 'Richmond', 'Barnet'],
    criteria: [
      { field: 'income_100k_plus', weight: 40, min: 28, target: 45 },
      { field: 'income_150k_plus', weight: 30, min: 15, target: 30 },
      { field: 'age_25_44_pct', weight: 20, min: 25, target: 38 },
      { field: 'households_middle_pct', weight: 10, min: 42, target: 55 }
    ]
  },

  university_towns: {
    id: 'university_towns',
    name: 'University Towns',
    description: 'Student populations in university cities',
    icon: '🎓',
    color: '#8b5cf6',
    ukSegment: true,
    targetPostcodes: ['OX', 'CB', 'BS', 'NG', 'LE', 'CV', 'M13', 'EH'],
    areas: ['Oxford', 'Cambridge', 'Bristol', 'Nottingham', 'Leicester'],
    criteria: [
      { field: 'age_under_25_pct', weight: 50, min: 20, target: 35 },
      { field: 'age_25_44_pct', weight: 30, min: 30, target: 45 },
      { field: 'income_under_50k', weight: 15, min: 35, target: 50 },
      { field: 'households_young_pct', weight: 5, min: 30, target: 45 }
    ]
  },

  coastal_retirees: {
    id: 'coastal_retirees',
    name: 'Coastal Retirees',
    description: 'Seniors in seaside towns and coastal areas',
    icon: '🌊',
    color: '#06b6d4',
    ukSegment: true,
    targetPostcodes: ['BN', 'PO', 'SO', 'TQ', 'TR', 'EX', 'TN'],
    areas: ['Brighton', 'Portsmouth', 'Bournemouth', 'Torquay', 'Eastbourne'],
    criteria: [
      { field: 'age_65_plus_pct', weight: 45, min: 22, target: 38 },
      { field: 'age_45_64_pct', weight: 25, min: 28, target: 40 },
      { field: 'income_50_75k', weight: 20, min: 18, target: 28 },
      { field: 'households_senior_pct', weight: 10, min: 32, target: 45 }
    ]
  },

  northern_working_class: {
    id: 'northern_working_class',
    name: 'Northern Working Class',
    description: 'Traditional working-class communities in northern England',
    icon: '⚒️',
    color: '#991b1b',
    ukSegment: true,
    targetPostcodes: ['L', 'M', 'S', 'BD', 'LS', 'NE', 'TS', 'DL'],
    areas: ['Liverpool', 'Manchester', 'Sheffield', 'Leeds', 'Newcastle'],
    criteria: [
      { field: 'income_under_50k', weight: 45, min: 40, target: 55 },
      { field: 'income_50_75k', weight: 25, min: 18, target: 28 },
      { field: 'age_25_44_pct', weight: 20, min: 25, target: 38 },
      { field: 'households_middle_pct', weight: 10, min: 40, target: 52 }
    ]
  },

  city_singles: {
    id: 'city_singles',
    name: 'City Singles',
    description: 'Young single professionals in city centers',
    icon: '🎯',
    color: '#c026d3',
    ukSegment: true,
    targetPostcodes: ['M1', 'M2', 'LS1', 'B1', 'EH1', 'G1'],
    areas: ['Manchester City', 'Leeds City', 'Birmingham City', 'Edinburgh City'],
    criteria: [
      { field: 'age_25_44_pct', weight: 50, min: 35, target: 50 },
      { field: 'income_50_75k', weight: 25, min: 20, target: 32 },
      { field: 'income_75_100k', weight: 15, min: 15, target: 25 },
      { field: 'households_young_pct', weight: 10, min: 35, target: 50 }
    ]
  },

  rural_communities: {
    id: 'rural_communities',
    name: 'Rural Communities',
    description: 'Mixed-age populations in countryside and rural towns',
    icon: '🌾',
    color: '#65a30d',
    ukSegment: true,
    targetPostcodes: ['SY', 'LD', 'HR', 'DT', 'TA', 'CA', 'YO', 'NR'],
    areas: ['Shropshire', 'Herefordshire', 'Dorset', 'Somerset', 'North Yorkshire'],
    criteria: [
      { field: 'age_45_64_pct', weight: 35, min: 28, target: 40 },
      { field: 'age_65_plus_pct', weight: 25, min: 18, target: 28 },
      { field: 'income_under_50k', weight: 25, min: 35, target: 50 },
      { field: 'households_senior_pct', weight: 15, min: 28, target: 40 }
    ]
  },

  scottish_urban: {
    id: 'scottish_urban',
    name: 'Scottish Urban',
    description: 'Mixed demographics in Scottish cities',
    icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    color: '#1e40af',
    ukSegment: true,
    targetPostcodes: ['G', 'EH', 'AB', 'DD', 'PA', 'KY'],
    areas: ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'],
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 28, target: 42 },
      { field: 'income_50_75k', weight: 30, min: 18, target: 28 },
      { field: 'income_75_100k', weight: 20, min: 15, target: 25 },
      { field: 'households_middle_pct', weight: 10, min: 38, target: 50 }
    ]
  },

  welsh_valleys: {
    id: 'welsh_valleys',
    name: 'Welsh Valleys',
    description: 'Working-class communities in Welsh towns and valleys',
    icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    color: '#dc2626',
    ukSegment: true,
    targetPostcodes: ['CF', 'NP', 'SA', 'LL', 'SY'],
    areas: ['Cardiff', 'Newport', 'Swansea', 'Rhondda', 'Valleys'],
    criteria: [
      { field: 'income_under_50k', weight: 45, min: 40, target: 55 },
      { field: 'income_50_75k', weight: 25, min: 20, target: 30 },
      { field: 'age_25_44_pct', weight: 20, min: 25, target: 38 },
      { field: 'households_middle_pct', weight: 10, min: 42, target: 55 }
    ]
  }
};

/**
 * Calculate audience fit score for a ZIP code
 * @param {Object} demographics - Demographic data for the ZIP
 * @param {Object} audience - Audience definition
 * @returns {number} Score from 0-100
 */
export function calculateAudienceScore(demographics, audience) {
  if (!demographics || !audience) return 0;
  
  let totalScore = 0;
  let totalWeight = 0;
  
  audience.criteria.forEach(criterion => {
    const value = demographics[criterion.field] || 0;
    const { min, target, weight } = criterion;
    
    // Score calculation:
    // - Below min: 0 points
    // - At min: 50 points
    // - At target: 100 points
    // - Linear interpolation between min and target
    
    let score = 0;
    if (value >= target) {
      score = 100;
    } else if (value >= min) {
      score = 50 + ((value - min) / (target - min)) * 50;
    } else {
      score = (value / min) * 50;
    }
    
    totalScore += score * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Score all ZIP codes for a given audience
 * @param {Object} demographicsData - Map of ZIP3 -> demographics
 * @param {Object} audience - Audience definition
 * @returns {Array} Array of {zip3, score, demographics} sorted by score
 */
export function scoreZIPsForAudience(demographicsData, audience) {
  const scores = [];

  // CSV-based audiences use a pre-computed affinity map
  if (audience.isCSVBased && audience.csvAffinityMap) {
    Object.entries(demographicsData).forEach(([zip3, demographics]) => {
      const score = audience.csvAffinityMap[zip3] || 0;
      scores.push({ zip3, score, demographics });
    });
  } else {
    Object.entries(demographicsData).forEach(([zip3, demographics]) => {
      const score = calculateAudienceScore(demographics, audience);
      scores.push({ zip3, score, demographics });
    });
  }

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Map UK postcode area prefix to a broad UK region
 */
const UK_AREA_REGION = {
  AB:'Scotland',DD:'Scotland',DG:'Scotland',EH:'Scotland',FK:'Scotland',G:'Scotland',
  HS:'Scotland',IV:'Scotland',KA:'Scotland',KW:'Scotland',KY:'Scotland',ML:'Scotland',
  PA:'Scotland',PH:'Scotland',TD:'Scotland',ZE:'Scotland',
  CF:'Wales',LD:'Wales',LL:'Wales',NP:'Wales',SA:'Wales',SY:'Wales',
  BT:'Northern Ireland',
  DH:'North East',DL:'North East',NE:'North East',SR:'North East',TS:'North East',
  BB:'North West',BL:'North West',CA:'North West',CH:'North West',CW:'North West',
  FY:'North West',L:'North West',LA:'North West',M:'North West',OL:'North West',
  PR:'North West',SK:'North West',WA:'North West',WN:'North West',
  BD:'Yorkshire',DN:'Yorkshire',HD:'Yorkshire',HG:'Yorkshire',HU:'Yorkshire',
  HX:'Yorkshire',LS:'Yorkshire',S:'Yorkshire',WF:'Yorkshire',YO:'Yorkshire',
  DE:'East Midlands',LE:'East Midlands',LN:'East Midlands',NG:'East Midlands',NN:'East Midlands',
  B:'West Midlands',CV:'West Midlands',DY:'West Midlands',HR:'West Midlands',
  ST:'West Midlands',TF:'West Midlands',WR:'West Midlands',WS:'West Midlands',WV:'West Midlands',
  AL:'East of England',CB:'East of England',CM:'East of England',CO:'East of England',
  IP:'East of England',LU:'East of England',NR:'East of England',PE:'East of England',
  SG:'East of England',SS:'East of England',
  BR:'London',CR:'London',DA:'London',E:'London',EC:'London',EN:'London',HA:'London',
  IG:'London',KT:'London',N:'London',NW:'London',RM:'London',SE:'London',SM:'London',
  SW:'London',TW:'London',UB:'London',W:'London',WC:'London',
  BN:'South East',CT:'South East',GU:'South East',HP:'South East',ME:'South East',
  MK:'South East',OX:'South East',PO:'South East',RG:'South East',RH:'South East',
  SL:'South East',SO:'South East',TN:'South East',WD:'South East',
  BA:'South West',BH:'South West',BS:'South West',DT:'South West',EX:'South West',
  GL:'South West',PL:'South West',SN:'South West',SP:'South West',TA:'South West',
  TQ:'South West',TR:'South West',
};

/**
 * Get geographic diversity score for a set of ZIPs/postcodes
 * (Higher score = more geographically distributed)
 */
function getGeographicDiversity(zips, countryCode) {
  if (zips.length === 0) return 0;

  if (countryCode === 'UK') {
    // UK: diversity across broad regions (12 possible)
    const ukRegions = new Set();
    const areaSet = new Set();
    for (const code of zips) {
      const area = code.match(/^[A-Z]{1,2}/)?.[0];
      if (area) {
        areaSet.add(area);
        const region = UK_AREA_REGION[area];
        if (region) ukRegions.add(region);
      }
    }
    const regionScore = Math.min(ukRegions.size * 9, 50); // 12 regions max → 50
    const areaScore = Math.min(areaSet.size * 0.5, 50);   // 120 areas max
    return Math.min(Math.round(regionScore + areaScore), 100);
  }

  // US: group by first digit (rough geographic regions)
  const regions = new Set(zips.map(z => z.charAt(0)));

  // Count unique two-digit prefixes
  const prefixes = new Set(zips.map(z => z.substring(0, 2)));

  // Diversity score based on region spread and prefix variety
  const regionScore = regions.size * 15; // Max 135 for all 9 regions
  const prefixScore = Math.min(prefixes.size * 2, 65); // Max 65

  return Math.min(regionScore + prefixScore, 100);
}

/**
 * Generate recommendations for exposed and holdout groups
 * @param {Object} demographicsData - Map of ZIP3 -> demographics
 * @param {Object} audience - Audience definition
 * @param {Object} options - { exposedRatio: 0.6, minScore: 50 }
 * @returns {Object} { exposed: [], holdout: [], stats: {} }
 */
export function generateRecommendations(demographicsData, audience, options = {}) {
  const {
    exposedRatio = 0.6,
    minScore = 50,
    maxZips = 100,
    countryCode = 'US'
  } = options;
  
  // Score all ZIPs
  const scoredZips = scoreZIPsForAudience(demographicsData, audience);
  
  // Filter by minimum score
  const qualified = scoredZips.filter(z => z.score >= minScore);
  
  // Limit to maxZips
  const limited = qualified.slice(0, maxZips);
  
  // Split into exposed and holdout
  const exposedCount = Math.round(limited.length * exposedRatio);
  const holdoutCount = limited.length - exposedCount;
  
  // For exposed: take the highest scoring ZIPs
  const exposed = limited.slice(0, exposedCount);
  
  // For holdout: take remaining ZIPs with good geographic diversity
  // Strategy: skip some high-scoring ZIPs to maintain geographic balance
  const holdout = [];
  const remainingZips = limited.slice(exposedCount);
  
  // Take holdout ZIPs trying to maximize geographic diversity
  for (let i = 0; i < remainingZips.length && holdout.length < holdoutCount; i++) {
    holdout.push(remainingZips[i]);
  }
  
  // Calculate statistics
  const stats = {
    totalQualified: qualified.length,
    exposedCount: exposed.length,
    holdoutCount: holdout.length,
    exposedRatio: exposed.length / (exposed.length + holdout.length),
    avgScoreExposed: exposed.reduce((sum, z) => sum + z.score, 0) / exposed.length || 0,
    avgScoreHoldout: holdout.reduce((sum, z) => sum + z.score, 0) / holdout.length || 0,
    minScoreExposed: exposed.length > 0 ? Math.min(...exposed.map(z => z.score)) : 0,
    maxScoreExposed: exposed.length > 0 ? Math.max(...exposed.map(z => z.score)) : 0,
    geographicDiversityExposed: getGeographicDiversity(exposed.map(z => z.zip3), countryCode),
    geographicDiversityHoldout: getGeographicDiversity(holdout.map(z => z.zip3), countryCode),
    totalPopulation: exposed.reduce((sum, z) => sum + (z.demographics.population || 0), 0) +
                     holdout.reduce((sum, z) => sum + (z.demographics.population || 0), 0),
    exposedPopulation: exposed.reduce((sum, z) => sum + (z.demographics.population || 0), 0),
    holdoutPopulation: holdout.reduce((sum, z) => sum + (z.demographics.population || 0), 0)
  };
  
  return {
    exposed,
    holdout,
    notRecommended: scoredZips.filter(z => z.score < minScore || !limited.includes(z)),
    stats
  };
}

export default AUDIENCES;
