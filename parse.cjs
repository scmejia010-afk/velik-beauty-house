const fs = require('fs');

const content = fs.readFileSync('productos-catalogo.md', 'utf-8');
const lines = content.split('\n');

const products = [];
let currentCategory = '';

const catMap = {
  'LÍNEA HYDRATE': 'Hydrate',
  'LÍNEA GLOW': 'Glow',
  'LÍNEA AMPLIFY': 'Amplify',
  'LÍNEA REPLENISH': 'Replenish',
  'LÍNEA BARE': 'Bare',
  'LÍNEA PURIFICANTE / DEEP CLEANSING': 'Bare',
  'TRATAMIENTOS Y ACEITES': 'Tratamientos',
  'CREMAS Y OTROS': 'Tratamientos',
  'FRAGANCIA': 'Tratamientos',
  'ACCESORIOS Y HERRAMIENTAS': 'Accesorios',
};

const catImages = {
  Hydrate: {
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop"
  },
  Glow: {
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"
  },
  Amplify: {
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1604654894610-df490998570e?w=600&h=600&fit=crop"
  },
  Replenish: {
    image: "https://images.unsplash.com/photo-1608248593842-8021c6a1b187?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=600&fit=crop"
  },
  Bare: {
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop"
  },
  Tratamientos: {
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=600&fit=crop"
  },
  Accesorios: {
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop"
  }
};

for (const line of lines) {
  if (line.startsWith('## ')) {
    const catName = line.replace('## ', '').trim();
    if (catMap[catName]) {
      currentCategory = catMap[catName];
    }
  } else if (line.startsWith('|') && !line.includes('Producto') && !line.includes('---')) {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length >= 6) {
      const id = parts[1];
      const title = parts[2];
      let size = parts[4];
      if (title.includes('MANDIL') || title.includes('Tools') || title.includes('Aplicador') || title.includes('Toallas')) {
        size = parts[4] || '-';
      }
      
      if (id && title && title !== '') {
        products.push({
          title: title.replace(/\*(.*?)\*/g, '$1'),
          category: currentCategory,
          size: size === '—' ? '-' : size,
          price: 'Por definir',
          desc: `Producto de la línea ${currentCategory} de Authentic Beauty Concept.`,
          image: catImages[currentCategory]?.image || '',
          hoverImage: catImages[currentCategory]?.hoverImage || ''
        });
      }
    }
  }
}

fs.writeFileSync('parsed_products.json', JSON.stringify(products, null, 2));
console.log('Parsed', products.length, 'products');
