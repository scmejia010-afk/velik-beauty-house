-- ============================================================
-- Content Engine · instalación completa
-- Pega todo esto en Supabase → SQL Editor → RUN. Una sola vez.
-- Es seguro repetirlo: todo usa IF NOT EXISTS / OR REPLACE.
-- ============================================================


-- ─────────── db/schema.sql ───────────
-- ============================================================
-- Content Engine · esquema base
-- Motor de producción y publicación de video multicuenta
-- ============================================================

-- Cuentas reales propias. Una fila por cuenta por plataforma.
create table if not exists accounts (
  id            uuid primary key default gen_random_uuid(),
  label         text not null,              -- nombre interno: "velik-es", "beauty-us"
  platform      text not null check (platform in ('tiktok','instagram','facebook','youtube')),
  handle        text not null,
  niche         text not null,
  language      text not null default 'es',
  target_market text not null default 'CO',  -- define el RPM esperado
  voice_id      text,                        -- voz Higgsfield de esta cuenta
  -- Credenciales: un token POR CUENTA. El rate limit de IG es por token,
  -- no por cuenta: un token compartido estrangula a las 10 cuentas.
  access_token    text,
  refresh_token   text,
  token_expires_at timestamptz,
  -- YouTube: un proyecto Google Cloud por cuenta (cuota de 10k/día es por proyecto)
  cloud_project_id text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (platform, handle)
);

-- Piezas producidas. Una fila por video, independiente de dónde se publique.
create table if not exists videos (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid references accounts(id) on delete set null,
  title         text,
  hook          text,                        -- los primeros 3 segundos: lo que decide todo
  script        text,
  duration_sec  int,                         -- >=60 para que TikTok/Facebook paguen
  format        text not null default 'long' check (format in ('long','short')),
  -- Trazabilidad Higgsfield
  hf_job_id     text,
  hf_voice_id   text,
  media_url     text,
  status        text not null default 'draft'
                check (status in ('draft','generating','ready','failed','archived')),
  trend_id      uuid,
  created_at    timestamptz not null default now()
);

-- Cada intento de publicación de un video en una cuenta.
create table if not exists publications (
  id              uuid primary key default gen_random_uuid(),
  video_id        uuid not null references videos(id) on delete cascade,
  account_id      uuid not null references accounts(id) on delete cascade,
  scheduled_for   timestamptz not null,
  published_at    timestamptz,
  platform_post_id text,
  status          text not null default 'queued'
                  check (status in ('queued','publishing','published','failed','skipped_quota')),
  attempts        int not null default 0,
  error           text,
  created_at      timestamptz not null default now(),
  unique (video_id, account_id)
);

create index if not exists publications_due_idx
  on publications (scheduled_for) where status = 'queued';

-- Consumo de cupo por cuenta y día. El Publisher consulta esto ANTES de publicar.
-- Sin esta tabla las publicaciones se pierden en silencio al topar el límite.
create table if not exists quota_usage (
  account_id   uuid not null references accounts(id) on delete cascade,
  day          date not null,
  posts_used   int not null default 0,
  api_units_used int not null default 0,     -- YouTube: 1600 por upload
  primary key (account_id, day)
);

-- Métricas reales por publicación. Aquí vive el aprendizaje del sistema.
create table if not exists metrics (
  id              uuid primary key default gen_random_uuid(),
  publication_id  uuid not null references publications(id) on delete cascade,
  captured_at     timestamptz not null default now(),
  views           bigint default 0,
  qualified_views bigint default 0,          -- las únicas que pagan
  avg_watch_sec   numeric,
  retention_3s    numeric,                   -- % que pasa del hook
  revenue_usd     numeric default 0,
  rpm_usd         numeric,                   -- revenue / (views/1000)
  -- Desglose geográfico: la variable que más mueve el ingreso.
  -- Mismas vistas desde US valen 5-10x las de CO.
  geo_breakdown   jsonb
);

create index if not exists metrics_pub_idx on metrics (publication_id, captured_at desc);

-- Banco de voces IA (una identidad sonora por cuenta/nicho).
create table if not exists voices (
  id          uuid primary key default gen_random_uuid(),
  hf_voice_id text not null unique,
  label       text not null,
  language    text not null,
  notes       text,
  created_at  timestamptz not null default now()
);

-- Tendencias detectadas por el agente Scout.
create table if not exists trends (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  niche      text not null,
  topic      text not null,
  hook_angle text,
  evidence   jsonb,
  score      numeric,
  detected_at timestamptz not null default now()
);

-- ─────────── db/functions.sql ───────────
-- Incremento atómico del cupo. Con varios agentes publicando en paralelo,
-- un read-modify-write desde la aplicación pierde conteos y revienta el límite.
create or replace function increment_quota(
  p_account_id uuid,
  p_day        date,
  p_posts      int default 1,
  p_units      int default 0
) returns void language sql as $$
  insert into quota_usage (account_id, day, posts_used, api_units_used)
  values (p_account_id, p_day, p_posts, p_units)
  on conflict (account_id, day) do update
    set posts_used     = quota_usage.posts_used + p_posts,
        api_units_used = quota_usage.api_units_used + p_units;
$$;

-- ─────────── db/002_kids.sql ───────────
-- Campos exigidos por el nicho infantil y la política de contenido inauténtico.
alter table videos
  add column if not exists made_for_kids  boolean not null default true,
  -- Divulgación obligatoria desde mayo 2025 para contenido sintético.
  -- No divulgar = desmonetización permanente.
  add column if not exists ai_generated   boolean not null default true,
  add column if not exists ai_disclosed   boolean not null default false,
  -- Revisión humana: en contenido infantil no es opcional. La política
  -- prohíbe contenido "angustiante" y eso no se detecta automáticamente.
  add column if not exists human_reviewed boolean not null default false,
  add column if not exists reviewed_by    text,
  add column if not exists reviewed_at    timestamptz,
  -- Resultado de la compuerta de autenticidad, para auditoría.
  add column if not exists authenticity   jsonb;

alter table accounts
  add column if not exists made_for_kids boolean not null default false;

-- Nada entra en la cola sin pasar revisión humana.
create or replace function assert_reviewed() returns trigger language plpgsql as $$
begin
  if not exists (
    select 1 from videos v
    where v.id = new.video_id and v.human_reviewed and v.ai_disclosed
  ) then
    raise exception 'video % no puede encolarse: requiere revisión humana y divulgación de IA', new.video_id;
  end if;
  return new;
end $$;

drop trigger if exists publications_require_review on publications;
create trigger publications_require_review
  before insert on publications
  for each row execute function assert_reviewed();

-- ─────────── db/003_series.sql ───────────
-- ============================================================
-- Series narrativas (storytelling)
-- ============================================================
-- Una serie con personajes recurrentes y arco continuo es la respuesta
-- directa a la política de contenido inauténtico: lo que YouTube persigue
-- es lo repetitivo y genérico, no una narrativa con continuidad.
-- Además sube la retención: el espectador vuelve por el siguiente episodio.

create table if not exists series (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid references accounts(id) on delete set null,
  title         text not null,
  premise       text not null,              -- de qué trata la serie
  -- La biblia de personajes. Es lo que mantiene la coherencia visual y de
  -- voz entre episodios producidos en días distintos.
  characters    jsonb not null default '[]',
  setting       text,
  art_style     text not null,              -- prompt de estilo, idéntico en todos los episodios
  target_age    text not null default '3-6',
  language      text not null default 'en',
  episode_count int not null default 0,
  status        text not null default 'active'
                check (status in ('planning','active','paused','completed')),
  created_at    timestamptz not null default now()
);

create table if not exists episodes (
  id          uuid primary key default gen_random_uuid(),
  series_id   uuid not null references series(id) on delete cascade,
  number      int not null,
  title       text not null,
  -- Qué enseña este episodio (colores, contar, compartir...). El valor
  -- educativo es lo que diferencia de "AI slop" ante la política.
  lesson      text,
  synopsis    text,
  -- Las escenas: cada una es una imagen + un tramo de narración.
  -- Producir por imágenes cuesta ~10 créditos contra ~84 del video generado.
  scenes      jsonb not null default '[]',
  video_id    uuid references videos(id) on delete set null,
  status      text not null default 'outlined'
              check (status in ('outlined','scripted','produced','published','failed')),
  created_at  timestamptz not null default now(),
  unique (series_id, number)
);

create index if not exists episodes_pending_idx
  on episodes (series_id, number) where status in ('outlined','scripted');

-- Registro de ejecución del orquestador: qué hizo, cuándo y con qué resultado.
-- Sin esto una cadena de 5 agentes es imposible de depurar.
create table if not exists orchestrator_runs (
  id          uuid primary key default gen_random_uuid(),
  series_id   uuid references series(id) on delete set null,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  stage       text,                          -- en qué etapa está o falló
  status      text not null default 'running'
              check (status in ('running','completed','failed')),
  credits_spent int not null default 0,
  report      jsonb
);

alter table videos
  add column if not exists episode_id uuid references episodes(id) on delete set null,
  -- 'images' = imágenes + narración (~10 créditos). 'video' = generado (~84).
  add column if not exists production_mode text not null default 'images'
      check (production_mode in ('images','video'));

-- ─────────── db/004_media.sql ───────────
-- Las URLs de las imágenes generadas, para poder revisar desde el panel.
-- Sin esto la revisión obliga a abrir Higgsfield aparte, que en el celular
-- rompe el flujo por completo.
alter table episodes
  add column if not exists images jsonb not null default '[]';

alter table videos
  add column if not exists thumbnail_url text,
  add column if not exists audio_url text;
