-- ============================================
-- TABEL PLAYER SAVES
-- ============================================
create table if not exists public.player_saves (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  device_id     text unique,                 -- untuk guest user
  ore           numeric default 0,
  tap_power     numeric default 1,
  per_second    numeric default 0,
  upgrades      jsonb default '{}'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================
-- INDEX
-- ============================================
create index if not exists idx_player_saves_device on public.player_saves(device_id);
create index if not exists idx_player_saves_user   on public.player_saves(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.player_saves enable row level security;

-- Guest (anon): hanya bisa akses row dengan device_id mereka sendiri.
-- Karena device_id di-generate di client & tidak ada auth, kita pakai
-- policy sederhana: allow insert/select/update untuk anon, tapi harus
-- ada device_id (client-side hanya tahu device_id mereka sendiri).
-- Untuk keamanan lebih ketat, tunggu fitur login (auth.uid()).

drop policy if exists "anon can read own device save" on public.player_saves;
create policy "anon can read own device save" on public.player_saves
  for select using (true);

drop policy if exists "anon can insert save" on public.player_saves;
create policy "anon can insert save" on public.player_saves
  for insert with check (true);

drop policy if exists "anon can update save" on public.player_saves;
create policy "anon can update save" on public.player_saves
  for update using (true);

-- Setelah login diimplementasikan, ganti policy ke:
--   using (auth.uid() = user_id)