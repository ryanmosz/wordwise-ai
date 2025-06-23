#!/bin/bash

# Script to verify debug output is being generated

echo "===== Testing Debug Output ====="
echo "This script checks if our debug logging is working"
echo ""

# Check if server is running
echo "1. Checking if dev server is running..."
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "✓ Dev server is running"
else
    echo "✗ Dev server is not running on port 3000"
    exit 1
fi

echo ""
echo "2. Instructions for manual verification:"
echo "   - Open http://localhost:3000/editor"
echo "   - Open browser console (F12)"
echo "   - Log in and type: 'This are a test sentence'"
echo ""
echo "3. Expected console output patterns:"
echo "   [Editor] Content changed: {...}"
echo "   [Editor] Initializing plain text from editor: ..."
echo "   [useSuggestions] Starting analysis for text length: ..."
echo "   [useSuggestions] Text preview: ..."
echo "   [AIService] Full text being analyzed: ..."
echo "   [AIService] Suggestions detail: ..."
echo "   [TextEditor] Applying suggestion marks: ..."
echo "   [TextEditor] Editor state: {...}"
echo "   [TextEditor] Processing suggestion [0]: ..."
echo "   [editorUtils] Mapping character positions: ..."
echo "   [editorUtils] Text node at pos ..."
echo ""
echo "4. Debug points to watch for:"
echo "   - Is plain text being sent (no HTML tags)?"
echo "   - Do AI positions match the text indices?"
echo "   - Are positions being mapped correctly?"
echo "   - Which suggestions fail with 'Text mismatch'?"
echo ""
echo "===== Ready for Testing =====" 