#!/bin/bash

# Test script for suggestion integration in TextEditor

echo "===== Testing Suggestion Integration in TextEditor ====="
echo "Testing that suggestions appear with colored underlines and are clickable"

# Function to extract suggestion info from a page
extract_suggestions() {
    echo "Extracting suggestion information..."
    
    # Look for suggestion spans
    w3m -dump_source http://localhost:3000/editor | grep -E 'data-suggestion-id|suggestion-' | head -20
    
    # Count different types of suggestions
    echo ""
    echo "Suggestion types found:"
    w3m -dump_source http://localhost:3000/editor | grep -o 'suggestion-[a-z_]*' | sort | uniq -c
}

# Function to simulate viewing the editor
view_editor() {
    echo ""
    echo "Editor content:"
    w3m -dump http://localhost:3000/editor | grep -A 10 -B 5 "WordWise AI" | head -30
}

# Function to check for suggestion marks in the HTML
check_suggestion_marks() {
    echo ""
    echo "Checking for suggestion marks in the editor..."
    
    # Look for the suggestion mark elements
    local marks=$(w3m -dump_source http://localhost:3000/editor | grep -c 'data-suggestion-id')
    echo "Found $marks suggestion marks"
    
    # Check for different suggestion types
    echo ""
    echo "Suggestion types in the DOM:"
    w3m -dump_source http://localhost:3000/editor | grep -E 'class="[^"]*suggestion-[^"]*"' | sed 's/.*class="\([^"]*\)".*/\1/' | grep -o 'suggestion-[a-z_]*' | sort | uniq -c
}

# Main test flow
echo ""
echo "1. Initial page load..."
view_editor

echo ""
echo "2. Checking for suggestions after AI analysis..."
sleep 3  # Wait for AI analysis
extract_suggestions

echo ""
echo "3. Verifying suggestion marks are applied..."
check_suggestion_marks

echo ""
echo "4. Checking debug info..."
w3m -dump http://localhost:3000/editor | grep -E "DEBUG:|isAnalyzing|suggestionsCount" | head -5

echo ""
echo "===== Test Complete ====="
echo "To manually test:"
echo "1. Open http://localhost:3000/editor in a browser"
echo "2. Type text with errors (e.g., 'This are a test')"
echo "3. Wait 2 seconds for analysis"
echo "4. Look for colored underlines"
echo "5. Click on underlined text to see suggestion card" 