const fs = require('fs');
let c = fs.readFileSync('src/components/ProductsGrid.tsx', 'utf-8');
c = c.replace(/\.jpg"/g, '.png"');
fs.writeFileSync('src/components/ProductsGrid.tsx', c);
