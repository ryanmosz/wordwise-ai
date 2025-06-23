# WordWise AI - Frontend

WordWise AI is a marketing copy assistant that provides AI-powered suggestions to improve your writing. It analyzes text in real-time and offers grammar, vocabulary, clarity, and tone improvements.

## Features

- **Real-time Analysis**: Automatic text analysis as you type (with 2-second debounce)
- **Inline Suggestions**: Visual underlines for different suggestion types:
  - 🟦 Blue: Grammar corrections
  - 🟪 Purple: Vocabulary improvements  
  - 🟨 Yellow: Clarity enhancements
  - 🟩 Green: Tone adjustments
- **Interactive Tooltips**: Hover over suggestions to see details
- **One-click Accept/Reject**: Easy suggestion management
- **Document Management**: Create, edit, and organize multiple documents
- **Auto-save**: Automatic saving with visual feedback

## Current Limitations

### AI Analysis Limitations
- The AI may not catch all grammar errors (e.g., subject-verb agreement issues like "These are a poor sentence")
- Character position calculations from the AI can be incorrect, requiring client-side position correction
- The AI sometimes undercounts characters, especially with punctuation

### Technical Limitations  
- Suggestion marks occasionally persist after accepting/rejecting (requires workaround with transaction-based removal)
- The main editor integration has been challenging to get fully working
- Multiple suggestion marks can accumulate if not properly cleared
- Text position mapping between plain text and editor positions requires careful handling

### Known Issues
- After accepting a suggestion, the text may need re-analysis to detect new issues
- The AI response quality depends on the Supabase Edge Function model
- Some complex grammatical errors may not be detected

## Test Files

We have created extensive test files to verify functionality:

### Test Pages (`/src/pages/`)
- `TestAcceptReject.tsx` - Tests accept/reject functionality for suggestions
- `TestAIService.tsx` - Tests AI service integration and API calls
- `TestDebounce.tsx` - Tests debouncing behavior for text analysis
- `TestHoverDebug.tsx` - Debug tool for hover interactions
- `TestLoadingStates.tsx` - Tests loading state management
- `TestSuggestionColors.tsx` - Tests color coding for different suggestion types
- `TestSuggestionHighlight.tsx` - Tests suggestion highlighting functionality
- `TestSuggestionMark.tsx` - Tests TipTap mark implementation
- `TestSuggestionStateManagement.tsx` - Tests state management for suggestions
- `TestUseSuggestions.tsx` - Tests the main useSuggestions hook
- `TestUseSuggestionsEnhanced.tsx` - Enhanced testing for edge cases

### Test Scripts (`/scripts/`)
- `test-accept-reject.sh` - Shell script for accept/reject testing
- `test-ai-service-api.sh` - Tests AI service API endpoints
- `test-ai-service.sh` - Tests AI service functionality
- `test-debounce-react.sh` - Tests React debouncing
- `test-debounce.sh` - Tests general debouncing
- `test-debug-output.sh` - Debug output testing
- `test-hover-css.html` - HTML test for hover CSS
- `test-hover-w3m.sh` - Tests hover in w3m browser
- `test-loading-states.sh` - Tests loading states
- `test-punctuation-preservation.sh` - Tests punctuation handling
- `test-spa-with-curl.sh` - Tests SPA with curl
- `test-suggestion-integration.sh` - Integration tests for suggestions
- `test-suggestion-mark.cjs` - Node.js tests for suggestion marks
- `test-suggestion-marks.sh` - Shell tests for marks
- `test-suggestion-state.sh` - Tests suggestion state
- `test-use-suggestions.sh` - Tests useSuggestions hook
- `test-with-w3m.sh` - General w3m testing
- `verify-accept-reject.sh` - Verification for accept/reject
- `verify-with-w3m.cjs` - w3m verification script
- `w3m-test-runner.sh` - w3m test runner

### Unit Tests
- `SuggestionCard.test.tsx` - Component tests for SuggestionCard
- `SuggestionHighlight.test.tsx` - Component tests for SuggestionHighlight
- `SuggestionMark.test.ts` - Unit tests for SuggestionMark
- `useSuggestions.test.ts` - Hook tests for useSuggestions

**Note**: While we have extensive test coverage, integration in the main editor has proven challenging due to the complex interaction between TipTap, React state management, and real-time updates.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for local development with Supabase)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

For local development with Docker:
```bash
# From the root directory
docker-compose up -d
```

Then access the app at http://localhost:3000

For standalone frontend development:
```bash
cd frontend
npm run dev
```

This will start on port 3001 if 3000 is in use.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Architecture

- **React + TypeScript**: Type-safe component development
- **TipTap**: Rich text editor with extensible architecture
- **Supabase**: Backend services including auth and real-time features
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server

## Contributing

When contributing, please:
1. Run tests before submitting PRs
2. Add tests for new functionality
3. Document any new limitations discovered
4. Update this README with any new test files created
