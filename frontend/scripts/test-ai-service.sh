#!/bin/bash

# Test AI Service Integration using W3M
# This script tests the real AI service connection to Supabase Edge Function

echo "========================================"
echo "AI Service Integration Test"
echo "========================================"
echo ""

# Test URL
URL="http://localhost:3000/test-ai-service"

echo "Testing URL: $URL"
echo ""

# Make initial request and save output
echo "1. Loading test page..."
OUTPUT=$(w3m -dump $URL 2>&1)

if [[ $? -ne 0 ]]; then
    echo "❌ Failed to load page"
    echo "$OUTPUT"
    exit 1
fi

echo "✅ Page loaded successfully"
echo ""

# Check for key UI elements
echo "2. Checking UI elements..."

if echo "$OUTPUT" | grep -q "AI Service Integration Test"; then
    echo "✅ Page title found"
else
    echo "❌ Page title not found"
fi

if echo "$OUTPUT" | grep -q "Test Text"; then
    echo "✅ Text input area found"
else
    echo "❌ Text input area not found"
fi

if echo "$OUTPUT" | grep -q "Document ID: test-doc-"; then
    echo "✅ Document ID displayed"
else
    echo "❌ Document ID not displayed"
fi

echo ""
echo "3. Status Panel Content:"
echo "------------------------"
echo "$OUTPUT" | grep -A 5 "Status" | head -n 6

echo ""
echo "4. Debug Info (if available):"
echo "-----------------------------"
echo "$OUTPUT" | grep -A 20 "Debug Info" | grep -E "(textLength|enabled|isLoading|error|suggestionsCount)" | head -n 10

echo ""
echo "5. Suggestions Section:"
echo "-----------------------"

# Check if there are suggestions
if echo "$OUTPUT" | grep -q "Suggestions ([0-9]"; then
    SUGGESTION_COUNT=$(echo "$OUTPUT" | grep -oE "Suggestions \([0-9]+\)" | grep -oE "[0-9]+")
    echo "✅ Found $SUGGESTION_COUNT suggestions"
    
    # Extract suggestion details
    echo ""
    echo "Suggestion Types Found:"
    echo "$OUTPUT" | grep -E "(grammar|tone|persuasive|vocabulary|conciseness|headline|readability|ab_test)" | grep -v "type" | sort | uniq | head -n 10
    
    echo ""
    echo "First Suggestion Details:"
    echo "$OUTPUT" | grep -A 15 "Suggestions (" | grep -E "(Original:|Suggestion:|Explanation:|Confidence:)" | head -n 8
else
    echo "⚠️  No suggestions found (may still be loading)"
fi

echo ""
echo "6. Error Status:"
echo "----------------"
if echo "$OUTPUT" | grep -q "Error: None"; then
    echo "✅ No errors detected"
elif echo "$OUTPUT" | grep -q "Error:"; then
    ERROR_MSG=$(echo "$OUTPUT" | grep -A 1 "Error:" | tail -n 1)
    echo "❌ Error found: $ERROR_MSG"
else
    echo "⚠️  Could not determine error status"
fi

echo ""
echo "7. Loading Status:"
echo "------------------"
if echo "$OUTPUT" | grep -q "Loading: Yes"; then
    echo "⚠️  Page is still loading (AI analysis in progress)"
    echo "   Wait 2-3 seconds and run test again"
elif echo "$OUTPUT" | grep -q "Loading: No"; then
    echo "✅ Loading complete"
fi

echo ""
echo "========================================"
echo "Test Summary:"
echo "========================================"

# Determine overall test result
if echo "$OUTPUT" | grep -q "Suggestions ([1-9]" && echo "$OUTPUT" | grep -q "Error: None"; then
    echo "✅ AI Service Integration: WORKING"
    echo "   - Page loads correctly"
    echo "   - AI service returns suggestions"
    echo "   - No errors detected"
    EXIT_CODE=0
elif echo "$OUTPUT" | grep -q "Loading: Yes"; then
    echo "⚠️  AI Service Integration: LOADING"
    echo "   - Page loads correctly"
    echo "   - AI analysis in progress"
    echo "   - Run test again in a few seconds"
    EXIT_CODE=2
elif echo "$OUTPUT" | grep -q "Error:"; then
    echo "❌ AI Service Integration: ERROR"
    echo "   - Page loads correctly"
    echo "   - But AI service returned an error"
    echo "   - Check error message above"
    EXIT_CODE=1
else
    echo "❓ AI Service Integration: UNKNOWN"
    echo "   - Could not determine status"
    echo "   - Check output above for details"
    EXIT_CODE=3
fi

echo ""
echo "Raw output saved to: /tmp/ai-service-test-output.txt"
echo "$OUTPUT" > /tmp/ai-service-test-output.txt

exit $EXIT_CODE 