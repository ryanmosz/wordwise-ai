#!/bin/bash

# Enhanced W3M Test Runner for React SPAs
# Usage: ./w3m-test-runner.sh [url] [test-name]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DEFAULT_URL="http://localhost:3000/test-w3m-suggestions.html"
DEFAULT_TEST="Basic Functionality"

URL="${1:-$DEFAULT_URL}"
TEST_NAME="${2:-$DEFAULT_TEST}"

echo "======================================"
echo "W3M Enhanced Test Runner"
echo "======================================"
echo "URL: $URL"
echo "Test: $TEST_NAME"
echo ""

# Function to run a W3M test with assertions
run_w3m_test() {
    local url=$1
    local test_name=$2
    local temp_file="/tmp/w3m_output_$$.txt"
    
    echo "Running: $test_name"
    echo "-------------------"
    
    # Fetch page with debug mode
    w3m -dump "${url}?debug=true" > "$temp_file" 2>&1
    
    if [ ! -s "$temp_file" ]; then
        echo -e "${RED}✗ Failed to fetch page${NC}"
        return 1
    fi
    
    # Extract different debug sections
    local debug_info=$(sed -n '/\[DEBUG-START:STATE\]/,/\[DEBUG-END:STATE\]/p' "$temp_file" | sed '1d;$d')
    local ascii_viz=$(sed -n '/Component Status:/,/Component Health:/p' "$temp_file")
    local test_results=$(sed -n '/Automated Test Results/,/Overall Status:/p' "$temp_file")
    
    # Run assertions
    local errors=0
    
    # Check if debug sections exist
    if [ -n "$debug_info" ]; then
        echo -e "${GREEN}✓ Debug state found${NC}"
    else
        echo -e "${RED}✗ Debug state missing${NC}"
        ((errors++))
    fi
    
    if [ -n "$ascii_viz" ]; then
        echo -e "${GREEN}✓ ASCII visualization found${NC}"
    else
        echo -e "${YELLOW}⚠ ASCII visualization missing${NC}"
    fi
    
    if [ -n "$test_results" ]; then
        echo -e "${GREEN}✓ Test results found${NC}"
        
        # Count passed tests
        local passed_count=$(echo "$test_results" | grep -c "✓")
        local failed_count=$(echo "$test_results" | grep -c "✗")
        
        echo "  → Tests passed: $passed_count"
        echo "  → Tests failed: $failed_count"
        
        if [ $failed_count -gt 0 ]; then
            echo -e "${YELLOW}⚠ Some tests failed:${NC}"
            echo "$test_results" | grep "✗" | sed 's/^/    /'
            ((errors++))
        fi
    else
        echo -e "${RED}✗ Test results missing${NC}"
        ((errors++))
    fi
    
    # Check for specific values if debug info exists
    if [ -n "$debug_info" ]; then
        # Parse JSON (basic parsing without jq)
        if echo "$debug_info" | grep -q '"errors": \[\]'; then
            echo -e "${GREEN}✓ No errors detected${NC}"
        else
            echo -e "${RED}✗ Errors found in state${NC}"
            ((errors++))
        fi
        
        if echo "$debug_info" | grep -q '"hookInitialized": true'; then
            echo -e "${GREEN}✓ Hook initialized${NC}"
        else
            echo -e "${RED}✗ Hook not initialized${NC}"
            ((errors++))
        fi
    fi
    
    # Clean up
    rm -f "$temp_file"
    
    # Return status
    if [ $errors -eq 0 ]; then
        echo -e "\n${GREEN}✓ All assertions passed!${NC}"
        return 0
    else
        echo -e "\n${RED}✗ $errors assertions failed${NC}"
        return 1
    fi
}

# Function to extract and validate meta tags
check_meta_tags() {
    local url=$1
    echo -e "\nChecking Meta Tags..."
    echo "-------------------"
    
    local meta_output=$(w3m -dump_source "$url" | grep 'meta name="debug:')
    
    if [ -n "$meta_output" ]; then
        echo -e "${GREEN}✓ Debug meta tags found:${NC}"
        echo "$meta_output" | sed 's/^/  /'
    else
        echo -e "${YELLOW}⚠ No debug meta tags found${NC}"
    fi
}

# Function to parse JSON data island
parse_json_data() {
    local url=$1
    echo -e "\nParsing JSON Data Island..."
    echo "-------------------------"
    
    local json_data=$(w3m -dump "$url" | sed -n '/<script.*id="debug-state"/,/<\/script>/p' | sed '1d;$d')
    
    if [ -n "$json_data" ]; then
        echo -e "${GREEN}✓ JSON data island found${NC}"
        
        # Basic validation
        if echo "$json_data" | grep -q '"page"'; then
            echo "  → Page property exists"
        fi
        
        if echo "$json_data" | grep -q '"timestamp"'; then
            echo "  → Timestamp property exists"
        fi
    else
        echo -e "${YELLOW}⚠ No JSON data island found${NC}"
    fi
}

# Function to display ASCII visualization
show_ascii_visualization() {
    local url=$1
    echo -e "\nASCII Visualization:"
    echo "==================="
    
    w3m -dump "$url" | sed -n '/Component Status:/,/Component Health:/{p; /Component Health:/q}'
}

# Main execution
echo "Starting comprehensive W3M tests..."
echo ""

# Run the main test
run_w3m_test "$URL" "$TEST_NAME"
test_result=$?

# Additional checks
check_meta_tags "$URL"
parse_json_data "$URL"

# Show visualization if requested
if [ "${SHOW_VIZ:-false}" = "true" ]; then
    show_ascii_visualization "$URL"
fi

# Summary
echo -e "\n======================================"
echo "Test Summary"
echo "======================================"

if [ $test_result -eq 0 ]; then
    echo -e "${GREEN}✓ Primary tests PASSED${NC}"
else
    echo -e "${RED}✗ Primary tests FAILED${NC}"
fi

echo ""
echo "Tip: Use SHOW_VIZ=true $0 to see ASCII visualization"
echo "Tip: Add ?debug=true to URL for enhanced debug output"

exit $test_result 