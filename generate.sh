#!/bin/bash

# PerformancePulse - Content Generation Script
# This script generates posts and collections from CSV data

echo "🎭 PerformancePulse Content Generator"
echo "======================================"
echo ""

# Load API key from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not found!"
    echo ""
    echo "Please create a .env file with your API key:"
    echo "  cp .env.example .env"
    echo "  # Then edit .env and add your real API key"
    echo ""
    exit 1
fi

echo "✓ API key found"
echo ""

# Step 1: Clear existing posts and collections
echo "🗑️  Step 1: Clearing old content..."
echo "--------------------------------------------"
rm -f posts/*.md
rm -f collections/*.md
echo "✓ Old posts and collections removed"
echo ""

# Step 2: Generate posts and collections
echo "📝 Step 2: Generating posts and collections..."
echo "--------------------------------------------"
python3 generate_posts_with_collections.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error: Failed to generate posts"
    exit 1
fi

echo ""
echo "✅ Posts and collections generated!"
echo ""

# Step 3: Update file list
echo "📋 Step 3: Updating file list..."
echo "--------------------------------------------"
npm run generate

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error: Failed to update file list"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ All done! Your website is ready."
echo "======================================"
echo ""
echo "To view your website:"
echo "  python3 -m http.server 8080"
echo ""
echo "Then open: http://localhost:8080"
echo ""
