# GitHub Pages 배포 가이드

이 문서는 StageX 프로젝트를 GitHub Pages에 배포하는 방법을 설명합니다.

## 사전 준비

1. GitHub 계정이 있어야 합니다
2. Git이 설치되어 있어야 합니다
3. 프로젝트 파일이 준비되어 있어야 합니다

## 배포 단계

### 1. GitHub 저장소 생성

1. GitHub에 로그인합니다
2. 우측 상단의 `+` 버튼을 클릭하고 `New repository`를 선택합니다
3. 저장소 이름을 입력합니다 (예: `performance-blog`)
4. Public으로 설정합니다
5. `Create repository` 버튼을 클릭합니다

### 2. 로컬 프로젝트를 Git 저장소로 초기화

터미널에서 프로젝트 폴더로 이동한 후 다음 명령어를 실행합니다:

```bash
# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Performance blog setup"

# 기본 브랜치를 main으로 설정
git branch -M main

# 원격 저장소 추가 (YOUR_USERNAME와 YOUR_REPO를 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 원격 저장소에 푸시
git push -u origin main
```

### 3. GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동합니다
2. `Settings` 탭을 클릭합니다
3. 왼쪽 메뉴에서 `Pages`를 선택합니다
4. `Source` 섹션에서:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
5. `Save` 버튼을 클릭합니다

### 4. 배포 확인

- 몇 분 후 페이지가 배포됩니다
- 배포 URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
- 배포 상태는 `Actions` 탭에서 확인할 수 있습니다

## 이미지 추가하기

실제 공연 이미지를 추가하려면:

### 방법 1: 직접 업로드

1. `images/posts/` 폴더에 이미지 파일을 추가합니다
2. Git에 커밋하고 푸시합니다:

```bash
git add images/posts/your-image.jpg
git commit -m "Add performance image"
git push
```

### 방법 2: 플레이스홀더 생성기 사용

1. 브라우저에서 `images/placeholder-generator.html` 파일을 엽니다
2. 공연 정보를 입력하고 이미지를 생성합니다
3. 다운로드한 이미지를 `images/posts/` 폴더에 저장합니다
4. Git에 커밋하고 푸시합니다

## 새 공연 추가하기

### 1. 마크다운 파일 작성

`posts/` 폴더에 새 파일을 생성합니다:

```bash
posts/2025-11-01-새공연제목.md
```

내용:
```markdown
---
title: "새 공연 제목"
date: 2025-11-01
category: "뮤지컬"
image: "/images/posts/new-show.jpg"
venue: "공연장 이름"
period: "2025.11.01 - 2025.12.31"
excerpt: "공연에 대한 짧은 소개"
tags: ["뮤지컬", "로맨스"]
---

# 새 공연 제목

여기에 공연에 대한 상세한 내용을 작성합니다...
```

### 2. posts.json 업데이트

`data/posts.json` 파일을 열고 새 포스트 정보를 추가합니다:

```json
{
  "posts": [
    {
      "id": "post-009",
      "title": "새 공연 제목",
      "date": "2025-11-01",
      "category": "뮤지컬",
      "image": "/images/posts/new-show.jpg",
      "venue": "공연장 이름",
      "period": "2025.11.01 - 2025.12.31",
      "excerpt": "공연에 대한 짧은 소개",
      "tags": ["뮤지컬", "로맨스"],
      "featured": false,
      "content": "posts/2025-11-01-새공연제목.md"
    },
    // ... 기존 포스트들
  ]
}
```

### 3. Git에 커밋 및 푸시

```bash
git add .
git commit -m "Add new post: 새 공연 제목"
git push
```

몇 분 후 웹사이트에 새 공연이 표시됩니다.

## 취합글 작성하기

### 1. 마크다운 파일 작성

`collections/` 폴더에 새 파일을 생성합니다:

```bash
collections/2025-11-01-11월추천공연.md
```

### 2. posts.json의 collections 배열에 추가

```json
{
  "collections": [
    {
      "id": "collection-004",
      "title": "11월 추천 공연 모음",
      "date": "2025-11-01",
      "type": "collection",
      "image": "/images/collections/november-2025.jpg",
      "excerpt": "11월에 꼭 봐야 할 공연들",
      "related_posts": ["post-001", "post-002", "post-009"],
      "content": "collections/2025-11-01-11월추천공연.md"
    },
    // ... 기존 취합글들
  ]
}
```

## 커스텀 도메인 설정 (선택사항)

자신의 도메인을 사용하려면:

### 1. 도메인 DNS 설정

도메인 제공업체에서 다음 레코드를 추가합니다:

```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### 2. CNAME 파일 수정

프로젝트 루트의 `CNAME` 파일을 수정합니다:

```
www.yourdomain.com
```

### 3. GitHub Pages 설정

1. GitHub 저장소의 Settings > Pages로 이동
2. Custom domain에 도메인 입력
3. Save 클릭
4. Enforce HTTPS 체크

## 문제 해결

### 페이지가 표시되지 않는 경우

1. GitHub Actions 탭에서 배포 상태 확인
2. 브라우저 캐시 삭제 후 재시도
3. 몇 분 정도 기다린 후 다시 확인

### 이미지가 표시되지 않는 경우

1. 이미지 경로가 올바른지 확인 (`/images/posts/...`)
2. 이미지 파일이 Git에 커밋되었는지 확인
3. 파일 이름에 특수문자나 공백이 없는지 확인

### CSS/JS가 적용되지 않는 경우

1. 브라우저 개발자 도구(F12)에서 콘솔 오류 확인
2. 파일 경로가 올바른지 확인
3. 브라우저 캐시 삭제

## 유지보수

### 정기적으로 해야 할 일

1. **백업**: 정기적으로 저장소를 백업합니다
2. **이미지 최적화**: 새 이미지를 추가할 때 압축합니다
3. **콘텐츠 업데이트**: 공연 정보를 최신 상태로 유지합니다
4. **링크 확인**: 외부 링크가 유효한지 확인합니다

### Git 기본 명령어

```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "설명 메시지"

# 푸시
git push

# 최신 버전 가져오기
git pull

# 브랜치 생성
git checkout -b new-feature

# 브랜치 병합
git checkout main
git merge new-feature
```

## 추가 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Markdown 가이드](https://www.markdownguide.org/)
- [Git 기초](https://git-scm.com/book/ko/v2)

## 도움이 필요하신가요?

문제가 발생하면 GitHub 저장소의 Issues 탭에 문의해주세요.

