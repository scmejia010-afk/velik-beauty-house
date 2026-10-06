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
