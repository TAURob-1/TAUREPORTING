import fs from 'fs/promises';

async function validateTwoPageDemo() {
  console.log('🔍 Validating Two-Page CarShield Demo...\n');
  
  const checks = [];
  
  // Check 1: App.jsx navigation
  try {
    const app = await fs.readFile('./src/App.jsx', 'utf-8');
    const hasNav = app.includes('CampaignPlanning') && app.includes('CampaignResults');
    const hasState = app.includes('currentPage');
    checks.push({
      name: 'App navigation',
      status: hasNav && hasState ? '✅' : '⚠️',
      details: `Planning: ${hasNav}, State: ${hasState}`
    });
  } catch (e) {
    checks.push({ name: 'App navigation', status: '❌', details: e.message });
  }
  
  // Check 2: Campaign Planning page
  try {
    const planning = await fs.readFile('./src/components/CampaignPlanning.jsx', 'utf-8');
    const hasMap = planning.includes('MapContainer');
    const hasZipToggle = planning.includes('toggleZIP');
    const hasChannels = planning.includes('channelInventory');
    checks.push({
      name: 'Campaign Planning page',
      status: hasMap && hasZipToggle && hasChannels ? '✅' : '⚠️',
      details: `Map: ${hasMap}, ZIP toggle: ${hasZipToggle}, Channels: ${hasChannels}`
    });
  } catch (e) {
    checks.push({ name: 'Campaign Planning page', status: '❌', details: e.message });
  }
  
  // Check 3: Campaign Results page
  try {
    const results = await fs.readFile('./src/components/CampaignResults.jsx', 'utf-8');
    const hasHeader = results.includes('Header');
    const hasMetrics = results.includes('MetricCard');
    const hasMap = results.includes('USAMap');
    checks.push({
      name: 'Campaign Results page',
      status: hasHeader && hasMetrics && hasMap ? '✅' : '⚠️',
      details: `Header: ${hasHeader}, Metrics: ${hasMetrics}, Map: ${hasMap}`
    });
  } catch (e) {
    checks.push({ name: 'Campaign Results page', status: '❌', details: e.message });
  }
  
  // Check 4: Demographics data
  try {
    const demographics = await fs.readFile('./src/data/zipDemographics.js', 'utf-8');
    const hasProfiles = demographics.includes('demographicProfiles');
    const hasGetters = demographics.includes('getZipDemographic');
    const hasLA = demographics.includes('900');
    checks.push({
      name: 'ZIP demographics data',
      status: hasProfiles && hasGetters && hasLA ? '✅' : '⚠️',
      details: `Profiles: ${hasProfiles}, Helpers: ${hasGetters}, LA data: ${hasLA}`
    });
  } catch (e) {
    checks.push({ name: 'ZIP demographics data', status: '❌', details: e.message });
  }
  
  // Check 5: Channel inventory
  try {
    const channels = await fs.readFile('./src/data/channelInventory.js', 'utf-8');
    const hasCTV = channels.includes('ctv:');
    const hasTraditional = channels.includes('traditional:');
    const hasRoku = channels.includes('Roku');
    checks.push({
      name: 'Channel inventory',
      status: hasCTV && hasTraditional && hasRoku ? '✅' : '⚠️',
      details: `CTV: ${hasCTV}, Traditional: ${hasTraditional}, Roku: ${hasRoku}`
    });
  } catch (e) {
    checks.push({ name: 'Channel inventory', status: '❌', details: e.message });
  }
  
  // Check 6: GeoJSON data
  try {
    const stats = await fs.stat('./public/data/us-zip3-simplified.json');
    const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
    checks.push({
      name: 'GeoJSON data',
      status: stats.size > 5000000 && stats.size < 6000000 ? '✅' : '⚠️',
      details: `${sizeMB}MB (expected ~5.6MB)`
    });
  } catch (e) {
    checks.push({ name: 'GeoJSON data', status: '❌', details: e.message });
  }
  
  // Print results
  console.log('Validation Results:\n');
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}`);
    console.log(`   ${check.details}\n`);
  });
  
  const allPassed = checks.every(c => c.status === '✅');
  
  if (allPassed) {
    console.log('🎉 All checks passed! Two-page demo is ready.\n');
    console.log('Pages available:');
    console.log('  📋 Campaign Planning - Interactive ZIP selector & channel inventory');
    console.log('  📊 Campaign Results - Performance metrics & geographic analysis\n');
    console.log('Run "npm run dev" and navigate to http://localhost:5174');
  } else {
    console.log('⚠️  Some checks failed. Review the details above.\n');
  }
  
  return allPassed;
}

validateTwoPageDemo()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Validation error:', err);
    process.exit(1);
  });
