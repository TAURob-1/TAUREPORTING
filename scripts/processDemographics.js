#!/usr/bin/env node

/**
 * Process demographic CSV files and aggregate to 3-digit ZIP codes
 * Outputs optimized JSON for client-side audience targeting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const DATA_DIR = '/home/r2/clawd/intermedia-ctv-prototype/data/demographics';
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, i) => {
      row[header.trim()] = values[i]?.trim() || '';
    });
    return row;
  });
}

/**
 * Convert 5-digit ZIP to 3-digit prefix
 */
function toZip3(zip5) {
  const zipStr = String(zip5).padStart(5, '0');
  return zipStr.substring(0, 3);
}

/**
 * Process income data
 */
function processIncome() {
  console.log('Processing income data...');
  const data = parseCSV(path.join(DATA_DIR, 'Copy of US_Demographics_Average-Income_zipcode_2023.csv'));
  
  const zip3Map = {};
  
  data.forEach(row => {
    const zip3 = toZip3(row.geolevel);
    if (!zip3Map[zip3]) {
      zip3Map[zip3] = {
        count: 0,
        under50k: 0,
        income50to75k: 0,
        income75to100k: 0,
        over100k: 0,
        over150k: 0  // Estimate from over100k
      };
    }
    
    const under50k = parseFloat(row.avg_income_less_than_50k) || 0;
    const income50to75k = parseFloat(row.avg_income_50k_to_74k) || 0;
    const income75to100k = parseFloat(row.avg_income_75k_to_99k) || 0;
    const over100k = parseFloat(row.avg_income_more_than_100k) || 0;
    
    zip3Map[zip3].under50k += under50k;
    zip3Map[zip3].income50to75k += income50to75k;
    zip3Map[zip3].income75to100k += income75to100k;
    zip3Map[zip3].over100k += over100k;
    zip3Map[zip3].over150k += over100k * 0.6; // Estimate 60% of 100k+ is 150k+
    zip3Map[zip3].count++;
  });
  
  // Calculate averages
  Object.keys(zip3Map).forEach(zip3 => {
    const data = zip3Map[zip3];
    if (data.count > 0) {
      data.under50k = Math.round(data.under50k / data.count);
      data.income50to75k = Math.round(data.income50to75k / data.count);
      data.income75to100k = Math.round(data.income75to100k / data.count);
      data.over100k = Math.round(data.over100k / data.count);
      data.over150k = Math.round(data.over150k / data.count);
    }
    delete data.count;
  });
  
  return zip3Map;
}

/**
 * Process age/gender data
 */
function processAgeGender() {
  console.log('Processing age/gender data...');
  const data = parseCSV(path.join(DATA_DIR, 'Copy of US_Age_Gender_Breakdown_by_zipcode(2023).csv'));
  
  const zip3Map = {};
  
  data.forEach(row => {
    const zip3 = toZip3(row.zipcode);
    const totalPop = parseFloat(row.total_population) || 0;
    
    if (totalPop === 0) return;
    
    if (!zip3Map[zip3]) {
      zip3Map[zip3] = {
        totalPopulation: 0,
        age_under_25: 0,
        age_25_44: 0,
        age_45_64: 0,
        age_65_plus: 0
      };
    }
    
    // Aggregate age groups (both male and female)
    const under25 = 
      (parseFloat(row.male_under_5) || 0) +
      (parseFloat(row.male_5_9) || 0) +
      (parseFloat(row.male_10_14) || 0) +
      (parseFloat(row.male_15_17) || 0) +
      (parseFloat(row.male_18_19) || 0) +
      (parseFloat(row.male_20) || 0) +
      (parseFloat(row.male_21) || 0) +
      (parseFloat(row.male_22_24) || 0) +
      (parseFloat(row.female_under_5) || 0) +
      (parseFloat(row.female_5_9) || 0) +
      (parseFloat(row.female_10_14) || 0) +
      (parseFloat(row.female_15_17) || 0) +
      (parseFloat(row.female_18_19) || 0) +
      (parseFloat(row.female_20) || 0) +
      (parseFloat(row.female_21) || 0) +
      (parseFloat(row.female_22_24) || 0);
    
    const age25_44 = 
      (parseFloat(row.male_25_29) || 0) +
      (parseFloat(row.male_30_34) || 0) +
      (parseFloat(row.male_35_39) || 0) +
      (parseFloat(row.male_40_44) || 0) +
      (parseFloat(row.female_25_29) || 0) +
      (parseFloat(row.female_30_34) || 0) +
      (parseFloat(row.female_35_39) || 0) +
      (parseFloat(row.female_40_44) || 0);
    
    const age45_64 = 
      (parseFloat(row.male_45_49) || 0) +
      (parseFloat(row.male_50_54) || 0) +
      (parseFloat(row.male_55_59) || 0) +
      (parseFloat(row.male_60_61) || 0) +
      (parseFloat(row.male_62_64) || 0) +
      (parseFloat(row.female_45_49) || 0) +
      (parseFloat(row.female_50_54) || 0) +
      (parseFloat(row.female_55_59) || 0) +
      (parseFloat(row.female_60_61) || 0) +
      (parseFloat(row.female_62_64) || 0);
    
    const age65_plus = 
      (parseFloat(row.male_65_66) || 0) +
      (parseFloat(row.male_67_69) || 0) +
      (parseFloat(row.male_70_74) || 0) +
      (parseFloat(row.male_75_79) || 0) +
      (parseFloat(row.male_80_84) || 0) +
      (parseFloat(row.male_85_up) || 0) +
      (parseFloat(row.female_65_66) || 0) +
      (parseFloat(row.female_67_69) || 0) +
      (parseFloat(row.female_70_74) || 0) +
      (parseFloat(row.female_75_79) || 0) +
      (parseFloat(row.female_80_84) || 0) +
      (parseFloat(row.female_85_up) || 0);
    
    zip3Map[zip3].totalPopulation += totalPop;
    zip3Map[zip3].age_under_25 += under25;
    zip3Map[zip3].age_25_44 += age25_44;
    zip3Map[zip3].age_45_64 += age45_64;
    zip3Map[zip3].age_65_plus += age65_plus;
  });
  
  // Convert to percentages
  Object.keys(zip3Map).forEach(zip3 => {
    const data = zip3Map[zip3];
    const total = data.totalPopulation;
    if (total > 0) {
      data.age_under_25_pct = Math.round((data.age_under_25 / total) * 100);
      data.age_25_44_pct = Math.round((data.age_25_44 / total) * 100);
      data.age_45_64_pct = Math.round((data.age_45_64 / total) * 100);
      data.age_65_plus_pct = Math.round((data.age_65_plus / total) * 100);
    }
  });
  
  return zip3Map;
}

/**
 * Process household data
 */
function processHouseholds() {
  console.log('Processing household data...');
  const data = parseCSV(path.join(DATA_DIR, 'Copy of US_Demographics_Household-Age_zipcode_2022.csv'));
  
  const zip3Map = {};
  
  data.forEach(row => {
    const zip3 = toZip3(row.zipcode);
    const total = parseFloat(row['Total:']) || 0;
    
    if (total === 0) return;
    
    if (!zip3Map[zip3]) {
      zip3Map[zip3] = {
        totalHouseholds: 0,
        households_young: 0,
        households_middle: 0,
        households_senior: 0
      };
    }
    
    const young = parseFloat(row['Householder 15 to 24 years:']) || 0;
    const youngAdult = parseFloat(row['Householder 25 to 34 years:']) || 0;
    const middle = parseFloat(row['Householder 35 to 64 years:']) || 0;
    const senior = parseFloat(row['Householder 65 years and over:']) || 0;
    
    zip3Map[zip3].totalHouseholds += total;
    zip3Map[zip3].households_young += young + youngAdult;
    zip3Map[zip3].households_middle += middle;
    zip3Map[zip3].households_senior += senior;
  });
  
  // Convert to percentages
  Object.keys(zip3Map).forEach(zip3 => {
    const data = zip3Map[zip3];
    const total = data.totalHouseholds;
    if (total > 0) {
      data.households_young_pct = Math.round((data.households_young / total) * 100);
      data.households_middle_pct = Math.round((data.households_middle / total) * 100);
      data.households_senior_pct = Math.round((data.households_senior / total) * 100);
    }
  });
  
  return zip3Map;
}

/**
 * Merge all demographic data
 */
function mergeData(income, ageGender, households) {
  console.log('Merging demographic data...');
  
  const allZips = new Set([
    ...Object.keys(income),
    ...Object.keys(ageGender),
    ...Object.keys(households)
  ]);
  
  const merged = {};
  
  allZips.forEach(zip3 => {
    merged[zip3] = {
      zip3,
      population: ageGender[zip3]?.totalPopulation || 0,
      households: households[zip3]?.totalHouseholds || 0,
      
      // Income distribution (percentages)
      income_under_50k: income[zip3]?.under50k || 0,
      income_50_75k: income[zip3]?.income50to75k || 0,
      income_75_100k: income[zip3]?.income75to100k || 0,
      income_100k_plus: income[zip3]?.over100k || 0,
      income_150k_plus: income[zip3]?.over150k || 0,
      
      // Age distribution (percentages)
      age_under_25_pct: ageGender[zip3]?.age_under_25_pct || 0,
      age_25_44_pct: ageGender[zip3]?.age_25_44_pct || 0,
      age_45_64_pct: ageGender[zip3]?.age_45_64_pct || 0,
      age_65_plus_pct: ageGender[zip3]?.age_65_plus_pct || 0,
      
      // Household distribution (percentages)
      households_young_pct: households[zip3]?.households_young_pct || 0,
      households_middle_pct: households[zip3]?.households_middle_pct || 0,
      households_senior_pct: households[zip3]?.households_senior_pct || 0
    };
  });
  
  return merged;
}

/**
 * Main processing
 */
function main() {
  console.log('Starting demographic data processing...\n');
  
  try {
    const income = processIncome();
    const ageGender = processAgeGender();
    const households = processHouseholds();
    
    const mergedData = mergeData(income, ageGender, households);
    
    // Write output
    const outputPath = path.join(OUTPUT_DIR, 'zip3-demographics.json');
    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    
    console.log(`\n✅ Processing complete!`);
    console.log(`📊 Processed ${Object.keys(mergedData).length} 3-digit ZIP regions`);
    console.log(`📁 Output: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error processing demographics:', error);
    process.exit(1);
  }
}

main();
