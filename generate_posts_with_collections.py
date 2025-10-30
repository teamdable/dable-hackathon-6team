#!/usr/bin/env python3
"""
Script to generate markdown post files from CSV data with AI-generated reviews
and create collection pages grouping posts by category_number
"""

import csv
import os
import time
from datetime import datetime
from openai import OpenAI
from collections import defaultdict

def sanitize_filename(text):
    """Create a safe filename from text"""
    safe_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789가-힣ㄱ-ㅎㅏ-ㅣ -"
    filename = ''.join(c for c in text if c in safe_chars)
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
        actor_list = actors.split(", ")[:5]
        actor_info = f"\n출연진: {', '.join(actor_list)}"

    prompt = f"""당신은 공연을 즐겨보고 블로그에 후기를 올리는 일반인입니다. 개인 블로그에 올릴 자연스러운 포스팅을 작성해주세요.

공연 정보:
- 제목: {title}
- 카테고리: {category}
- 장소: {venue_text}
- 공연 기간: {period}{actor_info}

블로그 포스팅 가이드라인:
1. 반말 사용 (예: "~했어요", "~같아요", "~더라고요")
2. 개인적인 경험이나 느낌을 담아서 작성
3. "오늘", "이번주", "요즘" 같은 시간 표현으로 자연스럽게 시작
4. "진짜", "완전", "너무", "좀" 같은 일상 표현 적극 활용
5. 블로그 특유의 친근하고 편안한 말투
6. 3-4개 문단 (각 문단 2-3문장)
7. 개인적인 추천이나 팁 한마디로 마무리

블로그 글처럼 자연스럽게 작성하되, 제목(#)이나 인사말은 빼고 본문만 작성해주세요."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 공연을 좋아하는 20-30대 블로거입니다. 개인 블로그에 공연 후기를 올리듯이 편하고 자연스럽게 글을 씁니다. 일기를 쓰듯 개인적인 경험과 솔직한 느낌을 담아서 작성합니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.95,
            max_tokens=700
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"  ⚠️  API 호출 오류: {e}")
        return f"{title}은(는) {venue_text}에서 만나볼 수 있는 {category} 공연입니다.\n\n공연 기간 동안 많은 관객들의 사랑을 받고 있으며, {category}의 진수를 느낄 수 있는 작품입니다."

def generate_collection_summary(client, category_name, posts):
    """Generate AI summary for a collection"""
    posts_info = "\n".join([f"- {p['title']} ({p['category']}, {p['venue']})" for p in posts[:10]])

    prompt = f"""당신은 공연 예술 전문 큐레이터입니다.
다음 컬렉션에 대한 자연스럽고 매력적인 소개글을 작성해주세요.

컬렉션 주제: {category_name}
포함된 공연들:
{posts_info}

작성 가이드라인:
1. 컬렉션의 전체적인 특징과 매력을 소개
2. 어떤 관객들에게 추천하는지 설명
3. 이 컬렉션을 통해 얻을 수 있는 경험 강조
4. 친근하고 열정적인 톤으로 작성
5. 2-3개 문단으로 구성 (각 문단 2-4문장)

마크다운 형식으로 작성하되, 제목(#)은 사용하지 말고 본문만 작성해주세요."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 공연 예술을 깊이 이해하고 사랑하는 큐레이터입니다. 관객들에게 공연 컬렉션의 매력을 전달합니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=600
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"  ⚠️  API 호출 오류: {e}")
        return f"이 컬렉션은 {category_name}를 주제로 선별된 {len(posts)}개의 공연을 소개합니다."

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

    venue_text = f"{region} {venue}" if region else venue
    excerpt = f"{venue_text}에서 열리는 {title}"

    tags = []
    if category:
        tags.append(category)
    if region:
        tags.append(region)
    sub_category = row['ent_sub_cate_nm']
    if sub_category:
        tags.append(sub_category)

    tags_yaml = "[" + ", ".join(f'"{tag}"' for tag in tags[:5]) + "]"

    ai_review = generate_review_with_ai(client, title, category, venue, region, actors, period)

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

def generate_collection_content(client, category_number, category_name, posts):
    """Generate markdown content for a collection page"""

    # Generate AI summary
    ai_summary = generate_collection_summary(client, category_name, posts)

    # Create date for collection (use today's date)
    today = datetime.now().strftime('%Y-%m-%d')

    # Create excerpt
    excerpt = f"{len(posts)}개의 선별된 공연을 만나보세요"

    # Use category number image (1.png, 2.png, etc.)
    image = f"images/{category_number}.png"

    # Generate content
    content = f"""---
title: "{category_name}"
date: {today}
type: "collection"
image: "{image}"
excerpt: "{excerpt}"
related_posts: [{", ".join(f'"{p["id"]}"' for p in posts)}]
---

{ai_summary}

## 포함된 공연 ({len(posts)}개)

"""

    for post in posts:
        content += f"""### [{post['title']}](post.html?id={post['id']})

{post['excerpt']}

- **카테고리**: {post['category']}
- **예매하기**: [티켓 예매 바로가기]({post['booking_link']})

---

"""

    return content

def main():
    csv_file = 'ryeol_final.csv'
    posts_dir = 'posts'
    collections_dir = 'collections'

    # Initialize OpenAI client
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("⚠️  Warning: OPENAI_API_KEY not found in environment variables.")
        print("Please set it with: export OPENAI_API_KEY='your-api-key'")
        return

    client = OpenAI(api_key=api_key)
    print("🤖 OpenAI client initialized\n")

    # Create directories
    os.makedirs(posts_dir, exist_ok=True)
    os.makedirs(collections_dir, exist_ok=True)

    # Data structures
    all_posts = []
    categories = defaultdict(list)
    post_count = 0

    # Read CSV and generate posts
    print("=" * 50)
    print("📝 STEP 1: Generating Individual Posts")
    print("=" * 50 + "\n")

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for i, row in enumerate(reader, 1):
            try:
                if not row.get('ent_prod_nm'):
                    continue

                print(f"[{i}] Generating post for: {row['ent_prod_nm']}")

                # Generate filename and post ID
                date = parse_date(row['start_dt'])
                title_slug = sanitize_filename(row['ent_prod_nm'])
                filename = f"{date}-{title_slug}.md"
                post_id = filename.replace('.md', '')
                filepath = os.path.join(posts_dir, filename)

                # Generate and write post content
                content = generate_post_content(client, row)

                with open(filepath, 'w', encoding='utf-8') as post_file:
                    post_file.write(content)

                # Store post info
                post_info = {
                    'id': post_id,
                    'title': row['ent_prod_nm'],
                    'category': row['ent_cate_nm'] or '공연',
                    'venue': row['place_nm'] or '미정',
                    'period': format_period(row['start_dt'], row['end_dt']),
                    'image': row['img_value'],
                    'excerpt': f"{row['region_nm']} {row['place_nm']}에서 열리는 {row['ent_prod_nm']}" if row['region_nm'] else f"{row['place_nm']}에서 열리는 {row['ent_prod_nm']}",
                    'booking_link': row['pdp_link']
                }
                all_posts.append(post_info)

                # Add to category
                category_number = row.get('category_number', '')
                if category_number:
                    categories[category_number].append(post_info)

                post_count += 1
                print(f"  ✓ Created: {filename}\n")

                time.sleep(1)

            except Exception as e:
                print(f"  ✗ Error processing row {i}: {e}\n")
                continue

    # Generate collection pages
    print("\n" + "=" * 50)
    print("📚 STEP 2: Generating Collection Pages")
    print("=" * 50 + "\n")

    collection_count = 0
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        category_names = {}
        for row in reader:
            cat_num = row.get('category_number', '')
            cat_name = row.get('category_name', '')
            if cat_num and cat_name and cat_num not in category_names:
                category_names[cat_num] = cat_name

    for category_number, posts in categories.items():
        if not posts:
            continue

        category_name = category_names.get(category_number, f'카테고리 {category_number}')

        print(f"[Collection {category_number}] {category_name}")
        print(f"  Posts: {len(posts)}")

        # Generate collection filename (use category number to avoid collisions)
        collection_date = datetime.now().strftime('%Y-%m-%d')
        collection_slug = sanitize_filename(category_name)
        # If slug is empty or too short, use category number
        if len(collection_slug) < 3:
            collection_slug = f"collection-{category_number}"
        collection_filename = f"{collection_date}-collection-{category_number}-{collection_slug}.md"
        collection_filepath = os.path.join(collections_dir, collection_filename)

        # Generate and write collection content
        collection_content = generate_collection_content(client, category_number, category_name, posts)

        with open(collection_filepath, 'w', encoding='utf-8') as coll_file:
            coll_file.write(collection_content)

        collection_count += 1
        print(f"  ✓ Created: {collection_filename}\n")

        time.sleep(1)

    print("=" * 50)
    print(f"✅ {post_count} posts created successfully!")
    print(f"✅ {collection_count} collections created successfully!")
    print(f"📁 Posts saved in: {posts_dir}/")
    print(f"📁 Collections saved in: {collections_dir}/")
    print("=" * 50)

if __name__ == '__main__':
    main()
