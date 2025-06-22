#!/bin/bash
# Test script for debounce behavior using W3M

set -e

echo "=== Testing Debounce Behavior with W3M ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL for the static test page
URL="http://localhost:3000/test-debounce.html"

# Function to check if server is running
check_server() {
    if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo -e "${RED}Error: Server is not running on http://localhost:3000${NC}"
        echo "Please start the server with: cd frontend && npm run dev"
        exit 1
    fi
}

# Function to extract debug info
extract_debug_info() {
    w3m -dump "$URL" | grep -A 15 "DEBUG: Debounce Test State"
}

# Function to check test results
check_test_results() {
    local output=$(w3m -dump "$URL")
    
    echo "Checking test results..."
    echo ""
    
    # Extract specific values
    local text_length=$(echo "$output" | grep "Text Length:" | head -1 | sed 's/.*Text Length: \([0-9]*\).*/\1/')
    local keystrokes=$(echo "$output" | grep "Keystrokes:" | head -1 | sed 's/.*Keystrokes: \([0-9]*\).*/\1/')
    local completed=$(echo "$output" | grep "Completed:" | head -1 | sed 's/.*Completed: \([0-9]*\).*/\1/')
    local cancelled=$(echo "$output" | grep "Cancelled:" | head -1 | sed 's/.*Cancelled: \([0-9]*\).*/\1/')
    
    # Validate debounce behavior
    if [ "$completed" = "1" ] && [ "$cancelled" = "4" ]; then
        echo -e "${GREEN}✓ Debounce behavior correct: 1 completed, 4 cancelled${NC}"
    else
        echo -e "${RED}✗ Debounce behavior incorrect: $completed completed, $cancelled cancelled${NC}"
    fi
    
    # Check efficiency
    if [ -n "$keystrokes" ] && [ -n "$completed" ]; then
        local total_requests=$((completed + cancelled))
        local efficiency=$(echo "scale=2; $completed / $total_requests * 100" | bc)
        echo -e "${GREEN}✓ Request efficiency: ${efficiency}% (only ${completed}/${total_requests} requests completed)${NC}"
    fi
    
    # Check minimum text length enforcement
    if [ "$text_length" -ge 10 ]; then
        echo -e "${GREEN}✓ Minimum text length (10 chars) enforced${NC}"
    else
        echo -e "${YELLOW}⚠ Text length is $text_length (should be >= 10 for analysis)${NC}"
    fi
}

# Function to parse JSON debug state
parse_json_state() {
    echo ""
    echo "Parsing JSON debug state..."
    
    # Extract JSON from HTML
    local json=$(w3m -dump_source "$URL" | sed -n '/<script type="application\/json"/,/<\/script>/p' | sed '1d;$d')
    
    # Use jq if available, otherwise use grep
    if command -v jq &> /dev/null; then
        echo "$json" | jq '.state.requests'
        echo ""
        echo "Performance metrics:"
        echo "$json" | jq '.performance'
    else
        echo "Install jq for better JSON parsing"
        echo "$json" | grep -E '"(total|completed|cancelled)"'
    fi
}

# Function to check individual test results
check_individual_tests() {
    echo ""
    echo "Individual test results:"
    
    local output=$(w3m -dump "$URL")
    
    # Check each test
    if echo "$output" | grep -q "✓ 2-second debounce delay: PASS"; then
        echo -e "${GREEN}✓ Debounce delay test: PASS${NC}"
    else
        echo -e "${RED}✗ Debounce delay test: FAIL${NC}"
    fi
    
    if echo "$output" | grep -q "✓ Previous requests cancelled: PASS"; then
        echo -e "${GREEN}✓ Request cancellation test: PASS${NC}"
    else
        echo -e "${RED}✗ Request cancellation test: FAIL${NC}"
    fi
    
    if echo "$output" | grep -q "✓ Min text length .* enforced: PASS"; then
        echo -e "${GREEN}✓ Min text length test: PASS${NC}"
    else
        echo -e "${RED}✗ Min text length test: FAIL${NC}"
    fi
    
    if echo "$output" | grep -q "✓ Only latest request completes: PASS"; then
        echo -e "${GREEN}✓ Single completion test: PASS${NC}"
    else
        echo -e "${RED}✗ Single completion test: FAIL${NC}"
    fi
    
    if echo "$output" | grep -q "✓ Loading state updates correctly: PASS"; then
        echo -e "${GREEN}✓ Loading state test: PASS${NC}"
    else
        echo -e "${RED}✗ Loading state test: FAIL${NC}"
    fi
}

# Main execution
echo "Testing URL: $URL"
echo ""

# Check if server is running
check_server

# Extract and display debug info
echo "Debug Information:"
echo "=================="
extract_debug_info
echo ""

# Check test results
check_test_results

# Check individual tests
check_individual_tests

# Parse JSON state
parse_json_state

echo ""
echo "=== Debounce Test Complete ==="
echo ""
echo "To test the React component interactively:"
echo "1. Visit http://localhost:3000/test-debounce"
echo "2. Type continuously and observe the request log"
echo "3. Stop typing and wait 2 seconds to see analysis trigger"
echo "" 