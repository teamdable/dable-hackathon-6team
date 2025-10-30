#!/usr/bin/env python3
"""
Script to generate markdown post files from CSV data with AI-generated reviews
"""

import csv
import os
import time
from datetime import datetime
from openai import OpenAI

def sanitize_filename(text):
    """Create a safe filename from text"""
    # Remove special characters
    safe_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789가-힣ㄱ-ㅎㅏ-ㅣ -"
    filename = ''.join(c for c in text if c in safe_chars)
    # Replace spaces with hyphens and limit length
    filename = filename.strip().replace(' ', '-')[:50]
    return filename

def parse_date(date_str):
    """Convert date string from YYYYMMDD to YYYY-MM-DD"""
    if not date_str or len(date_str) != 8:
        return datetime.now().strftime('%Y-%m-%d')
    try:
        return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}"
    except:
        return datetime.now().strftime('%Y-%m-%d')

def format_period(start_dt, end_dt):
    """Format performance period"""
    start = parse_date(start_dt)
    end = parse_date(end_dt)
    return f"{start} ~ {end}"

def generate_review_with_ai(client, title, category, venue, region, actors, period):
    """Generate a natural review using OpenAI API"""

    venue_text = f"{region} {venue}" if region else venue
    actor_info = ""
    if actors:
        actor_list = actors.split(", ")[:5]  # First 5 actors
        actor_info = f"\n출연진: {', '.join(actor_list)}"

    prompt = f"""당신은 공연과 뮤지컬을 사랑하는 열정적인 공연 평론가입니다.
다음 공연에 대한 자연스럽고 매력적인 리뷰를 작성해주세요.

공연 정보:
- 제목: {title}
- 카테고리: {category}
- 장소: {venue_text}
- 공연 기간: {period}{actor_info}

리뷰 작성 가이드라인:
1. 공연의 매력과 특징을 자연스럽게 소개
2. 관람객의 입장에서 어떤 점이 인상적일지 설명
3. 공연 장르의 특성을 살려서 작성
4. 친근하고 열정적인 톤으로 작성
5. 2-3개 문단으로 구성 (각 문단 2-4문장)
6. 마지막에 관람 추천 한마디 추가

마크다운 형식으로 작성하되, 제목(#)은 사용하지 말고 본문만 작성해주세요."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 공연 예술을 깊이 이해하고 사랑하는 전문 평론가입니다. 관객들에게 공연의 매력을 전달하는 리뷰를 작성합니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=800
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"  ⚠️  API 호출 오류: {e}")
        # Fallback to simple description
        return f"{title}은(는) {venue_text}에서 만나볼 수 있는 {category} 공연입니다.\n\n공연 기간 동안 많은 관객들의 사랑을 받고 있으며, {category}의 진수를 느낄 수 있는 작품입니다."

def generate_post_content(client, row):
    """Generate markdown content for a post with AI-generated review"""
    title = row['ent_prod_nm']
    category = row['ent_cate_nm'] or '공연'
    venue = row['place_nm'] or '미정'
    region = row['region_nm'] or ''
    address = row['place_adr_nm'] or ''
    start_dt = row['start_dt']
    end_dt = row['end_dt']
    period = format_period(start_dt, end_dt)
    image = row['img_value']
    link = row['pdp_link']
    actors = row['actor_list']

    # Generate excerpt
    venue_text = f"{region} {venue}" if region else venue
    excerpt = f"{venue_text}에서 열리는 {title}"

    # Parse actors for tags
    tags = []
    if category:
        tags.append(category)
    if region:
        tags.append(region)
    sub_category = row['ent_sub_cate_nm']
    if sub_category:
        tags.append(sub_category)

    # Format tags for YAML
    tags_yaml = "[" + ", ".join(f'"{tag}"' for tag in tags[:5]) + "]"

    # Generate AI review
    ai_review = generate_review_with_ai(client, title, category, venue, region, actors, period)

    # Generate content
    content = f"""---
title: "{title}"
date: {parse_date(start_dt)}
category: "{category}"
image: "{image}"
venue: "{venue}"
period: "{period}"
excerpt: "{excerpt}"
tags: {tags_yaml}
---

{ai_review}

## 공연 정보

- **장소**: {venue_text}
- **주소**: {address if address else '상세 주소는 예매 사이트를 확인해주세요'}
- **공연 기간**: {period}
"""

    if actors:
        # Parse and format actors nicely
        actor_list = actors.split(", ")
        if len(actor_list) <= 10:
            actors_formatted = ", ".join(actor_list)
        else:
            actors_formatted = ", ".join(actor_list[:10]) + f" 외 {len(actor_list) - 10}명"

        content += f"""
## 출연진

{actors_formatted}
"""

    content += f"""
## 예매하기

공연 예매는 아래 링크를 통해 가능합니다.

[예매 링크 바로가기]({link})
"""

    return content

def main():
    csv_file = 'temp.csv'
    posts_dir = 'posts'

    # Initialize OpenAI client
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("⚠️  Warning: OPENAI_API_KEY not found in environment variables.")
        print("Please set it with: export OPENAI_API_KEY='your-api-key'")
        return

    client = OpenAI(api_key=api_key)
    print("🤖 OpenAI client initialized\n")

    # Create posts directory if it doesn't exist
    os.makedirs(posts_dir, exist_ok=True)

    # Read CSV and generate posts
    post_count = 0

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for i, row in enumerate(reader, 1):
            try:
                # Skip empty rows
                if not row.get('ent_prod_nm'):
                    continue

                print(f"[{i}] Generating post for: {row['ent_prod_nm']}")

                # Generate filename
                date = parse_date(row['start_dt'])
                title_slug = sanitize_filename(row['ent_prod_nm'])
                filename = f"{date}-{title_slug}.md"
                filepath = os.path.join(posts_dir, filename)

                # Generate and write content
                content = generate_post_content(client, row)

                with open(filepath, 'w', encoding='utf-8') as post_file:
                    post_file.write(content)

                post_count += 1
                print(f"  ✓ Created: {filename}\n")

                # Rate limiting - wait between API calls
                time.sleep(1)

            except Exception as e:
                print(f"  ✗ Error processing row {i}: {e}\n")
                continue

    print(f"{'='*50}")
    print(f"✅ {post_count} posts created successfully!")
    print(f"📁 Posts saved in: {posts_dir}/")

if __name__ == '__main__':
    main()
