import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.join(process.cwd(), 'src/components/ProductsGrid.tsx'), 'utf8');

// Extraer el array products
const match = content.match(/const products: Product\[\] = (\[[\s\S]*?\]);\r?\n\r?\nconst categories/);

if (!match) {
  console.error("No se pudo encontrar el array de productos");
  process.exit(1);
}

const productsText = match[1];
const products = eval(`(${productsText})`);

let sql = "INSERT INTO inventario (producto_nombre, talla, stock) VALUES\n";

const values = [];
for (const product of products) {
  for (const size of product.sizes) {
    values.push(`('${product.title.replace(/'/g, "''")}', '${size.size}', 10)`);
  }
}

sql += values.join(",\n");
sql += "\nON CONFLICT (producto_nombre, talla) DO NOTHING;";

fs.writeFileSync('insert_products.sql', sql);
console.log("SQL generado correctamente en insert_products.sql con " + values.length + " filas.");
