import fs from 'fs/promises';

async function simplifyGeoJSON() {
  const data = JSON.parse(await fs.readFile('./public/data/us-zip3.json', 'utf-8'));
  
  // Reduce coordinate precision to 4 decimal places (about 11 meters accuracy)
  // This significantly reduces file size
  function roundCoords(coords) {
    if (typeof coords[0] === 'number') {
      return coords.map(c => Math.round(c * 10000) / 10000);
    }
    return coords.map(roundCoords);
  }
  
  const simplified = {
    ...data,
    features: data.features.map(feature => ({
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: roundCoords(feature.geometry.coordinates)
      }
    }))
  };
  
  await fs.writeFile(
    './public/data/us-zip3-simplified.json',
    JSON.stringify(simplified)
  );
  
  const originalSize = (await fs.stat('./public/data/us-zip3.json')).size;
  const newSize = (await fs.stat('./public/data/us-zip3-simplified.json')).size;
  
  console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Simplified size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${((1 - newSize / originalSize) * 100).toFixed(1)}%`);
}

simplifyGeoJSON().catch(console.error);
