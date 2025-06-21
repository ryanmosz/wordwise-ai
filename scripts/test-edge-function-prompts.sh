#!/bin/bash

# Test the deployed edge function with various prompts

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the project URL and anon key
PROJECT_URL="https://gcvqhujqaofvelcxczfm.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdnFodWpxYW9mdmVsY3hjemZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDczMDgsImV4cCI6MjA2NTc4MzMwOH0.Ys7vjcz8nrz2yGB-NrenxCvZKnHMtjXFEOzR-sCdSjc"

echo "Testing Edge Function: analyze-text"
echo "===================================="

# Test 1: Grammar errors
echo -e "\n${GREEN}Test 1: Grammar errors${NC}"
curl -s -X POST "${PROJECT_URL}/functions/v1/analyze-text" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "text": "Their are many mistake in this sentences.",
    "documentId": "test-1",
    "userSettings": {
      "brandTone": "professional",
      "readingLevel": 10,
      "bannedWords": []
    }
  }' | jq .

# Test 2: Reading level
echo -e "\n${GREEN}Test 2: Complex sentence for grade 8 reading level${NC}"
curl -s -X POST "${PROJECT_URL}/functions/v1/analyze-text" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "text": "The implementation of sophisticated methodologies necessitates comprehensive evaluation.",
    "documentId": "test-2",
    "userSettings": {
      "brandTone": "friendly",
      "readingLevel": 8,
      "bannedWords": []
    }
  }' | jq .

# Test 3: Brand tone
echo -e "\n${GREEN}Test 3: Casual tone for professional brand${NC}"
curl -s -X POST "${PROJECT_URL}/functions/v1/analyze-text" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "text": "Hey guys, wanna check out our cool new stuff?",
    "documentId": "test-3",
    "userSettings": {
      "brandTone": "professional",
      "readingLevel": 10,
      "bannedWords": []
    }
  }' | jq .

# Test 4: Banned words
echo -e "\n${GREEN}Test 4: Text with banned words${NC}"
curl -s -X POST "${PROJECT_URL}/functions/v1/analyze-text" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "text": "We guarantee amazing results with our revolutionary product.",
    "documentId": "test-4",
    "userSettings": {
      "brandTone": "honest",
      "readingLevel": 10,
      "bannedWords": ["guarantee", "amazing", "revolutionary"]
    }
  }' | jq .

# Test 5: Empty text
echo -e "\n${GREEN}Test 5: Empty text (should return error)${NC}"
curl -s -X POST "${PROJECT_URL}/functions/v1/analyze-text" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "text": "",
    "documentId": "test-5",
    "userSettings": {
      "brandTone": "professional",
      "readingLevel": 10,
      "bannedWords": []
    }
  }' | jq .

echo -e "\n${GREEN}Testing complete!${NC}" 