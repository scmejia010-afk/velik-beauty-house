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
