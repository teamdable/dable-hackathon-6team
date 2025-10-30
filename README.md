# PerformancePulse 🎭

공연(뮤지컬, 연극, 콘서트 등)에 대한 소개와 추천을 제공하는 블로그 웹사이트입니다.

## 🚀 빠른 시작

**처음 시작하시나요?** → [`QUICKSTART.md`](QUICKSTART.md) 문서를 먼저 읽어보세요!

**배포 가이드가 필요하신가요?** → [`DEPLOYMENT.md`](DEPLOYMENT.md) 문서를 참조하세요!

## 프로젝트 소개

PerformancePulse는 GitHub Pages를 이용한 정적 웹사이트로, 다양한 공연 정보를 마크다운 기반으로 쉽게 관리하고 공유할 수 있습니다.

### ✨ 특징

- 🎨 **사진과 유사한 모던한 UI** - 블로그 스타일의 세련된 디자인
- 📝 **마크다운 기반** - 쉽고 빠른 콘텐츠 작성
- 🔄 **동적 로딩** - JSON 데이터 기반 자동 렌더링
- 📱 **완벽한 반응형** - 모든 기기에서 최적화된 경험
- 🚀 **GitHub Pages** - 무료 호스팅 및 자동 배포
- 🎭 **공연 특화** - 공연 정보에 최적화된 구조

## 주요 기능

- 📝 **마크다운 기반 콘텐츠 관리**: 공연 소개글을 마크다운으로 작성
- 🎨 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- 🔍 **검색 기능**: 공연 검색 가능
- 🏷️ **카테고리 분류**: 뮤지컬, 연극, 콘서트 등으로 분류
- 📱 **소셜 미디어 공유**: Facebook, Twitter 공유 기능

## 디렉토리 구조

```
/
├── index.html              # 메인 페이지
├── post.html               # 개별 공연 상세 페이지
├── css/                    # 스타일시트
│   ├── style.css          # 메인 스타일
│   └── post.css           # 포스트 상세 스타일
├── js/                     # JavaScript 파일
│   ├── main.js            # 메인 로직
│   └── post.js            # 포스트 상세 로직
├── posts/                  # 개별 공연 소개글 (마크다운)
│   └── YYYY-MM-DD-제목.md
├── collections/            # 취합 글 (마크다운)
│   └── YYYY-MM-DD-제목.md
├── images/                 # 이미지 파일
│   ├── posts/             # 공연 포스터 등
│   └── collections/       # 취합글 이미지
└── data/                   # 메타데이터
    └── posts.json         # 포스트 메타정보
```

## 새 공연 추가하기

### 1. 마크다운 파일 작성

`posts/` 폴더에 새 마크다운 파일을 생성합니다:

```markdown
---
title: "공연 제목"
date: YYYY-MM-DD
category: "뮤지컬|연극|콘서트|기타"
image: "/images/posts/파일명.jpg"
venue: "공연장"
period: "공연 기간"
excerpt: "짧은 소개 (2-3줄)"
tags: ["태그1", "태그2"]
---

# 공연 제목

여기에 공연에 대한 상세한 내용을 작성합니다...
```

### 2. 이미지 추가

공연 포스터 이미지를 `images/posts/` 폴더에 추가합니다.

### 3. posts.json 업데이트

`data/posts.json` 파일에 새 포스트 정보를 추가합니다:

```json
{
  "id": "post-xxx",
  "title": "공연 제목",
  "date": "YYYY-MM-DD",
  "category": "뮤지컬",
  "image": "/images/posts/파일명.jpg",
  "venue": "공연장",
  "period": "공연 기간",
  "excerpt": "짧은 소개",
  "tags": ["태그1", "태그2"],
  "featured": false,
  "content": "posts/YYYY-MM-DD-파일명.md"
}
```

### 4. Git에 커밋 및 푸시

```bash
git add .
git commit -m "Add new post: 공연 제목"
git push origin main
```

## 취합글 작성하기

`collections/` 폴더에 마크다운 파일을 생성하고, `data/posts.json`의 `collections` 배열에 정보를 추가합니다.

## GitHub Pages 배포

### 초기 설정

1. GitHub 저장소 생성
2. 코드를 저장소에 푸시
3. Settings > Pages로 이동
4. Source를 "Deploy from a branch" 선택
5. Branch를 "main"과 "/ (root)" 선택
6. Save 클릭

### 접속 URL

배포 후 `https://[username].github.io/[repository-name]/`에서 접속 가능합니다.

### 커스텀 도메인 (선택사항)

1. 도메인 구매 후 DNS 설정
2. `CNAME` 파일에 도메인 입력
3. GitHub Settings > Pages에서 커스텀 도메인 설정

## 로컬 개발

로컬에서 개발하려면 간단한 HTTP 서버를 실행하세요:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server

# VS Code Live Server 확장 사용
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 반응형 디자인
- **JavaScript (ES6+)**: 동적 콘텐츠 로딩
- **Marked.js**: 마크다운 파싱
- **GitHub Pages**: 호스팅

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

Made with ❤️ for performance lovers
