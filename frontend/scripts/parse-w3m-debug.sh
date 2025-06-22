#!/bin/bash

# Script to demonstrate parsing debug data from w3m output
# Usage: ./parse-w3m-debug.sh

URL="http://localhost:3000/test-w3m-suggestions.html"

echo "Parsing W3M Debug Data"
echo "====================="
echo ""

# Extract specific debug values
echo "1. Extracting Key Metrics:"
echo "--------------------------"

# Get text length
TEXT_LENGTH=$(w3m -dump "$URL" | grep "Text Length:" | head -1 | sed 's/.*Text Length: \([0-9]*\).*/\1/')
echo "   Text Length: $TEXT_LENGTH"

# Get suggestion count
SUGGESTIONS=$(w3m -dump "$URL" | grep "Total Suggestions:" | sed 's/.*Total Suggestions: \([0-9]*\).*/\1/')
echo "   Total Suggestions: $SUGGESTIONS"

# Get loading status
LOADING=$(w3m -dump "$URL" | grep "Loading:" | head -1 | sed 's/.*Loading: \([a-z]*\).*/\1/')
echo "   Loading Status: $LOADING"

# Get error status
ERROR=$(w3m -dump "$URL" | grep "Error:" | head -1 | sed 's/.*Error: \([a-z]*\).*/\1/')
echo "   Error Status: $ERROR"

echo ""
echo "2. Test Results Summary:"
echo "------------------------"

# Count passed tests
PASSED_TESTS=$(w3m -dump "$URL" | grep -c "✓")
echo "   Passed Tests: $PASSED_TESTS"

# Extract test names
echo "   Test Details:"
w3m -dump "$URL" | grep "✓" | sed 's/^/      /'

echo ""
echo "3. Automated Validation:"
echo "------------------------"

# Validate expected values
if [ "$TEXT_LENGTH" = "25" ]; then
    echo "   ✓ Text length is correct (25)"
else
    echo "   ✗ Text length mismatch (expected 25, got $TEXT_LENGTH)"
fi

if [ "$SUGGESTIONS" = "3" ]; then
    echo "   ✓ Suggestion count is correct (3)"
else
    echo "   ✗ Suggestion count mismatch"
fi

if [ "$LOADING" = "false" ]; then
    echo "   ✓ Loading state is correct (false)"
else
    echo "   ✗ Loading state mismatch"
fi

if [ "$ERROR" = "none" ]; then
    echo "   ✓ No errors detected"
else
    echo "   ✗ Error detected: $ERROR"
fi

echo ""
echo "4. Performance Metrics:"
echo "-----------------------"

# Extract JSON data (if we had jq installed, we could parse it properly)
echo "   Note: For full JSON parsing, install jq: brew install jq"
echo "   Raw JSON preview:"
w3m -dump "$URL" | grep -A 20 '"performance"' | grep -E "(debounceDelay|analysisTime)" | sed 's/^/      /'

echo ""
echo "Parse complete!" 