# Data Directory

이 디렉토리는 블로그의 포스트와 컬렉션 파일 목록을 관리합니다.

## files.json

`files.json` 파일은 블로그에 표시될 포스트와 컬렉션의 파일 목록을 관리합니다.

### 구조

```json
{
  "posts": [
    "2025-10-28-오페라의유령.md",
    "2025-10-25-시카고.md",
    ...
  ],
  "collections": [
    "2025-10-30-연말추천공연.md",
    "2025-10-27-대학로데이트.md",
    ...
  ]
}
```

### 새 포스트 추가 방법

1. `posts/` 또는 `collections/` 디렉토리에 새 Markdown 파일 생성
2. Markdown 파일에 frontmatter 추가 (아래 예시 참고)
3. `files.json`에 새 파일명 추가

### Frontmatter 예시

#### 포스트 (posts/)

```markdown
---
title: "공연 제목"
date: 2025-10-28
category: "뮤지컬"
image: "/images/posts/image.jpg"
venue: "공연장"
period: "2025.11.01 - 2026.01.31"
excerpt: "짧은 설명"
tags: ["뮤지컬", "클래식", "로맨스"]
---

# 본문 내용...
```

#### 컬렉션 (collections/)

```markdown
---
title: "컬렉션 제목"
date: 2025-10-30
type: "collection"
image: "/images/collections/image.jpg"
excerpt: "짧은 설명"
related_posts: ["post-001", "post-002"]
---

# 본문 내용...
```

## 작동 원리

- `main.js`와 `post.js`가 `files.json`을 읽어서 파일 목록을 가져옵니다
- 각 Markdown 파일의 frontmatter에서 메타데이터를 추출합니다
- 메타데이터를 기반으로 블로그 UI를 동적으로 생성합니다
- 별도의 큰 JSON 파일을 수동으로 관리할 필요가 없습니다

## 장점

- ✅ 각 포스트의 메타데이터가 해당 Markdown 파일에 함께 관리됨
- ✅ 새 포스트 추가 시 `files.json`에 파일명만 추가하면 됨
- ✅ 메타데이터 변경 시 Markdown 파일만 수정하면 됨
- ✅ 버전 관리가 용이함

