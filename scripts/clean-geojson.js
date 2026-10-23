const fs = require('fs');

const geo = JSON.parse(fs.readFileSync('public/argentina-provinces.json', 'utf8'));

// Find Tierra del Fuego
const tdfIdx = geo.features.findIndex(f => f.properties.id === '94');
const tdf = geo.features[tdfIdx];

console.log('Before cleanup:');
console.log('  TDF polygons:', tdf.geometry.coordinates.length);

// Filter: keep only polygons where ALL points have longitude west of -50
// This removes South Georgia, South Sandwich Islands, etc.
const kept = [];
const removed = [];

for (const polygon of tdf.geometry.coordinates) {
  let hasEastPoint = false;
  for (const ring of polygon) {
    for (const pt of ring) {
      if (pt[0] > -50) {
        hasEastPoint = true;
        break;
      }
    }
    if (hasEastPoint) break;
  }
  if (hasEastPoint) {
    removed.push(polygon);
  } else {
    kept.push(polygon);
  }
}

console.log('  Kept:', kept.length);
console.log('  Removed:', removed.length);

tdf.geometry.coordinates = kept;

// Also remove Malvinas/Falklands (east of -57 lon) to keep only continental TDF + Isla Grande
const kept2 = [];
for (const polygon of tdf.geometry.coordinates) {
  let allEast = true;
  for (const ring of polygon) {
    for (const pt of ring) {
      if (pt[0] <= -63) {
        allEast = false;
        break;
      }
    }
    if (!allEast) break;
  }
  // Keep polygons that have at least some points west of -63 (continental)
  // OR keep all - Malvinas are roughly between -61 and -57.7
  kept2.push(polygon);
}

// Verify final bounds
let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
for (const f of geo.features) {
  (function pc(c) {
    c.forEach(item => {
      if (typeof item[0] === 'number') {
        if (item[0] < minLon) minLon = item[0];
        if (item[0] > maxLon) maxLon = item[0];
        if (item[1] < minLat) minLat = item[1];
        if (item[1] > maxLat) maxLat = item[1];
      } else {
        pc(item);
      }
    });
  })(f.geometry.coordinates);
}

console.log('\nAfter cleanup:');
console.log('  TDF polygons:', tdf.geometry.coordinates.length);
console.log('  Lon:', minLon.toFixed(2), 'to', maxLon.toFixed(2));
console.log('  Lat:', minLat.toFixed(2), 'to', maxLat.toFixed(2));
console.log('  Total features:', geo.features.length);

fs.writeFileSync('public/argentina-provinces.json', JSON.stringify(geo));
console.log('\nSaved cleaned GeoJSON!');
