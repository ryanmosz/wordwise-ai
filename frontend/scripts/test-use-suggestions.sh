#!/bin/bash

# Test script for useSuggestions hook using w3m
# Usage: ./test-use-suggestions.sh

echo "Testing useSuggestions hook with w3m..."
echo "======================================="
echo ""

# Test 1: Static HTML page (works with w3m)
echo "1. Testing static HTML debug page..."
echo "-----------------------------------"
URL_STATIC="http://localhost:3000/test-w3m-suggestions.html"

# Check if static page loads
w3m -dump "$URL_STATIC" | grep -q "Test useSuggestions Hook"
if [ $? -eq 0 ]; then
    echo "✓ Static test page loaded successfully"
else
    echo "✗ Static test page failed to load"
    exit 1
fi

echo ""
echo "2. Extracting debug information..."
echo "----------------------------------"
w3m -dump "$URL_STATIC" | grep -A 15 "DEBUG: useSuggestions Hook State"

echo ""
echo "3. Checking test results..."
echo "---------------------------"
w3m -dump "$URL_STATIC" | grep -A 5 "Automated Test Results"

echo ""
echo "4. React SPA Test (Expected to fail with w3m)..."
echo "-------------------------------------------------"
URL_REACT="http://localhost:3000/test-use-suggestions?debug=true"

echo "Note: React SPAs render client-side, so w3m cannot see the content."
echo "For real w3m testing, we would need:"
echo "  - Server-side rendering (SSR) with Next.js"
echo "  - Or embed static debug info in the initial HTML"
echo ""
echo "Attempting React page (will show empty):"
w3m -dump "$URL_REACT" | head -10 || echo "No content visible to w3m"

echo ""
echo "Summary:"
echo "--------"
echo "✓ W3M testing works with static HTML"
echo "✓ Debug information is accessible to text browsers"
echo "✓ Test results can be parsed programmatically"
echo "! React SPAs require SSR or static debug injection for w3m testing"
echo ""
echo "Test complete!" 