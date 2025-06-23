#!/bin/bash

# Test script for verifying loading states in the editor
# This script checks that loading indicators appear during AI analysis

echo "Testing Editor Loading States"
echo "============================"

# Function to check for debug info
check_debug_info() {
    local url="$1"
    echo -e "\nChecking debug info at: $url"
    
    # Get the debug info
    local debug_info=$(w3m -dump "$url" | grep -A5 "DEBUG: EditorPage")
    
    if [ -n "$debug_info" ]; then
        echo "Debug info found:"
        echo "$debug_info"
    else
        echo "No debug info found - editor might not be loaded"
    fi
}

# Test 1: Check initial state
echo -e "\nTest 1: Initial Editor State"
echo "----------------------------"
check_debug_info "http://localhost:3000/editor?debug=true"

# Test 2: Check if loading indicators are present in the DOM (even if hidden)
echo -e "\nTest 2: Check for Loading Indicator Elements"
echo "--------------------------------------------"
curl -s http://localhost:3000/ | grep -q "Analyzing..." && echo "✓ 'Analyzing...' text found in bundle" || echo "✗ 'Analyzing...' text not found"
curl -s http://localhost:3000/ | grep -q "AI analyzing..." && echo "✓ 'AI analyzing...' text found in bundle" || echo "✗ 'AI analyzing...' text not found"

# Test 3: Manual testing instructions
echo -e "\nTest 3: Manual Testing Instructions"
echo "-----------------------------------"
echo "1. Open http://localhost:3000/editor in your browser"
echo "2. Login with test credentials (test@example.com / password123)"
echo "3. Create or select a document"
echo "4. Start typing some text (at least 10 characters)"
echo "5. Stop typing and wait 2 seconds"
echo ""
echo "Expected Results:"
echo "- After 2 seconds, you should see 'Analyzing...' in the footer"
echo "- You should also see 'AI analyzing...' badge in the top-right of the editor"
echo "- Both indicators should disappear when analysis completes"
echo "- You can continue typing while the analysis is in progress"
echo ""
echo "Debug Mode:"
echo "- Add ?debug=true to the URL for additional console logging"
echo "- Check browser console for 'Analysis state:' logs"

# Test 4: Check component structure
echo -e "\nTest 4: Verify Component Structure"
echo "----------------------------------"
echo "Checking if LoadingSpinner is imported in editor bundle..."
curl -s http://localhost:3000/assets/*.js | grep -q "LoadingSpinner" && echo "✓ LoadingSpinner component found" || echo "✗ LoadingSpinner not found"

echo -e "\nChecking if useSuggestions hook is imported..."
curl -s http://localhost:3000/assets/*.js | grep -q "useSuggestions" && echo "✓ useSuggestions hook found" || echo "✗ useSuggestions not found"

echo -e "\nTest complete!" 