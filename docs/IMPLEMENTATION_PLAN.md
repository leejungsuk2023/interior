# Figma 디자인 → 실제 구현 계획

## 1. 현재 상태 요약

- **출처**: Figma Make 코드 번들 (Minimalist Landing Page Design)
- **스택**: React + Vite + React Router + Tailwind + shadcn/ui
- **페이지**: 랜딩(/) · 포트폴리오(/portfolio) · 견적(/estimate) · 관리자(/admin)
- **데이터**: 전부 하드코딩(배열/useState), 백엔드/DB 없음

---

## 2. 구현 단계 계획

### Phase 1: 데이터 계층 분리 (백엔드 선택 전)

1. **공통 타입/인터페이스 정의**
   - `Lead` (견적 문의), `Portfolio`, `Review` 등 한 곳에 정의
   - 예: `src/types/` 또는 `src/app/types/`

2. **데이터 접근 추상화**
   - `getLeads()`, `getPortfolios()`, `createLead()`, `createPortfolio()` 등 API 형태로 함수만 정의
   - 내부 구현은 나중에 Supabase/Google Sheets로 교체

3. **페이지에서 하드코딩 제거**
   - LandingPage: 포트폴리오 일부, 리뷰 → 데이터 소스에서 로드
   - PortfolioPage: 전체 목록 → 데이터 소스에서 로드
   - EstimatePage: 제출 시 → `createLead()` 호출
   - AdminPage: 리드 목록, 포트폴리오 목록/추가 → 데이터 소스 사용

이 단계까지 하면 **관리자 페이지 UI/UX는 그대로 두고**, “데이터만 어디서 오는지”만 바꿀 수 있습니다.

---

### Phase 2: 백엔드 선택 (Supabase vs Google Sheets)

| 구분 | Supabase | Google Sheets |
|------|----------|----------------|
| **역할** | 실시간 DB + Auth + Storage | 스프레드시트를 DB처럼 사용 |
| **관리자 페이지 UI** | **변경 최소** (CRUD 그대로) | **변경 최소** (CRUD 그대로) |
| **차이** | 테이블/API 그대로 사용 | 시트 구조 + API 키/권한 설계 필요 |

**결론: Google Sheet를 써도 관리자 페이지가 “이상해질” 필요는 없습니다.**

이유:
- 관리자 페이지는 “리드 목록 보기/수정”, “포트폴리오 추가/수정” 같은 **CRUD**만 하면 됨.
- Supabase면: `supabase.from('leads').select()` / `.insert()` 등.
- Google Sheets면: Google Sheets API로 같은 데이터를 읽고 쓰면 됨.
- **프론트(Admin UI)는 “데이터 계층”만 호출하므로, 그 계층이 Supabase를 쓰든 Sheets를 쓰든 화면 구성은 동일하게 유지 가능.**

다만 아래처럼 **기능/운영 측면** 차이는 있으니 선택 시 고려하면 됩니다.

---

### Phase 3-A: Supabase로 구현할 때

1. **Supabase 프로젝트 생성**
   - 테이블: `leads`, `portfolios`, (선택) `reviews`
   - RLS 정책: 관리자만 쓰기, 공개 페이지는 읽기만 등

2. **클라이언트**
   - `@supabase/supabase-js` 설치
   - `src/lib/supabase.ts` 등으로 클라이언트 생성
   - Phase 1에서 만든 데이터 계층을 Supabase 호출로 구현

3. **관리자 페이지**
   - 기존 테이블/폼 그대로 사용
   - “신규 등록”, “포트폴리오 추가” 등은 `insert`, 목록은 `select`, 상태 변경은 `update`로 연결만 하면 됨.
   - **실시간 구독**(optional): `supabase.channel()` 로 새 리드 알림 등 가능 → UI가 오히려 더 좋아질 수 있음.

4. **이미지**
   - 포트폴리오 이미지: URL 입력만 하거나, Supabase Storage에 업로드 후 URL 저장

---

### Phase 3-B: Google Sheets로 구현할 때

1. **시트 구조 설계**
   - 시트 1: `leads` (고객명, 연락처, 업종, 면적, 예산, 상태, 날짜, 메모…)
   - 시트 2: `portfolios` (이름, 위치, 면적, 예산, 업종, 스타일, 기간, 이미지URL…)
   - (선택) 시트 3: `reviews` (이름, 업종, 평점, 코멘트, 이미지URL)

2. **접근 방식 (택 1)**
   - **Google Sheets API** (공식): 서버/Cloud Function에서 API 키 또는 OAuth로 시트 읽기/쓰기.
   - **Google Apps Script Web App**: 시트에 연결된 스크립트를 “웹 앱”으로 배포해 URL로 GET/POST → 시트를 DB처럼 사용. (서버 없이 가능하지만 보안/권한 설계 필요.)

3. **프론트엔드**
   - **직접 시트 호출 불가**: 브라우저에서 API 키 노출되면 안 되므로, 반드시 **중간 백엔드(서버/Serverless)** 필요.
   - 예: Vercel/Netlify Function, Cloud Run, Express 등에서 “리드 추가”, “포트폴리오 목록” 같은 엔드포인트 제공 → 그 엔드포인트가 Google Sheets API/Apps Script를 호출.

4. **관리자 페이지가 “이상해지는” 경우 (피하면 됨)**
   - **데이터 형식 불일치**: 시트 컬럼명/순서를 바꾸면 API 응답이 바뀌어서 테이블이 깨질 수 있음 → 시트 스키마를 타입과 맞추고, API 계층에서 한 번 더 매핑하면 해결.
   - **실시간 반영**: 시트는 폴링으로 새로고침해야 함. “실시간 구독” 같은 건 없음. 관리자 페이지에서 “목록 새로고침” 버튼 또는 30초마다 자동 갱신 정도로 구현하면 됨.
   - **복잡한 쿼리**: “상태가 견적완료인 것만”, “이번 달만” 같은 건 시트에서 필터/정렬해서 읽어오면 됨. UI는 그대로 두고, 백엔드(또는 Apps Script)에서 처리.

정리하면, **Google Sheets를 써도 관리자 페이지 레이아웃/기능을 그대로 두고**, “데이터 소스만 시트”로 바꾸는 설계가 가능합니다. 다만 **중간 백엔드(또는 Web App)** 는 필수입니다.

---

### Phase 4: 공통 마무리

1. **견적 제출(EstimatePage)**
   - 폼 제출 시 `createLead()` 호출 → Supabase insert 또는 “시트에 한 행 추가” API 호출.

2. **랜딩/포트폴리오**
   - `getPortfolios()`, (선택) `getReviews()` 로 데이터 로드.
   - 로딩/에러 상태 처리 (스켈레톤, 토스트 등).

3. **관리자 인증**
   - `/admin` 은 로그인 없이 열리면 안 됨.
   - Supabase: Supabase Auth로 로그인 후 세션 확인.
   - Google Sheets만 쓸 때: 별도 로그인 (Firebase Auth, Auth0, 또는 간단한 비밀번호 페이지) 필요.

4. **환경 변수**
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 또는 백엔드 URL 등.

---

## 3. Supabase vs Google Sheets – 관리자 페이지 관점 요약

| 질문 | Supabase | Google Sheets |
|------|----------|----------------|
| 관리자 페이지 UI를 크게 바꿔야 하나? | 아니오 | 아니오 (데이터 계층만 교체) |
| 실시간 반영 | 가능 (구독) | 폴링/새로고침으로 대체 |
| 백엔드 필요 여부 | Supabase가 백엔드 역할 | 시트만 쓰려면 **서버/함수 필요** |
| 운영/편집 | 대시보드 + SQL | 스프레드시트로 비개발자도 편집 가능 |

**추천**
- **빠른 구현 + 실시간 + 인증까지 한 번에**: Supabase.
- **데이터를 스프레드시트로 관리하고 싶고, 서버(또는 Apps Script) 구성 가능**: Google Sheets.

두 경우 모두 **“데이터 계층을 한 번 추상화해 두고, 그 안만 Supabase/Sheets로 구현”** 하면 관리자 페이지는 동일하게 유지할 수 있습니다.

---

## 4. 바로 착수할 수 있는 체크리스트

- [ ] `src/types/` 에 `Lead`, `Portfolio`, `Review` 등 타입 정의
- [ ] `src/lib/data.ts` (또는 `api/`) 에 `getLeads`, `getPortfolios`, `createLead`, `createPortfolio` 등 시그니처만 정의
- [ ] LandingPage / PortfolioPage: 위 함수로 데이터 로드 (초기에는 하드코딩 반환으로 구현)
- [ ] EstimatePage: 제출 시 `createLead` 호출
- [ ] AdminPage: 목록/추가를 데이터 계층으로 교체
- [ ] 백엔드 결정 후: Supabase 클라이언트 또는 Google Sheets용 백엔드 구현
- [ ] `/admin` 접근 시 로그인 체크 추가

이 순서로 진행하면 Figma 디자인을 유지한 채 실제 데이터 연동까지 단계적으로 구현할 수 있습니다.
