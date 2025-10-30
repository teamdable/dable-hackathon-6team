## 1단계: 프로젝트 확인 ✅

현재 프로젝트 구조:
```
dable-hackathon-6team/
├── index.html              # 메인 페이지
├── post.html               # 공연 상세 페이지
├── css/                    # 스타일
├── js/                     # JavaScript
├── posts/                  # 공연 소개글 (마크다운)
├── collections/            # 취합글 (마크다운)
├── images/                 # 이미지
├── data/                   # 데이터
│   └── files.json          # 파일 목록 (자동 생성)
└── scripts/                # 자동화 스크립트
    └── generate-files-list.js
```

## 2단계: 로컬에서 테스트 🖥️

### 방법 1: Python 사용 (권장)

터미널을 열고 프로젝트 폴더로 이동한 후:

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

## 3단계: 이미지 추가 📸

현재 이미지가 없어서 페이지가 제대로 표시되지 않을 수 있습니다.

### 임시 이미지 생성하기

1. 브라우저에서 `images/placeholder-generator.html` 열기
2. 공연 정보 입력
3. "이미지 생성" 클릭
4. "이미지 다운로드" 클릭
5. 다운로드한 이미지를 `images/posts/` 폴더에 저장

### 필요한 이미지 목록

다음 이미지들을 생성하거나 준비하세요:

**공연 포스터** (`images/posts/`):
- `phantom.jpg` - 오페라의 유령
- `chicago.jpg` - 시카고
- `frozen.jpg` - 겨울왕국
- `hamlet.jpg` - 햄릿
- `lesmis.jpg` - 레미제라블
- `rachmaninoff.jpg` - 라흐마니노프 콘서트
- `comedy.jpg` - 웃음의 대학
- `crashlanding.jpg` - 사랑의 불시착

**취합글 이미지** (`images/collections/`):
- `yearend-2025.jpg` - 연말 추천
- `daehakro-date.jpg` - 대학로 데이트
- `family-shows.jpg` - 가족 공연

### 빠른 해결책

실제 이미지 대신 무료 이미지 사이트 활용:
- [Unsplash](https://unsplash.com/s/photos/theater)
- [Pexels](https://www.pexels.com/search/musical/)


## 다음 단계 📝

### 새 공연 추가하기

1. **마크다운 파일 작성**
   `posts/2025-11-05-새공연.md` 파일 생성:
   ```markdown
   ---
   title: "새 공연 제목"
   date: 2025-11-05
   category: "뮤지컬"
   image: "/images/posts/새공연.jpg"
   venue: "공연장"
   period: "2025.11.05 - 2025.12.31"
   excerpt: "공연 소개"
   tags: ["뮤지컬", "태그1", "태그2"]
   ---

   # 새 공연 제목

   본문 내용...
   ```

2. **이미지 추가**
   ```bash
   images/posts/새공연.jpg
   ```

3. **파일 목록 자동 생성**
   ```bash
   npm run generate
   # 또는
   node scripts/generate-files-list.js
   ```
   
   이 명령어가 자동으로 `data/files.json`을 업데이트합니다!

4. **Git에 커밋**
   ```bash
   git add .
   git commit -m "Add new post: 새 공연"
   git push
   ```

### 취합글 작성하기

1. **마크다운 파일 작성**
   `collections/2025-11-05-새컬렉션.md` 파일 생성:
   ```markdown
   ---
   title: "새 컬렉션 제목"
   date: 2025-11-05
   type: "collection"
   image: "/images/collections/새컬렉션.jpg"
   excerpt: "컬렉션 소개"
   related_posts: ["2025-10-28-오페라의유령", "2025-10-25-시카고"]
   ---

   # 새 컬렉션 제목

   본문 내용...
   ```

2. **파일 목록 생성**
   ```bash
   npm run generate
   ```

3. **Git에 커밋**
   ```bash
   git add .
   git commit -m "Add new collection: 새 컬렉션"
   git push
   ```

### 기존 파일 수정하기

1. `collections/` 폴더에 마크다운 파일 생성
2. `data/posts.json`의 `collections` 배열에 추가
3. Git에 커밋 및 푸시

## 문제 해결 🔧

### 이미지가 안 보여요
- 이미지 경로 확인: `/images/posts/파일명.jpg`
- 파일명이 `posts.json`과 일치하는지 확인
- 이미지가 Git에 커밋되었는지 확인

### 페이지가 안 열려요
- 로컬 서버가 실행 중인지 확인
- 브라우저 캐시 삭제 후 재시도
- 개발자 도구(F12)에서 콘솔 오류 확인

### GitHub Pages가 안 보여요
- Actions 탭에서 배포 상태 확인
- 몇 분 정도 기다린 후 재시도
- Settings > Pages에서 설정 확인

## 유용한 명령어 💻

```bash
# 현재 상태 확인
git status

# 변경사항 보기
git diff

# 커밋 히스토리
git log --oneline

# 원격 저장소 확인
git remote -v

# 최신 버전 가져오기
git pull
```

## 추가 자료 📚

- **상세 가이드**: `DEPLOYMENT.md` 참조
- **프로젝트 규칙**: `.cursor/rules` 참조
- **이미지 가이드**: `images/README.md` 참조

## 도움이 필요하신가요? 💬

- GitHub Issues에 질문 남기기
- README.md 문서 참조
- DEPLOYMENT.md에서 상세 가이드 확인

---

**축하합니다! 🎉**

이제 공연 블로그가 준비되었습니다. 멋진 콘텐츠를 만들어보세요!

