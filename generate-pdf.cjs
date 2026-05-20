const puppeteer = require('puppeteer');

(async () => {
  console.log('Lanzando navegador...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Establecer un viewport de escritorio
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navegando a la URL...');
  await page.goto('https://velik-beauty-house.vercel.app/', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Función para hacer scroll hasta el final y forzar la carga de imágenes lazy / animaciones
  console.log('Haciendo scroll para cargar todo el contenido...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });

  // Volver arriba por si acaso algo depende de la posición del scroll
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  
  // Esperar un segundo extra para que terminen las animaciones de scroll
  await new Promise(r => setTimeout(r, 2000));

  // Obtener la altura total de la página para que el PDF sea de una sola página continua y no corte nada
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  console.log('Generando PDF...');
  await page.pdf({
    path: 'Velik-Beauty-House.pdf',
    width: '1440px',
    height: Math.ceil(height) + 'px',
    printBackground: true,
    pageRanges: '1' // Solo la primera página (que al tener el alto total es única)
  });

  await browser.close();
  console.log('PDF generado exitosamente como Velik-Beauty-House.pdf');
})();
