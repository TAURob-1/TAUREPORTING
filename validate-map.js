import fs from 'fs/promises';

async function validateMapSetup() {
  console.log('🔍 Validating CarShield Map Upgrade...\n');
  
  const checks = [];
  
  // Check 1: GeoJSON file exists and is valid
  try {
    const geoJson = JSON.parse(
      await fs.readFile('./public/data/us-zip3-simplified.json', 'utf-8')
    );
    const featureCount = geoJson.features.length;
    checks.push({
      name: 'GeoJSON file',
      status: featureCount === 896 ? '✅' : '⚠️',
      details: `${featureCount} ZIP regions`
    });
  } catch (e) {
    checks.push({
      name: 'GeoJSON file',
      status: '❌',
      details: e.message
    });
  }
  
  // Check 2: Component file exists
  try {
    const component = await fs.readFile('./src/components/USAMap.jsx', 'utf-8');
    const hasLeaflet = component.includes('react-leaflet');
    const hasGeoJSON = component.includes('GeoJSON');
    checks.push({
      name: 'USAMap component',
      status: hasLeaflet && hasGeoJSON ? '✅' : '⚠️',
      details: `Leaflet: ${hasLeaflet}, GeoJSON: ${hasGeoJSON}`
    });
  } catch (e) {
    checks.push({
      name: 'USAMap component',
      status: '❌',
      details: e.message
    });
  }
  
  // Check 3: ZIP mapping exists
  try {
    const mapping = await fs.readFile('./src/data/zipMapping.js', 'utf-8');
    const hasFunctions = mapping.includes('getZipType') && 
                        mapping.includes('getZipColor');
    checks.push({
      name: 'ZIP mapping utilities',
      status: hasFunctions ? '✅' : '⚠️',
      details: 'Helper functions present'
    });
  } catch (e) {
    checks.push({
      name: 'ZIP mapping utilities',
      status: '❌',
      details: e.message
    });
  }
  
  // Check 4: Package dependencies
  try {
    const pkg = JSON.parse(await fs.readFile('./package.json', 'utf-8'));
    const hasLeaflet = pkg.dependencies.leaflet;
    const hasReactLeaflet = pkg.dependencies['react-leaflet'];
    checks.push({
      name: 'Dependencies',
      status: hasLeaflet && hasReactLeaflet ? '✅' : '⚠️',
      details: `leaflet@${hasLeaflet || 'missing'}, react-leaflet@${hasReactLeaflet || 'missing'}`
    });
  } catch (e) {
    checks.push({
      name: 'Dependencies',
      status: '❌',
      details: e.message
    });
  }
  
  // Check 5: CSS styles
  try {
    const css = await fs.readFile('./src/index.css', 'utf-8');
    const hasTooltip = css.includes('custom-tooltip');
    const hasAnimation = css.includes('fadeIn');
    checks.push({
      name: 'Custom styles',
      status: hasTooltip && hasAnimation ? '✅' : '⚠️',
      details: `Tooltip: ${hasTooltip}, Animation: ${hasAnimation}`
    });
  } catch (e) {
    checks.push({
      name: 'Custom styles',
      status: '❌',
      details: e.message
    });
  }
  
  // Print results
  console.log('Validation Results:\n');
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}`);
    console.log(`   ${check.details}\n`);
  });
  
  const allPassed = checks.every(c => c.status === '✅');
  
  if (allPassed) {
    console.log('🎉 All checks passed! Map upgrade is ready for demo.\n');
    console.log('Run "npm run dev" and navigate to http://localhost:5173');
  } else {
    console.log('⚠️  Some checks failed. Review the details above.\n');
  }
  
  return allPassed;
}

validateMapSetup()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Validation error:', err);
    process.exit(1);
  });
