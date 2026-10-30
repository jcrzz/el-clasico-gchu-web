-- ---------------------------------------------------------------------------
-- EL CLÁSICO — esquema de Supabase
-- Ejecutá este archivo completo en Supabase → SQL Editor.
-- El panel usa la service role key (bypassa RLS); el sitio público usa la
-- anon key y sólo necesita permisos de lectura.
-- ---------------------------------------------------------------------------

create extension if not exists pgcrypto;

-- Shows ---------------------------------------------------------------------
create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time time,
  city text not null,
  country text not null default 'AR' check (country in ('AR', 'UY')),
  venue text not null,
  ticket_url text not null default '',
  status text not null default 'available'
    check (status in ('available', 'sold-out', 'paused')),
  notes text,
  free_entry boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.shows
  add column if not exists free_entry boolean not null default false;

create index if not exists shows_date_idx on public.shows (date);

-- Galería -------------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  src text,
  alt text not null,
  caption text not null,
  scene text not null default 'band'
    check (scene in ('guitar', 'band', 'drummer', 'vocalist')),
  span text not null default 'small'
    check (span in ('tall', 'wide', 'small')),
  position integer not null default 0,
  mono boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_position_idx
  on public.gallery_images (position);

-- EPK -----------------------------------------------------------------------
create table if not exists public.epk_content (
  id text primary key default 'main',
  bio text[] not null default '{}',
  bio_short text not null default '',
  facts jsonb not null default '[]'::jsonb,
  rider jsonb not null default '[]'::jsonb,
  stage_plot_url text,
  downloads jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Fila única. Los textos/archivos vacíos caen al mock del sitio.
insert into public.epk_content (id)
values ('main')
on conflict (id) do nothing;

-- Aportes / recaudación ------------------------------------------------------
create table if not exists public.support_content (
  id text primary key default 'main',
  alias text not null default '',
  cvu text not null default '',
  account_holder text not null default '',
  qr_image_url text,
  free_amount_link text not null default '',
  tiers jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Fila única. Los campos vacíos caen al mock del sitio.
insert into public.support_content (id)
values ('main')
on conflict (id) do nothing;

-- RLS: lectura pública, escritura sólo con service role ----------------------
alter table public.shows enable row level security;
alter table public.gallery_images enable row level security;
alter table public.epk_content enable row level security;
alter table public.support_content enable row level security;

drop policy if exists "public read shows" on public.shows;
create policy "public read shows"
  on public.shows for select
  to anon, authenticated
  using (true);

drop policy if exists "public read gallery" on public.gallery_images;
create policy "public read gallery"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

drop policy if exists "public read epk" on public.epk_content;
create policy "public read epk"
  on public.epk_content for select
  to anon, authenticated
  using (true);

drop policy if exists "public read support" on public.support_content;
create policy "public read support"
  on public.support_content for select
  to anon, authenticated
  using (true);

-- Storage -------------------------------------------------------------------
-- Buckets públicos para las fotos y los descargables del press kit.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'gallery',
    'gallery',
    true,
    12582912,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'press',
    'press',
    true,
    26214400,
    array[
      'application/pdf',
      'application/zip',
      'application/x-zip',
      'application/x-zip-compressed',
      'application/octet-stream'
    ]
  ),
  (
    'support',
    'support',
    true,
    4194304,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública de los objetos (las URLs públicas ya son accesibles, pero
-- estas políticas mantienen consistente el acceso vía API de Storage).
drop policy if exists "public read gallery objects" on storage.objects;
create policy "public read gallery objects"
  on storage.objects for select
  to public
  using (bucket_id = 'gallery');

drop policy if exists "public read press objects" on storage.objects;
create policy "public read press objects"
  on storage.objects for select
  to public
  using (bucket_id = 'press');

drop policy if exists "public read support objects" on storage.objects;
create policy "public read support objects"
  on storage.objects for select
  to public
  using (bucket_id = 'support');

-- ---------------------------------------------------------------------------
-- Después de ejecutar:
-- 1. Authentication → Users → Add user: creá el usuario del panel.
-- 2. Copiá la URL y las claves del proyecto a .env.local / Vercel.
-- 3. Agregá ese email a ADMIN_EMAILS.
-- 4. (Producción) Desactivá "Allow new users to sign up" en Auth si el panel
--    no necesita registro público.
-- ---------------------------------------------------------------------------
