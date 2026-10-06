-- Las URLs de las imágenes generadas, para poder revisar desde el panel.
-- Sin esto la revisión obliga a abrir Higgsfield aparte, que en el celular
-- rompe el flujo por completo.
alter table episodes
  add column if not exists images jsonb not null default '[]';

alter table videos
  add column if not exists thumbnail_url text,
  add column if not exists audio_url text;
