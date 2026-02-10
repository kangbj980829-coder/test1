# Cloudflare Pages 배포 가이드

## 1. 자동 빌드 설정 (이미 완료)

Cloudflare Pages는 Git 저장소와 연결되어 있으면 자동으로 빌드합니다.
- **Push하면 자동 배포**: `git push`만 하면 됩니다
- **빌드 명령어**: `bun run build` (Cloudflare가 자동 실행)
- **출력 디렉토리**: `.svelte-kit/cloudflare`

---

## 2. D1 데이터베이스 바인딩 설정 (필수!)

현재 데이터베이스가 연결되지 않은 이유는 **Cloudflare Pages 대시보드에서 D1 바인딩을 추가하지 않았기 때문**입니다.

### 설정 방법:

1. **Cloudflare Dashboard 접속**
   ```
   https://dash.cloudflare.com
   ```

2. **Workers & Pages** → 프로젝트 선택
   - 프로젝트 이름: `test1` (또는 배포된 프로젝트명)

3. **Settings** 탭 클릭

4. **Functions** 섹션으로 스크롤

5. **D1 database bindings** 찾기

6. **Add binding** 버튼 클릭

7. 다음 정보 입력:
   - **Variable name**: `DB` (정확히 대문자로)
   - **D1 database**: `visitbook-db` 선택

8. **Save** 클릭

9. **재배포 트리거**
   - 설정을 저장하면 자동으로 재배포되거나
   - 새로운 커밋을 push하면 새 배포에 반영됩니다

---

## 3. 확인

배포 후 사이트를 방문하여:
- 방명록 목록이 표시되는지
- 새 메시지를 작성할 수 있는지
- "Database connection failed" 오류가 사라졌는지

확인하세요!

---

## 데이터베이스 정보

- **Database ID**: `08d3170d-3975-4554-8315-4330f9c0d469`
- **Database Name**: `visitbook-db`
- **Binding Name**: `DB`
- **Schema**: `schema.sql` (이미 원격에 적용됨)

