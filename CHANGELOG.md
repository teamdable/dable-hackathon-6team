# Changelog

## [2.0.0] - 2025-10-30

### 🎉 주요 변경사항

#### 데이터 관리 방식 개선
- ✅ **Markdown frontmatter 기반 메타데이터 관리**
  - 이전: `data/posts.json`에 모든 메타데이터 수동 관리
  - 이후: 각 Markdown 파일의 frontmatter에서 자동 추출
  - 장점: 파일별 독립적 관리, 버전 관리 용이

- ✅ **자동 파일 목록 생성 스크립트**
  - `scripts/generate-files-list.js` 추가
  - `npm run generate` 명령어로 `data/files.json` 자동 생성
  - 날짜순 자동 정렬 (최신순)

#### Featured 섹션 변경
- ✅ **Featured 섹션**: Collections 표시
- ✅ **Recommended Articles 섹션**: 개별 Posts 표시
- Collections와 Posts를 명확하게 구분하여 사용자 경험 개선

### 📦 추가된 파일
- `scripts/generate-files-list.js` - 파일 목록 자동 생성 스크립트
- `scripts/README.md` - 스크립트 사용 가이드
- `data/files.json` - 파일 목록 (자동 생성)
- `data/README.md` - 데이터 관리 가이드
- `package.json` - npm 스크립트 설정
- `CHANGELOG.md` - 변경 이력

### 🗑️ 삭제된 파일
- `data/posts.json` - frontmatter 기반 시스템으로 대체

### 🔧 수정된 파일
- `js/main.js`
  - Markdown frontmatter 파싱 기능 추가
  - Collections와 Posts 분리 로드
  - Featured 섹션에 Collections 표시
  
- `js/post.js`
  - Markdown frontmatter 파싱 기능 추가
  - Collections와 Posts 모두 지원
  
- `README.md` - 새로운 워크플로우 반영
- `QUICKSTART.md` - 사용 가이드 업데이트
- `.gitignore` - Node.js 관련 항목 추가

### 📝 마이그레이션 가이드

#### 기존 프로젝트 업데이트하기

1. **새 파일 가져오기**
   ```bash
   git pull
   ```

2. **파일 목록 생성**
   ```bash
   npm run generate
   ```

3. **동작 확인**
   - 로컬 서버 실행
   - 메인 페이지 확인 (Collections가 Featured에 표시되는지)
   - 개별 포스트 페이지 확인

#### 새 포스트 추가 방법 변경

**이전 방식:**
1. Markdown 파일 작성
2. `data/posts.json` 수동 편집 (메타데이터 추가)
3. 커밋 & 푸시

**새 방식:**
1. Markdown 파일 작성 (frontmatter 포함)
2. `npm run generate` 실행
3. 커밋 & 푸시

### 🎯 이점

1. **간편한 관리**
   - 메타데이터가 해당 Markdown 파일 안에 있어 관리 용이
   - 큰 JSON 파일 편집 불필요

2. **오류 감소**
   - 파일 목록 자동 생성으로 오타 방지
   - 파일명 기반 ID 자동 생성

3. **확장성**
   - 새 포스트 추가 시 스크립트만 실행
   - 파일 추가/삭제 자동 반영

4. **버전 관리 개선**
   - 각 포스트의 변경사항을 독립적으로 추적 가능
   - Git diff가 더 명확함

### 💡 팁

- frontmatter만 수정한 경우 `npm run generate` 불필요
- 파일이 추가/삭제/이름변경된 경우에만 실행
- GitHub Actions로 자동화 가능 (scripts/README.md 참고)

### 🐛 알려진 이슈
- 없음

### 📚 추가 문서
- `data/README.md` - 데이터 구조 설명
- `scripts/README.md` - 스크립트 사용법 및 자동화 가이드

---

## [1.0.0] - 2025-10-27

### 초기 릴리스
- 블로그 기본 구조 구현
- Markdown 기반 콘텐츠 시스템
- GitHub Pages 배포 설정

