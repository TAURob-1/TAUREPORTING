/**
 * Atlas Pre-Built Segment Taxonomy
 *
 * Column references use actual CSV header names from uk_demographics_enriched_msoa.csv
 * Each criterion has: cols (numerator), total (denominator), dir (HIGH/LOW/MID/LOW-MID/MID-HIGH/LOWEST)
 * Scoring: compute share = sum(cols)/total, then compare to national average.
 *   HIGH    → index > 100 scores well (over-representation)
 *   LOW     → index < 100 scores well (under-representation, inverted)
 *   MID     → proximity to 100 scores well
 *   LOW-MID → below median but not extreme
 *   MID-HIGH→ above median but not top
 *   LOWEST  → bottom decile
 *   NEUTRAL → ignored in scoring (informational only)
 *
 * For med_inc and Population Density, these are absolute values scored via percentile rank.
 */

const C = {
  // Shorthand aliases for column names
  popDensity: 'Population Density: Persons per square kilometre; measures: Value',
  medInc: 'med_inc',
  sumTotal: 'sum_total',
  // Age
  age0_4: 'sum_age_0_4', age5_9: 'sum_age_5_9', age10_14: 'sum_age_10_14', age15_19: 'sum_age_15_19',
  age20_24: 'sum_age_20_24', age25_29: 'sum_age_25_29', age30_34: 'sum_age_30_34', age35_39: 'sum_age_35_39',
  age40_44: 'sum_age_40_44', age45_49: 'sum_age_45_49', age50_54: 'sum_age_50_54', age55_59: 'sum_age_55_59',
  age60_64: 'sum_age_60_64', age65_69: 'sum_age_65_69', age70_74: 'sum_age_70_74', age75_79: 'sum_age_75_79',
  age80_84: 'sum_age_80_84', age85p: 'sum_age_85_plus',
  // Bedrooms
  bedTotal: 'Number of bedrooms: Total: All households',
  bed1: 'Number of bedrooms: 1 bedroom', bed2: 'Number of bedrooms: 2 bedrooms',
  bed3: 'Number of bedrooms: 3 bedrooms', bed4p: 'Number of bedrooms: 4 or more bedrooms',
  // Students
  stuTotal: 'Schoolchild or full-time student indicator: Total: All usual residents aged 5 years and over',
  student: 'Schoolchild or full-time student indicator: Student',
  // Country of birth
  cobTotal: 'Country of birth: Total; measures: Value',
  cobEurope: 'Country of birth: Europe; measures: Value',
  cobUK: 'Country of birth: Europe: United Kingdom; measures: Value',
  cobEU: 'Country of birth: Europe: EU countries; measures: Value',
  cobEU14: 'Country of birth: Europe: EU countries: European Union EU14; measures: Value',
  cobEU8: 'Country of birth: Europe: EU countries: European Union EU8; measures: Value',
  cobEU2: 'Country of birth: Europe: EU countries: European Union EU2; measures: Value',
  cobNonEU: 'Country of birth: Europe: Non-EU countries; measures: Value',
  cobAfrica: 'Country of birth: Africa; measures: Value',
  cobAsia: 'Country of birth: Middle East and Asia; measures: Value',
  cobAmericas: 'Country of birth: The Americas and the Caribbean; measures: Value',
  // Second address
  secAddrTotal: 'Second address indicator: Total: All usual residents',
  secAddrUK: 'Second address indicator: Second address is in the UK',
  // Qualifications
  qualTotal: 'Highest level of qualification: Total: All usual residents aged 16 years and over',
  qualNone: 'Highest level of qualification: No qualifications',
  qualL1: 'Highest level of qualification: Level 1 and entry level qualifications',
  qualL2: 'Highest level of qualification: Level 2 qualifications',
  qualAppr: 'Highest level of qualification: Apprenticeship',
  qualL3: 'Highest level of qualification: Level 3 qualifications',
  qualL4p: 'Highest level of qualification: Level 4 qualifications and above',
  // Industry
  indTotal: 'Industry (current): Total: All usual residents aged 16 years and over in employment the week before the census',
  indAgri: 'Industry (current): A: Agriculture, Forestry and fishing',
  indCrop: 'Industry (current): 01 Crop and animal production, hunting and related service activities',
  indMfg: 'Industry (current): C: Manufacturing',
  indConstruction: 'Industry (current): F: Construction',
  indConstBuildings: 'Industry (current): 41 Construction of buildings; 42 Civil engineering; 43 Specialised construction activities',
  indWholesaleRetail: 'Industry (current): G: Wholesale and retail trade; repair of motor vehicles and motorcycles',
  indRetail: 'Industry (current): 47 Retail trade, except of motor vehicles and motorcycles',
  indTransport: 'Industry (current): H: Transport and storage',
  indAccomFood: 'Industry (current): I: Accommodation and food service activities',
  indAccom: 'Industry (current): 55 Accommodation',
  indInfoComm: 'Industry (current): J: Information and communication',
  indFilmTV: 'Industry (current): 59 Motion picture, video and television production, sound recording and music publishing activities',
  indBroadcast: 'Industry (current): 60 Programming and broadcasting activities',
  indComputer: 'Industry (current): 62 Computer programming, consultancy and related activities',
  indFinIns: 'Industry (current): K: Financial and insurance activities',
  indFinSvc: 'Industry (current): 64 Financial service activities, except insurance and pension funding',
  indProfSci: 'Industry (current): M: Professional, scientific and technical activities',
  indLegal: 'Industry (current): 69 Legal and accounting activities',
  indMgmtConsult: 'Industry (current): 70 Activities of head offices; management consultancy activities',
  indRD: 'Industry (current): 72 Scientific research and development',
  indEducation: 'Industry (current): P: Education',
  indEdu85: 'Industry (current): 85 Education',
  indHealth: 'Industry (current): Q: Human health and social work activities',
  indHealthAct: 'Industry (current): 86 Human health activities',
  indCreative: 'Industry (current): 90 Creative, arts and entertainment activities',
  // Cars
  carTotal: 'Number of cars or vans: Total: All households',
  carNone: 'Number of cars or vans: No cars or vans in household',
  car1: 'Number of cars or vans: 1 car or van in household',
  car2: 'Number of cars or vans: 2 cars or vans in household',
  car3p: 'Number of cars or vans: 3 or more cars or vans in household',
  // Household size
  hhTotal: 'Household size: Total: All household spaces; measures: Value',
  hh1: 'Household size: 1 person in household; measures: Value',
  hh2: 'Household size: 2 people in household; measures: Value',
  hh3: 'Household size: 3 people in household; measures: Value',
  hh4: 'Household size: 4 people in household; measures: Value',
  hh5: 'Household size: 5 people in household; measures: Value',
  hh6: 'Household size: 6 people in household; measures: Value',
  hh7: 'Household size: 7 people in household; measures: Value',
  hh8p: 'Household size: 8 or more people in household; measures: Value',
  // Occupation
  occTotal: 'Occupation (current): Total: All usual residents aged 16 years and over in employment the week before the census',
  occManagers: 'Occupation (current): 1. Managers, directors and senior officials',
  occProfessional: 'Occupation (current): 2. Professional occupations',
  occAssocProf: 'Occupation (current): 3. Associate professional and technical occupations',
  occAdmin: 'Occupation (current): 4. Administrative and secretarial occupations',
  occTrades: 'Occupation (current): 5. Skilled trades occupations',
  occCaring: 'Occupation (current): 6. Caring, leisure and other service occupations',
  occSales: 'Occupation (current): 7. Sales and customer service occupations',
  occProcess: 'Occupation (current): 8. Process, plant and machine operatives',
  occElementary: 'Occupation (current): 9. Elementary occupations',
  // Religion
  relTotal: 'Religion: Total: All usual residents',
  relMuslim: 'Religion: Muslim', relHindu: 'Religion: Hindu', relSikh: 'Religion: Sikh',
};

// Helper: criterion builder
function cr(cols, total, dir, weight) {
  return { cols: Array.isArray(cols) ? cols : [cols], total, dir, weight: weight || 1 };
}

const PREBUILT_TAXONOMY = {
  A: {
    code: 'A', label: 'Metropolitan Professionals', color: '#1e40af',
    groups: {
      A1: { code: 'A1', label: 'City Elite',
        types: {
          'A1.1': { code: 'A1.1', label: 'Executive Postcodes', description: 'Wealthy urban executives in large city homes',
            criteria: [
              cr(C.popDensity, null, 'HIGH_PCTL', 1),
              cr(C.medInc, null, 'HIGH_PCTL_90', 1.5),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr(C.occManagers, C.occTotal, 'HIGH', 1),
              cr(C.bed4p, C.bedTotal, 'HIGH', 1),
              cr([C.car2, C.car3p], C.carTotal, 'HIGH', 0.8),
            ]},
          'A1.2': { code: 'A1.2', label: 'Prime Apartments', description: 'Affluent professionals in premium small city homes',
            criteria: [
              cr(C.popDensity, null, 'HIGH_PCTL', 1),
              cr(C.medInc, null, 'HIGH_PCTL_75', 1.2),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr([C.bed1, C.bed2], C.bedTotal, 'HIGH', 1),
              cr([C.hh1, C.hh2], C.hhTotal, 'HIGH', 0.8),
              cr([C.indFinIns, C.indProfSci], C.indTotal, 'HIGH', 1),
            ]},
        }},
      A2: { code: 'A2', label: 'Urban Careerists',
        types: {
          'A2.1': { code: 'A2.1', label: 'Tech Quarter', description: 'Young tech workers in dense urban areas',
            criteria: [
              cr(C.popDensity, null, 'HIGH_PCTL_50', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr([C.age25_29, C.age30_34, C.age35_39], C.sumTotal, 'HIGH', 1.2),
              cr([C.indInfoComm, C.indComputer], C.indTotal, 'HIGH', 1.5),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr([C.hh1, C.hh2], C.hhTotal, 'HIGH', 0.7),
            ]},
          'A2.2': { code: 'A2.2', label: 'City Professionals', description: 'Finance and legal professionals in the city',
            criteria: [
              cr(C.popDensity, null, 'HIGH_PCTL_50', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr([C.age30_34, C.age35_39, C.age40_44], C.sumTotal, 'HIGH', 1),
              cr([C.indFinIns, C.indLegal, C.indMgmtConsult], C.indTotal, 'HIGH', 1.5),
              cr(C.occProfessional, C.occTotal, 'HIGH', 1),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
            ]},
        }},
      A3: { code: 'A3', label: 'Commuter Belt Affluence',
        types: {
          'A3.1': { code: 'A3.1', label: 'Prosperous Commuters', description: 'Wealthy professional families in the commuter belt',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_50', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_75', 1.2),
              cr(C.occProfessional, C.occTotal, 'HIGH', 1),
              cr(C.bed4p, C.bedTotal, 'HIGH', 1),
              cr([C.car2, C.car3p], C.carTotal, 'HIGH', 1),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
            ]},
          'A3.2': { code: 'A3.2', label: 'Executive Suburbs', description: 'Senior managers in family suburbs',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_50', 0.7),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr(C.occManagers, C.occTotal, 'HIGH', 1.2),
              cr([C.hh3, C.hh4], C.hhTotal, 'HIGH', 1),
              cr([C.bed3, C.bed4p], C.bedTotal, 'HIGH', 0.8),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
            ]},
        }},
    }},
  B: {
    code: 'B', label: 'Comfortable Families', color: '#059669',
    groups: {
      B1: { code: 'B1', label: 'Thriving Parents',
        types: {
          'B1.1': { code: 'B1.1', label: 'School Catchment Families', description: 'Educated affluent families with school-age children',
            criteria: [
              cr([C.age5_9, C.age10_14], C.sumTotal, 'HIGH', 1.2),
              cr(C.student, C.stuTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_50', 1),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr([C.bed3, C.bed4p], C.bedTotal, 'HIGH', 1),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
            ]},
          'B1.2': { code: 'B1.2', label: 'Established Family Homes', description: 'Larger families in spacious suburban houses',
            criteria: [
              cr([C.age0_4, C.age5_9, C.age10_14, C.age15_19], C.sumTotal, 'HIGH', 1.2),
              cr([C.hh4, C.hh5], C.hhTotal, 'HIGH', 1),
              cr(C.bed4p, C.bedTotal, 'HIGH', 1),
              cr(C.car3p, C.carTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr(C.popDensity, null, 'LOW_PCTL_50', 0.7),
            ]},
        }},
      B2: { code: 'B2', label: 'Suburban Settlers',
        types: {
          'B2.1': { code: 'B2.1', label: 'Mid-Range Family Streets', description: 'Average-income families in 3-bed houses',
            criteria: [
              cr(C.medInc, null, 'MID_PCTL', 1),
              cr(C.bed3, C.bedTotal, 'HIGH', 1.2),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
              cr([C.hh3, C.hh4], C.hhTotal, 'HIGH', 1),
              cr([C.qualL2, C.qualL3], C.qualTotal, 'HIGH', 0.8),
            ]},
          'B2.2': { code: 'B2.2', label: 'Growing Households', description: 'Young parents with small children',
            criteria: [
              cr([C.age30_34, C.age35_39], C.sumTotal, 'HIGH', 1),
              cr([C.age0_4, C.age5_9], C.sumTotal, 'HIGH', 1.2),
              cr(C.hh3, C.hhTotal, 'HIGH', 1),
              cr([C.bed2, C.bed3], C.bedTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.7),
            ]},
        }},
      B3: { code: 'B3', label: 'Working Family Effort',
        types: {
          'B3.1': { code: 'B3.1', label: 'Shift-Work Families', description: 'Manual worker families on modest incomes',
            criteria: [
              cr([C.occProcess, C.occElementary], C.occTotal, 'HIGH', 1.2),
              cr([C.age0_4, C.age5_9, C.age10_14], C.sumTotal, 'HIGH', 1),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.8),
              cr([C.qualNone, C.qualL1], C.qualTotal, 'HIGH', 0.8),
              cr(C.bed3, C.bedTotal, 'HIGH', 0.7),
              cr([C.indMfg, C.indConstruction], C.indTotal, 'HIGH', 1),
            ]},
          'B3.2': { code: 'B3.2', label: 'Trade Family Homes', description: 'Skilled trade families with school-age kids',
            criteria: [
              cr(C.occTrades, C.occTotal, 'HIGH', 1.5),
              cr([C.age5_9, C.age10_14, C.age15_19], C.sumTotal, 'HIGH', 1),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr(C.bed3, C.bedTotal, 'HIGH', 0.8),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
              cr(C.qualAppr, C.qualTotal, 'HIGH', 1),
            ]},
        }},
    }},
  C: {
    code: 'C', label: 'Young & Urban', color: '#7c3aed',
    groups: {
      C1: { code: 'C1', label: 'Graduate Starters',
        types: {
          'C1.1': { code: 'C1.1', label: 'First Rung Professionals', description: 'Young graduates starting careers in city flats',
            criteria: [
              cr([C.age20_24, C.age25_29], C.sumTotal, 'HIGH', 1.2),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr([C.occProfessional, C.occAssocProf], C.occTotal, 'HIGH', 1),
              cr(C.bed1, C.bedTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr(C.popDensity, null, 'HIGH_PCTL_50', 0.7),
            ]},
          'C1.2': { code: 'C1.2', label: 'Shared Graduate Living', description: 'Graduates sharing houses in urban areas',
            criteria: [
              cr([C.age20_24, C.age25_29], C.sumTotal, 'HIGH', 1.2),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr([C.hh3, C.hh4, C.hh5], C.hhTotal, 'HIGH', 1),
              cr([C.age0_4, C.age5_9, C.age10_14], C.sumTotal, 'LOW', 0.8),
              cr(C.popDensity, null, 'HIGH_PCTL', 0.7),
            ]},
        }},
      C2: { code: 'C2', label: 'Student & Academic',
        types: {
          'C2.1': { code: 'C2.1', label: 'University Towns', description: 'Student-dominated areas near universities',
            criteria: [
              cr([C.age15_19, C.age20_24], C.sumTotal, 'HIGH', 1.5),
              cr(C.student, C.stuTotal, 'HIGH', 1.2),
              cr([C.indEducation, C.indEdu85], C.indTotal, 'HIGH', 1),
              cr([C.hh5, C.hh6, C.hh7], C.hhTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.7),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
            ]},
          'C2.2': { code: 'C2.2', label: 'Campus Fringe', description: 'International student mix near campuses',
            criteria: [
              cr(C.student, C.stuTotal, 'HIGH', 1),
              cr([C.age20_24, C.age25_29], C.sumTotal, 'HIGH', 1),
              cr([C.cobNonEU, C.cobAsia], C.cobTotal, 'HIGH', 1),
              cr(C.popDensity, null, 'HIGH_PCTL_50', 0.7),
              cr([C.bed1, C.bed2], C.bedTotal, 'HIGH', 0.8),
            ]},
        }},
      C3: { code: 'C3', label: 'Urban Independents',
        types: {
          'C3.1': { code: 'C3.1', label: 'City Renters', description: 'Young singles in urban service-sector jobs',
            criteria: [
              cr([C.age25_29, C.age30_34], C.sumTotal, 'HIGH', 1.2),
              cr(C.hh1, C.hhTotal, 'HIGH', 1),
              cr(C.bed1, C.bedTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr([C.indAccomFood, C.indRetail], C.indTotal, 'HIGH', 1),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.7),
            ]},
          'C3.2': { code: 'C3.2', label: 'Creative Urbanites', description: 'Creative-industry workers in dense city areas',
            criteria: [
              cr([C.age25_29, C.age30_34], C.sumTotal, 'HIGH', 1),
              cr([C.indCreative, C.indFilmTV, C.indBroadcast], C.indTotal, 'HIGH', 1.5),
              cr(C.popDensity, null, 'HIGH_PCTL', 1),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'MID_PCTL', 0.5),
            ]},
        }},
    }},
  D: {
    code: 'D', label: 'Established Middle', color: '#ca8a04',
    groups: {
      D1: { code: 'D1', label: 'Mid-Life Comfort',
        types: {
          'D1.1': { code: 'D1.1', label: 'Settled Suburbia', description: 'Mid-life average-income suburban households',
            criteria: [
              cr([C.age45_49, C.age50_54, C.age55_59], C.sumTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'MID_PCTL', 1),
              cr(C.bed3, C.bedTotal, 'HIGH', 1),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
              cr([C.qualL2, C.qualL3], C.qualTotal, 'HIGH', 0.7),
            ]},
          'D1.2': { code: 'D1.2', label: 'Comfortable Plateau', description: 'Established professionals in larger homes',
            criteria: [
              cr([C.age45_49, C.age50_54], C.sumTotal, 'HIGH', 1),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr([C.occProfessional, C.occAdmin], C.occTotal, 'HIGH', 1),
              cr([C.bed3, C.bed4p], C.bedTotal, 'HIGH', 0.8),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 0.7),
            ]},
        }},
      D2: { code: 'D2', label: 'Traditional Employment',
        types: {
          'D2.1': { code: 'D2.1', label: 'Industrial Heartland', description: 'Manufacturing and construction workers',
            criteria: [
              cr([C.indMfg, C.indConstruction], C.indTotal, 'HIGH', 1.5),
              cr([C.qualL1, C.qualL2, C.qualAppr], C.qualTotal, 'HIGH', 1),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr([C.age40_44, C.age45_49, C.age50_54], C.sumTotal, 'HIGH', 1),
              cr([C.occTrades, C.occProcess], C.occTotal, 'HIGH', 1.2),
            ]},
          'D2.2': { code: 'D2.2', label: 'Practical Trades', description: 'Construction tradespeople in 3-bed homes',
            criteria: [
              cr(C.occTrades, C.occTotal, 'HIGH', 1.5),
              cr(C.qualAppr, C.qualTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr(C.bed3, C.bedTotal, 'HIGH', 0.8),
              cr(C.car2, C.carTotal, 'HIGH', 0.7),
              cr([C.indConstruction, C.indConstBuildings], C.indTotal, 'HIGH', 1),
            ]},
        }},
      D3: { code: 'D3', label: 'Small Town Mainstream',
        types: {
          'D3.1': { code: 'D3.1', label: 'Market Town Workers', description: 'Retail-dominated small town workers',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_50', 0.8),
              cr([C.indWholesaleRetail, C.indRetail], C.indTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr([C.qualL2, C.qualL3], C.qualTotal, 'HIGH', 0.8),
            ]},
          'D3.2': { code: 'D3.2', label: 'Suburban Routine', description: 'Admin workers in average suburban settings',
            criteria: [
              cr(C.occAdmin, C.occTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'MID_PCTL', 0.8),
              cr([C.hh2, C.hh3], C.hhTotal, 'HIGH', 0.8),
              cr(C.bed3, C.bedTotal, 'HIGH', 0.8),
            ]},
        }},
    }},
  E: {
    code: 'E', label: 'Rural & Country', color: '#15803d',
    groups: {
      E1: { code: 'E1', label: 'Country Prosperity',
        types: {
          'E1.1': { code: 'E1.1', label: 'Landed Comfort', description: 'Affluent rural residents in large properties',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_25', 1),
              cr(C.medInc, null, 'HIGH_PCTL_75', 1.2),
              cr(C.bed4p, C.bedTotal, 'HIGH', 1.2),
              cr(C.car3p, C.carTotal, 'HIGH', 1),
              cr(C.occManagers, C.occTotal, 'HIGH', 1),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 0.8),
            ]},
          'E1.2': { code: 'E1.2', label: 'Farming Estates', description: 'Agricultural families on large rural properties',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_25', 1),
              cr([C.indAgri, C.indCrop], C.indTotal, 'HIGH', 2),
              cr(C.bed4p, C.bedTotal, 'HIGH', 1),
              cr(C.car3p, C.carTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.7),
              cr([C.hh3, C.hh4], C.hhTotal, 'HIGH', 0.7),
            ]},
        }},
      E2: { code: 'E2', label: 'Village Life',
        types: {
          'E2.1': { code: 'E2.1', label: 'Settled Villages', description: 'Older UK-born residents in rural villages',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_25', 1),
              cr([C.age50_54, C.age55_59, C.age60_64, C.age65_69], C.sumTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr(C.bed3, C.bedTotal, 'HIGH', 0.8),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
              cr(C.cobUK, C.cobTotal, 'HIGH', 0.7),
            ]},
          'E2.2': { code: 'E2.2', label: 'Rural Working Age', description: 'Working-age trades people in rural areas',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_25', 1),
              cr([C.age35_39, C.age40_44, C.age45_49], C.sumTotal, 'HIGH', 1),
              cr(C.occTrades, C.occTotal, 'HIGH', 1.2),
              cr([C.indAgri, C.indConstruction], C.indTotal, 'HIGH', 1),
              cr(C.medInc, null, 'MID_PCTL', 0.5),
            ]},
        }},
      E3: { code: 'E3', label: 'Remote & Sparse',
        types: {
          'E3.1': { code: 'E3.1', label: 'Deep Rural', description: 'Most remote areas with older, lower-qualified population',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_10', 1.5),
              cr([C.age65_69, C.age70_74, C.age75_79], C.sumTotal, 'HIGH', 1.2),
              cr(C.indAgri, C.indTotal, 'HIGH', 1.5),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.7),
              cr(C.qualNone, C.qualTotal, 'HIGH', 0.8),
            ]},
          'E3.2': { code: 'E3.2', label: 'Coastal Periphery', description: 'Coastal retirement and tourism areas',
            criteria: [
              cr(C.popDensity, null, 'LOW_PCTL_25', 1),
              cr([C.indAccomFood, C.indAccom], C.indTotal, 'HIGH', 1.5),
              cr([C.age60_64, C.age65_69, C.age70_74], C.sumTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.7),
              cr([C.occCaring, C.occSales], C.occTotal, 'HIGH', 0.8),
              cr(C.secAddrUK, C.secAddrTotal, 'HIGH', 0.8),
            ]},
        }},
    }},
  F: {
    code: 'F', label: 'Later Life', color: '#9333ea',
    groups: {
      F1: { code: 'F1', label: 'Comfortable Retirement',
        types: {
          'F1.1': { code: 'F1.1', label: 'Affluent Retirees', description: 'Wealthy retired couples in large homes',
            criteria: [
              cr([C.age65_69, C.age70_74, C.age75_79], C.sumTotal, 'HIGH', 1.5),
              cr(C.medInc, null, 'HIGH_PCTL_75', 1.2),
              cr(C.bed4p, C.bedTotal, 'HIGH', 1),
              cr(C.car2, C.carTotal, 'HIGH', 0.8),
              cr(C.hh2, C.hhTotal, 'HIGH', 1),
            ]},
          'F1.2': { code: 'F1.2', label: 'Downsized Comfort', description: 'Comfortably off retirees in smaller homes',
            criteria: [
              cr([C.age65_69, C.age70_74], C.sumTotal, 'HIGH', 1.5),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr([C.bed2, C.bed3], C.bedTotal, 'HIGH', 1),
              cr(C.hh2, C.hhTotal, 'HIGH', 1),
              cr(C.car1, C.carTotal, 'HIGH', 0.7),
            ]},
        }},
      F2: { code: 'F2', label: 'Modest Retirement',
        types: {
          'F2.1': { code: 'F2.1', label: 'Bungalow Belt', description: 'Older couples in modest homes at suburban edges',
            criteria: [
              cr([C.age70_74, C.age75_79], C.sumTotal, 'HIGH', 1.5),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr([C.bed2, C.bed3], C.bedTotal, 'HIGH', 1),
              cr(C.car1, C.carTotal, 'HIGH', 0.8),
              cr(C.hh2, C.hhTotal, 'HIGH', 0.8),
              cr(C.popDensity, null, 'LOW_PCTL_50', 0.7),
            ]},
          'F2.2': { code: 'F2.2', label: 'Seaside Seniors', description: 'Retired populations in coastal/resort areas',
            criteria: [
              cr([C.age65_69, C.age70_74, C.age75_79], C.sumTotal, 'HIGH', 1.5),
              cr(C.popDensity, null, 'LOW_PCTL_25', 0.8),
              cr(C.secAddrUK, C.secAddrTotal, 'HIGH', 1),
              cr(C.indAccomFood, C.indTotal, 'HIGH', 1),
              cr([C.hh1, C.hh2], C.hhTotal, 'HIGH', 0.8),
            ]},
        }},
      F3: { code: 'F3', label: 'Elderly Essentials',
        types: {
          'F3.1': { code: 'F3.1', label: 'Urban Elderly', description: 'Oldest urban residents living alone in small flats',
            criteria: [
              cr([C.age75_79, C.age80_84, C.age85p], C.sumTotal, 'HIGH', 1.5),
              cr(C.popDensity, null, 'HIGH_PCTL_50', 0.8),
              cr(C.bed1, C.bedTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr(C.hh1, C.hhTotal, 'HIGH', 1),
              cr(C.medInc, null, 'LOW_PCTL_25', 0.7),
            ]},
          'F3.2': { code: 'F3.2', label: 'Isolated Seniors', description: 'Elderly living alone in lower-density areas',
            criteria: [
              cr([C.age75_79, C.age80_84, C.age85p], C.sumTotal, 'HIGH', 1.5),
              cr(C.popDensity, null, 'LOW_PCTL_50', 0.7),
              cr(C.hh1, C.hhTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr(C.medInc, null, 'LOW_PCTL_25', 0.7),
              cr(C.qualNone, C.qualTotal, 'HIGH', 0.7),
            ]},
        }},
    }},
  G: {
    code: 'G', label: 'Global Communities', color: '#0891b2',
    groups: {
      G1: { code: 'G1', label: 'Established Diversity',
        types: {
          'G1.1': { code: 'G1.1', label: 'Multicultural Families', description: 'Diverse families with children in urban areas',
            criteria: [
              cr([C.cobEU, C.cobNonEU, C.cobAfrica, C.cobAsia], C.cobTotal, 'HIGH', 1.5),
              cr([C.hh4, C.hh5, C.hh6], C.hhTotal, 'HIGH', 1),
              cr([C.age0_4, C.age5_9, C.age10_14], C.sumTotal, 'HIGH', 1),
              cr([C.relMuslim, C.relHindu, C.relSikh], C.relTotal, 'HIGH', 1.2),
              cr(C.popDensity, null, 'HIGH_PCTL_50', 0.7),
            ]},
          'G1.2': { code: 'G1.2', label: 'Settled International', description: 'Established migrant families with moderate incomes',
            criteria: [
              cr([C.cobEU, C.cobAfrica, C.cobAsia], C.cobTotal, 'HIGH', 1.5),
              cr([C.age40_44, C.age45_49, C.age50_54], C.sumTotal, 'HIGH', 1),
              cr(C.medInc, null, 'MID_PCTL', 0.7),
              cr([C.hh3, C.hh4], C.hhTotal, 'HIGH', 0.8),
              cr([C.bed2, C.bed3], C.bedTotal, 'HIGH', 0.7),
            ]},
        }},
      G2: { code: 'G2', label: 'New Arrival Areas',
        types: {
          'G2.1': { code: 'G2.1', label: 'EU Worker Communities', description: 'EU-born workers in manual/service sector jobs',
            criteria: [
              cr([C.cobEU, C.cobEU14, C.cobEU8, C.cobEU2], C.cobTotal, 'HIGH', 2),
              cr([C.age20_24, C.age25_29, C.age30_34, C.age35_39], C.sumTotal, 'HIGH', 1),
              cr([C.indAccomFood, C.indTransport, C.indMfg], C.indTotal, 'HIGH', 1),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.7),
              cr([C.occProcess, C.occElementary], C.occTotal, 'HIGH', 0.8),
            ]},
          'G2.2': { code: 'G2.2', label: 'Global Gateway', description: 'Young non-EU born population in dense urban areas',
            criteria: [
              cr([C.cobAfrica, C.cobAsia, C.cobAmericas], C.cobTotal, 'HIGH', 2),
              cr([C.age20_24, C.age25_29, C.age30_34], C.sumTotal, 'HIGH', 1),
              cr([C.hh5, C.hh6, C.hh7, C.hh8p], C.hhTotal, 'HIGH', 1),
              cr(C.medInc, null, 'LOW_PCTL_25', 0.7),
              cr(C.popDensity, null, 'HIGH_PCTL', 0.8),
            ]},
        }},
      G3: { code: 'G3', label: 'Cosmopolitan Mix',
        types: {
          'G3.1': { code: 'G3.1', label: 'International Professionals', description: 'Degree-educated migrants in high-skill industries',
            criteria: [
              cr([C.cobEurope, C.cobAsia, C.cobAmericas], C.cobTotal, 'HIGH', 1.5),
              cr(C.qualL4p, C.qualTotal, 'HIGH', 1),
              cr([C.indProfSci, C.indRD, C.indInfoComm], C.indTotal, 'HIGH', 1.2),
              cr(C.medInc, null, 'HIGH_PCTL_50', 0.8),
              cr(C.occProfessional, C.occTotal, 'HIGH', 0.8),
            ]},
          'G3.2': { code: 'G3.2', label: 'Global Campus', description: 'International students near universities',
            criteria: [
              cr([C.cobEurope, C.cobAfrica, C.cobAsia], C.cobTotal, 'HIGH', 1.5),
              cr(C.student, C.stuTotal, 'HIGH', 1.2),
              cr([C.age15_19, C.age20_24], C.sumTotal, 'HIGH', 1.2),
              cr(C.indEducation, C.indTotal, 'HIGH', 1),
              cr(C.medInc, null, 'LOW_PCTL_50', 0.5),
            ]},
        }},
    }},
  H: {
    code: 'H', label: 'Stretched & Struggling', color: '#dc2626',
    groups: {
      H1: { code: 'H1', label: 'Urban Pressure',
        types: {
          'H1.1': { code: 'H1.1', label: 'Inner City Squeeze', description: 'Low-income urban areas with small homes',
            criteria: [
              cr(C.medInc, null, 'LOW_PCTL_25', 1.5),
              cr(C.popDensity, null, 'HIGH_PCTL', 1),
              cr(C.bed1, C.bedTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr(C.qualNone, C.qualTotal, 'HIGH', 0.8),
              cr(C.occElementary, C.occTotal, 'HIGH', 0.8),
            ]},
          'H1.2': { code: 'H1.2', label: 'High-Rise Hardship', description: 'Overcrowded low-income urban households',
            criteria: [
              cr(C.medInc, null, 'LOW_PCTL_25', 1.5),
              cr(C.popDensity, null, 'HIGH_PCTL', 1),
              cr([C.hh5, C.hh6, C.hh7], C.hhTotal, 'HIGH', 1),
              cr([C.bed1, C.bed2], C.bedTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr([C.age0_4, C.age5_9], C.sumTotal, 'HIGH', 0.8),
            ]},
        }},
      H2: { code: 'H2', label: 'Working Poverty',
        types: {
          'H2.1': { code: 'H2.1', label: 'Low-Wage Families', description: 'Families with children on low incomes',
            criteria: [
              cr(C.medInc, null, 'LOW_PCTL_25', 1.5),
              cr([C.age0_4, C.age5_9, C.age10_14], C.sumTotal, 'HIGH', 1.2),
              cr([C.qualNone, C.qualL1], C.qualTotal, 'HIGH', 0.8),
              cr([C.occCaring, C.occSales, C.occElementary], C.occTotal, 'HIGH', 1),
              cr([C.hh3, C.hh4], C.hhTotal, 'HIGH', 0.8),
            ]},
          'H2.2': { code: 'H2.2', label: 'Service Sector Stretch', description: 'Low-pay service workers in modest areas',
            criteria: [
              cr(C.medInc, null, 'LOW_PCTL_50', 1.2),
              cr([C.indRetail, C.indAccomFood, C.indHealth], C.indTotal, 'HIGH', 1.2),
              cr([C.occCaring, C.occSales], C.occTotal, 'HIGH', 1),
              cr([C.qualL1, C.qualL2], C.qualTotal, 'HIGH', 0.8),
              cr(C.car1, C.carTotal, 'HIGH', 0.7),
            ]},
        }},
      H3: { code: 'H3', label: 'Benefit-Age Vulnerability',
        types: {
          'H3.1': { code: 'H3.1', label: 'Pensioner Poverty', description: 'Low-income elderly living alone',
            criteria: [
              cr([C.age65_69, C.age70_74, C.age75_79, C.age80_84], C.sumTotal, 'HIGH', 1.5),
              cr(C.medInc, null, 'LOW_PCTL_25', 1.2),
              cr(C.bed1, C.bedTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr(C.hh1, C.hhTotal, 'HIGH', 1),
              cr(C.qualNone, C.qualTotal, 'HIGH', 0.7),
            ]},
          'H3.2': { code: 'H3.2', label: 'Pre-Retirement Squeeze', description: 'Low-income 50-64s with no qualifications',
            criteria: [
              cr([C.age50_54, C.age55_59, C.age60_64], C.sumTotal, 'HIGH', 1.5),
              cr(C.medInc, null, 'LOW_PCTL_25', 1.2),
              cr(C.qualNone, C.qualTotal, 'HIGH', 1),
              cr(C.carNone, C.carTotal, 'HIGH', 0.8),
              cr(C.hh1, C.hhTotal, 'HIGH', 0.8),
            ]},
        }},
    }},
};

// Make available globally
if (typeof window !== 'undefined') window.PREBUILT_TAXONOMY = PREBUILT_TAXONOMY;
