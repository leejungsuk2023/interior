-- 사이트 설정 (키-값, Hero 이미지 등)
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

create policy "site_settings read" on public.site_settings for select using (true);
create policy "site_settings insert" on public.site_settings for insert with check (true);
create policy "site_settings update" on public.site_settings for update using (true);

-- 기본 Hero 이미지 URL (선택: 여기서 넣거나 앱에서 fallback)
insert into public.site_settings (key, value) values (
  'hero_image_url',
  'https://images.unsplash.com/photo-1585503081214-2d3384d1f7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21tZXJjaWFsJTIwb2ZmaWNlJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcwNzg5MjMzfDA&ixlib=rb-4.1.0&q=80&w=1080'
) on conflict (key) do nothing;
