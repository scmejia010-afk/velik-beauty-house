import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { name: 'replenish-shampoo.png', url: 'https://dm.henkel-dam.com/is/image/henkel/ABC_Replenish_Shp_300ml_42469834?wid=800&fmt=png-alpha' },
  { name: 'replenish-acondicionador.png', url: 'https://dm.henkel-dam.com/is/image/henkel/ABC_Replenish_Cond_250ml_048?wid=800&fmt=png-alpha' },
  { name: 'replenish-acondicionador-spray.png', url: 'https://dm.henkel-dam.com/is/image/henkel/ABC_Replenish_Spray_Cond_250ml_42469803_040?wid=800&fmt=png-alpha' },
  { name: 'replenish-rich-mascarilla.png', url: 'https://dm.henkel-dam.com/is/image/henkel/ABC_Replenish_Rich_Mask_200ml_061?wid=800&fmt=png-alpha' },
  { name: 'replenish-light-mascarilla.png', url: 'https://dm.henkel-dam.com/is/image/henkel/ABC_Replenish_Light_Mask_200ml_061?wid=800&fmt=png-alpha' },
  { name: 'amplify-shampoo.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392781_1?wid=800&fmt=png-alpha' },
  { name: 'amplify-acondicionador.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42367130_1?wid=800&fmt=png-alpha' },
  { name: 'amplify-acondicionador-spray.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42367468_1?wid=800&fmt=png-alpha' },
  { name: 'glow-shampoo.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392460_1?wid=800&fmt=png-alpha' },
  { name: 'glow-acondicionador.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42367307_1?wid=800&fmt=png-alpha' },
  { name: 'glow-mascarilla.png', url: 'https://dm.henkel-dam.com/is/image/henkel/abc-com-glow-mask-teaser?wid=800&fmt=png-alpha' },
  { name: 'glow-cool-cleanser.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42405559_ABC_Cool_Glow_Cleanser_300ml_01?wid=800&fmt=png-alpha' },
  { name: 'glow-sprayable-serum.png', url: 'https://dm.henkel-dam.com/is/image/henkel/abc_master_glow_spray_serum_teaser_v1?wid=800&fmt=png-alpha' },
  { name: 'hydrate-champu.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392491_1?wid=800&fmt=png-alpha' },
  { name: 'hydrate-acondicionador.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392590_1?wid=800&fmt=png-alpha' },
  { name: 'hydrate-acondicionador-spray.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392606_1?wid=800&fmt=png-alpha' },
  { name: 'hydrate-mascarilla.png', url: 'https://dm.henkel-dam.com/is/image/henkel/hydrate-mask-com-teaser?wid=800&fmt=png-alpha' },
  { name: 'hydrate-lotion.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392804_1?wid=800&fmt=png-alpha' },
  { name: 'hydrate-smoothing-serum.png', url: 'https://dm.henkel-dam.com/is/image/henkel/ABC_HYDRATE_Smoothing_Serum?wid=800&fmt=png-alpha' },
  { name: 'all-hair-deep-cleansing.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42366898_1?wid=800&fmt=png-alpha' },
  { name: 'all-hair-flawless-primer.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392620_1?wid=800&fmt=png-alpha' },
  { name: 'all-hair-working-hairspray.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42366645_1?wid=800&fmt=png-alpha' },
  { name: 'all-hair-solid-pomade.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42392811_1?wid=800&fmt=png-alpha' },
  { name: 'beyond-eau-de-toilette.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42393306_53?wid=800&fmt=png-alpha' },
  { name: 'beyond-hand-cream.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42393337_ABC_Hand_Hair_LightCream_75ml_5_NEW?wid=800&fmt=png-alpha' },
  { name: 'beyond-enhancing-water.png', url: 'https://dm.henkel-dam.com/is/image/henkel/42405450_ABC_Enhancing_Water_100ml_5_NEW?wid=800&fmt=png-alpha' }
];

async function downloadImage(url, dest) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    await fs.writeFile(dest, Buffer.from(buffer));
    console.log(`✅ Downloaded: ${path.basename(dest)}`);
  } catch (err) {
    console.error(`❌ Failed: ${url} -> ${err.message}`);
  }
}

async function run() {
  const dir = path.join(__dirname, 'public', 'productos');
  await fs.mkdir(dir, { recursive: true });
  
  const promises = images.map(img => 
    downloadImage(img.url, path.join(dir, img.name))
  );
  
  await Promise.all(promises);
  console.log('All downloads finished.');
}

run();
