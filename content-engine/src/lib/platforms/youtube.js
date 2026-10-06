/**
 * Cliente de publicación YouTube Data API v3.
 *
 * Dos particularidades que gobiernan el diseño:
 * - La cuota de 10.000 unidades/día es POR PROYECTO Google Cloud, y un
 *   upload cuesta 1.600 → 6 videos/día por proyecto. Un proyecto por cuenta.
 * - selfDeclaredMadeForKids es obligatorio. Declararlo activa COPPA:
 *   sin anuncios personalizados, RPM cae a ~$0.33.
 */
export async function uploadVideo({
  accessToken, filePath, title, description, tags = [],
  madeForKids = true, aiDisclosed = true,
}) {
  const metadata = {
    snippet: { title, description, tags, categoryId: '27' },  // 27 = Education
    status: {
      privacyStatus: 'public',
      // Obligatorio. No declararlo no es una opción para contenido infantil.
      selfDeclaredMadeForKids: madeForKids,
      // Divulgación de contenido sintético: no declararla cuando aplica
      // es desmonetización permanente.
      containsSyntheticMedia: aiDisclosed,
    },
  };

  const init = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos'
    + '?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        'X-Upload-Content-Type': 'video/*',
      },
      body: JSON.stringify(metadata),
    }
  );
  if (!init.ok) throw new Error(`inicio de subida falló ${init.status}: ${await init.text()}`);

  const uploadUrl = init.headers.get('location');
  if (!uploadUrl) throw new Error('la API no devolvió URL de subida reanudable');

  const { createReadStream, statSync } = await import('node:fs');
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'content-length': String(statSync(filePath).size) },
    body: createReadStream(filePath),
    duplex: 'half',
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`subida falló ${res.status}: ${JSON.stringify(body)}`);

  return { platformPostId: body.id, unitsSpent: 1600 };
}

/**
 * Retención e ingreso por país. Es la métrica que gobierna el proyecto:
 * sin el desglose geográfico no se sabe si el problema es el contenido o
 * el mercado de la audiencia.
 */
export async function fetchAnalytics({ accessToken, videoId, startDate, endDate }) {
  const url = new URL('https://youtubeanalytics.googleapis.com/v2/reports');
  url.searchParams.set('ids', 'channel==MINE');
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('metrics', 'views,estimatedMinutesWatched,averageViewDuration,estimatedRevenue');
  url.searchParams.set('dimensions', 'country');
  url.searchParams.set('filters', `video==${videoId}`);

  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`analytics falló ${res.status}: ${await res.text()}`);
  return res.json();
}
