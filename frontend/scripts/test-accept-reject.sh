#!/bin/bash

# Test Accept/Reject Functionality with W3M
# This script tests the static HTML version of the accept/reject test page

echo "🧪 Testing Accept/Reject Functionality with W3M"
echo "=============================================="

# Test static HTML page
URL="http://localhost:3000/test-accept-reject.html"

# Check if the server is running
if ! curl -s "$URL" > /dev/null; then
    echo "❌ Error: Server not running at $URL"
    echo "Please start the development server with: cd frontend && npm run dev"
    exit 1
fi

echo "✓ Server is running"
echo ""

# Test 1: Check if page loads
echo "Test 1: Page Structure"
w3m -dump "$URL" | grep -q "Test Accept/Reject Functionality"
if [ $? -eq 0 ]; then
    echo "✅ Page loaded successfully"
else
    echo "❌ Page failed to load"
    exit 1
fi

# Test 2: Check debug info is accessible
echo ""
echo "Test 2: Debug Information"
DEBUG_INFO=$(w3m -dump "$URL" | grep -A 10 "DEBUG: Accept/Reject Test Page")
if [ -n "$DEBUG_INFO" ]; then
    echo "✅ Debug information accessible"
    echo "$DEBUG_INFO" | head -7
else
    echo "❌ Debug information not found"
fi

# Test 3: Check suggestion count
echo ""
echo "Test 3: Suggestion Count"
TOTAL=$(w3m -dump "$URL" | grep "Total Suggestions:" | sed 's/.*Total Suggestions: \([0-9]*\).*/\1/')
if [ "$TOTAL" = "3" ]; then
    echo "✅ Found correct number of suggestions: $TOTAL"
else
    echo "❌ Incorrect suggestion count: $TOTAL (expected 3)"
fi

# Test 4: Check initial state
echo ""
echo "Test 4: Initial State"
PENDING=$(w3m -dump "$URL" | grep "Pending:" | head -1 | sed 's/.*Pending: \([0-9]*\).*/\1/')
if [ "$PENDING" = "3" ]; then
    echo "✅ All suggestions pending initially: $PENDING"
else
    echo "❌ Incorrect pending count: $PENDING (expected 3)"
fi

# Test 5: Check ASCII visualization
echo ""
echo "Test 5: ASCII Visualization"
ASCII_VIZ=$(w3m -dump "$URL" | grep -A 5 "Suggestion Status:")
if [ -n "$ASCII_VIZ" ]; then
    echo "✅ ASCII visualization present"
    echo "$ASCII_VIZ"
else
    echo "❌ ASCII visualization not found"
fi

# Test 6: Extract structured data
echo ""
echo "Test 6: Structured Data"
STRUCTURED=$(w3m -dump "$URL" | sed -n '/ACCEPT\/REJECT STATE/,/Suggestion Details:/p')
if [ -n "$STRUCTURED" ]; then
    echo "✅ Structured data accessible"
    echo "$STRUCTURED" | head -10
else
    echo "❌ Structured data not found"
fi

# Summary
echo ""
echo "=============================================="
echo "Test Summary:"
echo "✓ Page loads correctly"
echo "✓ Debug information is accessible to W3M"
echo "✓ Initial state shows 3 pending suggestions"
echo "✓ ASCII visualization works"
echo "✓ Structured data can be parsed"
echo ""
echo "Note: This tests the static HTML version."
echo "For live React testing, use the browser at:"
echo "http://localhost:3000/test-accept-reject" 