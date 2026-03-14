/**
 * Keyword Clusters — M-KEY Drill-Down Data (ES Module)
 *
 * Synthetic UK keyword data for audience attributes.
 * Volumes are monthly search estimates (UK), CPC in GBP, competition 0–1.
 */

export const KEYWORD_CLUSTERS = {
  // BEHAV
  'BEHAV.tech_enthusiast': [
    { group: 'Product Reviews', keywords: [
      { term: 'best laptops 2026', volume: 33100, cpc: 1.85, competition: 0.78 },
      { term: 'iphone vs samsung', volume: 27100, cpc: 1.20, competition: 0.65 },
      { term: 'best noise cancelling headphones', volume: 22200, cpc: 2.10, competition: 0.82 },
      { term: 'gaming monitor 4k', volume: 14800, cpc: 1.95, competition: 0.74 },
      { term: 'best smartwatch uk', volume: 12100, cpc: 1.65, competition: 0.71 }
    ]},
    { group: 'Tech News', keywords: [
      { term: 'ai news today', volume: 18100, cpc: 0.85, competition: 0.32 },
      { term: 'tech deals uk', volume: 14800, cpc: 2.40, competition: 0.88 },
      { term: 'new gadgets 2026', volume: 9900, cpc: 1.10, competition: 0.55 },
      { term: 'best tech gifts', volume: 8100, cpc: 2.20, competition: 0.80 }
    ]},
    { group: 'Software & Apps', keywords: [
      { term: 'best vpn uk', volume: 27100, cpc: 5.80, competition: 0.95 },
      { term: 'password manager free', volume: 14800, cpc: 3.20, competition: 0.89 },
      { term: 'cloud storage comparison', volume: 8100, cpc: 2.85, competition: 0.76 },
      { term: 'best photo editing app', volume: 6600, cpc: 1.40, competition: 0.62 }
    ]}
  ],

  'BEHAV.fitness_active': [
    { group: 'Gym & Training', keywords: [
      { term: 'best gym near me', volume: 40500, cpc: 3.50, competition: 0.92 },
      { term: 'home workout plan', volume: 22200, cpc: 1.20, competition: 0.58 },
      { term: 'personal trainer cost uk', volume: 12100, cpc: 4.10, competition: 0.85 },
      { term: 'crossfit classes near me', volume: 8100, cpc: 3.80, competition: 0.88 },
      { term: 'strength training programme', volume: 6600, cpc: 0.95, competition: 0.45 }
    ]},
    { group: 'Nutrition', keywords: [
      { term: 'protein powder best uk', volume: 18100, cpc: 2.60, competition: 0.82 },
      { term: 'meal prep ideas healthy', volume: 14800, cpc: 0.75, competition: 0.38 },
      { term: 'creatine benefits', volume: 12100, cpc: 1.10, competition: 0.52 },
      { term: 'best pre workout uk', volume: 9900, cpc: 2.40, competition: 0.79 }
    ]},
    { group: 'Wearables & Tracking', keywords: [
      { term: 'best fitness tracker 2026', volume: 14800, cpc: 1.80, competition: 0.75 },
      { term: 'garmin vs apple watch', volume: 9900, cpc: 1.45, competition: 0.68 },
      { term: 'strava premium worth it', volume: 6600, cpc: 0.90, competition: 0.42 },
      { term: 'heart rate monitor chest strap', volume: 5400, cpc: 1.60, competition: 0.65 }
    ]}
  ],

  'BEHAV.frequent_traveller': [
    { group: 'Flights & Booking', keywords: [
      { term: 'cheap flights from london', volume: 49500, cpc: 1.85, competition: 0.90 },
      { term: 'business class deals', volume: 14800, cpc: 4.20, competition: 0.88 },
      { term: 'flight comparison uk', volume: 12100, cpc: 2.30, competition: 0.85 },
      { term: 'last minute flights', volume: 22200, cpc: 1.95, competition: 0.87 }
    ]},
    { group: 'Hotels & Stays', keywords: [
      { term: 'best hotels london', volume: 18100, cpc: 3.80, competition: 0.92 },
      { term: 'airbnb alternatives uk', volume: 8100, cpc: 1.60, competition: 0.65 },
      { term: 'boutique hotels europe', volume: 6600, cpc: 2.90, competition: 0.78 },
      { term: 'hotel loyalty programmes', volume: 5400, cpc: 1.40, competition: 0.55 }
    ]},
    { group: 'Travel Gear', keywords: [
      { term: 'best carry on luggage', volume: 12100, cpc: 1.70, competition: 0.72 },
      { term: 'travel insurance uk', volume: 33100, cpc: 5.20, competition: 0.94 },
      { term: 'noise cancelling earbuds travel', volume: 6600, cpc: 1.90, competition: 0.68 },
      { term: 'packing cubes best', volume: 5400, cpc: 1.10, competition: 0.52 }
    ]}
  ],

  'BEHAV.skiing_winter_sports': [
    { group: 'Trip Planning', keywords: [
      { term: 'ski holidays 2026', volume: 27100, cpc: 3.20, competition: 0.91 },
      { term: 'best ski resorts alps', volume: 18100, cpc: 2.85, competition: 0.87 },
      { term: 'cheap ski holidays europe', volume: 14800, cpc: 3.40, competition: 0.89 },
      { term: 'family ski holidays', volume: 12100, cpc: 3.60, competition: 0.90 },
      { term: 'ski chalet france', volume: 9900, cpc: 3.10, competition: 0.86 }
    ]},
    { group: 'Equipment', keywords: [
      { term: 'best ski boots 2026', volume: 8100, cpc: 1.80, competition: 0.68 },
      { term: 'ski jacket sale uk', volume: 9900, cpc: 2.10, competition: 0.75 },
      { term: 'ski hire vs buy', volume: 5400, cpc: 1.20, competition: 0.48 },
      { term: 'best all mountain skis', volume: 6600, cpc: 1.65, competition: 0.62 },
      { term: 'snowboard vs ski beginner', volume: 4400, cpc: 0.85, competition: 0.35 }
    ]},
    { group: 'Snow Conditions', keywords: [
      { term: 'snow report alps', volume: 14800, cpc: 0.40, competition: 0.18 },
      { term: 'best time to ski europe', volume: 6600, cpc: 0.95, competition: 0.42 },
      { term: 'ski season dates 2026', volume: 8100, cpc: 0.55, competition: 0.25 },
      { term: 'avalanche forecast alps', volume: 3600, cpc: 0.30, competition: 0.12 }
    ]},
    { group: 'Lessons & Improvement', keywords: [
      { term: 'ski lessons adults', volume: 5400, cpc: 2.40, competition: 0.78 },
      { term: 'off piste skiing course', volume: 2900, cpc: 2.80, competition: 0.72 },
      { term: 'learn to ski holiday', volume: 4400, cpc: 3.00, competition: 0.82 },
      { term: 'ski technique tips', volume: 3600, cpc: 0.45, competition: 0.22 }
    ]}
  ],

  'BEHAV.grocery_frequent': [
    { group: 'Supermarket Deals', keywords: [
      { term: 'tesco offers this week', volume: 40500, cpc: 0.55, competition: 0.35 },
      { term: 'aldi special buys', volume: 33100, cpc: 0.40, competition: 0.28 },
      { term: 'sainsburys nectar offers', volume: 18100, cpc: 0.65, competition: 0.42 },
      { term: 'lidl weekly specials', volume: 14800, cpc: 0.38, competition: 0.25 }
    ]},
    { group: 'Meal Planning', keywords: [
      { term: 'cheap meal ideas uk', volume: 22200, cpc: 0.80, competition: 0.42 },
      { term: 'weekly meal plan family', volume: 12100, cpc: 0.95, competition: 0.48 },
      { term: 'batch cooking recipes', volume: 9900, cpc: 0.70, competition: 0.38 },
      { term: 'slow cooker recipes easy', volume: 14800, cpc: 0.60, competition: 0.32 }
    ]},
    { group: 'Online Grocery', keywords: [
      { term: 'ocado delivery slots', volume: 12100, cpc: 1.80, competition: 0.72 },
      { term: 'tesco grocery delivery', volume: 18100, cpc: 1.40, competition: 0.68 },
      { term: 'best online supermarket uk', volume: 8100, cpc: 1.60, competition: 0.75 },
      { term: 'grocery delivery same day', volume: 6600, cpc: 1.90, competition: 0.78 }
    ]}
  ],

  'BEHAV.diy_home_improvement': [
    { group: 'Projects', keywords: [
      { term: 'how to tile a bathroom', volume: 14800, cpc: 0.85, competition: 0.38 },
      { term: 'kitchen renovation cost uk', volume: 12100, cpc: 2.80, competition: 0.82 },
      { term: 'garden decking ideas', volume: 18100, cpc: 1.20, competition: 0.55 },
      { term: 'loft conversion planning permission', volume: 8100, cpc: 2.40, competition: 0.75 }
    ]},
    { group: 'Tools & Materials', keywords: [
      { term: 'best cordless drill uk', volume: 9900, cpc: 1.60, competition: 0.72 },
      { term: 'screwfix near me', volume: 33100, cpc: 0.45, competition: 0.30 },
      { term: 'b&q kitchen units', volume: 12100, cpc: 1.80, competition: 0.68 },
      { term: 'paint colours 2026', volume: 8100, cpc: 0.90, competition: 0.42 }
    ]},
    { group: 'Tradesperson', keywords: [
      { term: 'electrician near me', volume: 27100, cpc: 5.20, competition: 0.94 },
      { term: 'plumber emergency near me', volume: 18100, cpc: 6.80, competition: 0.96 },
      { term: 'checkatrade reviews', volume: 9900, cpc: 1.40, competition: 0.58 },
      { term: 'how much does a plasterer cost', volume: 6600, cpc: 1.80, competition: 0.65 }
    ]}
  ],

  'BEHAV.gaming': [
    { group: 'Hardware', keywords: [
      { term: 'ps5 deals uk', volume: 27100, cpc: 1.40, competition: 0.72 },
      { term: 'gaming pc build 2026', volume: 14800, cpc: 1.85, competition: 0.78 },
      { term: 'best gaming headset', volume: 18100, cpc: 1.60, competition: 0.70 },
      { term: 'nintendo switch 2 price', volume: 22200, cpc: 0.80, competition: 0.55 }
    ]},
    { group: 'Games & Reviews', keywords: [
      { term: 'best games 2026', volume: 33100, cpc: 0.65, competition: 0.38 },
      { term: 'game pass worth it', volume: 12100, cpc: 1.20, competition: 0.62 },
      { term: 'gta 6 release date', volume: 40500, cpc: 0.35, competition: 0.22 },
      { term: 'indie games pc', volume: 6600, cpc: 0.55, competition: 0.30 }
    ]},
    { group: 'Streaming & Esports', keywords: [
      { term: 'twitch streaming setup', volume: 8100, cpc: 1.10, competition: 0.55 },
      { term: 'esports tournaments uk', volume: 5400, cpc: 0.90, competition: 0.45 },
      { term: 'best streaming software', volume: 6600, cpc: 1.30, competition: 0.60 },
      { term: 'gaming chair best uk', volume: 9900, cpc: 1.75, competition: 0.72 }
    ]}
  ],

  // PSYCH
  'PSYCH.health_conscious': [
    { group: 'Healthy Eating', keywords: [
      { term: 'healthy recipes uk', volume: 22200, cpc: 0.75, competition: 0.40 },
      { term: 'best supplements uk', volume: 14800, cpc: 2.40, competition: 0.82 },
      { term: 'organic food delivery', volume: 8100, cpc: 2.80, competition: 0.78 },
      { term: 'plant based diet plan', volume: 9900, cpc: 1.10, competition: 0.52 }
    ]},
    { group: 'Wellness', keywords: [
      { term: 'meditation app best', volume: 12100, cpc: 2.60, competition: 0.80 },
      { term: 'sleep tracker uk', volume: 6600, cpc: 1.40, competition: 0.62 },
      { term: 'mental health support uk', volume: 14800, cpc: 1.80, competition: 0.55 },
      { term: 'yoga classes near me', volume: 18100, cpc: 3.20, competition: 0.85 }
    ]}
  ],

  'PSYCH.eco_conscious': [
    { group: 'Sustainable Living', keywords: [
      { term: 'zero waste products uk', volume: 8100, cpc: 1.40, competition: 0.58 },
      { term: 'electric car best uk 2026', volume: 14800, cpc: 3.80, competition: 0.88 },
      { term: 'solar panels cost uk', volume: 18100, cpc: 5.20, competition: 0.92 },
      { term: 'carbon footprint calculator', volume: 6600, cpc: 0.65, competition: 0.32 }
    ]},
    { group: 'Ethical Shopping', keywords: [
      { term: 'ethical fashion brands uk', volume: 6600, cpc: 1.20, competition: 0.55 },
      { term: 'b corp companies uk', volume: 4400, cpc: 0.80, competition: 0.38 },
      { term: 'sustainable packaging', volume: 5400, cpc: 1.60, competition: 0.62 },
      { term: 'refill shops near me', volume: 8100, cpc: 0.90, competition: 0.42 }
    ]}
  ],

  'PSYCH.luxury_oriented': [
    { group: 'Luxury Goods', keywords: [
      { term: 'designer handbags sale uk', volume: 12100, cpc: 2.80, competition: 0.85 },
      { term: 'luxury watches uk', volume: 9900, cpc: 3.40, competition: 0.88 },
      { term: 'best luxury hotels london', volume: 8100, cpc: 4.20, competition: 0.90 },
      { term: 'premium car lease deals', volume: 6600, cpc: 4.80, competition: 0.92 }
    ]},
    { group: 'Experiences', keywords: [
      { term: 'michelin star restaurants london', volume: 14800, cpc: 1.60, competition: 0.65 },
      { term: 'spa breaks uk luxury', volume: 9900, cpc: 3.10, competition: 0.82 },
      { term: 'private members clubs london', volume: 5400, cpc: 2.20, competition: 0.72 },
      { term: 'first class flights deals', volume: 6600, cpc: 3.60, competition: 0.85 }
    ]}
  ],

  'PSYCH.price_sensitive_psych': [
    { group: 'Deals & Vouchers', keywords: [
      { term: 'voucher codes uk', volume: 27100, cpc: 0.90, competition: 0.55 },
      { term: 'cashback sites best uk', volume: 9900, cpc: 1.80, competition: 0.72 },
      { term: 'black friday deals uk 2026', volume: 40500, cpc: 1.20, competition: 0.78 },
      { term: 'student discount uk', volume: 18100, cpc: 0.65, competition: 0.42 }
    ]},
    { group: 'Price Comparison', keywords: [
      { term: 'compare energy prices uk', volume: 22200, cpc: 5.80, competition: 0.95 },
      { term: 'cheapest broadband uk', volume: 14800, cpc: 4.20, competition: 0.92 },
      { term: 'best savings account uk', volume: 12100, cpc: 3.60, competition: 0.88 },
      { term: 'cheapest car insurance', volume: 33100, cpc: 6.40, competition: 0.96 }
    ]}
  ],

  // PURCH
  'PURCH.premium_buyer': [
    { group: 'Premium Products', keywords: [
      { term: 'best premium headphones', volume: 8100, cpc: 2.20, competition: 0.75 },
      { term: 'luxury skincare uk', volume: 9900, cpc: 2.80, competition: 0.80 },
      { term: 'high end kitchen appliances', volume: 6600, cpc: 2.40, competition: 0.72 },
      { term: 'premium coffee machine uk', volume: 5400, cpc: 1.90, competition: 0.68 }
    ]},
    { group: 'Premium Services', keywords: [
      { term: 'concierge service london', volume: 3600, cpc: 4.80, competition: 0.88 },
      { term: 'personal shopper uk', volume: 4400, cpc: 3.20, competition: 0.78 },
      { term: 'private healthcare uk cost', volume: 6600, cpc: 5.40, competition: 0.92 },
      { term: 'premium delivery services', volume: 5400, cpc: 1.60, competition: 0.58 }
    ]}
  ],

  'PURCH.price_sensitive_purch': [
    { group: 'Budget Shopping', keywords: [
      { term: 'best budget phone uk 2026', volume: 14800, cpc: 1.40, competition: 0.68 },
      { term: 'primark online shop', volume: 22200, cpc: 0.55, competition: 0.35 },
      { term: 'factory outlet near me', volume: 9900, cpc: 1.20, competition: 0.58 },
      { term: 'second hand furniture uk', volume: 8100, cpc: 0.85, competition: 0.42 }
    ]},
    { group: 'Money Saving', keywords: [
      { term: 'money saving tips uk', volume: 12100, cpc: 0.70, competition: 0.38 },
      { term: 'free things to do near me', volume: 18100, cpc: 0.45, competition: 0.25 },
      { term: 'reduce bills uk', volume: 6600, cpc: 2.40, competition: 0.75 },
      { term: 'loyalty card best uk', volume: 5400, cpc: 1.10, competition: 0.52 }
    ]}
  ],

  'PURCH.auto_intender': [
    { group: 'Car Research', keywords: [
      { term: 'best family car 2026 uk', volume: 14800, cpc: 2.80, competition: 0.85 },
      { term: 'electric car range comparison', volume: 9900, cpc: 2.40, competition: 0.78 },
      { term: 'used car prices uk', volume: 22200, cpc: 1.90, competition: 0.82 },
      { term: 'car review uk', volume: 12100, cpc: 1.20, competition: 0.58 }
    ]},
    { group: 'Buying & Finance', keywords: [
      { term: 'pcp vs hp car finance', volume: 8100, cpc: 3.40, competition: 0.88 },
      { term: 'car insurance quote', volume: 40500, cpc: 6.80, competition: 0.96 },
      { term: 'autotrader used cars', volume: 33100, cpc: 0.80, competition: 0.52 },
      { term: 'car leasing deals uk', volume: 12100, cpc: 4.20, competition: 0.90 }
    ]}
  ],

  'PURCH.fashion_buyer': [
    { group: 'Fashion Shopping', keywords: [
      { term: 'new in zara uk', volume: 14800, cpc: 0.60, competition: 0.32 },
      { term: 'summer dresses 2026', volume: 18100, cpc: 1.20, competition: 0.62 },
      { term: 'best trainers 2026', volume: 12100, cpc: 1.80, competition: 0.72 },
      { term: 'mens fashion trends 2026', volume: 8100, cpc: 0.90, competition: 0.48 }
    ]},
    { group: 'Fashion Deals', keywords: [
      { term: 'asos sale uk', volume: 22200, cpc: 0.45, competition: 0.28 },
      { term: 'designer outlet online uk', volume: 6600, cpc: 1.40, competition: 0.62 },
      { term: 'next sale date 2026', volume: 9900, cpc: 0.35, competition: 0.22 },
      { term: 'best fashion apps uk', volume: 5400, cpc: 1.10, competition: 0.52 }
    ]}
  ],

  'PURCH.fmcg_regular': [
    { group: 'Household Essentials', keywords: [
      { term: 'best washing machine 2026', volume: 14800, cpc: 1.60, competition: 0.72 },
      { term: 'cleaning products best uk', volume: 8100, cpc: 0.90, competition: 0.45 },
      { term: 'nappy deals uk', volume: 6600, cpc: 1.20, competition: 0.58 },
      { term: 'pet food best uk', volume: 9900, cpc: 1.40, competition: 0.65 }
    ]},
    { group: 'Brand Comparison', keywords: [
      { term: 'own brand vs branded', volume: 5400, cpc: 0.55, competition: 0.28 },
      { term: 'best toilet paper uk', volume: 6600, cpc: 0.70, competition: 0.35 },
      { term: 'subscribe and save amazon', volume: 8100, cpc: 0.85, competition: 0.42 },
      { term: 'bulk buy uk online', volume: 4400, cpc: 1.10, competition: 0.52 }
    ]}
  ],

  // CONTEXT
  'CONTEXT.seasonal_summer': [
    { group: 'Summer Activities', keywords: [
      { term: 'summer holidays uk 2026', volume: 33100, cpc: 2.40, competition: 0.85 },
      { term: 'best beaches uk', volume: 18100, cpc: 0.60, competition: 0.32 },
      { term: 'outdoor furniture sale', volume: 14800, cpc: 1.80, competition: 0.72 },
      { term: 'bbq best buy uk', volume: 9900, cpc: 1.40, competition: 0.65 }
    ]},
    { group: 'Summer Fashion', keywords: [
      { term: 'swimwear uk women', volume: 12100, cpc: 1.20, competition: 0.58 },
      { term: 'sun cream best uk', volume: 8100, cpc: 1.10, competition: 0.52 },
      { term: 'festival clothing uk', volume: 6600, cpc: 0.95, competition: 0.48 },
      { term: 'sandals women best', volume: 9900, cpc: 1.30, competition: 0.60 }
    ]}
  ],

  'CONTEXT.seasonal_winter': [
    { group: 'Winter Activities', keywords: [
      { term: 'christmas markets uk 2026', volume: 27100, cpc: 0.80, competition: 0.38 },
      { term: 'winter coat women uk', volume: 18100, cpc: 1.60, competition: 0.68 },
      { term: 'ice skating near me', volume: 22200, cpc: 1.20, competition: 0.55 },
      { term: 'log burner installation cost', volume: 8100, cpc: 2.80, competition: 0.78 }
    ]},
    { group: 'Christmas Shopping', keywords: [
      { term: 'christmas gifts 2026', volume: 40500, cpc: 1.40, competition: 0.72 },
      { term: 'advent calendar luxury uk', volume: 9900, cpc: 1.80, competition: 0.68 },
      { term: 'christmas hamper delivery', volume: 12100, cpc: 2.20, competition: 0.75 },
      { term: 'secret santa gifts under 10', volume: 14800, cpc: 0.65, competition: 0.35 }
    ]}
  ],

  'CONTEXT.commute_window': [
    { group: 'Commute Essentials', keywords: [
      { term: 'train times uk', volume: 40500, cpc: 0.45, competition: 0.25 },
      { term: 'best podcasts 2026', volume: 18100, cpc: 0.80, competition: 0.42 },
      { term: 'audiobooks free uk', volume: 9900, cpc: 1.60, competition: 0.65 },
      { term: 'noise cancelling earbuds best', volume: 14800, cpc: 1.90, competition: 0.72 }
    ]},
    { group: 'Commute Planning', keywords: [
      { term: 'railcard uk cheapest', volume: 12100, cpc: 1.20, competition: 0.55 },
      { term: 'e-scooter uk legal', volume: 6600, cpc: 0.70, competition: 0.35 },
      { term: 'cycle to work scheme', volume: 8100, cpc: 1.80, competition: 0.68 },
      { term: 'season ticket calculator', volume: 5400, cpc: 0.90, competition: 0.42 }
    ]}
  ],

  'CONTEXT.evening_leisure': [
    { group: 'Entertainment', keywords: [
      { term: 'best streaming service uk', volume: 22200, cpc: 2.40, competition: 0.82 },
      { term: 'new films 2026', volume: 14800, cpc: 0.55, competition: 0.30 },
      { term: 'restaurant booking london', volume: 12100, cpc: 2.80, competition: 0.85 },
      { term: 'things to do tonight near me', volume: 18100, cpc: 1.20, competition: 0.58 }
    ]},
    { group: 'Home Evening', keywords: [
      { term: 'best wine delivery uk', volume: 8100, cpc: 2.60, competition: 0.78 },
      { term: 'board games best 2026', volume: 6600, cpc: 0.85, competition: 0.42 },
      { term: 'takeaway delivery near me', volume: 33100, cpc: 1.40, competition: 0.72 },
      { term: 'recipe ideas tonight', volume: 9900, cpc: 0.50, competition: 0.28 }
    ]}
  ],

  'CONTEXT.back_to_school': [
    { group: 'School Supplies', keywords: [
      { term: 'school uniform uk cheap', volume: 18100, cpc: 1.20, competition: 0.62 },
      { term: 'school bag best uk', volume: 9900, cpc: 1.40, competition: 0.65 },
      { term: 'stationery set children', volume: 6600, cpc: 0.80, competition: 0.42 },
      { term: 'school shoes kids uk', volume: 14800, cpc: 1.60, competition: 0.68 }
    ]},
    { group: 'Tech for School', keywords: [
      { term: 'best laptop for students uk', volume: 12100, cpc: 2.20, competition: 0.78 },
      { term: 'tablet for kids best', volume: 8100, cpc: 1.80, competition: 0.72 },
      { term: 'calculator scientific best', volume: 5400, cpc: 0.90, competition: 0.45 },
      { term: 'kids smartwatch uk', volume: 6600, cpc: 1.40, competition: 0.58 }
    ]}
  ]
};

export const KEYWORD_CLASS_DEFAULTS = {
  DEMO: [
    { group: 'Age-Targeted Content', keywords: [
      { term: 'things to do in my area', volume: 27100, cpc: 0.80, competition: 0.42 },
      { term: 'events near me this weekend', volume: 22200, cpc: 0.95, competition: 0.48 },
      { term: 'best deals today uk', volume: 14800, cpc: 1.20, competition: 0.58 },
      { term: 'local news uk', volume: 18100, cpc: 0.45, competition: 0.28 }
    ]}
  ],
  SOCIO: [
    { group: 'Financial Planning', keywords: [
      { term: 'mortgage calculator uk', volume: 33100, cpc: 4.80, competition: 0.92 },
      { term: 'savings account best rate', volume: 22200, cpc: 3.60, competition: 0.88 },
      { term: 'pension calculator uk', volume: 14800, cpc: 3.20, competition: 0.85 },
      { term: 'credit score check free', volume: 18100, cpc: 2.80, competition: 0.82 }
    ]}
  ],
  GEO: [
    { group: 'Local Services', keywords: [
      { term: 'near me', volume: 110000, cpc: 1.20, competition: 0.65 },
      { term: 'delivery to my area', volume: 8100, cpc: 0.90, competition: 0.48 },
      { term: 'local business directory', volume: 6600, cpc: 1.40, competition: 0.55 },
      { term: 'postcode lookup uk', volume: 12100, cpc: 0.30, competition: 0.18 }
    ]}
  ],
  MEDIA: [
    { group: 'Media & Content', keywords: [
      { term: 'best streaming service 2026', volume: 22200, cpc: 2.40, competition: 0.82 },
      { term: 'podcast recommendations', volume: 9900, cpc: 0.70, competition: 0.35 },
      { term: 'news app best uk', volume: 6600, cpc: 1.20, competition: 0.55 },
      { term: 'youtube premium worth it', volume: 8100, cpc: 0.90, competition: 0.42 }
    ]}
  ],
  CONTEXT: [
    { group: 'Seasonal & Contextual', keywords: [
      { term: 'seasonal offers uk', volume: 12100, cpc: 1.10, competition: 0.52 },
      { term: 'whats on this weekend', volume: 18100, cpc: 0.60, competition: 0.35 },
      { term: 'things to do near me', volume: 27100, cpc: 0.80, competition: 0.42 },
      { term: 'bank holiday activities', volume: 9900, cpc: 0.70, competition: 0.38 }
    ]}
  ]
};
