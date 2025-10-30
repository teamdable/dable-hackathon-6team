# 이미지 가이드

## 이미지 규격

### 공연 포스터 (posts/)
- **권장 크기**: 1200 x 800px (3:2 비율)
- **최소 크기**: 800 x 600px
- **파일 형식**: JPG, PNG, WebP
- **파일 크기**: 500KB 이하 권장

### 취합글 이미지 (collections/)
- **권장 크기**: 1200 x 800px (3:2 비율)
- **최소 크기**: 800 x 600px
- **파일 형식**: JPG, PNG, WebP
- **파일 크기**: 500KB 이하 권장

## 이미지 최적화

이미지를 업로드하기 전에 최적화를 권장합니다:

### 온라인 도구
- [TinyPNG](https://tinypng.com/) - PNG/JPG 압축
- [Squoosh](https://squoosh.app/) - 다양한 형식 지원
- [ImageOptim](https://imageoptim.com/) - Mac 전용 앱

### 명령줄 도구
```bash
# ImageMagick 사용
convert input.jpg -resize 1200x800^ -gravity center -extent 1200x800 -quality 85 output.jpg

# WebP 변환
cwebp -q 80 input.jpg -o output.webp
```

## 플레이스홀더 이미지

실제 이미지가 없을 때는 다음 서비스를 이용할 수 있습니다:

- [Unsplash](https://unsplash.com/) - 무료 고품질 이미지
- [Pexels](https://www.pexels.com/) - 무료 스톡 이미지
- [Placeholder.com](https://placeholder.com/) - 임시 플레이스홀더

## 저작권 주의사항

- 공연 포스터는 저작권이 있을 수 있으므로 주의하세요
- 공식 배포용 이미지를 사용하거나 출처를 명시하세요
- 상업적 이용 시 라이선스를 확인하세요

## 파일명 규칙

```
posts/
  ├── phantom.jpg           # 오페라의 유령
  ├── chicago.jpg           # 시카고
  └── frozen.jpg            # 겨울왕국

collections/
  ├── yearend-2025.jpg      # 연말 추천
  └── daehakro-date.jpg     # 대학로 데이트
```

- 영문 소문자 사용
- 공백 대신 하이픈(-) 사용
- 의미 있는 이름 사용

