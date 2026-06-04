const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/data/roadmaps');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'languages.json');

files.forEach(file => {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let count = 0;
  Object.keys(data).forEach(track => {
    data[track].forEach(layer => {
      if ('sideLeft' in layer || 'sideRight' in layer) {
        delete layer.sideLeft;
        delete layer.sideRight;
        count++;
      }
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`${file}: cleared ${count} layers`);
});

console.log('Done.');
