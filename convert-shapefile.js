import shapefile from 'shapefile';
import fs from 'fs/promises';

async function convertToGeoJSON() {
  const source = await shapefile.open(
    './public/data/three_digit_zips/three_dig_zips/three_dig_zips.shp'
  );
  
  const features = [];
  let result = await source.read();
  
  while (!result.done) {
    features.push(result.value);
    result = await source.read();
  }
  
  const geojson = {
    type: 'FeatureCollection',
    features: features
  };
  
  await fs.writeFile(
    './public/data/us-zip3.json',
    JSON.stringify(geojson, null, 2)
  );
  
  console.log(`Converted ${features.length} ZIP code regions to GeoJSON`);
}

convertToGeoJSON().catch(console.error);
