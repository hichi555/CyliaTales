-- Account-level Settings & Preferences persistence.
-- Settings previously only wrote to window.localStorage, so reading profile,
-- accessibility, production-default and privacy choices did not follow a
-- creator across browsers or devices. This stores them on the existing
-- profiles row, reusing its current RLS policies (owner-only select/update),
-- so no new table or policy is required.

alter table public.profiles
  add column if not exists preferences jsonb not null default '{}'::jsonb;

comment on column public.profiles.preferences is
  'Settings & Preferences studio state: reading profile, comfort/access, production defaults and privacy choices. Client writes through to window.localStorage for instant reads and falls back to it offline.';
