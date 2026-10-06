# Especificación de los agentes

Cada agente es una función serverless disparada por Vercel Cron. Estado
compartido solo vía Supabase: ningún agente llama a otro directamente, para
que un fallo aislado no tumbe la cadena.

## 1. Scout — inteligencia de tendencias

**Cadencia:** diaria, 06:00 hora local.
**Entrada:** nichos activos de `accounts`; desempeño reciente de `metrics`.
**Salida:** filas en `trends` con `topic`, `hook_angle`, `score`.

Combina señales públicas de tendencia con lo que ya funcionó en las cuentas
propias. Debe priorizar temas donde el nicho tiene audiencia en mercados de
alto RPM, no solo volumen de búsqueda.

## 2. Writer — guion

**Entrada:** una fila de `trends`.
**Salida:** fila en `videos` con `hook`, `script`, `duration_sec >= 60`.

Dos restricciones duras: la pieza debe superar los 60 segundos (sin eso no
genera ingresos en TikTok ni Facebook) y el hook debe resolverse en los
primeros 3 segundos, que es donde `retention_3s` decide el alcance.

## 3. Producer — producción

**Entrada:** `videos` en estado `draft`.
**Salida:** `media_url`, estado `ready`.

Vía MCP de Higgsfield: `generate_video` por secuencias hasta alcanzar la
duración, `generate_audio` con la voz asignada a la cuenta (`accounts.voice_id`),
y `virality_predictor` como filtro antes de encolar — descartar aquí cuesta
menos que quemar cupo de publicación.

Cada cuenta tiene su propia voz del banco `voices`, para que los nichos no
suenen iguales.

## 4. Publisher — publicación

**Cadencia:** cada 15 minutos.
**Entrada:** `publications` con `status='queued'` y `scheduled_for <= now()`.

Secuencia obligatoria por cada publicación:

1. `validateForMonetization(video, platform)` — descartar piezas que no van a pagar.
2. `canPublish(db, account)` — compuerta de cupo local.
3. En Meta, `fetchMetaLiveQuota()` — el endpoint manda sobre la constante local.
4. Publicar vía el cliente de la plataforma.
5. `recordUsage()` **solo** si la publicación se confirmó.

Al topar cupo: marcar `skipped_quota` y reprogramar al día siguiente. Nunca
reintentar en bucle contra un límite diario.

## 5. Analyst — medición y aprendizaje

**Cadencia:** diaria.
**Salida:** filas en `metrics`.

Recoge vistas cualificadas, retención, ingreso y **desglose geográfico**
(`geo_breakdown`). El RPM efectivo por geografía es la métrica que gobierna
las decisiones de contenido: si el 80% de las vistas viene de mercados de
CPM bajo, el problema no es el volumen, es el targeting.

Realimenta al Scout con los hooks de mayor `retention_3s` y los temas de
mayor `rpm_usd` real.
