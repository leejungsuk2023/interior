-- 포트폴리오 갤러리용 이미지 URL 배열 (대표 이미지는 기존 image_url 유지)
alter table public.portfolios
  add column if not exists image_urls jsonb default '[]'::jsonb;

comment on column public.portfolios.image_urls is '갤러리용 이미지 URL 배열. 비어 있으면 image_url만 사용';
