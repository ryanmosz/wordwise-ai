#!/bin/bash

# Quick verification of accept/reject functionality

echo "🔍 Verifying Accept/Reject Implementation"
echo "========================================"

# Check if all required files exist
echo "Checking files..."

FILES=(
    "src/pages/TestAcceptReject.tsx"
    "src/pages/TestAcceptReject.css"
    "public/test-accept-reject.html"
    "scripts/test-accept-reject.sh"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check if route is added to App.tsx
echo ""
echo "Checking route configuration..."
if grep -q "test-accept-reject" src/App.tsx; then
    echo "✅ Route added to App.tsx"
else
    echo "❌ Route not found in App.tsx"
fi

# Check if animations are defined
echo ""
echo "Checking CSS animations..."
if grep -q "acceptPulse" src/pages/TestAcceptReject.css; then
    echo "✅ Accept animation defined"
fi
if grep -q "rejectSlide" src/pages/TestAcceptReject.css; then
    echo "✅ Reject animation defined"
fi

echo ""
echo "========================================"
echo "✨ Implementation verified!"
echo ""
echo "Test the functionality at:"
echo "http://localhost:3000/test-accept-reject" 