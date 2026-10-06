/**
 * Cliente de publicación TikTok Content Posting API.
 *
 * Restricciones duras:
 * - ~15 posts/día POR CREADOR, compartido entre todas las apps autorizadas.
 *   Otra herramienta de scheduling consume el mismo cupo.
 * - 6 peticiones/minuto por token.
 * - Un cliente SIN AUDITAR solo permite publicar a 5 creadores cada 24h.
 * - Solo piezas de +60s generan ingresos en Creator Rewards.
 */
const API = 'https://open.tiktokapis.com/v2';

export async function publishVideo({ accessToken, videoUrl, title, isDraft = false }) {
  const res = await fetch(`${API}/post/publish/${isDraft ? 'inbox' : 'video'}/init/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      ...(isDraft ? {} : {
        post_info: {
          title,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_comment: false,
          brand_content_toggle: false,
          brand_organic_toggle: false,
        },
      }),
      source_info: { source: 'PULL_FROM_URL', video_url: videoUrl },
    }),
  });
  const body = await res.json();
  if (!res.ok || body.error?.code !== 'ok') {
    throw new Error(`publicación TikTok falló: ${JSON.stringify(body.error ?? body)}`);
  }
  return { publishId: body.data.publish_id };
}

/** El resultado es asíncrono: init devuelve id, el estado llega después. */
export async function fetchPublishStatus({ accessToken, publishId }) {
  const res = await fetch(`${API}/post/publish/status/fetch/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ publish_id: publishId }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`consulta de estado falló: ${JSON.stringify(body)}`);
  return body.data;  // PROCESSING_UPLOAD | PUBLISH_COMPLETE | FAILED
}
