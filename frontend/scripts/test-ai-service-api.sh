#!/bin/bash

# Test AI Service API directly using cURL
# This tests the Supabase edge function without UI dependencies

echo "========================================"
echo "AI Service API Direct Test"
echo "========================================"
echo ""

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required environment variables"
    echo "   Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set"
    exit 1
fi

# Test data
TEST_TEXT="This are a test sentence with eror. Our product is good and we offer great service."
ENDPOINT="${VITE_SUPABASE_URL}/functions/v1/analyze-text"

echo "1. Testing Edge Function Endpoint"
echo "   URL: $ENDPOINT"
echo ""

# Make API request
echo "2. Sending test request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "'"$TEST_TEXT"'",
    "documentId": "test-api-123",
    "userSettings": {
      "brandTone": "professional",
      "readingLevel": 8,
      "bannedWords": ["great"]
    }
  }')

# Extract HTTP status code (last line)
HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)
# Extract JSON response (all but last line)
JSON_RESPONSE=$(echo "$RESPONSE" | sed '$d')

echo "3. Response Status: $HTTP_STATUS"
echo ""

# Check status code
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo "❌ Request failed with status $HTTP_STATUS"
    echo "Response:"
    echo "$JSON_RESPONSE" | jq '.' 2>/dev/null || echo "$JSON_RESPONSE"
    exit 1
fi

echo "✅ Request successful"
echo ""

# Parse and validate response
echo "4. Validating Response Structure..."

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq not installed. Install with: brew install jq"
    echo "Raw response:"
    echo "$JSON_RESPONSE"
    exit 0
fi

# Validate response has suggestions array
if ! echo "$JSON_RESPONSE" | jq -e '.suggestions' > /dev/null 2>&1; then
    echo "❌ Response missing 'suggestions' field"
    echo "$JSON_RESPONSE" | jq '.'
    exit 1
fi

# Count suggestions
SUGGESTION_COUNT=$(echo "$JSON_RESPONSE" | jq '.suggestions | length')
echo "✅ Found $SUGGESTION_COUNT suggestions"
echo ""

# Analyze suggestions
echo "5. Suggestion Analysis:"
echo "------------------------"

# Extract suggestion types
echo "Suggestion Types:"
echo "$JSON_RESPONSE" | jq -r '.suggestions[].type' | sort | uniq -c

echo ""
echo "Suggestions Detail:"
echo "$JSON_RESPONSE" | jq -r '.suggestions[] | "[\(.type)] \(.originalText) → \(.suggestionText) (confidence: \(.confidence))"'

echo ""
echo "6. Validation Checks:"

# Check for expected grammar correction
if echo "$JSON_RESPONSE" | jq -e '.suggestions[] | select(.originalText == "This are")' > /dev/null 2>&1; then
    echo "✅ Grammar correction found for 'This are'"
else
    echo "⚠️  Expected grammar correction for 'This are' not found"
fi

# Check for banned word suggestion
if echo "$JSON_RESPONSE" | jq -e '.suggestions[] | select(.originalText | test("great"; "i"))' > /dev/null 2>&1; then
    echo "✅ Banned word 'great' flagged"
else
    echo "⚠️  Banned word 'great' not flagged"
fi

# Validate suggestion structure
echo ""
echo "7. Structure Validation:"
VALID_STRUCTURE=true

# Check required fields in first suggestion
if [ "$SUGGESTION_COUNT" -gt 0 ]; then
    FIRST_SUGGESTION=$(echo "$JSON_RESPONSE" | jq '.suggestions[0]')
    
    for field in "startIndex" "endIndex" "type" "originalText" "suggestionText" "explanation" "confidence"; do
        if ! echo "$FIRST_SUGGESTION" | jq -e ".$field" > /dev/null 2>&1; then
            echo "❌ Missing required field: $field"
            VALID_STRUCTURE=false
        fi
    done
    
    if [ "$VALID_STRUCTURE" = true ]; then
        echo "✅ All required fields present"
    fi
    
    # Validate indices
    START_INDEX=$(echo "$FIRST_SUGGESTION" | jq '.startIndex')
    END_INDEX=$(echo "$FIRST_SUGGESTION" | jq '.endIndex')
    
    if [ "$START_INDEX" -ge "$END_INDEX" ]; then
        echo "❌ Invalid indices: startIndex ($START_INDEX) >= endIndex ($END_INDEX)"
    else
        echo "✅ Valid indices"
    fi
    
    # Validate confidence score
    CONFIDENCE=$(echo "$FIRST_SUGGESTION" | jq '.confidence')
    if (( $(echo "$CONFIDENCE >= 0 && $CONFIDENCE <= 1" | bc -l) )); then
        echo "✅ Valid confidence score: $CONFIDENCE"
    else
        echo "❌ Invalid confidence score: $CONFIDENCE"
    fi
fi

echo ""
echo "========================================"
echo "Test Summary:"
echo "========================================"

if [ "$HTTP_STATUS" -eq 200 ] && [ "$SUGGESTION_COUNT" -gt 0 ] && [ "$VALID_STRUCTURE" = true ]; then
    echo "✅ AI Service API: FULLY FUNCTIONAL"
    echo "   - Edge function responds correctly"
    echo "   - Returns valid suggestions"
    echo "   - Structure validation passed"
    EXIT_CODE=0
else
    echo "❌ AI Service API: ISSUES DETECTED"
    echo "   - Check errors above for details"
    EXIT_CODE=1
fi

# Save full response for debugging
echo ""
echo "Full response saved to: /tmp/ai-service-api-response.json"
echo "$JSON_RESPONSE" | jq '.' > /tmp/ai-service-api-response.json 2>/dev/null || echo "$JSON_RESPONSE" > /tmp/ai-service-api-response.json

exit $EXIT_CODE 