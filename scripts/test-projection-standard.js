const fs = require('fs');
const d3Geo = require('d3-geo');

const geo = JSON.parse(fs.readFileSync('public/argentina-provinces.json', 'utf8'));

// Create geoMercator projection with center [0, 0]
const projection = d3Geo.geoMercator()
  .scale(1400)
  .center([0, 0])
  .translate([400, 450]); // standard 800x900 midpoint

// Let's project the center of Argentina [-64, -38.5]
const [cx, cy] = projection([-64, -38.5]);
console.log('Projected center of Argentina [-64, -38.5]:', cx, cy);

// The translation applied by ZoomableGroup is [400 - cx, 450 - cy]
const tx = 400 - cx;
const ty = 450 - cy;
console.log('ZoomableGroup translation:', tx, ty);

// Let's check the final coordinates of all provinces after this translation
geo.features.forEach(f => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let pointCount = 0;

  function projectCoords(coords) {
    coords.forEach(item => {
      if (typeof item[0] === 'number') {
        const [x, y] = projection(item);
        const rx = x + tx;
        const ry = y + ty;
        if (rx < minX) minX = rx;
        if (rx > maxX) maxX = rx;
        if (ry < minY) minY = ry;
        if (ry > maxY) maxY = ry;
        pointCount++;
      } else {
        projectCoords(item);
      }
    });
  }

  projectCoords(f.geometry.coordinates);
  console.log(`${f.properties.nombre} (${f.properties.id}):`);
  console.log(`  X: ${minX.toFixed(1)} to ${maxX.toFixed(1)} (width: ${(maxX - minX).toFixed(1)})`);
  console.log(`  Y: ${minY.toFixed(1)} to ${maxY.toFixed(1)} (height: ${(maxY - minY).toFixed(1)})`);
});
