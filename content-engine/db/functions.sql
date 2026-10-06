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
