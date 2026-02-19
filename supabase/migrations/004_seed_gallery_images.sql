-- 기존 포트폴리오에 갤러리 이미지 추가 (image_urls 채우기)
update public.portfolios
set image_urls = jsonb_build_array(
  image_url,
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
)
where image_urls is null or image_urls = '[]'::jsonb;
