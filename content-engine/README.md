# Content Engine

Motor autónomo de producción y publicación de video multicuenta.
Agentes que investigan, producen, publican y aprenden — sobre cuentas
reales y propias, con las APIs oficiales de cada plataforma.

## Hallazgos que definen el diseño

Investigación de 2026-10. Estos cuatro datos son la base de toda la arquitectura:

1. **El escalado es horizontal, no vertical.** TikTok tope ~15 posts/día *por
   creador* (compartido entre todas las apps autorizadas), YouTube 6/día por
   proyecto Cloud. Publicar "cada 20 minutos" en una cuenta es imposible.
   10 cuentas × 15 = 150 piezas/día. Ahí está la escala.

2. **Facebook es la plataforma más rentable y la menos disputada.**
   RPM $1–10 contra $0.03–0.10 de YouTube Shorts y $0.01–0.05 de Instagram.
   Colombia es país elegible. Casi nadie lo mira.

3. **La geografía de la audiencia pesa más que el volumen.** CPM Colombia
   $0.6–1.0, de los más bajos del mundo; vistas de US/UK/CA valen 5–10×.
   La misma pieza con las mismas vistas puede pagar $30 o $600.

4. **TikTok y Facebook solo pagan piezas de +60s, 100% originales.**
   Esto cambia el pipeline de producción: no clips de 8s, sino secuencias
   armadas. Duets y stitches no generan ingresos.

### Bloqueos conocidos

- **Auditoría de TikTok**: un cliente sin auditar solo permite publicar a
  5 creadores cada 24h. Hay que pasarla antes de escalar a multicuenta.
- **Un token por cuenta** en Meta: el límite de 200 llamadas/hora es por
  token, no por cuenta. Un token compartido estrangula a todas las cuentas.
- **Un proyecto Google Cloud por cuenta** de YouTube: la cuota de 10.000
  unidades/día es por proyecto.

## Arquitectura

    PANEL (React + Vite)        — cuentas, cola, calendario, RPM por geografía
         |
    SUPABASE (Postgres)         — accounts, videos, publications, quota_usage,
         |                        metrics, voices, trends
         |
    AGENTES (Vercel Cron)       — ver abajo

Reusa el stack que ya corre en Velik: Supabase + Vercel. Sin infraestructura nueva.

## Los cinco agentes

| Agente | Cadencia | Qué hace |
|---|---|---|
| **Scout** | diaria | Detecta tendencias y ángulos de hook por nicho. Escribe en `trends`. |
| **Writer** | por tendencia | Guion de +60s con hook en los primeros 3s. Escribe en `videos`. |
| **Producer** | por guion | Higgsfield: video, voz de la cuenta, doblaje. Llena `media_url`. |
| **Publisher** | cada 15 min | Toma la cola vencida, **valida cupo**, publica, registra consumo. |
| **Analyst** | diaria | Retención, RPM real y desglose geográfico. Realimenta al Scout. |

El **Publisher** es la pieza crítica. Sin su compuerta de cupo
(`src/lib/quota.js`) el sistema falla en silencio: la API rechaza por límite
y el video nunca se publica sin que nadie lo note.

El **Analyst** cierra el ciclo: mide qué hook retuvo más allá del segundo 3 y
qué geografía pagó, y el Scout usa eso para la siguiente tanda. Esta
realimentación es lo que hace que el sistema mejore en vez de solo repetir.

## Nicho

Contenido infantil (preescolar) en inglés. Este nicho tiene dos
restricciones severas documentadas en `docs/riesgos.md` que condicionan
todo el diseño:

- **COPPA** recorta el ingreso hasta un 80%: sin anuncios personalizados,
  el RPM cae a ~$0.33–3.00 y se desactivan memberships y comentarios.
- **Política de contenido inauténtico**: en enero 2026 YouTube terminó 16
  canales con 4.700 millones de vistas por contenido de plantilla generado
  en masa. El contenido infantil con IA es el blanco exacto.

Por eso el sistema está diseñado para **calidad con revisión humana
obligatoria**, no para volumen. El techo real no son las 593 piezas/día de
las APIs, sino las ~35/día que una persona puede revisar de verdad.

## Estado

- [x] Esquema de base de datos (`db/schema.sql`, `db/functions.sql`, `db/002_kids.sql`)
- [x] Límites y proyección de ingresos (`src/lib/limits.js`)
- [x] Compuerta de cupo y validación de monetización (`src/lib/quota.js`)
- [x] Reglas del nicho infantil y compuerta de autenticidad (`src/lib/kids.js`)
- [x] Clientes de publicación: Meta, TikTok, YouTube (`src/lib/platforms/`)
- [x] Los cinco agentes (`src/agents/`)
- [x] Cron endpoints y cola de revisión (`api/`)
- [ ] OAuth y renovación de tokens por cuenta
- [ ] Panel visual (la API de revisión ya existe: `api/review.js`)
- [ ] Integración real del MCP de Higgsfield en el Producer

## Puesta en marcha

1. Aplicar `db/schema.sql`, `db/functions.sql` y `db/002_kids.sql` en Supabase.
2. Copiar `.env.example` a `.env` y llenar las credenciales.
3. `npm run capacity` para dimensionar antes de escalar cuentas.
4. Iniciar la **auditoría del cliente de TikTok**: sin ella el tope es de
   5 creadores cada 24h, y tiene tiempos de espera externos.

## Alcance

Este sistema opera exclusivamente cuentas propias e identificadas mediante las
APIs oficiales de cada plataforma. No incluye ni incluirá generación de
interacción artificial (vistas, seguidores, engagement): es fraude contra los
programas de monetización de los que el proyecto cobra, y la vía más directa a
la desmonetización y retención de pagos.
