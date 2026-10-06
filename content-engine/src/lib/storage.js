/**
 * Copia las imágenes generadas a Supabase Storage.
 *
 * Las URLs que devuelve Higgsfield son temporales: a las pocas horas dejan
 * de servir la imagen y el panel queda con marcos rotos. Guardar una copia
 * propia es la única forma de que un episodio siga siendo revisable mañana.
 *
 * Se hace apenas la imagen existe, antes del audio y el ensamblaje: si una
 * etapa posterior falla, el trabajo ya pagado en créditos no se pierde.
 */
import { db } from './db.js';

const BUCKET = 'episodios';

/** Crea el bucket público la primera vez. Idempotente. */
export async function ensureBucket() {
  const { data } = await db.storage.listBuckets();
  if (data?.some(b => b.name === BUCKET)) return;
  const { error } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  });
  // Otra ejecución en paralelo pudo crearlo entre la lectura y la escritura.
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`no se pudo crear el bucket ${BUCKET}: ${error.message}`);
  }
}

/**
 * Descarga una imagen remota y la guarda bajo una ruta estable.
 * Devuelve la URL pública permanente.
 */
export async function persistImage({ sourceUrl, episodeId, index }) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`no se pudo descargar la imagen ${index}: ${res.status}`);

  const type = res.headers.get('content-type') ?? 'image/png';
  const ext = type.includes('webp') ? 'webp' : type.includes('jpeg') ? 'jpg' : 'png';
  const path = `${episodeId}/escena-${String(index + 1).padStart(2, '0')}.${ext}`;

  const { error } = await db.storage.from(BUCKET).upload(
    path,
    Buffer.from(await res.arrayBuffer()),
    { contentType: type, upsert: true }
  );
  if (error) throw new Error(`no se pudo guardar la imagen ${index}: ${error.message}`);

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Guarda todas las escenas de un episodio.
 * Si alguna falla, conserva su URL original en vez de perder la escena:
 * una imagen que caduca es mejor que un hueco.
 */
export async function persistEpisodeImages({ episodeId, urls }) {
  await ensureBucket();
  return Promise.all(urls.map(async (url, i) => {
    try {
      return await persistImage({ sourceUrl: url, episodeId, index: i });
    } catch (e) {
      console.error(`escena ${i + 1} no se pudo guardar: ${e.message}`);
      return url;
    }
  }));
}
