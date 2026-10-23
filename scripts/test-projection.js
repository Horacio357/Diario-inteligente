const fs = require('fs');
const d3Geo = require('d3-geo');

const geo = JSON.parse(fs.readFileSync('public/argentina-provinces.json', 'utf8'));

// Create geoMercator projection
const projection = d3Geo.geoMercator()
  .scale(1400)
  .center([-64, -38.5])
  .translate([400, 450]); // standard 800x900 midpoint

// Let's project all features and calculate bounding box
geo.features.forEach(f => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let pointCount = 0;

  function projectCoords(coords) {
    coords.forEach(item => {
      if (typeof item[0] === 'number') {
        const [x, y] = projection(item);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        pointCount++;
      } else {
        projectCoords(item);
      }
    });
  }

  projectCoords(f.geometry.coordinates);
  console.log(`${f.properties.nombre} (${f.properties.id}):`);
  console.log(`  Points: ${pointCount}`);
  console.log(`  X: ${minX.toFixed(1)} to ${maxX.toFixed(1)} (width: ${(maxX - minX).toFixed(1)})`);
  console.log(`  Y: ${minY.toFixed(1)} to ${maxY.toFixed(1)} (height: ${(maxY - minY).toFixed(1)})`);
});
