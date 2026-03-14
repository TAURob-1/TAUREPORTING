/**
 * Atlas Simple Segments — dimension definitions for "Build Your Own" audience builder.
 *
 * Each dimension maps to columns in uk_demographics_enriched_msoa.csv.
 * Options within a dimension are mutually exclusive selections; users pick one
 * option per dimension and combine across dimensions (AND logic).
 *
 * Two scoring types:
 *   - "share" (default): option score = sum(columns) / MSOA total population * 100
 *   - "quintile": MSOA ranked by sourceColumn across all MSOAs; assigned to percentile band
 */

export const SEGMENT_DIMENSIONS = {
  age: {
    label: 'Age',
    description: 'Life-stage age groups collapsed from 18 census bands',
    options: {
      young_adults: {
        label: 'Young Adults (18–29)',
        columns: ['sum_age_15_19', 'sum_age_20_24', 'sum_age_25_29'],
        note: '15-19 used as partial proxy for 18-19'
      },
      early_career: {
        label: 'Early Career (30–44)',
        columns: ['sum_age_30_34', 'sum_age_35_39', 'sum_age_40_44']
      },
      mid_life: {
        label: 'Mid-Life (45–59)',
        columns: ['sum_age_45_49', 'sum_age_50_54', 'sum_age_55_59']
      },
      pre_retirement: {
        label: 'Pre-Retirement (60–74)',
        columns: ['sum_age_60_64', 'sum_age_65_69', 'sum_age_70_74']
      },
      retirement: {
        label: 'Retirement (75+)',
        columns: ['sum_age_75_79', 'sum_age_80_84', 'sum_age_85_plus']
      },
      families_children: {
        label: 'Families with Children (0–17)',
        columns: ['sum_age_0_4', 'sum_age_5_9', 'sum_age_10_14', 'sum_age_15_19']
      }
    }
  },

  income: {
    label: 'Income',
    description: 'Median income banded into quintile tiles from med_inc',
    type: 'quintile',
    sourceColumn: 'med_inc',
    options: {
      low:           { label: 'Low',           percentileRange: [0, 20] },
      below_average: { label: 'Below Average', percentileRange: [20, 40] },
      average:       { label: 'Average',       percentileRange: [40, 60] },
      above_average: { label: 'Above Average', percentileRange: [60, 80] },
      high:          { label: 'High',          percentileRange: [80, 100] }
    }
  },

  household_size: {
    label: 'Household Size',
    description: 'Dominant household size in the MSOA',
    options: {
      single: {
        label: 'Single Person',
        columns: ['Household size: 1 person in household; measures: Value']
      },
      couples: {
        label: 'Couples (2)',
        columns: ['Household size: 2 people in household; measures: Value']
      },
      small_family: {
        label: 'Small Family (3–4)',
        columns: [
          'Household size: 3 people in household; measures: Value',
          'Household size: 4 people in household; measures: Value'
        ]
      },
      large: {
        label: 'Large (5+)',
        columns: [
          'Household size: 5 people in household; measures: Value',
          'Household size: 6 people in household; measures: Value',
          'Household size: 7 people in household; measures: Value',
          'Household size: 8 or more people in household; measures: Value'
        ]
      }
    }
  },

  education: {
    label: 'Education',
    description: 'Highest qualification level collapsed into 3 tiers',
    options: {
      no_qualifications: {
        label: 'No Qualifications',
        columns: ['Highest level of qualification: No qualifications']
      },
      level_1_3: {
        label: 'Level 1–3 (Vocational/Secondary)',
        columns: [
          'Highest level of qualification: Level 1 and entry level qualifications',
          'Highest level of qualification: Level 2 qualifications',
          'Highest level of qualification: Apprenticeship',
          'Highest level of qualification: Level 3 qualifications'
        ]
      },
      level_4_plus: {
        label: 'Level 4+ (Degree & Above)',
        columns: ['Highest level of qualification: Level 4 qualifications and above']
      }
    }
  },

  car_ownership: {
    label: 'Car Ownership',
    description: 'Vehicle access per household',
    options: {
      no_car: {
        label: 'No Car',
        columns: ['Number of cars or vans: No cars or vans in household']
      },
      one_car: {
        label: '1 Car',
        columns: ['Number of cars or vans: 1 car or van in household']
      },
      two_plus: {
        label: '2+ Cars',
        columns: [
          'Number of cars or vans: 2 cars or vans in household',
          'Number of cars or vans: 3 or more cars or vans in household'
        ]
      }
    }
  },

  housing: {
    label: 'Housing',
    description: 'Bedrooms as proxy for property size',
    options: {
      one_bed: {
        label: '1 Bed',
        columns: ['Number of bedrooms: 1 bedroom']
      },
      two_bed: {
        label: '2 Bed',
        columns: ['Number of bedrooms: 2 bedrooms']
      },
      three_bed: {
        label: '3 Bed',
        columns: ['Number of bedrooms: 3 bedrooms']
      },
      four_plus: {
        label: '4+ Bed',
        columns: ['Number of bedrooms: 4 or more bedrooms']
      }
    }
  }
};
