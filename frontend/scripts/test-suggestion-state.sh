#!/bin/bash

# test-suggestion-state.sh - W3M test for suggestion state management
# This tests the Zustand store integration with the useSuggestions hook

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing Suggestion State Management..."
echo "================================"

# Start the development server if not already running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Starting development server..."
    cd ../
    npm run dev &
    SERVER_PID=$!
    sleep 5
fi

# Test URL
TEST_URL="http://localhost:3000/test-suggestion-state.html"

echo "📋 Fetching test page..."
RESPONSE=$(w3m -dump "$TEST_URL" 2>/dev/null)

# Extract debug state
DEBUG_STATE=$(echo "$RESPONSE" | sed -n '/\[DEBUG-START:STATE\]/,/\[DEBUG-END:STATE\]/p' | sed '1d;$d' | tr '\n' ' ' | sed 's/\\/\\\\/g')

# Function to check if Maps are initialized
check_maps_initialized() {
    # Check if the full response contains both keys (they might be on same line)
    if echo "$RESPONSE" | grep -q '"activeSuggestions".*{' && echo "$RESPONSE" | grep -q '"suggestionStatus".*{'; then
        echo -e "${GREEN}✓ Maps are initialized${NC}"
        return 0
    else
        echo -e "${RED}✗ Maps are not initialized${NC}"
        return 1
    fi
}

# Function to check suggestion count
check_suggestion_count() {
    # Count suggestions in the debug state
    SUGGESTION_COUNT=$(echo "$DEBUG_STATE" | grep -o '"id": "mock-' | wc -l)
    
    if [ "$SUGGESTION_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $SUGGESTION_COUNT suggestions in state${NC}"
        return 0
    else
        echo -e "${RED}✗ No suggestions found in state${NC}"
        return 1
    fi
}

# Function to check status tracking
check_status_tracking() {
    if echo "$DEBUG_STATE" | grep -q '"suggestionStatus".*"mock-.*": "pending"'; then
        echo -e "${GREEN}✓ Suggestion status tracking is working${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Status tracking needs verification${NC}"
        return 1
    fi
}

# Function to check ASCII visualization
check_ascii_viz() {
    if echo "$RESPONSE" | grep -q "Suggestion State Management"; then
        echo -e "${GREEN}✓ ASCII visualization present${NC}"
        
        # Extract visualization content
        VIZ=$(echo "$RESPONSE" | sed -n '/Maps State/,/Hook State/p')
        echo "  - Active Suggestions: $(echo "$VIZ" | grep "Active Suggestions" | head -1)"
        echo "  - Status Map: $(echo "$VIZ" | grep "Status Map" | head -1)"
        return 0
    else
        echo -e "${RED}✗ ASCII visualization not found${NC}"
        return 1
    fi
}

# Run tests
echo ""
echo "Running Tests:"
echo "--------------"

TESTS_PASSED=0
TESTS_TOTAL=4

check_maps_initialized && ((TESTS_PASSED++))
check_suggestion_count && ((TESTS_PASSED++))
check_status_tracking && ((TESTS_PASSED++))
check_ascii_viz && ((TESTS_PASSED++))

# Summary
echo ""
echo "Test Summary:"
echo "============="
echo -e "Tests passed: ${TESTS_PASSED}/${TESTS_TOTAL}"

if [ "$TESTS_PASSED" -eq "$TESTS_TOTAL" ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    EXIT_CODE=1
fi

# Show debug state if requested
if [ "$SHOW_STATE" = "true" ]; then
    echo ""
    echo "Debug State:"
    echo "============"
    echo "$DEBUG_STATE" | jq . 2>/dev/null || echo "$DEBUG_STATE"
fi

# Cleanup
if [ ! -z "$SERVER_PID" ]; then
    echo "Stopping development server..."
    kill $SERVER_PID
fi

exit $EXIT_CODE 