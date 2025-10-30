# Scripts

이 디렉토리는 블로그 관리를 위한 자동화 스크립트를 포함합니다.

## generate-files-list.js

`posts/`와 `collections/` 디렉토리를 스캔하여 `data/files.json` 파일을 자동으로 생성합니다.

### 사용법

#### 1. Node.js 설치 확인
```bash
node --version
```

#### 2. 스크립트 실행
```bash
# 방법 1: npm 스크립트 사용 (권장)
npm run generate

# 방법 2: 직접 실행
node scripts/generate-files-list.js
```

### 언제 실행하나요?

- ✅ 새로운 포스트를 `posts/` 폴더에 추가한 후
- ✅ 새로운 컬렉션을 `collections/` 폴더에 추가한 후
- ✅ 포스트나 컬렉션 파일을 삭제한 후
- ✅ GitHub에 배포하기 전

### 자동화 방법

#### Git Hook 사용 (선택사항)

`.git/hooks/pre-commit` 파일을 만들어서 커밋 전 자동 실행:

```bash
#!/bin/sh
npm run generate
git add data/files.json
```

#### GitHub Actions 사용 (선택사항)

`.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Generate files list
        run: npm run generate
      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add data/files.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Auto-generate files.json"
          git push
```

## 워크플로우

### 새 포스트 추가하기

1. `posts/2025-11-01-새공연.md` 파일 생성
2. Frontmatter 작성
   ```markdown
   ---
   title: "새 공연 제목"
   date: 2025-11-01
   category: "뮤지컬"
   image: "/images/posts/new-show.jpg"
   venue: "공연장"
   period: "2025.11.15 - 2026.01.31"
   excerpt: "짧은 설명"
   tags: ["뮤지컬", "태그1", "태그2"]
   ---
   ```
3. 본문 작성
4. **`npm run generate` 실행** ← 이것만 하면 됩니다!
5. 커밋 & 푸시

### 새 컬렉션 추가하기

1. `collections/2025-11-01-새컬렉션.md` 파일 생성
2. Frontmatter 작성
   ```markdown
   ---
   title: "새 컬렉션 제목"
   date: 2025-11-01
   type: "collection"
   image: "/images/collections/new-collection.jpg"
   excerpt: "짧은 설명"
   related_posts: ["post-id-1", "post-id-2"]
   ---
   ```
3. 본문 작성
4. **`npm run generate` 실행**
5. 커밋 & 푸시

## 장점

- ✅ 수동으로 `files.json`을 편집할 필요 없음
- ✅ 파일 추가/삭제 시 자동으로 목록 업데이트
- ✅ 오타나 실수 방지
- ✅ 파일명 기반으로 자동 정렬 (최신순)

