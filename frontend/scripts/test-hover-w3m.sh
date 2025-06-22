#!/bin/bash

# W3M Test Script for Hover Functionality
# This script tests if the inline suggestions hover is working correctly

echo "🧪 Testing Inline Suggestions Hover with W3M..."
echo "================================================"

URL="http://localhost:3008/test-suggestion-mark?debug=true"

# Fetch the page with w3m
echo "📡 Fetching test page..."
OUTPUT=$(w3m -dump "$URL" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Error: Could not fetch page. Is the server running on port 3008?"
    exit 1
fi

# Extract hover debug state
echo "🔍 Checking hover debug state..."

# Check Container Initialized
CONTAINER_INIT=$(echo "$OUTPUT" | grep "HOVER DEBUG: Container Initialized=" | grep -o "YES\|NO" | head -1)
echo "  Container Initialized: $CONTAINER_INIT"

# Check Hover Ready
HOVER_READY=$(echo "$OUTPUT" | grep "HOVER DEBUG: Hover Ready=" | grep -o "YES\|NO" | head -1)
echo "  Hover Ready: $HOVER_READY"

# Check Suggestion Count
SUGGESTION_COUNT=$(echo "$OUTPUT" | grep "HOVER DEBUG: Suggestion Count=" | sed 's/.*=//' | head -1)
echo "  Suggestion Count: $SUGGESTION_COUNT"

# Check Test Results
TEST_RESULT=$(echo "$OUTPUT" | grep "HOVER DEBUG: Test Results=" | grep -o "PASS\|FAIL" | head -1)
echo "  Test Results: $TEST_RESULT"

# Extract ASCII visualization
echo ""
echo "📊 Hover State Visualization:"
echo "$OUTPUT" | sed -n '/Hover State Visualization:/,/System Health:/p' | head -20

# Determine overall result
echo ""
echo "🎯 Overall Test Result:"

if [ "$TEST_RESULT" = "PASS" ] && [ "$HOVER_READY" = "YES" ]; then
    echo "✅ PASS - Hover functionality is ready!"
    echo ""
    echo "Next steps to verify hover works:"
    echo "1. Click 'Test 8: Precise Select' button"
    echo "2. Wait for suggestions to appear"
    echo "3. Hover over underlined text"
    echo "4. Background color should change on hover"
    exit 0
else
    echo "❌ FAIL - Hover functionality not ready"
    echo ""
    echo "Issues found:"
    [ "$CONTAINER_INIT" != "YES" ] && echo "  - Container not initialized"
    [ "$HOVER_READY" != "YES" ] && echo "  - ProseMirror missing hover-ready class"
    [ "$SUGGESTION_COUNT" = "0" ] && echo "  - No suggestions found"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you've clicked a test button to load suggestions"
    echo "2. Wait a few seconds for initialization"
    echo "3. Check browser console for errors"
    exit 1
fi 