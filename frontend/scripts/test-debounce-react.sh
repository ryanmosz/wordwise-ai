#!/bin/bash
# Test script for React debounce component with debug mode

set -e

echo "=== Testing React Debounce Component ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs
STATIC_URL="http://localhost:3000/test-debounce.html"
REACT_URL="http://localhost:3000/test-debounce?debug=true"

# Function to check if server is running
check_server() {
    if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo -e "${RED}Error: Server is not running on http://localhost:3000${NC}"
        echo "Please start the server with: cd frontend && npm run dev"
        exit 1
    fi
}

# Function to test React component debug output
test_react_component() {
    echo "Testing React component (debug mode)..."
    echo ""
    
    # Note: W3M cannot execute JavaScript, so we can't test the actual React component
    # This would need Playwright or similar for real testing
    echo -e "${YELLOW}Note: React components require JavaScript execution.${NC}"
    echo -e "${YELLOW}W3M cannot test dynamic React components directly.${NC}"
    echo ""
    echo "For manual testing of the React component:"
    echo "1. Open http://localhost:3000/test-debounce in your browser"
    echo "2. Type text continuously and watch the request log"
    echo "3. Verify:"
    echo "   - Requests are marked as 'PENDING' while typing"
    echo "   - Previous requests change to 'CANCELLED' when you continue typing"
    echo "   - Only the last request shows 'COMPLETED' after 2 seconds"
    echo "   - No API calls for text under 10 characters"
    echo ""
}

# Function to display test scenarios
display_test_scenarios() {
    echo "Test Scenarios to Verify Manually:"
    echo "=================================="
    echo ""
    echo "1. ${GREEN}Rapid Typing Test${NC}"
    echo "   - Type continuously without stopping"
    echo "   - Expected: Multiple cancelled requests, only last one completes"
    echo ""
    echo "2. ${GREEN}Short Text Test${NC}"
    echo "   - Type less than 10 characters"
    echo "   - Expected: No API requests initiated"
    echo ""
    echo "3. ${GREEN}Pause and Resume Test${NC}"
    echo "   - Type, pause for 1 second, then continue"
    echo "   - Expected: First request cancelled, new request initiated"
    echo ""
    echo "4. ${GREEN}Error Simulation Test${NC}"
    echo "   - Disconnect internet while typing"
    echo "   - Expected: Error displayed, graceful handling"
    echo ""
    echo "5. ${GREEN}Enable/Disable Test${NC}"
    echo "   - Toggle 'Analysis: OFF' and type"
    echo "   - Expected: No requests when disabled"
    echo ""
}

# Function to show performance expectations
show_performance_expectations() {
    echo "Performance Expectations:"
    echo "========================"
    echo ""
    echo "✓ Debounce Delay: Exactly 2000ms (2 seconds)"
    echo "✓ Request Efficiency: ~20% (1 completion per 5 keystrokes average)"
    echo "✓ Bandwidth Savings: ~80% compared to no debouncing"
    echo "✓ Memory Usage: Cancelled requests should be garbage collected"
    echo "✓ Response Time: 1-3 seconds for AI analysis"
    echo ""
}

# Main execution
echo "Checking server status..."
check_server

echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test static HTML (W3M compatible)
echo "Running W3M tests on static HTML..."
./frontend/scripts/test-debounce.sh | grep -E "(✓|✗)" || true

echo ""

# Show React component test info
test_react_component

# Display test scenarios
display_test_scenarios

# Show performance expectations
show_performance_expectations

echo "=== Test Instructions Complete ==="
echo ""
echo "Next steps:"
echo "1. Open ${REACT_URL} in your browser"
echo "2. Follow the test scenarios above"
echo "3. Verify all expected behaviors"
echo "" 