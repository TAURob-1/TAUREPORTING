// Map 3-digit ZIP codes to test groups based on geographic regions
// This approximates the DMA-based test design

export const zipCodeAssignments = {
  // High Performers (Los Angeles, Dallas-Fort Worth, Atlanta regions)
  high: [
    '900', '901', '902', '903', '904', '905', '906', '907', '908', // Los Angeles area
    '910', '911', '912', '913', '914', '915', '916', '917', '918', '919',
    '920', '921', '922', '923', '924', '925', '926', '927', '928',
    '750', '751', '752', '753', '754', '755', '756', '757', '758', '759', // Dallas area
    '760', '761', '762', '763', '764', '765', '766', '767', '768', '769',
    '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', // Atlanta area
    '310', '311', '312', '313', '314', '315', '316', '317', '318', '319',
  ],
  
  // Holdout (Philadelphia, Miami, Boston regions)
  holdout: [
    '190', '191', '192', '193', '194', '195', '196', // Philadelphia area
    '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', // Miami area
    '340', '341', '342', '343', '344', '345', '346', '347', '348', '349',
    '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', // Boston area
    '020', '021', '022', '023', '024', '025', '026', '027',
  ],
  
  // Exposed (everything else - Chicago, Houston, Phoenix, Seattle, Denver, NYC, etc.)
  exposed: [
    // This will be the default for any ZIP not in high or holdout
  ]
};

// Helper function to determine ZIP code type
export function getZipType(zipCode) {
  const zip3 = zipCode.toString().padStart(3, '0');
  
  if (zipCodeAssignments.high.includes(zip3)) {
    return 'high';
  }
  if (zipCodeAssignments.holdout.includes(zip3)) {
    return 'holdout';
  }
  return 'exposed';
}

// Get color for ZIP code type
export function getZipColor(type) {
  switch (type) {
    case 'exposed':
      return '#3b82f6'; // blue
    case 'holdout':
      return '#6b7280'; // gray
    case 'high':
      return '#10b981'; // green
    default:
      return '#9ca3af';
  }
}

// Get sample data for ZIP codes based on type
export function getZipData(zipCode, type) {
  const baseData = {
    exposed: {
      impressions: '1.2M - 2.4M',
      lift: '+19% - +25%',
      description: 'Active campaign exposure'
    },
    holdout: {
      impressions: '0',
      lift: '-0.9% - -2.1%',
      description: 'Holdout control group'
    },
    high: {
      impressions: '1.5M - 2.4M',
      lift: '+28% - +31%',
      description: 'High performer region'
    }
  };
  
  return baseData[type] || baseData.exposed;
}
