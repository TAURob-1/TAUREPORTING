#!/usr/bin/env node

/**
 * Audience Graph Data Validation Script
 *
 * Standalone Node.js script that validates all audience graph data modules.
 * Run: node scripts/validate-audience-graph-data.js
 */

import { ATTRIBUTE_CLASSES, MECHANISM_KEYS } from '../src/data/audienceGraph/scores.js';
import { CHANNEL_AFFINITY, CHANNEL_PLATFORM_KEYS, CHANNEL_PLATFORMS } from '../src/data/audienceGraph/channelAffinity.js';
import { KEYWORD_CLUSTERS, KEYWORD_CLASS_DEFAULTS } from '../src/data/audienceGraph/keywordClusters.js';
import { DAYPART_PROFILES } from '../src/data/audienceGraph/daypartProfiles.js';

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

// Collect all attribute keys
const allKeys = [];
for (const [classKey, cls] of Object.entries(ATTRIBUTE_CLASSES)) {
  for (const attrKey of Object.keys(cls.attributes)) {
    allKeys.push(`${classKey}.${attrKey}`);
  }
}

console.log(`\n🔍 Audience Graph Data Validation`);
console.log(`   ${allKeys.length} attributes across ${Object.keys(ATTRIBUTE_CLASSES).length} classes\n`);

// 1. Channel Affinity coverage
console.log('1. Channel Affinity Coverage');
const missingAffinity = allKeys.filter((k) => !CHANNEL_AFFINITY[k]);
check('All attributes have CHANNEL_AFFINITY entries', missingAffinity.length === 0, `Missing: ${missingAffinity.join(', ')}`);

// 2. Daypart Profiles coverage
console.log('\n2. Daypart Profiles Coverage');
const missingDaypart = allKeys.filter((k) => !DAYPART_PROFILES[k]);
check('All attributes have DAYPART_PROFILES entries', missingDaypart.length === 0, `Missing: ${missingDaypart.join(', ')}`);

// 3. Daypart hourly values = exactly 24
console.log('\n3. Daypart Hourly Values (24 per profile)');
let badHourly = [];
for (const key of allKeys) {
  const profile = DAYPART_PROFILES[key];
  if (profile && profile.hourly?.length !== 24) {
    badHourly.push(`${key}: ${profile.hourly?.length}`);
  }
}
check('All profiles have exactly 24 hourly values', badHourly.length === 0, badHourly.join(', '));

// 4. Channel affinity scores 0-100
console.log('\n4. Channel Affinity Score Range (0-100)');
let outOfRange = [];
for (const [key, scores] of Object.entries(CHANNEL_AFFINITY)) {
  for (const [pk, value] of Object.entries(scores)) {
    if (value < 0 || value > 100) {
      outOfRange.push(`${key}.${pk}=${value}`);
    }
  }
}
check('All affinity scores in 0-100 range', outOfRange.length === 0, outOfRange.join(', '));

// 5. Daypart values 0-200 range, average near 100
console.log('\n5. Daypart Value Range (0-200, avg ~100)');
let daypartOutOfRange = [];
let daypartAvgIssues = [];
for (const [key, profile] of Object.entries(DAYPART_PROFILES)) {
  for (const v of profile.hourly) {
    if (v < 0 || v > 200) {
      daypartOutOfRange.push(`${key}:${v}`);
    }
  }
  const avg = profile.hourly.reduce((s, v) => s + v, 0) / 24;
  if (avg < 50 || avg > 130) {
    daypartAvgIssues.push(`${key}: avg=${avg.toFixed(1)}`);
  }
}
check('All daypart values in 0-200 range', daypartOutOfRange.length === 0, daypartOutOfRange.join(', '));
check('All daypart averages in 50-130 range', daypartAvgIssues.length === 0, daypartAvgIssues.join(', '));

// 6. Keyword clusters have required fields
console.log('\n6. Keyword Cluster Structure');
let kwIssues = [];
for (const [key, clusters] of Object.entries(KEYWORD_CLUSTERS)) {
  for (const cluster of clusters) {
    if (!cluster.group) kwIssues.push(`${key}: missing group`);
    if (!Array.isArray(cluster.keywords)) kwIssues.push(`${key}.${cluster.group}: keywords not array`);
    for (const kw of (cluster.keywords || [])) {
      if (!kw.term) kwIssues.push(`${key}.${cluster.group}: missing term`);
      if (typeof kw.volume !== 'number') kwIssues.push(`${key}.${cluster.group}.${kw.term}: bad volume`);
      if (typeof kw.cpc !== 'number') kwIssues.push(`${key}.${cluster.group}.${kw.term}: bad cpc`);
      if (typeof kw.competition !== 'number') kwIssues.push(`${key}.${cluster.group}.${kw.term}: bad competition`);
    }
  }
}
check('All keyword clusters have required fields', kwIssues.length === 0, `${kwIssues.length} issues`);

// 7. Cross-ref CHANNEL_PLATFORMS keys
console.log('\n7. Platform Key Cross-Reference');
const platformKeys = Object.keys(CHANNEL_PLATFORMS);
check('CHANNEL_PLATFORM_KEYS matches CHANNEL_PLATFORMS',
  platformKeys.length === CHANNEL_PLATFORM_KEYS.length &&
  platformKeys.every((k) => CHANNEL_PLATFORM_KEYS.includes(k)));

let affinityPlatformIssues = [];
for (const [key, scores] of Object.entries(CHANNEL_AFFINITY)) {
  for (const pk of Object.keys(scores)) {
    if (!CHANNEL_PLATFORMS[pk]) {
      affinityPlatformIssues.push(`${key}: unknown platform ${pk}`);
    }
  }
}
check('All affinity platforms exist in CHANNEL_PLATFORMS', affinityPlatformIssues.length === 0, affinityPlatformIssues.join(', '));

// Summary
console.log(`\n${'─'.repeat(50)}`);
console.log(`📊 Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log(`${failed === 0 ? '✅ All validations passed!' : '❌ Some validations failed.'}\n`);

process.exit(failed > 0 ? 1 : 0);
