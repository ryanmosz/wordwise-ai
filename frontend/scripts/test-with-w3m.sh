#!/bin/bash

# Test script using w3m for automated verification
# This reduces manual testing burden by checking page structure and content

echo "🧪 Starting w3m automated tests for WordWise AI"
echo "================================================"

BASE_URL="http://localhost:3001"

# Function to test a page
test_page() {
    local path=$1
    local description=$2
    echo ""
    echo "📄 Testing: $description ($path)"
    echo "-----------------------------------"
    
    # Dump the page content
    w3m -dump "$BASE_URL$path" > /tmp/w3m_test_output.txt 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ Page loaded successfully"
        
        # Check for common error indicators
        if grep -i "error" /tmp/w3m_test_output.txt > /dev/null; then
            echo "⚠️  Warning: Found 'error' text on page"
            grep -i "error" /tmp/w3m_test_output.txt | head -3
        fi
        
        # Show first 10 lines of content
        echo "📝 Page content preview:"
        head -10 /tmp/w3m_test_output.txt | sed 's/^/   /'
        
    else
        echo "❌ Failed to load page"
        cat /tmp/w3m_test_output.txt
    fi
}

# Function to check for specific elements
check_elements() {
    local path=$1
    local element=$2
    echo ""
    echo "🔍 Checking for '$element' on $path"
    
    w3m -dump "$BASE_URL$path" | grep -i "$element" > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Found: $element"
    else
        echo "❌ Not found: $element"
    fi
}

# Test the test-marks page
echo ""
echo "🎯 Testing Suggestion Marks Page"
echo "================================"

test_page "/test-marks" "Suggestion Marks Test Page"

# Check for specific elements on test-marks page
check_elements "/test-marks" "Test Suggestion Marks"
check_elements "/test-marks" "Test Results"
check_elements "/test-marks" "Suggestion Type Colors"
check_elements "/test-marks" "grammar"
check_elements "/test-marks" "tone"
check_elements "/test-marks" "persuasive"

# Check accessibility - links with numbers
echo ""
echo "♿ Accessibility Check - Link Structure"
echo "--------------------------------------"
w3m -dump -o display_link_number=1 "$BASE_URL/test-marks" > /tmp/w3m_links.txt 2>&1
echo "Links found on page:"
grep -E "^\[[0-9]+\]" /tmp/w3m_links.txt | head -10

# Test the main editor page (requires login)
echo ""
echo "📝 Testing Editor Page Structure"
echo "================================"
test_page "/editor" "Editor Page (may redirect to login)"

# Check login page
echo ""
echo "🔐 Testing Login Page"
echo "====================="
test_page "/login" "Login Page"
check_elements "/login" "WordWise AI"
check_elements "/login" "Email"
check_elements "/login" "Password"
check_elements "/login" "Test User Login"

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "Tests completed. Review output above for any issues."
echo ""
echo "Note: This is a structural test. Visual elements like colors and"
echo "hover states still need manual verification in a browser."

# Cleanup
rm -f /tmp/w3m_test_output.txt /tmp/w3m_links.txt 