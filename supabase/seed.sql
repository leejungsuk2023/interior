-- 시드 데이터 (001, 002 마이그레이션 실행 후 Supabase SQL Editor에서 실행)

-- 리드(견적 문의)
insert into public.leads (client_name, phone, email, message, business_type, area, budget, estimate_min, estimate_max, status) values
('김민수', '010-1234-5678', 'kim@example.com', '카페 인테리어 문의드립니다.', '카페', '35평', '5,400만원 ~ 7,020만원', 5400, 7020, '신규'),
('박지영', '010-2345-6789', 'park@example.com', '', '레스토랑', '45평', '9,000만원 ~ 1억 1,700만원', 9000, 11700, '진행중'),
('이준호', '010-3456-7890', 'lee@example.com', '오피스 리모델링', '오피스', '60평', '9,000만원 ~ 1억 1,700만원', 9000, 11700, '견적완료'),
('최서연', '010-4567-8901', 'choi@example.com', '', '리테일', '28평', '4,760만원 ~ 6,188만원', 4760, 6188, '계약완료'),
('정동혁', '010-5678-9012', 'jung@example.com', '강남 쪽 매장입니다.', '카페', '32평', '5,760만원 ~ 7,488만원', 5760, 7488, '신규')
;

-- 포트폴리오
insert into public.portfolios (name, location, area, budget, industry, style, duration, image_url) values
('모던 카페 인테리어', '서울 강남구', '30평', '5,000만원~', '카페', '모던', '3주', 'https://images.unsplash.com/photo-1676716244847-3fae1a2afb5b?w=1080'),
('프리미엄 사무실', '서울 성수동', '50평', '8,000만원~', '오피스', '미니멀', '5주', 'https://images.unsplash.com/photo-1622131815452-cc00d8d89f02?w=1080'),
('럭셔리 레스토랑', '서울 청담동', '40평', '6,000만원~', '레스토랑', '럭셔리', '4주', 'https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?w=1080'),
('브루클린 카페', '서울 강남구', '35평', '6,200만원', '카페', '모던', '3주', 'https://images.unsplash.com/photo-1676716244847-3fae1a2afb5b?w=1080'),
('스타트업 오피스', '서울 성수동', '55평', '9,500만원', '오피스', '미니멀', '5주', 'https://images.unsplash.com/photo-1622131815452-cc00d8d89f02?w=1080'),
('이탈리안 레스토랑', '서울 청담동', '45평', '7,800만원', '레스토랑', '럭셔리', '4주', 'https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?w=1080')
;

-- 리뷰 (랜딩 페이지용)
insert into public.reviews (name, business, rating, comment, image) values
('김민준', '카페 운영', 5, '3주 만에 완공되었고, 디자인이 정말 만족스럽습니다. 손님들 반응이 정말 좋아요!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'),
('박서연', '오피스 대표', 5, '예산 내에서 최고의 결과물을 만들어주셨습니다. 직원들이 너무 좋아해요.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'),
('이준호', '레스토랑 사장', 5, 'A/S까지 완벽하게 챙겨주시는 모습에 감동했습니다. 추천합니다!', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop')
;

-- site_settings (Hero 이미지 - 002에서 이미 넣었으면 생략 가능)
insert into public.site_settings (key, value) values (
  'hero_image_url',
  'https://images.unsplash.com/photo-1585503081214-2d3384d1f7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
) on conflict (key) do nothing;
