/**
 * Cliente de publicación Meta (Facebook + Instagram Reels).
 * Facebook es la plataforma de mayor RPM del proyecto.
 *
 * Publicar es un proceso de dos pasos: crear contenedor, luego publicar.
 * El contenedor tarda en procesarse; publicar antes de que esté listo falla
 * y consume cupo sin publicar nada.
 */
const GRAPH = 'https://graph.facebook.com/v21.0';

async function graph(path, params, method = 'GET') {
  const url = new URL(`${GRAPH}${path}`);
  if (method === 'GET') for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, method === 'GET' ? {} : {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Graph ${path} ${res.status}: ${JSON.stringify(body.error ?? body)}`);
  return body;
}

/** Instagram Reels: contenedor -> espera de procesamiento -> publicación. */
export async function publishInstagramReel({ igUserId, token, videoUrl, caption }) {
  const { id: creationId } = await graph(`/${igUserId}/media`, {
    media_type: 'REELS', video_url: videoUrl, caption, access_token: token,
  }, 'POST');

  await waitForContainer(creationId, token);

  const { id } = await graph(`/${igUserId}/media_publish`, {
    creation_id: creationId, access_token: token,
  }, 'POST');
  return { platformPostId: id };
}

/**
 * Facebook Reels: inicio -> subida -> publicación.
 * Requiere permiso pages_manage_posts y token de PÁGINA, no de usuario.
 */
export async function publishFacebookReel({ pageId, token, videoUrl, description }) {
  const start = await graph(`/${pageId}/video_reels`, {
    upload_phase: 'start', access_token: token,
  }, 'POST');

  const upload = await fetch(`https://rupload.facebook.com/video-upload/v21.0/${start.video_id}`, {
    method: 'POST',
    headers: { Authorization: `OAuth ${token}`, file_url: videoUrl },
  });
  if (!upload.ok) throw new Error(`subida de reel falló ${upload.status}: ${await upload.text()}`);

  await graph(`/${pageId}/video_reels`, {
    upload_phase: 'finish',
    video_id: start.video_id,
    video_state: 'PUBLISHED',
    description,
    access_token: token,
  }, 'POST');

  return { platformPostId: start.video_id };
}

/**
 * El contenedor pasa por IN_PROGRESS antes de FINISHED. Publicar durante el
 * procesamiento devuelve error y gasta cupo sin resultado.
 */
async function waitForContainer(creationId, token, { timeoutMs = 300000, intervalMs = 5000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { status_code, status } = await graph(`/${creationId}`, {
      fields: 'status_code,status', access_token: token,
    });
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR') throw new Error(`contenedor en error: ${status}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`contenedor ${creationId} no terminó de procesar en ${timeoutMs}ms`);
}

export { graph as metaGraph };
