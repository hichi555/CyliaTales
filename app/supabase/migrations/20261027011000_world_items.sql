-- Story World continuity ledger (places & props) persistence.
-- world.tsx already reads real Supabase data for characters and stories, but
-- the places/props ledger only ever wrote to window.localStorage: unlike the
-- rest of the world bible, it did not follow a creator across browsers or
-- devices. This gives it the same owner-scoped table shape already used by
-- public.characters.

create table public.world_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('place', 'prop')),
  name text not null,
  purpose text not null,
  anchor text not null,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.world_items to authenticated;
grant all on public.world_items to service_role;
alter table public.world_items enable row level security;
create policy "own world items" on public.world_items for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
