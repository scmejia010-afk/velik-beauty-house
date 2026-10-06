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
