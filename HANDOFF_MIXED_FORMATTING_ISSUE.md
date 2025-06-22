# Handoff: Mixed Formatting Issue with Inline Suggestions

## Current Status
The inline suggestion functionality is mostly working, but there's one persistent issue with Test 6 in the test page (`/test-marks`).

## The Issue
In Test 6 (Programmatic Application), the third suggestion (headline type) shows a gray-blue background instead of the expected green underline. This only happens:
- On initial load
- For the headline suggestion that appears at the end of the content
- The issue disappears after hovering over other suggestions

## What's Working
- Test 1-5: All working correctly
- Test 7-8: Working correctly
- Grammar suggestions: Red underline ✓
- Tone suggestions: Yellow underline ✓
- Headline suggestions in other tests: Green underline ✓
- Hover functionality: Working correctly
- Mixed formatting (bold/italic): Working correctly

## What's Not Working
- Test 6 headline suggestion: Shows gray-blue background instead of green underline on initial load
- The background disappears after interacting with other suggestions
- Appears to be a CSS specificity or initialization issue

## Recent Changes Made
1. Fixed CSS syntax error (removed nested comment)
2. Added `background: transparent` to base suggestion class
3. Added explicit transparent background rules for headline suggestions
4. Removed generic hover rules that were overriding type-specific colors
5. Added 100ms delay to hover hook initialization
6. Fixed condition check in `testProgrammaticApplication` function

## Code Locations
- Test page: `frontend/src/pages/TestSuggestionMark.tsx`
- CSS styles: `frontend/src/index.css` (lines 150-300 contain suggestion styles)
- Hover hook: `frontend/src/hooks/useSuggestionHover.ts`
- Suggestion mark: `frontend/src/components/editor/SuggestionMark.ts`

## Next Steps to Try
1. Check if there's a CSS rule being applied specifically to the last suggestion in a paragraph
2. Investigate if the issue is related to the suggestion being inside a heading element
3. Check for any ProseMirror-specific styling that might be interfering
4. Consider if the issue is related to the order of mark application
5. Debug why this specific suggestion gets an initial background color

## How to Reproduce
1. Navigate to `http://localhost:3000/test-marks`
2. Click "Test 6: Programmatic Application"
3. Observe that "Make this headline compelling!" has a gray-blue background instead of green underline
4. Hover over the red or yellow suggestions
5. Notice the gray-blue background disappears and the green underline appears correctly

## Terminal Errors
There are persistent CSS parsing errors in the terminal about "Missing opening {" but these don't seem to affect functionality. 