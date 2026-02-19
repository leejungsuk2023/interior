# Minimalist Landing Page Design

This is a code bundle for Minimalist Landing Page Design. The original project is available at https://www.figma.com/design/44sVvkEGZDx59PQsAKep4Z/Minimalist-Landing-Page-Design.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Supabase 연동

랜딩·포트폴리오·견적·관리자 데이터는 Supabase에 저장됩니다.

1. [Supabase](https://supabase.com)에서 프로젝트를 만든 뒤, **SQL Editor**에서 `supabase/migrations/001_initial.sql` 내용을 실행해 테이블을 생성하세요.
2. 프로젝트 설정에서 **API URL**과 **anon public** 키를 복사한 뒤, 루트에 `.env` 파일을 만들고 아래처럼 넣으세요 (`.env.example` 참고).

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. `npm run dev`로 다시 실행하면 랜딩/포트폴리오/견적 제출/관리자 목록이 Supabase와 연동됩니다.

데이터가 없으면 랜딩·포트폴리오는 빈 목록으로 보이고, 리뷰는 기본 3건이 표시됩니다. 관리자에서 포트폴리오를 추가하거나, 견적 페이지에서 견적을 제출하면 DB에 저장됩니다.

### 관리자 로그인 (아이디/비밀번호)

`/admin` 접속 시 아이디·비밀번호 입력 화면이 나옵니다. `.env`에 다음을 넣고, 해당 값으로 로그인하세요.

- `VITE_ADMIN_ID`: 관리자 아이디
- `VITE_ADMIN_PASSWORD`: 관리자 비밀번호

예: `VITE_ADMIN_ID=admin`, `VITE_ADMIN_PASSWORD=원하는비밀번호`  
로그인 상태는 브라우저 탭을 닫기 전까지 유지되고, **로그아웃** 버튼으로 해제할 수 있습니다.
