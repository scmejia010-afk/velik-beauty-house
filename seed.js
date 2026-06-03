import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y3JiY29jY2lzb3RhbmNpeHRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5NTM3OSwiZXhwIjoyMDk2MDcxMzc5fQ.HSf3zcKHbZesq5SEq66hOr1vpzPZ95xSes3Ci_5lHbg";
const supabase = createClient(supabaseUrl, serviceRoleKey);

const products = [
  {
    "title": "Hydrate Cleanser",
    "category": "Hydrate",
    "sizes": [{"size": "300ml", "price": "$ 145.990"}, {"size": "1000ml", "price": "$ 316.990"}]
  },
  {
    "title": "Hydrate Conditioner",
    "category": "Hydrate",
    "sizes": [{"size": "250ml", "price": "$ 155.990"}, {"size": "1000ml", "price": "$ 338.990"}]
  },
  {
    "title": "Hydrate Intense Treatment",
    "category": "Hydrate",
    "sizes": [{"size": "200ml", "price": "$ 200.990"}, {"size": "500ml", "price": "$ 334.990"}]
  },
  {
    "title": "Hydrate Lotion",
    "category": "Hydrate",
    "sizes": [{"size": "250ml", "price": "$ 187.990"}]
  },
  {
    "title": "Glow Cleanser",
    "category": "Glow",
    "sizes": [{"size": "300ml", "price": "$ 145.990"}, {"size": "1000ml", "price": "$ 316.990"}]
  },
  {
    "title": "Glow Conditioner",
    "category": "Glow",
    "sizes": [{"size": "250ml", "price": "$ 155.990"}, {"size": "1000ml", "price": "$ 338.990"}]
  },
  {
    "title": "Glow Mask",
    "category": "Glow",
    "sizes": [{"size": "200ml", "price": "$ 200.990"}, {"size": "500ml", "price": "$ 334.990"}]
  },
  {
    "title": "Amplify Cleanser",
    "category": "Amplify",
    "sizes": [{"size": "300ml", "price": "$ 145.990"}, {"size": "1000ml", "price": "$ 316.990"}]
  },
  {
    "title": "Amplify Conditioner",
    "category": "Amplify",
    "sizes": [{"size": "250ml", "price": "$ 155.990"}, {"size": "1000ml", "price": "$ 338.990"}]
  },
  {
    "title": "Replenish Cleanser",
    "category": "Replenish",
    "sizes": [{"size": "300ml", "price": "$ 145.990"}, {"size": "1000ml", "price": "$ 316.990"}]
  },
  {
    "title": "Replenish Conditioner",
    "category": "Replenish",
    "sizes": [{"size": "250ml", "price": "$ 155.990"}, {"size": "1000ml", "price": "$ 338.990"}]
  },
  {
    "title": "Replenish Mask",
    "category": "Replenish",
    "sizes": [{"size": "200ml", "price": "$ 200.990"}, {"size": "500ml", "price": "$ 334.990"}]
  },
  {
    "title": "Replenish Balm",
    "category": "Replenish",
    "sizes": [{"size": "150ml", "price": "$ 187.990"}]
  },
  {
    "title": "Deep Cleansing Shampoo",
    "category": "All Hair Types",
    "sizes": [{"size": "300ml", "price": "$ 145.990"}, {"size": "1000ml", "price": "$ 316.990"}]
  },
  {
    "title": "Hand & Hair Light Cream",
    "category": "All Hair Types",
    "sizes": [{"size": "75ml", "price": "$ 145.990"}]
  },
  {
    "title": "Eau de Toilette",
    "category": "Beyond The Hair",
    "sizes": [{"size": "50ml", "price": "$ 288.990"}]
  },
  {
    "title": "Flawless Primer",
    "category": "Styling",
    "sizes": [{"size": "250ml", "price": "$ 187.990"}]
  },
  {
    "title": "Amplify Mousse",
    "category": "Styling",
    "sizes": [{"size": "200ml", "price": "$ 187.990"}]
  },
  {
    "title": "Shaping Cream",
    "category": "Styling",
    "sizes": [{"size": "150ml", "price": "$ 187.990"}]
  },
  {
    "title": "Solid Pomade",
    "category": "Styling",
    "sizes": [{"size": "85ml", "price": "$ 187.990"}]
  },
  {
    "title": "Grit Wax Paste",
    "category": "Styling",
    "sizes": [{"size": "85ml", "price": "$ 187.990"}]
  },
  {
    "title": "Working Hairspray",
    "category": "Styling",
    "sizes": [{"size": "300ml", "price": "$ 187.990"}]
  },
  {
    "title": "Strong Hold Hairspray",
    "category": "Styling",
    "sizes": [{"size": "300ml", "price": "$ 187.990"}]
  },
  {
    "title": "Dry Shampoo",
    "category": "Styling",
    "sizes": [{"size": "250ml", "price": "$ 187.990"}]
  },
  {
    "title": "Nymph Salt Spray",
    "category": "Styling",
    "sizes": [{"size": "250ml", "price": "$ 187.990"}]
  },
  {
    "title": "Glow Spray Serum",
    "category": "Styling",
    "sizes": [{"size": "250ml", "price": "$ 187.990"}]
  },
  {
    "title": "Airy Texture Spray",
    "category": "Styling",
    "sizes": [{"size": "300ml", "price": "$ 187.990"}]
  },
  {
    "title": "Cosmic Blow-Dry Jelly",
    "category": "Styling",
    "sizes": [{"size": "150ml", "price": "$ 187.990"}]
  }
];

async function seed() {
  console.log("Iniciando migración de inventario...");
  for (const product of products) {
    for (const size of product.sizes) {
      const { error } = await supabase
        .from('inventario')
        .insert({
          producto_nombre: product.title,
          talla: size.size,
          stock: 10
        });
      
      if (error && error.code !== '23505') {
        console.error(`Error al insertar ${product.title} (${size.size}):`, error.message);
      } else {
        console.log(`Insertado: ${product.title} (${size.size}) con 10 unidades iniciales.`);
      }
    }
  }
  console.log("¡Migración completada exitosamente!");
}

seed();
