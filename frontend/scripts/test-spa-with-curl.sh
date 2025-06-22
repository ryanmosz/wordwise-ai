#!/bin/bash

# Test script for SPA using curl
# Since w3m can't execute JavaScript, we'll check the raw HTML and API responses

echo "🧪 Testing WordWise AI SPA Structure"
echo "===================================="

BASE_URL="http://localhost:3001"

# Function to check HTTP response
check_http_response() {
    local path=$1
    local description=$2
    echo ""
    echo "🌐 Testing: $description ($path)"
    echo "-----------------------------------"
    
    # Get HTTP status code
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
    
    if [ "$status" = "200" ]; then
        echo "✅ HTTP 200 OK"
        
        # Get content preview
        echo "📝 HTML preview (first 500 chars):"
        curl -s "$BASE_URL$path" | head -c 500 | sed 's/^/   /'
        echo ""
        
        # Check for React root
        if curl -s "$BASE_URL$path" | grep -q "id=\"root\""; then
            echo "✅ Found React root element"
        else
            echo "❌ React root element not found"
        fi
        
        # Check for script tags
        script_count=$(curl -s "$BASE_URL$path" | grep -c "<script")
        echo "📦 Found $script_count script tags"
        
    else
        echo "❌ HTTP Status: $status"
    fi
}

# Function to check if dev server is running
check_dev_server() {
    echo "🔍 Checking if dev server is running..."
    if curl -s -o /dev/null "$BASE_URL"; then
        echo "✅ Dev server is accessible"
        return 0
    else
        echo "❌ Dev server is not accessible at $BASE_URL"
        echo "   Make sure to run: npm run dev"
        return 1
    fi
}

# Main tests
if check_dev_server; then
    # Test main routes
    check_http_response "/" "Root path"
    check_http_response "/test-marks" "Test Marks page"
    check_http_response "/login" "Login page"
    check_http_response "/editor" "Editor page"
    
    # Check for static assets
    echo ""
    echo "📦 Checking static assets"
    echo "------------------------"
    
    # Get the main JS file
    main_js=$(curl -s "$BASE_URL/" | grep -o 'src="/src/main.tsx"' | head -1)
    if [ -n "$main_js" ]; then
        echo "✅ Found main.tsx script reference"
    else
        echo "⚠️  Main script reference format may have changed"
    fi
    
    # Check Vite HMR
    if curl -s "$BASE_URL/" | grep -q "/@vite/client"; then
        echo "✅ Vite HMR client detected (dev mode)"
    fi
    
    # Summary
    echo ""
    echo "📊 Summary"
    echo "========="
    echo "✅ Server is running and serving the SPA shell"
    echo "⚠️  Content verification requires JavaScript execution"
    echo ""
    echo "For full content testing, use one of these approaches:"
    echo "1. Manual browser testing"
    echo "2. Playwright/Puppeteer for automated browser testing"
    echo "3. Check the browser console for our verification logs"
else
    echo ""
    echo "🛑 Cannot proceed with tests - dev server not running"
fi 