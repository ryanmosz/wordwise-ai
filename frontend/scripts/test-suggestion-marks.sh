#!/bin/bash

# Test script for verifying suggestion marks are working correctly

echo "🔍 Testing Suggestion Marks with w3m..."
echo "=================================="

# Test URL
URL="http://localhost:3000/test-marks?debug=true"

echo "📍 Testing Test 6 (Programmatic Application)..."
echo ""

# Fetch the page and look for suggestion marks
echo "🌐 Fetching page content..."
w3m -dump "$URL" > /tmp/test-marks-output.txt

# Check if the page loaded
if grep -q "Suggestion Mark Test Page" /tmp/test-marks-output.txt; then
    echo "✅ Page loaded successfully"
else
    echo "❌ Failed to load page"
    exit 1
fi

# Check for debug info
echo ""
echo "📊 Debug Info:"
grep "DEBUG:" /tmp/test-marks-output.txt | head -5

# Check for CSS loading indicator
echo ""
echo "🎨 CSS Status:"
if grep -q "CSS v4 - Hover Fix" /tmp/test-marks-output.txt; then
    echo "✅ CSS is loaded (v4 Hover Fix active)"
else
    echo "⚠️  CSS loading indicator not found"
fi

# Look for test controls
echo ""
echo "🔧 Test Controls:"
if grep -q "Test 6: Programmatic Application" /tmp/test-marks-output.txt; then
    echo "✅ Test 6 button found"
else
    echo "❌ Test 6 button not found"
fi

# Check for color reference
echo ""
echo "🎨 Color Reference:"
if grep -q "Headline (Green): #22c55e" /tmp/test-marks-output.txt; then
    echo "✅ Headline color reference found (#22c55e)"
else
    echo "❌ Headline color reference not found"
fi

echo ""
echo "=================================="
echo "📋 Summary: Basic page structure verified"
echo ""
echo "Note: To fully test the issue, you need to:"
echo "1. Open http://localhost:3000/test-marks in a browser"
echo "2. Click 'Test 6: Programmatic Application'"
echo "3. Check if 'Make this headline compelling!' has:"
echo "   - ✅ Green underline (#22c55e)"
echo "   - ✅ No gray-blue background on initial load"
echo "   - ✅ Light green background only on hover" 