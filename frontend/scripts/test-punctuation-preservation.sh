#!/bin/bash

# Test script to check if punctuation is preserved in suggestion marks

echo "🧪 Testing Comprehensive Edge Cases in Suggestions..."
echo "===================================================="

URL="http://localhost:3001/test-suggestion-mark"

# First, we need to simulate clicking Test 8
# Since we can't actually click, we'll check the debug output from the page

echo "📡 Fetching test page and checking for edge cases..."

# Fetch the page
OUTPUT=$(curl -s "$URL" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Error: Could not fetch page. Is the server running on port 3001?"
    exit 1
fi

echo ""
echo "📝 Instructions:"
echo "1. Open http://localhost:3001/test-suggestion-mark in your browser"
echo "2. Click 'Test 8: Multi-line Suggestions'"
echo "3. Look at the Debug Console output"
echo ""
echo "✅ Edge Cases Being Tested:"
echo "   Line 9: Only 'are' underlined (partial word)"
echo "   Line 10: 'This are' underlined (two words with space)"
echo "   Line 11: 'are grammatical errors.' (skip first word)"
echo "   Line 12: 'This are grammatical' (skip last word)"
echo "   Line 13: Full multi-line sentence underline"
echo "   Line 14: Partial multi-line underline"
echo "   Line 15: Underline spanning line break"
echo "   Line 16: Front & end underlined, middle skipped"
echo ""
echo "🎨 Updated hover colors:"
echo "   - Grammar: Light Red background"
echo "   - Tone: Light Yellow background" 
echo "   - Persuasive: Blue background"
echo "   - Readability: Cyan background (rgb(207, 250, 254))"
echo "   - Vocabulary: Light Rose background (rgb(254, 226, 226))"
echo ""
echo "📊 The Debug Console will show:"
echo "   - Success messages for each edge case"
echo "   - '🔗 Merged X split marks' if any merging occurred"
echo "   - Detailed application logs for each suggestion"

# Check if CSS v20 is loaded
if echo "$OUTPUT" | grep -q "CSS v20"; then
    echo ""
    echo "✅ CSS v20 is loaded (Comprehensive edge case support)"
else
    echo ""
    echo "⚠️  CSS might be cached - try hard refresh (Cmd+Shift+R)"
fi 