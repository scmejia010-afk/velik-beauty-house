const https = require('https');
const GHL_KEY = 'pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e';

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function fetchCalendars() {
  return new Promise((res) => {
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: '/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${GHL_KEY}`, 'Version': '2021-04-15' }
    }, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d).calendars || []));
    });
    req.end();
  });
}

function updateSlug(cal, slug) {
  return new Promise((res) => {
    const body = JSON.stringify({ slug });
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: `/calendars/${cal.id}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GHL_KEY}`,
        'Version': '2021-04-15',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res({ name: cal.name, slug, status: r.statusCode }));
    });
    req.on('error', e => res({ name: cal.name, slug, error: e.message }));
    req.write(body); req.end();
  });
}

async function run() {
  console.log('Fetching calendars...');
  const cals = await fetchCalendars();
  console.log(`Found ${cals.length} calendars\n`);

  // Track used slugs to avoid duplicates
  const used = new Set();

  for (let i = 0; i < cals.length; i += 5) {
    const batch = cals.slice(i, i + 5);
    const results = await Promise.all(batch.map(cal => {
      let slug = normalize(cal.name);
      // If duplicate, append a number
      let finalSlug = slug;
      let count = 2;
      while (used.has(finalSlug)) {
        finalSlug = slug + '-' + count++;
      }
      used.add(finalSlug);
      return updateSlug(cal, finalSlug);
    }));
    results.forEach(r => {
      if (r.error) console.log(`✗ ${r.name} → ERROR: ${r.error}`);
      else console.log(`${r.status === 200 ? '✓' : '✗'} ${r.name} → ${r.slug} [${r.status}]`);
    });
  }
  console.log('\nDone!');
}
run();
