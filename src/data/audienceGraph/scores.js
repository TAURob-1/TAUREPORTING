/**
 * Audience Graph — Baseline Score Library (ES Module)
 *
 * Defines 8 targeting mechanisms, ~50 attributes across 8 classes,
 * and baseline Precision (P) × Scale (S) scores for each attribute–mechanism pair.
 * P and S are scored 0–5. Weight W = P × S (max 25).
 *
 * Based on TAU Audience Graph Specification v1.
 */

export const MECHANISMS = {
  M_GEO:  { key: 'M_GEO',  label: 'Geographic / Demographic', short: 'Geo-Demo',    color: '#2563eb', icon: '🌍' },
  M_CHAN: { key: 'M_CHAN', label: 'Channel Selection',         short: 'Channel',     color: '#7c3aed', icon: '📺' },
  M_INT:  { key: 'M_INT',  label: 'Interest / Behavioral',    short: 'Interest',    color: '#059669', icon: '🎯' },
  M_CTX:  { key: 'M_CTX',  label: 'Contextual',               short: 'Contextual',  color: '#ea580c', icon: '📰' },
  M_KEY:  { key: 'M_KEY',  label: 'Search / Keyword',         short: 'Search',      color: '#0891b2', icon: '🔍' },
  M_CRM:  { key: 'M_CRM',  label: 'CRM / First-Party',       short: 'CRM',         color: '#be185d', icon: '📋' },
  M_LAL:  { key: 'M_LAL',  label: 'Lookalike / Modeling',     short: 'Lookalike',   color: '#4f46e5', icon: '🔄' },
  M_TIME: { key: 'M_TIME', label: 'Temporal',                  short: 'Temporal',    color: '#ca8a04', icon: '⏰' }
};

export const MECHANISM_KEYS = Object.keys(MECHANISMS);

export const ATTRIBUTE_CLASSES = {
  DEMO: {
    key: 'DEMO', label: 'Demographics', color: '#2563eb', icon: '👤',
    defaults: { M_GEO: {P:4,S:4}, M_CHAN: {P:3,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:1,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} },
    attributes: {
      age_18_24: { label: 'Age 18–24', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:2,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:2,S:2} } },
      age_25_34: { label: 'Age 25–34', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:3,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:2,S:2} } },
      age_35_44: { label: 'Age 35–44', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:3,S:4}, M_INT: {P:3,S:3}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:3,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:2} } },
      age_45_54: { label: 'Age 45–54', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:3,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:1}, M_CRM: {P:3,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } },
      age_55_64: { label: 'Age 55–64', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:3,S:4}, M_INT: {P:2,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:2}, M_TIME: {P:1,S:1} } },
      age_65_plus: { label: 'Age 65+', scores: { M_GEO: {P:5,S:4}, M_CHAN: {P:3,S:3}, M_INT: {P:1,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:3,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:2,S:2} } },
      gender_male: { label: 'Male', scores: { M_GEO: {P:3,S:5}, M_CHAN: {P:3,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:3,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } },
      gender_female: { label: 'Female', scores: { M_GEO: {P:3,S:5}, M_CHAN: {P:3,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:3,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } },
      age_15_17: { label: 'Age 15–17', scores: { M_GEO: {P:4,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:2,S:2}, M_CRM: {P:2,S:1}, M_LAL: {P:3,S:2}, M_TIME: {P:2,S:2} } },
      parent_40_60: { label: 'Parent 40–60', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:3}, M_CTX: {P:4,S:4}, M_KEY: {P:3,S:3}, M_CRM: {P:5,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:3,S:3} } }
    }
  },

  SOCIO: {
    key: 'SOCIO', label: 'Socioeconomic', color: '#059669', icon: '💰',
    defaults: { M_GEO: {P:4,S:3}, M_CHAN: {P:2,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} },
    attributes: {
      income_low: { label: 'Low Income', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:3,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:3,S:3}, M_KEY: {P:2,S:2}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } },
      income_mid: { label: 'Mid Income', scores: { M_GEO: {P:3,S:5}, M_CHAN: {P:2,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:2,S:3}, M_LAL: {P:2,S:3}, M_TIME: {P:1,S:1} } },
      income_high: { label: 'High Income', scores: { M_GEO: {P:5,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:3,S:2}, M_KEY: {P:2,S:2}, M_CRM: {P:4,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:1,S:1} } },
      education_degree: { label: 'Degree+', scores: { M_GEO: {P:4,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:2,S:2}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } },
      education_vocational: { label: 'Vocational', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:2,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:3}, M_TIME: {P:1,S:1} } },
      education_none: { label: 'No Qualifications', scores: { M_GEO: {P:4,S:3}, M_CHAN: {P:2,S:3}, M_INT: {P:1,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:1,S:1} } },
      homeowner: { label: 'Homeowner', scores: { M_GEO: {P:5,S:4}, M_CHAN: {P:2,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:2,S:2}, M_CRM: {P:4,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } },
      renter: { label: 'Renter', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:2,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:2,S:2}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} } }
    }
  },

  GEO: {
    key: 'GEO', label: 'Geographic', color: '#dc2626', icon: '📍',
    defaults: { M_GEO: {P:5,S:4}, M_CHAN: {P:2,S:3}, M_INT: {P:1,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:3}, M_TIME: {P:1,S:1} },
    attributes: {
      urban: { label: 'Urban', scores: { M_GEO: {P:5,S:5}, M_CHAN: {P:3,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:2,S:3}, M_LAL: {P:2,S:3}, M_TIME: {P:2,S:2} } },
      suburban: { label: 'Suburban', scores: { M_GEO: {P:4,S:5}, M_CHAN: {P:2,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:2,S:3}, M_LAL: {P:2,S:3}, M_TIME: {P:1,S:2} } },
      rural: { label: 'Rural', scores: { M_GEO: {P:5,S:3}, M_CHAN: {P:2,S:2}, M_INT: {P:1,S:2}, M_CTX: {P:2,S:2}, M_KEY: {P:1,S:1}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:1,S:1} } },
      london: { label: 'London', scores: { M_GEO: {P:5,S:4}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:2,S:2}, M_CRM: {P:3,S:3}, M_LAL: {P:3,S:3}, M_TIME: {P:2,S:2} } },
      regional_cities: { label: 'Regional Cities', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:3,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:2,S:3}, M_KEY: {P:1,S:2}, M_CRM: {P:2,S:3}, M_LAL: {P:2,S:3}, M_TIME: {P:1,S:2} } }
    }
  },

  BEHAV: {
    key: 'BEHAV', label: 'Behavioral', color: '#7c3aed', icon: '🎮',
    defaults: { M_GEO: {P:2,S:2}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:4}, M_CTX: {P:3,S:3}, M_KEY: {P:3,S:3}, M_CRM: {P:3,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} },
    attributes: {
      tech_enthusiast: { label: 'Tech Enthusiast', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:4,S:4}, M_INT: {P:5,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:4,S:4}, M_CRM: {P:3,S:2}, M_LAL: {P:4,S:4}, M_TIME: {P:2,S:2} } },
      fitness_active: { label: 'Fitness Active', scores: { M_GEO: {P:2,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:5,S:4}, M_CTX: {P:4,S:3}, M_KEY: {P:3,S:3}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:3,S:3} } },
      frequent_traveller: { label: 'Frequent Traveller', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:3}, M_KEY: {P:4,S:3}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:3,S:3} } },
      skiing_winter_sports: { label: 'Skiing / Winter Sports', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:3,S:2}, M_INT: {P:5,S:3}, M_CTX: {P:4,S:3}, M_KEY: {P:4,S:3}, M_CRM: {P:3,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:4,S:3} } },
      grocery_frequent: { label: 'Frequent Grocery Shopper', scores: { M_GEO: {P:3,S:4}, M_CHAN: {P:2,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:2,S:3}, M_KEY: {P:2,S:3}, M_CRM: {P:5,S:4}, M_LAL: {P:3,S:4}, M_TIME: {P:2,S:3} } },
      diy_home_improvement: { label: 'DIY / Home Improvement', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:3}, M_CTX: {P:4,S:3}, M_KEY: {P:4,S:3}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:2,S:2} } },
      gaming: { label: 'Gaming', scores: { M_GEO: {P:1,S:2}, M_CHAN: {P:4,S:4}, M_INT: {P:5,S:5}, M_CTX: {P:4,S:4}, M_KEY: {P:4,S:4}, M_CRM: {P:3,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:3,S:3} } },
      van_owner: { label: 'Van Owner / Operator', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:5,S:4}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:3,S:3} } },
      self_employed_trader: { label: 'Self-Employed Trader', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:4,S:3}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:5,S:4}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:4,S:4} } },
      learner_driver: { label: 'Learner Driver', scores: { M_GEO: {P:4,S:3}, M_CHAN: {P:4,S:4}, M_INT: {P:4,S:3}, M_CTX: {P:4,S:4}, M_KEY: {P:5,S:4}, M_CRM: {P:3,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:3,S:3} } }
    }
  },

  PSYCH: {
    key: 'PSYCH', label: 'Psychographic', color: '#0891b2', icon: '🧠',
    defaults: { M_GEO: {P:2,S:2}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:2,S:2}, M_CRM: {P:3,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:1,S:1} },
    attributes: {
      health_conscious: { label: 'Health Conscious', scores: { M_GEO: {P:2,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:5,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:3,S:3}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} } },
      eco_conscious: { label: 'Eco-Conscious', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:3,S:3}, M_CRM: {P:3,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} } },
      luxury_oriented: { label: 'Luxury-Oriented', scores: { M_GEO: {P:3,S:2}, M_CHAN: {P:4,S:3}, M_INT: {P:4,S:3}, M_CTX: {P:4,S:3}, M_KEY: {P:3,S:3}, M_CRM: {P:4,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} } },
      price_sensitive_psych: { label: 'Price-Sensitive', scores: { M_GEO: {P:3,S:4}, M_CHAN: {P:3,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:4,S:4}, M_CRM: {P:4,S:3}, M_LAL: {P:3,S:4}, M_TIME: {P:3,S:3} } },
      parent_of_teen: { label: 'Parent of Teenager', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:3}, M_CTX: {P:4,S:4}, M_KEY: {P:4,S:3}, M_CRM: {P:5,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:3,S:3} } },
      parent_of_student: { label: 'Parent of University Student', scores: { M_GEO: {P:4,S:4}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:3}, M_CTX: {P:4,S:4}, M_KEY: {P:4,S:3}, M_CRM: {P:5,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:4,S:4} } }
    }
  },

  PURCH: {
    key: 'PURCH', label: 'Purchase Behavior', color: '#be185d', icon: '🛒',
    defaults: { M_GEO: {P:2,S:2}, M_CHAN: {P:2,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:2,S:2}, M_KEY: {P:3,S:3}, M_CRM: {P:5,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} },
    attributes: {
      premium_buyer: { label: 'Premium Buyer', scores: { M_GEO: {P:3,S:2}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:3,S:3}, M_CRM: {P:5,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} } },
      price_sensitive_purch: { label: 'Price-Sensitive Buyer', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:4}, M_INT: {P:3,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:4,S:4}, M_CRM: {P:4,S:3}, M_LAL: {P:3,S:4}, M_TIME: {P:3,S:3} } },
      auto_intender: { label: 'Auto Intender', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:3,S:3}, M_INT: {P:4,S:3}, M_CTX: {P:4,S:3}, M_KEY: {P:5,S:4}, M_CRM: {P:4,S:2}, M_LAL: {P:4,S:3}, M_TIME: {P:2,S:2} } },
      fashion_buyer: { label: 'Fashion Buyer', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:4,S:3}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:3,S:3}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:3}, M_TIME: {P:3,S:3} } },
      fmcg_regular: { label: 'FMCG Regular', scores: { M_GEO: {P:3,S:4}, M_CHAN: {P:2,S:4}, M_INT: {P:2,S:4}, M_CTX: {P:2,S:3}, M_KEY: {P:2,S:3}, M_CRM: {P:5,S:4}, M_LAL: {P:3,S:4}, M_TIME: {P:2,S:2} } },
      insurance_comparison: { label: 'Insurance Comparison Shopper', scores: { M_GEO: {P:2,S:2}, M_CHAN: {P:4,S:4}, M_INT: {P:4,S:4}, M_CTX: {P:5,S:4}, M_KEY: {P:5,S:5}, M_CRM: {P:4,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:3,S:3} } },
      temp_cover_buyer: { label: 'Temporary Cover Buyer', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:4,S:4}, M_KEY: {P:5,S:4}, M_CRM: {P:5,S:4}, M_LAL: {P:4,S:3}, M_TIME: {P:4,S:4} } }
    }
  },

  CONTEXT: {
    key: 'CONTEXT', label: 'Contextual / Timing', color: '#ca8a04', icon: '📅',
    defaults: { M_GEO: {P:1,S:2}, M_CHAN: {P:2,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:4,S:4}, M_KEY: {P:2,S:2}, M_CRM: {P:2,S:2}, M_LAL: {P:1,S:2}, M_TIME: {P:4,S:4} },
    attributes: {
      seasonal_summer: { label: 'Summer Seasonal', scores: { M_GEO: {P:2,S:3}, M_CHAN: {P:2,S:3}, M_INT: {P:2,S:3}, M_CTX: {P:5,S:4}, M_KEY: {P:3,S:3}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:5,S:4} } },
      seasonal_winter: { label: 'Winter Seasonal', scores: { M_GEO: {P:2,S:3}, M_CHAN: {P:2,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:5,S:4}, M_KEY: {P:3,S:3}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:5,S:4} } },
      commute_window: { label: 'Commute Window', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:1,S:2}, M_CTX: {P:4,S:4}, M_KEY: {P:1,S:1}, M_CRM: {P:1,S:1}, M_LAL: {P:1,S:1}, M_TIME: {P:5,S:5} } },
      evening_leisure: { label: 'Evening Leisure', scores: { M_GEO: {P:1,S:2}, M_CHAN: {P:3,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:4,S:4}, M_KEY: {P:1,S:2}, M_CRM: {P:2,S:2}, M_LAL: {P:1,S:2}, M_TIME: {P:5,S:4} } },
      back_to_school: { label: 'Back-to-School', scores: { M_GEO: {P:2,S:3}, M_CHAN: {P:2,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:5,S:4}, M_KEY: {P:4,S:3}, M_CRM: {P:3,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:5,S:4} } },
      university_term_end: { label: 'University Term End', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:5,S:4}, M_KEY: {P:4,S:3}, M_CRM: {P:3,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:5,S:5} } },
      driving_test_window: { label: 'Driving Test Window', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:3,S:3}, M_INT: {P:3,S:3}, M_CTX: {P:5,S:4}, M_KEY: {P:5,S:4}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:4,S:4} } }
    }
  },

  MEDIA: {
    key: 'MEDIA', label: 'Media Consumption', color: '#4f46e5', icon: '📱',
    defaults: { M_GEO: {P:2,S:2}, M_CHAN: {P:4,S:4}, M_INT: {P:3,S:3}, M_CTX: {P:3,S:3}, M_KEY: {P:2,S:2}, M_CRM: {P:2,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:2,S:2} },
    attributes: {
      digital_heavy: { label: 'Digital Heavy', scores: { M_GEO: {P:2,S:3}, M_CHAN: {P:5,S:5}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:3,S:4}, M_CRM: {P:3,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:3,S:3} } },
      tv_heavy: { label: 'TV Heavy', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:5,S:4}, M_INT: {P:2,S:3}, M_CTX: {P:3,S:4}, M_KEY: {P:1,S:1}, M_CRM: {P:2,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:3,S:4} } },
      social_heavy: { label: 'Social Media Heavy', scores: { M_GEO: {P:1,S:2}, M_CHAN: {P:5,S:5}, M_INT: {P:5,S:5}, M_CTX: {P:4,S:4}, M_KEY: {P:2,S:3}, M_CRM: {P:3,S:3}, M_LAL: {P:4,S:4}, M_TIME: {P:3,S:3} } },
      print_traditional: { label: 'Print / Traditional', scores: { M_GEO: {P:3,S:3}, M_CHAN: {P:4,S:3}, M_INT: {P:2,S:2}, M_CTX: {P:3,S:3}, M_KEY: {P:1,S:1}, M_CRM: {P:2,S:2}, M_LAL: {P:2,S:2}, M_TIME: {P:2,S:2} } },
      podcast_audio: { label: 'Podcast / Audio', scores: { M_GEO: {P:1,S:2}, M_CHAN: {P:4,S:4}, M_INT: {P:4,S:4}, M_CTX: {P:4,S:4}, M_KEY: {P:2,S:2}, M_CRM: {P:2,S:2}, M_LAL: {P:3,S:3}, M_TIME: {P:3,S:3} } }
    }
  }
};

export const EXAMPLE_AUDIENCES = {
  young_affluent_skiers: {
    key: 'young_affluent_skiers',
    label: 'Young Affluent Women Who Ski',
    description: 'Women aged 25–34 with high income who are active skiers. A classic cross-mechanism audience from the TAU spec.',
    attributes: [
      { classKey: 'DEMO', attrKey: 'age_25_34' },
      { classKey: 'DEMO', attrKey: 'gender_female' },
      { classKey: 'SOCIO', attrKey: 'income_high' },
      { classKey: 'BEHAV', attrKey: 'skiing_winter_sports' },
      { classKey: 'CONTEXT', attrKey: 'seasonal_winter' }
    ]
  },
  business_travellers: {
    key: 'business_travellers',
    label: 'Business Travellers',
    description: 'Frequent travellers aged 35–54, high income, urban, digitally heavy. Cross-channel opportunity.',
    attributes: [
      { classKey: 'DEMO', attrKey: 'age_35_44' },
      { classKey: 'SOCIO', attrKey: 'income_high' },
      { classKey: 'GEO', attrKey: 'urban' },
      { classKey: 'BEHAV', attrKey: 'frequent_traveller' },
      { classKey: 'MEDIA', attrKey: 'digital_heavy' }
    ]
  },
  lapsed_gym_london: {
    key: 'lapsed_gym_london',
    label: 'Lapsed Gym Members in London',
    description: 'Fitness-active individuals in London aged 25–34. CRM data (lapsed membership) combined with geo and interest targeting.',
    attributes: [
      { classKey: 'DEMO', attrKey: 'age_25_34' },
      { classKey: 'GEO', attrKey: 'london' },
      { classKey: 'BEHAV', attrKey: 'fitness_active' },
      { classKey: 'PSYCH', attrKey: 'health_conscious' },
      { classKey: 'MEDIA', attrKey: 'social_heavy' }
    ]
  },
  budget_family_shoppers: {
    key: 'budget_family_shoppers',
    label: 'Budget-Conscious Family Shoppers',
    description: 'Price-sensitive families in suburban areas, frequent grocery shoppers, responsive to seasonal promotions.',
    attributes: [
      { classKey: 'DEMO', attrKey: 'age_35_44' },
      { classKey: 'SOCIO', attrKey: 'income_low' },
      { classKey: 'GEO', attrKey: 'suburban' },
      { classKey: 'PURCH', attrKey: 'price_sensitive_purch' },
      { classKey: 'BEHAV', attrKey: 'grocery_frequent' },
      { classKey: 'PSYCH', attrKey: 'price_sensitive_psych' }
    ]
  },
  premium_tech_adopters: {
    key: 'premium_tech_adopters',
    label: 'Premium Tech Early Adopters',
    description: 'High-income tech enthusiasts who are premium buyers, heavy digital consumers, interested in gaming.',
    attributes: [
      { classKey: 'SOCIO', attrKey: 'income_high' },
      { classKey: 'BEHAV', attrKey: 'tech_enthusiast' },
      { classKey: 'PURCH', attrKey: 'premium_buyer' },
      { classKey: 'MEDIA', attrKey: 'digital_heavy' },
      { classKey: 'PSYCH', attrKey: 'luxury_oriented' }
    ]
  },
  dayinsure_van_high_risk: {
    key: 'dayinsure_van_high_risk',
    label: 'Day Insure: Van High-Risk / Hard-to-Insure',
    description: 'Drivers who cannot get standard insurance due to convictions, non-UK residency, or other risk factors. Urban, migrant-heavy, logistics areas. Search-led acquisition.',
    attributes: [
      { classKey: 'GEO', attrKey: 'urban' },
      { classKey: 'SOCIO', attrKey: 'income_low' },
      { classKey: 'SOCIO', attrKey: 'education_none' },
      { classKey: 'BEHAV', attrKey: 'van_owner' },
      { classKey: 'PURCH', attrKey: 'insurance_comparison' },
      { classKey: 'PURCH', attrKey: 'temp_cover_buyer' }
    ]
  },
  dayinsure_van_traders: {
    key: 'dayinsure_van_traders',
    label: 'Day Insure: Van Traders / Sporadic Cover',
    description: 'Self-employed tradespeople needing temporary van insurance for specific jobs. Suburban industrial areas, job-timing driven.',
    attributes: [
      { classKey: 'GEO', attrKey: 'suburban' },
      { classKey: 'SOCIO', attrKey: 'education_vocational' },
      { classKey: 'BEHAV', attrKey: 'van_owner' },
      { classKey: 'BEHAV', attrKey: 'self_employed_trader' },
      { classKey: 'PURCH', attrKey: 'temp_cover_buyer' },
      { classKey: 'PSYCH', attrKey: 'price_sensitive_psych' }
    ]
  },
  dayinsure_student_parents: {
    key: 'dayinsure_student_parents',
    label: 'Day Insure: Student Holiday Cover (Parent Buyer)',
    description: 'Parents buying temporary insurance for university students home for holidays. Affluent suburban family geographies, strongest seasonal timing signal.',
    attributes: [
      { classKey: 'DEMO', attrKey: 'parent_40_60' },
      { classKey: 'GEO', attrKey: 'suburban' },
      { classKey: 'SOCIO', attrKey: 'income_mid' },
      { classKey: 'PSYCH', attrKey: 'parent_of_student' },
      { classKey: 'CONTEXT', attrKey: 'university_term_end' },
      { classKey: 'PURCH', attrKey: 'temp_cover_buyer' }
    ]
  },
  dayinsure_new_driver_parents: {
    key: 'dayinsure_new_driver_parents',
    label: 'Day Insure: New Drivers / Learners (Parent Buyer)',
    description: 'Parents buying temporary learner insurance for 17-year-olds learning to drive. Affluent suburban multi-car households.',
    attributes: [
      { classKey: 'DEMO', attrKey: 'parent_40_60' },
      { classKey: 'GEO', attrKey: 'suburban' },
      { classKey: 'SOCIO', attrKey: 'income_mid' },
      { classKey: 'PSYCH', attrKey: 'parent_of_teen' },
      { classKey: 'BEHAV', attrKey: 'learner_driver' },
      { classKey: 'CONTEXT', attrKey: 'driving_test_window' }
    ]
  }
};

export const MECHANISM_RECOMMENDATIONS = {
  M_GEO: {
    high: 'Strong geographic clustering detected. Use postcode-level targeting in Atlas to focus media delivery on high-index areas. Consider direct mail, OOH, and regional press.',
    mid: 'Moderate geographic signal. Use geo-targeting as a secondary layer to refine reach, not as the primary mechanism.',
    low: 'Weak geographic signal — this audience is geographically dispersed. Geo-targeting will add limited value; prioritise other mechanisms.'
  },
  M_CHAN: {
    high: 'Channel selection is a primary lever. Allocate budget to channels where this audience over-indexes (digital, TV, social) based on media consumption profile.',
    mid: 'Channel selection provides moderate differentiation. Use media mix modelling to identify best-performing channels.',
    low: 'This audience is not strongly differentiated by channel. Focus spend optimisation on other mechanisms.'
  },
  M_INT: {
    high: 'Strong interest-based signal. Deploy behavioural targeting via interest segments on programmatic platforms (DV360, Meta, TikTok). Use content affinity data.',
    mid: 'Interest targeting provides useful refinement. Layer interest segments onto broader channel or geo buys for incremental precision.',
    low: 'Interest data provides limited differentiation for this audience. Avoid over-reliance on behavioural segments.'
  },
  M_CTX: {
    high: 'Contextual alignment is highly effective. Target content environments that match this audience\'s interests and mindset. Use keyword and topic-level contextual tools.',
    mid: 'Contextual targeting adds moderate value. Use as a supplementary signal alongside primary mechanisms.',
    low: 'Contextual alignment has limited impact. This audience is not strongly associated with specific content environments.'
  },
  M_KEY: {
    high: 'Search intent is a strong signal. Invest in paid search with tailored keyword strategies. Consider SEO content to capture organic demand.',
    mid: 'Search captures some demand. Maintain keyword presence but don\'t over-allocate vs. other mechanisms.',
    low: 'Low search intent signal. This audience is unlikely to express need via search queries — use push rather than pull strategies.'
  },
  M_CRM: {
    high: 'First-party data is a key asset. Leverage CRM segments for personalisation, lookalike seeding, and retention campaigns. Ensure data hygiene and consent.',
    mid: 'CRM data provides moderate signal. Use for lookalike seeding and existing customer segmentation.',
    low: 'Limited first-party data available or applicable. Build CRM capability as a long-term investment.'
  },
  M_LAL: {
    high: 'Lookalike modelling will extend reach efficiently. Seed from CRM/converter data and deploy via platform LAL tools (Meta, Google, programmatic).',
    mid: 'Lookalikes offer moderate scale extension. Test multiple seed audiences and expansion ranges.',
    low: 'Lookalike modelling has limited applicability. The audience signal may be too broad or too niche for effective modelling.'
  },
  M_TIME: {
    high: 'Strong temporal pattern detected. Use dayparting, seasonal scheduling, and moment-based triggers to maximise impact and efficiency.',
    mid: 'Some temporal patterns exist. Apply basic dayparting and seasonal adjustments to media scheduling.',
    low: 'No strong temporal pattern. Standard scheduling with even distribution is appropriate.'
  }
};
