# Post Generation Script

This script generates natural, AI-powered reviews for performances by reading data from `temp.csv`.

## Features

- Reads performance data from CSV file
- Uses OpenAI's ChatGPT API to generate natural, enthusiastic reviews
- Creates markdown post files with proper frontmatter
- Written from a musical enthusiast's perspective
- Includes performance info, cast, and booking links

## Setup

### 1. Install Dependencies

```bash
pip install openai
```

Or install from requirements.txt:

```bash
pip install -r requirements.txt
```

### 2. Set OpenAI API Key

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Then edit `.env` and add your real API key:

```bash
# Edit this file
nano .env

# Add your key:
OPENAI_API_KEY=your-actual-api-key-here
```

**Note:** The `.env` file is in `.gitignore` and will NOT be committed to Git. Your API key stays private!

### 3. Prepare CSV File

Make sure `temp.csv` exists in the project root with the following columns:
- ent_prod_nm (performance name)
- ent_cate_nm (category)
- place_nm (venue)
- region_nm (region)
- place_adr_nm (address)
- start_dt (start date YYYYMMDD)
- end_dt (end date YYYYMMDD)
- img_value (image URL)
- pdp_link (booking link)
- actor_list (cast list)

## Usage

Run the script:

```bash
python3 generate_posts.py
```

Or make it executable and run directly:

```bash
chmod +x generate_posts.py
./generate_posts.py
```

## Output

- Posts are saved in the `posts/` directory
- Each post is named with the format: `YYYY-MM-DD-title.md`
- Posts include:
  - YAML frontmatter with metadata
  - AI-generated enthusiastic review
  - Performance information
  - Cast list (formatted)
  - Booking link

## Example Output

```markdown
---
title: "대학로 대표 코믹 힐링극 〈뷰티풀라이프〉"
date: 2018-02-20
category: "연극"
image: "https://..."
venue: "JTN 아트홀 4관"
period: "2018-02-20 ~ 2025-12-31"
excerpt: "서울 JTN 아트홀 4관에서 열리는 대학로 대표 코믹 힐링극 〈뷰티풀라이프〉"
tags: ["연극", "서울", "스테디셀러 연극"]
---

[AI-generated natural review appears here...]

## 공연 정보

- **장소**: 서울 JTN 아트홀 4관
- **주소**: 서울특별시 종로구 이화장길 26
- **공연 기간**: 2018-02-20 ~ 2025-12-31

## 출연진

[Cast list...]

## 예매하기

[Booking link...]
```

## Notes

- The script uses GPT-4o-mini model for cost efficiency
- Rate limiting: 1 second delay between API calls
- API errors are handled gracefully with fallback content
- Empty rows in CSV are automatically skipped

## Cost Estimation

Using GPT-4o-mini:
- Approximate cost: $0.0001 - $0.0003 per post
- For 100 posts: ~$0.01 - $0.03

## Troubleshooting

### "OPENAI_API_KEY not found"
Make sure you've exported the API key in your current shell session.

### Import Error: No module named 'openai'
Install the OpenAI package: `pip install openai`

### API Rate Limiting
The script includes 1-second delays between requests. If you hit rate limits, increase the `time.sleep()` value in the main loop.
