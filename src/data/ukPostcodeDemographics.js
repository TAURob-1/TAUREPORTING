// UK postcode area demographic profiles
// Based on ONS Census 2021 patterns and Experian Mosaic-style segmentation
// Covers all 120+ UK postcode areas with region, segment, income band, and household estimates

const UK_POSTCODE_DEMOGRAPHICS = {
  // Aberdeen
  AB: { region: 'Scotland', segment: 'Oil & Gas Professionals 35-54', income: 'Upper-Middle', urbanRural: 'Urban/Suburban', households: 152000 },
  // St Albans
  AL: { region: 'East of England', segment: 'Affluent Commuter Families 35-54', income: 'High', urbanRural: 'Suburban', households: 62000 },
  // Birmingham
  B: { region: 'West Midlands', segment: 'Diverse Urban Families 25-44', income: 'Middle', urbanRural: 'Urban', households: 480000 },
  // Bath
  BA: { region: 'South West', segment: 'Heritage Town Professionals 35-54', income: 'Upper-Middle', urbanRural: 'Urban/Suburban', households: 95000 },
  // Blackburn
  BB: { region: 'North West', segment: 'Working Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 68000 },
  // Bradford
  BD: { region: 'Yorkshire', segment: 'Diverse Urban Families 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 210000 },
  // Bournemouth
  BH: { region: 'South West', segment: 'Coastal Retirees & Families 55+', income: 'Middle', urbanRural: 'Urban/Suburban', households: 128000 },
  // Bolton
  BL: { region: 'North West', segment: 'Working Families 35-54', income: 'Middle', urbanRural: 'Urban', households: 120000 },
  // Brighton
  BN: { region: 'South East', segment: 'Young Urban Professionals 25-39', income: 'Upper-Middle', urbanRural: 'Urban', households: 145000 },
  // Bromley
  BR: { region: 'London', segment: 'Suburban Commuter Families 35-54', income: 'High', urbanRural: 'Suburban', households: 65000 },
  // Bristol
  BS: { region: 'South West', segment: 'City Professionals & Students 25-44', income: 'Upper-Middle', urbanRural: 'Urban', households: 195000 },
  // Carlisle
  CA: { region: 'North West', segment: 'Rural & Market Town Families 45-64', income: 'Middle', urbanRural: 'Rural', households: 72000 },
  // Cambridge
  CB: { region: 'East of England', segment: 'Academic & Tech Professionals 25-44', income: 'High', urbanRural: 'Urban/Suburban', households: 78000 },
  // Cardiff
  CF: { region: 'Wales', segment: 'City & Valley Families 25-44', income: 'Middle', urbanRural: 'Urban', households: 155000 },
  // Chester
  CH: { region: 'North West', segment: 'Affluent Suburban Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 145000 },
  // Chelmsford
  CM: { region: 'East of England', segment: 'Commuter Belt Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 115000 },
  // Colchester
  CO: { region: 'East of England', segment: 'Market Town Families 35-54', income: 'Middle', urbanRural: 'Suburban/Rural', households: 95000 },
  // Croydon
  CR: { region: 'London', segment: 'Diverse Suburban Families 25-44', income: 'Middle', urbanRural: 'Suburban', households: 72000 },
  // Canterbury
  CT: { region: 'South East', segment: 'Heritage Town Mixed 35-64', income: 'Middle', urbanRural: 'Urban/Rural', households: 82000 },
  // Coventry
  CV: { region: 'West Midlands', segment: 'Industrial City Families 25-44', income: 'Middle', urbanRural: 'Urban', households: 155000 },
  // Crewe
  CW: { region: 'North West', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 68000 },
  // Dartford
  DA: { region: 'South East', segment: 'Commuter Belt Families 35-54', income: 'Middle', urbanRural: 'Suburban', households: 85000 },
  // Dundee
  DD: { region: 'Scotland', segment: 'Urban Mixed 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 78000 },
  // Derby
  DE: { region: 'East Midlands', segment: 'Industrial City Families 35-54', income: 'Middle', urbanRural: 'Urban/Suburban', households: 130000 },
  // Dumfries
  DG: { region: 'Scotland', segment: 'Rural & Market Town 45-64', income: 'Middle', urbanRural: 'Rural', households: 38000 },
  // Durham
  DH: { region: 'North East', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 62000 },
  // Darlington
  DL: { region: 'North East', segment: 'Market Town Families 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 78000 },
  // Doncaster
  DN: { region: 'Yorkshire', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 155000 },
  // Dorchester
  DT: { region: 'South West', segment: 'Rural Retirees & Families 55+', income: 'Middle', urbanRural: 'Rural', households: 42000 },
  // Dudley
  DY: { region: 'West Midlands', segment: 'Working Suburban Families 35-54', income: 'Lower-Middle', urbanRural: 'Suburban', households: 78000 },
  // East London
  E: { region: 'London', segment: 'Young Diverse Urban 25-39', income: 'Middle', urbanRural: 'Urban', households: 195000 },
  // East Central London
  EC: { region: 'London', segment: 'City Workers & Young Professionals 25-39', income: 'High', urbanRural: 'Urban', households: 12000 },
  // Edinburgh
  EH: { region: 'Scotland', segment: 'City Professionals & Students 25-44', income: 'Upper-Middle', urbanRural: 'Urban', households: 235000 },
  // Enfield
  EN: { region: 'London', segment: 'Suburban Commuter Families 35-54', income: 'Middle', urbanRural: 'Suburban', households: 72000 },
  // Exeter
  EX: { region: 'South West', segment: 'Cathedral City Professionals 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 115000 },
  // Falkirk
  FK: { region: 'Scotland', segment: 'Working Town Families 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 68000 },
  // Blackpool
  FY: { region: 'North West', segment: 'Coastal Working Families 45-64', income: 'Lower-Middle', urbanRural: 'Urban', households: 82000 },
  // Glasgow
  G: { region: 'Scotland', segment: 'Urban Mixed Demographics 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 320000 },
  // Gloucester
  GL: { region: 'South West', segment: 'Market Town & Rural Families 35-54', income: 'Middle', urbanRural: 'Suburban/Rural', households: 130000 },
  // Guildford
  GU: { region: 'South East', segment: 'Affluent Commuter Families 35-54', income: 'High', urbanRural: 'Suburban', households: 145000 },
  // Harrow
  HA: { region: 'London', segment: 'Suburban Diverse Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 68000 },
  // Huddersfield
  HD: { region: 'Yorkshire', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 92000 },
  // Harrogate
  HG: { region: 'Yorkshire', segment: 'Affluent Spa Town Retirees 55+', income: 'High', urbanRural: 'Suburban/Rural', households: 42000 },
  // Hemel Hempstead
  HP: { region: 'South East', segment: 'Commuter Belt Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 105000 },
  // Hereford
  HR: { region: 'West Midlands', segment: 'Rural & Market Town 45-64', income: 'Middle', urbanRural: 'Rural', households: 42000 },
  // Outer Hebrides
  HS: { region: 'Scotland', segment: 'Remote Island Communities 45-64', income: 'Lower-Middle', urbanRural: 'Rural', households: 12000 },
  // Hull
  HU: { region: 'Yorkshire', segment: 'Urban Working Families 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 135000 },
  // Halifax
  HX: { region: 'Yorkshire', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 52000 },
  // Ilford
  IG: { region: 'London', segment: 'Diverse Suburban Families 25-44', income: 'Middle', urbanRural: 'Suburban', households: 62000 },
  // Ipswich
  IP: { region: 'East of England', segment: 'Market Town & Rural 35-54', income: 'Middle', urbanRural: 'Suburban/Rural', households: 120000 },
  // Inverness
  IV: { region: 'Scotland', segment: 'Highland & Rural 45-64', income: 'Middle', urbanRural: 'Rural', households: 52000 },
  // Kilmarnock
  KA: { region: 'Scotland', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 78000 },
  // Kingston upon Thames
  KT: { region: 'London', segment: 'Affluent Suburban Families 35-54', income: 'High', urbanRural: 'Suburban', households: 72000 },
  // Kirkwall
  KW: { region: 'Scotland', segment: 'Remote & Coastal Communities 45-64', income: 'Middle', urbanRural: 'Rural', households: 22000 },
  // Kirkcaldy
  KY: { region: 'Scotland', segment: 'Working Town & Coastal 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 82000 },
  // Liverpool
  L: { region: 'North West', segment: 'City & Suburban Families 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 245000 },
  // Lancaster
  LA: { region: 'North West', segment: 'University Town & Rural 25-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 78000 },
  // Llandrindod Wells
  LD: { region: 'Wales', segment: 'Rural Welsh Communities 45-64', income: 'Lower-Middle', urbanRural: 'Rural', households: 18000 },
  // Leicester
  LE: { region: 'East Midlands', segment: 'Diverse City Families 25-44', income: 'Middle', urbanRural: 'Urban/Suburban', households: 175000 },
  // Llandudno
  LL: { region: 'Wales', segment: 'Coastal & Rural Welsh 45-64', income: 'Lower-Middle', urbanRural: 'Rural', households: 68000 },
  // Lincoln
  LN: { region: 'East Midlands', segment: 'Cathedral City & Rural 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 68000 },
  // Leeds
  LS: { region: 'Yorkshire', segment: 'City Professionals & Students 25-44', income: 'Middle', urbanRural: 'Urban', households: 185000 },
  // Luton
  LU: { region: 'East of England', segment: 'Diverse Working Families 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 82000 },
  // Manchester
  M: { region: 'North West', segment: 'City Professionals & Students 25-39', income: 'Middle', urbanRural: 'Urban', households: 265000 },
  // Medway
  ME: { region: 'South East', segment: 'Working Town Families 35-54', income: 'Middle', urbanRural: 'Urban/Suburban', households: 110000 },
  // Milton Keynes
  MK: { region: 'South East', segment: 'New Town Professionals 25-44', income: 'Upper-Middle', urbanRural: 'Suburban', households: 120000 },
  // Motherwell
  ML: { region: 'Scotland', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 72000 },
  // North London
  N: { region: 'London', segment: 'Young Urban Professionals 25-39', income: 'Upper-Middle', urbanRural: 'Urban', households: 155000 },
  // Newcastle
  NE: { region: 'North East', segment: 'City & Suburban Families 25-44', income: 'Middle', urbanRural: 'Urban', households: 195000 },
  // Nottingham
  NG: { region: 'East Midlands', segment: 'City & Suburban Families 25-44', income: 'Middle', urbanRural: 'Urban/Suburban', households: 195000 },
  // Northampton
  NN: { region: 'East Midlands', segment: 'Working Town Families 35-54', income: 'Middle', urbanRural: 'Urban/Suburban', households: 145000 },
  // Newport
  NP: { region: 'Wales', segment: 'Valley & City Working Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 85000 },
  // Norwich
  NR: { region: 'East of England', segment: 'City & Rural Mix 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 115000 },
  // North West London
  NW: { region: 'London', segment: 'Diverse Urban Professionals 25-44', income: 'Upper-Middle', urbanRural: 'Urban', households: 125000 },
  // Oldham
  OL: { region: 'North West', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 92000 },
  // Oxford
  OX: { region: 'South East', segment: 'Academic & Affluent Professionals 25-54', income: 'High', urbanRural: 'Urban/Rural', households: 135000 },
  // Paisley
  PA: { region: 'Scotland', segment: 'Working & Suburban Families 35-54', income: 'Middle', urbanRural: 'Suburban/Rural', households: 85000 },
  // Peterborough
  PE: { region: 'East of England', segment: 'Working Town & Rural 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 125000 },
  // Perth
  PH: { region: 'Scotland', segment: 'Highland & Rural Professionals 45-64', income: 'Middle', urbanRural: 'Rural', households: 52000 },
  // Plymouth
  PL: { region: 'South West', segment: 'Naval & Coastal Families 25-44', income: 'Lower-Middle', urbanRural: 'Urban', households: 115000 },
  // Portsmouth
  PO: { region: 'South East', segment: 'Coastal City Families 25-44', income: 'Middle', urbanRural: 'Urban/Suburban', households: 165000 },
  // Preston
  PR: { region: 'North West', segment: 'Working & Suburban Families 35-54', income: 'Middle', urbanRural: 'Urban/Suburban', households: 85000 },
  // Reading
  RG: { region: 'South East', segment: 'Tech Corridor Professionals 25-44', income: 'High', urbanRural: 'Suburban', households: 145000 },
  // Redhill
  RH: { region: 'South East', segment: 'Commuter Belt Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban/Rural', households: 95000 },
  // Romford
  RM: { region: 'London', segment: 'Suburban Working Families 35-54', income: 'Middle', urbanRural: 'Suburban', households: 82000 },
  // Sheffield
  S: { region: 'Yorkshire', segment: 'City & Industrial Families 25-44', income: 'Middle', urbanRural: 'Urban', households: 255000 },
  // Swansea
  SA: { region: 'Wales', segment: 'Coastal City & Valley Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 105000 },
  // South East London
  SE: { region: 'London', segment: 'Diverse Urban Professionals 25-39', income: 'Middle', urbanRural: 'Urban', households: 175000 },
  // Stevenage
  SG: { region: 'East of England', segment: 'New Town Commuter Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 72000 },
  // Stockport
  SK: { region: 'North West', segment: 'Suburban Commuter Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 115000 },
  // Slough
  SL: { region: 'South East', segment: 'Diverse Working Town 25-44', income: 'Middle', urbanRural: 'Urban/Suburban', households: 68000 },
  // Sutton
  SM: { region: 'London', segment: 'Suburban Commuter Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 42000 },
  // Swindon
  SN: { region: 'South West', segment: 'New Town Working Families 25-44', income: 'Middle', urbanRural: 'Urban/Suburban', households: 105000 },
  // Southampton
  SO: { region: 'South East', segment: 'Port City Professionals 25-44', income: 'Middle', urbanRural: 'Urban', households: 125000 },
  // Salisbury
  SP: { region: 'South West', segment: 'Rural & Military Families 35-54', income: 'Middle', urbanRural: 'Rural', households: 48000 },
  // Sunderland
  SR: { region: 'North East', segment: 'Working City Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 72000 },
  // Southend
  SS: { region: 'East of England', segment: 'Coastal Suburban Families 35-54', income: 'Middle', urbanRural: 'Urban/Suburban', households: 95000 },
  // Stoke-on-Trent
  ST: { region: 'West Midlands', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 165000 },
  // South West London
  SW: { region: 'London', segment: 'Affluent Young Professionals 25-39', income: 'High', urbanRural: 'Urban', households: 155000 },
  // Shrewsbury
  SY: { region: 'West Midlands', segment: 'Market Town & Rural 45-64', income: 'Middle', urbanRural: 'Rural', households: 72000 },
  // Taunton
  TA: { region: 'South West', segment: 'Market Town & Rural 45-64', income: 'Middle', urbanRural: 'Rural', households: 62000 },
  // Galashiels
  TD: { region: 'Scotland', segment: 'Borders & Rural 45-64', income: 'Middle', urbanRural: 'Rural', households: 28000 },
  // Telford
  TF: { region: 'West Midlands', segment: 'New Town Working Families 25-44', income: 'Lower-Middle', urbanRural: 'Urban/Suburban', households: 72000 },
  // Tonbridge
  TN: { region: 'South East', segment: 'Affluent Commuter Families 35-54', income: 'High', urbanRural: 'Suburban/Rural', households: 145000 },
  // Torquay
  TQ: { region: 'South West', segment: 'Coastal Retirees & Tourism 55+', income: 'Middle', urbanRural: 'Urban/Rural', households: 62000 },
  // Truro
  TR: { region: 'South West', segment: 'Cornish Coastal & Rural 45-64', income: 'Middle', urbanRural: 'Rural', households: 62000 },
  // Cleveland
  TS: { region: 'North East', segment: 'Industrial Working Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 115000 },
  // Twickenham
  TW: { region: 'London', segment: 'Affluent Suburban Families 35-54', income: 'High', urbanRural: 'Suburban', households: 72000 },
  // Southall
  UB: { region: 'London', segment: 'Diverse Suburban Families 25-44', income: 'Middle', urbanRural: 'Suburban', households: 62000 },
  // West London
  W: { region: 'London', segment: 'Affluent Urban Professionals 25-44', income: 'High', urbanRural: 'Urban', households: 135000 },
  // Warrington
  WA: { region: 'North West', segment: 'New Town Suburban Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 95000 },
  // West Central London
  WC: { region: 'London', segment: 'Central London Workers & Students 25-39', income: 'High', urbanRural: 'Urban', households: 15000 },
  // Watford
  WD: { region: 'South East', segment: 'Commuter Belt Families 35-54', income: 'Upper-Middle', urbanRural: 'Suburban', households: 52000 },
  // Wakefield
  WF: { region: 'Yorkshire', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban/Rural', households: 95000 },
  // Wigan
  WN: { region: 'North West', segment: 'Working Town Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 72000 },
  // Worcester
  WR: { region: 'West Midlands', segment: 'Market Town & Rural 35-54', income: 'Middle', urbanRural: 'Suburban/Rural', households: 62000 },
  // Walsall
  WS: { region: 'West Midlands', segment: 'Working Suburban Families 35-54', income: 'Lower-Middle', urbanRural: 'Suburban', households: 68000 },
  // Wolverhampton
  WV: { region: 'West Midlands', segment: 'Working City Families 35-54', income: 'Lower-Middle', urbanRural: 'Urban', households: 105000 },
  // York
  YO: { region: 'Yorkshire', segment: 'Heritage City & Rural Families 35-54', income: 'Middle', urbanRural: 'Urban/Rural', households: 115000 },
  // Lerwick (Shetland)
  ZE: { region: 'Scotland', segment: 'Remote Island Communities 45-64', income: 'Middle', urbanRural: 'Rural', households: 10000 },
};

// Map a postcode district (e.g. "AB10") to its area prefix (e.g. "AB")
function getPostcodeArea(postcode) {
  const match = postcode.match(/^([A-Z]{1,2})/);
  return match ? match[1] : null;
}

// Get demographic info for a UK postcode district
export function getUkPostcodeDemographic(postcode) {
  const area = getPostcodeArea(postcode);
  const profile = area ? UK_POSTCODE_DEMOGRAPHICS[area] : null;

  if (!profile) {
    return {
      region: 'United Kingdom',
      segment: 'Mixed Demographics',
      income: 'Middle',
      urbanRural: 'Mixed',
      households: 50000,
    };
  }

  return profile;
}

// Estimate household reach for a UK postcode district
// Distributes the area-level households across its districts
export function estimateUkPostcodeReach(postcode) {
  const area = getPostcodeArea(postcode);
  const profile = area ? UK_POSTCODE_DEMOGRAPHICS[area] : null;
  const areaHouseholds = profile ? profile.households : 50000;

  // Typical postcode area has 10-30 districts; estimate ~15 on average
  // Then apply a reach factor (not all households are reachable via CTV)
  const districtsPerArea = 18;
  const ctvPenetration = 0.72; // BARB reports ~72% UK CTV penetration
  const baseReach = Math.round((areaHouseholds / districtsPerArea) * ctvPenetration);

  // Add minor deterministic variance based on postcode characters
  const hash = postcode.split('').reduce((h, c) => h + c.charCodeAt(0), 0);
  const variance = ((hash % 20) - 10) / 100; // ±10%

  return Math.max(500, Math.round(baseReach * (1 + variance)));
}

export { UK_POSTCODE_DEMOGRAPHICS };
