# WordWise AI MVP Development Plan

## Executive Summary

WordWise AI is an AI-powered writing assistant specifically designed for marketing managers to craft high-converting, on-brand campaign copy in real-time. This MVP will deliver instant grammar and style suggestions, brand-tone alignment features, and analytics to help marketers improve their copy performance. The system will be built as a web application using React/TypeScript frontend with Supabase backend, leveraging OpenAI GPT-4o for intelligent suggestions.

---

## Technical Architecture Overview

### System Architecture Diagram (ASCII)
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript App                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐         │
│  │ Auth Screen  │ │ Editor View  │ │ Settings View  │         │
│  └──────────────┘ └──────────────┘ └────────────────┘         │
│  ┌──────────────┐ ┌──────────────┐                            │
│  │ Dashboard    │ │ Export Modal │                            │
│  └──────────────┘ └──────────────┘                            │
│                                                                 │
│  State Management: Zustand                                      │
│  Styling: Tailwind CSS                                         │
│  Build Tool: Vite                                             │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        HOSTING LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Frontend: Vercel                                               │
│  Backend: Supabase Cloud                                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Supabase Services:                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐         │
│  │ Auth Service │ │ Postgres DB  │ │ Realtime Sub.  │         │
│  └──────────────┘ └──────────────┘ └────────────────┘         │
│  ┌──────────────────────────────────┐                          │
│  │ Edge Functions (Deno Runtime)    │                          │
│  │ - analyzeText()                  │                          │
│  │ - generateAlternatives()         │                          │
│  └──────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ API Calls
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────────┤
│  OpenAI API (GPT-4o)                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack Justification
- **Frontend (React 18 + TypeScript)**: Industry standard for complex SPAs with type safety
- **Vite**: Faster development builds than Create React App
- **Tailwind CSS**: Rapid UI development with utility classes
- **Zustand**: Simpler state management than Redux for MVP scope
- **Supabase**: All-in-one backend with auth, database, and edge functions
- **Vercel**: Seamless deployment for React apps with great DX
- **OpenAI GPT-4o**: Best-in-class language model for writing suggestions

---

## Data Model & Schemas

### Database Tables (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  brand_tone TEXT DEFAULT 'friendly',
  reading_level INTEGER DEFAULT 8,
  banned_words TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suggestions table
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  start_index INTEGER NOT NULL,
  end_index INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'grammar', 'tone', 'persuasive', 'headline', 'readability', 'vocabulary', 'ab_test'
  original_text TEXT NOT NULL,
  suggestion_text TEXT NOT NULL,
  explanation TEXT,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  accepted BOOLEAN DEFAULT NULL, -- NULL = pending, TRUE = accepted, FALSE = rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric TEXT NOT NULL, -- 'suggestion_acceptance_rate', 'readability_score', 'document_count'
  value DECIMAL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_suggestions_document_id ON suggestions(document_id);
CREATE INDEX idx_analytics_user_id_metric ON analytics(user_id, metric);
```

---

## API & Integration Contracts

### REST API Endpoints

| Method | Path | Request Body | Response | Auth Required |
|--------|------|--------------|----------|---------------|
| POST | /auth/signup | `{email, password}` | `{user, session}` | No |
| POST | /auth/login | `{email, password}` | `{user, session}` | No |
| POST | /auth/logout | - | `{success}` | Yes |
| GET | /api/documents | - | `{documents[]}` | Yes |
| GET | /api/documents/:id | - | `{document}` | Yes |
| POST | /api/documents | `{title, content}` | `{document}` | Yes |
| PUT | /api/documents/:id | `{title?, content?}` | `{document}` | Yes |
| DELETE | /api/documents/:id | - | `{success}` | Yes |
| GET | /api/user/settings | - | `{brand_tone, reading_level, banned_words}` | Yes |
| PUT | /api/user/settings | `{brand_tone?, reading_level?, banned_words?}` | `{settings}` | Yes |
| POST | /api/analyze | `{text, document_id}` | `{suggestions[]}` | Yes |
| PUT | /api/suggestions/:id | `{accepted}` | `{suggestion}` | Yes |
| GET | /api/analytics | `{start_date?, end_date?}` | `{metrics}` | Yes |

### Edge Function Contracts

**analyzeText Function**
```typescript
// Request
{
  text: string,
  documentId: string,
  userSettings: {
    brandTone: string,
    readingLevel: number,
    bannedWords: string[]
  }
}

// Response
{
  suggestions: [
    {
      startIndex: number,
      endIndex: number,
      type: string,
      originalText: string,
      suggestionText: string,
      explanation: string,
      confidence: number
    }
  ]
}
```

---

## Epic & Milestone Breakdown (7-Day Roadmap)

### Day 1-2: Foundation Setup (Days 1-2)
**Goal**: Establish project foundation with auth and basic document management

**User Stories**:
- As a user, I can sign up and log in to the application
- As a user, I can create, view, and edit documents

**Deliverables**:
- Docker development environment
- React app with routing
- Supabase project with auth
- Basic document CRUD operations

**Effort**: Large

### Day 3-4: AI Integration (Days 3-4)
**Goal**: Implement core AI analysis features

**User Stories**:
- As a marketer, I want grammar and spelling corrections
- As a marketer, I want tone adjustment suggestions
- As a marketer, I want persuasive language improvements

**Deliverables**:
- Edge function for text analysis
- Inline suggestion UI
- Real-time text highlighting

**Effort**: Large

### Day 5-6: Advanced Features (Days 5-6)
**Goal**: Complete remaining features and analytics

**User Stories**:
- As a marketer, I want headline optimization
- As a marketer, I want readability scores
- As a marketer, I want vocabulary variations
- As a marketer, I want A/B phrase alternatives

**Deliverables**:
- Brand voice settings page
- Analytics dashboard
- Export functionality

**Effort**: Medium

### Day 7: Polish & Deploy (Day 7)
**Goal**: Testing and deployment

**Deliverables**:
- Bug fixes
- Production deployment
- Demo video

**Effort**: Small

---

## Detailed Task Board (Step-by-Step Implementation)

### TASK 1: Set Up Docker Development Environment

#### Goal
Create a Docker-based development environment that allows the junior developer to run the entire WordWise AI application locally on macOS without installing dependencies directly on their machine.

**Why this is important**: Docker ensures consistent development environments across different machines and eliminates "works on my machine" problems. This gives our junior developer confidence that their setup matches production.

**Verification**: The developer can run `docker-compose up` and see "Development environment ready" in the terminal logs.

#### Implementation Details

1. Create a new project directory:
   ```
   Open Terminal on your Mac
   Type: mkdir ~/wordwise-ai
   Type: cd ~/wordwise-ai
   ```

2. Create the following file structure:
   ```
   wordwise-ai/
   ├── docker-compose.yml
   ├── frontend/
   │   └── Dockerfile.dev
   └── .env.example
   ```

3. Create `docker-compose.yml` in the root directory with this content:
   ```yaml
   version: '3.8'
   services:
     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile.dev
       ports:
         - "3000:3000"
       volumes:
         - ./frontend:/app
         - /app/node_modules
       environment:
         - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
         - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
     
     postgres:
       image: postgres:15
       environment:
         POSTGRES_PASSWORD: localpassword
         POSTGRES_DB: wordwise
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

4. Create `frontend/Dockerfile.dev`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "run", "dev"]
   ```

5. Create `.env.example`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

#### Test Phase

1. Ensure Docker Desktop is installed and running on your Mac
2. In Terminal, from the project root, run: `docker-compose up`
3. You should see output showing postgres starting up
4. Look for a message like "postgres_1 | database system is ready to accept connections"
5. Press Ctrl+C to stop the containers
6. Success criteria: No error messages and postgres container starts successfully

---

### TASK 2: Initialize Frontend React Application

#### Goal
Set up a React 18 application with TypeScript, Vite, Tailwind CSS, and Zustand for state management. This creates the foundation for all UI components.

**Why this is important**: The frontend is where users will interact with WordWise AI. A well-structured React app ensures smooth development of features.

**Verification**: Opening http://localhost:3000 shows a "Welcome to WordWise AI" page with Tailwind styling applied.

#### Implementation Details

1. Navigate to the frontend directory:
   ```
   cd ~/wordwise-ai/frontend
   ```

2. Initialize a new Vite project:
   ```
   Run: npm create vite@latest . -- --template react-ts
   When prompted, confirm you want to create in current directory
   ```

3. Install dependencies:
   ```
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npm install zustand @supabase/supabase-js react-router-dom
   npm install -D @types/react-router-dom
   ```

4. Initialize Tailwind CSS:
   ```
   Run: npx tailwindcss init -p
   ```

5. Update `tailwind.config.js`:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```

6. Replace contents of `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

7. Create the following file structure in src/:
   ```
   src/
   ├── components/
   │   ├── auth/
   │   ├── editor/
   │   ├── dashboard/
   │   └── common/
   ├── pages/
   ├── store/
   ├── services/
   ├── types/
   └── utils/
   ```

8. Update `src/App.tsx`:
   ```typescript
   Replace the default content with:
   
   function App() {
     return (
       <div className="min-h-screen bg-gray-50">
         <h1 className="text-4xl font-bold text-center pt-20 text-blue-600">
           Welcome to WordWise AI
         </h1>
         <p className="text-center mt-4 text-gray-600">
           Your AI-powered marketing copy assistant
         </p>
       </div>
     )
   }
   
   export default App
   ```

9. Update `vite.config.ts` to use port 3000:
   ```typescript
   Add to defineConfig:
   server: {
     port: 3000,
     host: true
   }
   ```

#### Test Phase

1. In the frontend directory, run: `npm run dev`
2. Open your browser to http://localhost:3000
3. Verify you see "Welcome to WordWise AI" with blue heading
4. Verify the text is centered and has proper styling
5. Check the browser console for any errors (should be none)

---

### TASK 3: Create Supabase Project and Configure Authentication

#### Goal
Set up a Supabase project with authentication enabled, create database tables, and connect the React app to Supabase services.

**Why this is important**: Supabase provides our backend infrastructure including user authentication, database, and serverless functions. This is the backbone of our application.

**Verification**: A test user can successfully sign up, log in, and see their email displayed on a protected page.

#### Implementation Details

1. Create Supabase Project:
   ```
   Go to https://supabase.com
   Click "Start your project"
   Sign in with GitHub
   Click "New project"
   Name: wordwise-ai
   Database Password: [generate a strong password and save it]
   Region: Choose closest to you
   Click "Create new project"
   ```

2. Wait for project to finish setting up (usually 2-3 minutes)

3. Get your project credentials:
   ```
   Go to Settings > API
   Copy the "anon public" key
   Copy the Project URL
   ```

4. Create `.env` file in frontend directory:
   ```
   Copy .env.example to .env
   Replace placeholders with your actual values:
   VITE_SUPABASE_URL=https://[your-project].supabase.co
   VITE_SUPABASE_ANON_KEY=[your-anon-key]
   ```

5. Set up database tables:
   ```
   In Supabase dashboard, go to SQL Editor
   Click "New query"
   Copy and paste the entire SQL schema from the Data Model section above
   Click "Run"
   Verify all tables created successfully
   ```

6. Enable Email Auth:
   ```
   Go to Authentication > Providers
   Ensure Email is enabled
   Under Email Settings, disable "Confirm email" for easier testing
   ```

7. Create Supabase client in `src/services/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error('Missing Supabase environment variables')
   }

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

8. Create auth store in `src/store/authStore.ts`:
   ```typescript
   import { create } from 'zustand'
   import { supabase } from '../services/supabase'

   interface AuthState {
     user: any | null
     loading: boolean
     signIn: (email: string, password: string) => Promise<void>
     signUp: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
     checkUser: () => Promise<void>
   }

   export const useAuthStore = create<AuthState>((set) => ({
     user: null,
     loading: true,
     // Implement methods here
   }))
   ```

#### Test Phase

1. In Supabase dashboard, go to Table Editor
2. Verify you see all 4 tables: users, documents, suggestions, analytics
3. Go to Authentication > Users
4. Click "Add user" > "Create new user"
5. Enter test@example.com and password "testpass123"
6. Verify user appears in the list
7. Check that the users table now has one row

---

### TASK 4: Build Authentication UI Components

#### Goal
Create login and signup pages with a test user button for easy development access. Include proper form validation and error handling.

**Why this is important**: Authentication is the gateway to the application. A smooth auth experience builds user confidence, and the test user button speeds up development testing.

**Verification**: Clicking the "Test User Login" button logs in automatically, and manual signup/login forms work correctly with error messages for invalid inputs.

#### Implementation Details

1. Create `src/pages/LoginPage.tsx`:
   ```
   This page should include:
   - Email input field
   - Password input field
   - Login button
   - Link to signup page
   - Test User Login button (slate secondary styling, prominent)
   - Error message display area
   ```

2. ASCII mockup of Login Page:
   ```
   ┌─────────────────────────────────────────┐
   │            WordWise AI                  │
   │                                         │
   │         ┌─────────────────┐            │
   │         │ Email           │            │
   │         └─────────────────┘            │
   │                                         │
   │         ┌─────────────────┐            │
   │         │ Password        │            │
   │         └─────────────────┘            │
   │                                         │
   │         [    Login    ]                 │
   │                                         │
   │      Don't have an account?            │
   │         Sign up here                   │
   │                                         │
   │    ─────── OR ───────                  │
   │                                         │
   │    [ Test User Login ]                  │
   │      (Dev Only)                        │
   └─────────────────────────────────────────┘
   ```

3. Create `src/pages/SignupPage.tsx`:
   ```
   Similar to login but with:
   - Email field
   - Password field (with strength indicator)
   - Confirm password field
   - Terms checkbox
   - Create Account button
   ```

4. Create `src/components/auth/AuthForm.tsx`:
   ```
   Reusable form component with:
   - Email validation (must contain @ and .)
   - Password validation (minimum 6 characters)
   - Loading states during submission
   - Error message display
   ```

5. Implement routing in `src/App.tsx`:
   ```
   Use react-router-dom to set up:
   - /login route → LoginPage
   - /signup route → SignupPage
   - / route → redirect to /login if not authenticated
   - /editor route → (placeholder for now)
   ```

6. Add test user functionality:
   ```
   In LoginPage, the Test User Login button should:
   - Use credentials: test@wordwise.ai / testpass123
   - Auto-fill and submit the form
   - Show loading spinner during login
   ```

7. Create `src/components/common/LoadingSpinner.tsx`:
   ```
   Simple spinning circle indicator
   Use Tailwind's animate-spin class
   ```

#### Test Phase

1. Navigate to http://localhost:3000
2. Verify you're redirected to /login
3. Click "Test User Login" button
4. Verify loading spinner appears briefly
5. Verify you're redirected to /editor (even if it's blank)
6. Go back to /login
7. Try logging in with invalid email format
8. Verify error message appears
9. Try signing up with mismatched passwords
10. Verify appropriate error message

---

### TASK 5: Create Document Editor Interface

#### Goal
Build a rich text editor where users can create and edit documents with real-time saving to the database. The editor should highlight text segments that have AI suggestions.

**Why this is important**: The editor is the core workspace where marketers will spend most of their time. It needs to be responsive, intuitive, and capable of displaying AI suggestions inline.

**Verification**: Users can type in the editor, see their changes auto-save (indicated by "Saving..." → "Saved"), and create multiple documents that persist between sessions.

#### Implementation Details

1. Create `src/pages/EditorPage.tsx`:
   ```
   Main layout with:
   - Header with document title (editable)
   - Toolbar with formatting options
   - Main editor area
   - Right sidebar for suggestions (empty for now)
   - Status bar showing save status
   ```

2. ASCII mockup of Editor Page:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ WordWise AI          [Settings] [Export] [Logout]   │
   ├─────────────────────────────────────────────────────┤
   │ Document: [Untitled Document ▼]              Saved  │
   ├─────────────────────────────────────────────────────┤
   │ ┌─────────────────────────┬──────────────────────┐ │
   │ │                         │   Suggestions        │ │
   │ │  Type your content      │                      │ │
   │ │  here...               │   No suggestions     │ │
   │ │                         │   yet                │ │
   │ │                         │                      │ │
   │ │                         │                      │ │
   │ │                         │                      │ │
   │ │                         │                      │ │
   │ │                         │                      │ │
   │ └─────────────────────────┴──────────────────────┘ │
   │ Words: 0 | Characters: 0 | Readability: N/A        │
   └─────────────────────────────────────────────────────┘
   ```

3. Install editor library:
   ```
   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight
   ```

4. Create `src/components/editor/TextEditor.tsx`:
   ```
   Use TipTap for rich text editing
   Configure with:
   - Basic formatting (bold, italic, underline)
   - Paragraph and heading support
   - Custom highlight extension for suggestions
   - onChange handler for auto-save
   ```

5. Create `src/store/documentStore.ts`:
   ```
   Zustand store for:
   - Current document state
   - Document list
   - Save status
   - Auto-save functionality (debounced)
   ```

6. Implement auto-save:
   ```
   - Debounce saves to every 2 seconds of inactivity
   - Show "Saving..." during save
   - Show "Saved" when complete
   - Show "Error saving" if failed
   ```

7. Create document management:
   ```
   - Dropdown to switch between documents
   - "New Document" option in dropdown
   - Rename document by clicking title
   - Delete document option (with confirmation)
   ```

#### Test Phase

1. Log in and navigate to editor
2. Start typing in the editor
3. Wait 2 seconds and verify "Saving..." appears
4. Verify it changes to "Saved"
5. Type more content with formatting (bold, italic)
6. Refresh the page
7. Verify your content is still there
8. Create a new document
9. Verify you can switch between documents
10. Verify word and character count update as you type

---

### TASK 6: Create AI Edge Function for Text Analysis

#### Goal
Deploy a Supabase Edge Function that accepts text input and returns AI-powered suggestions using OpenAI's GPT-4o model. The function should analyze grammar, tone, and persuasiveness.

**Why this is important**: This is the core AI functionality that differentiates WordWise from a basic text editor. Quality suggestions will determine user satisfaction.

**Verification**: Sending a POST request to the edge function with sample text returns a JSON array of suggestions with proper formatting.

#### Implementation Details

1. Install Supabase CLI:
   ```
   In Terminal:
   brew install supabase/tap/supabase
   ```

2. Initialize Supabase functions:
   ```
   cd ~/wordwise-ai
   supabase init
   supabase login
   ```

3. Create edge function:
   ```
   supabase functions new analyze-text
   ```

4. Create `supabase/functions/analyze-text/index.ts`:
   ```
   Structure:
   - Import Deno dependencies
   - Set up CORS headers
   - Parse request body
   - Validate inputs
   - Call OpenAI API
   - Format and return suggestions
   ```

5. Edge function logic outline:
   ```
   1. Extract text and user settings from request
   2. Create GPT-4o prompt that asks for:
      - Grammar corrections
      - Tone adjustments based on brand voice
      - Persuasiveness improvements
   3. Parse GPT response into structured suggestions
   4. Each suggestion should include:
      - Text position (start/end index)
      - Suggestion type
      - Original and suggested text
      - Explanation
      - Confidence score
   ```

6. Add OpenAI API key to edge function secrets:
   ```
   Get API key from https://platform.openai.com
   Run: supabase secrets set OPENAI_API_KEY=sk-...
   ```

7. Example prompt template:
   ```
   You are a marketing copy editor. Analyze this text:
   "[USER_TEXT]"
   
   Brand voice: [BRAND_TONE]
   Target reading level: [READING_LEVEL]
   
   Provide suggestions for:
   1. Grammar and spelling errors
   2. Tone alignment with brand voice
   3. More persuasive language
   
   Format each suggestion as JSON...
   ```

8. Deploy the function:
   ```
   supabase functions deploy analyze-text
   ```

#### Test Phase

1. Get your function URL from Supabase dashboard
2. Use a tool like Postman or curl to test:
   ```
   POST to: https://[project].supabase.co/functions/v1/analyze-text
   Headers:
     - Authorization: Bearer [anon-key]
     - Content-Type: application/json
   Body: {
     "text": "This are a test sentence with eror.",
     "settings": {
       "brandTone": "friendly",
       "readingLevel": 8
     }
   }
   ```
3. Verify response includes grammar correction suggestion
4. Verify suggestion has all required fields
5. Test with longer text (paragraph)
6. Verify multiple suggestions returned

---

### TASK 7: Implement Inline Suggestion UI

#### Goal
Create an interactive UI that highlights problematic text segments and shows suggestion cards when users click on them. Users can accept or reject each suggestion.

**Why this is important**: The suggestion interface is how users interact with AI feedback. It needs to be non-intrusive yet easily accessible, allowing quick decisions on each suggestion.

**Verification**: Text with suggestions shows colored underlines, clicking shows a popup card with suggestion details, and accepting a suggestion updates the text immediately.

#### Implementation Details

1. Create `src/components/editor/SuggestionHighlight.tsx`:
   ```
   Component that wraps text spans with:
   - Colored underline based on suggestion type
   - Click handler to show suggestion card
   - Different colors:
     - Red: Grammar errors
     - Yellow: Tone suggestions
     - Blue: Persuasiveness improvements
     - Green: Headlines/readability
   ```

2. Create `src/components/editor/SuggestionCard.tsx`:
   ```
   Popup card that shows:
   - Original text (strikethrough)
   - Suggested text (highlighted)
   - Explanation of why
   - Accept button (checkmark)
   - Reject button (X)
   - Confidence indicator
   ```

3. ASCII mockup of suggestion interaction:
   ```
   Editor text: "This are very unique product for marketing professionals."
                    ^^^^                ^^^^^^
                    (red)              (yellow)
   
   Click on "are" shows:
   ┌─────────────────────────────────┐
   │ Grammar Correction              │
   │                                 │
   │ ❌ This are very               │
   │ ✓  This is a very             │
   │                                 │
   │ "Are" should be "is" for       │
   │ singular subject               │
   │                                 │
   │ Confidence: 95%                │
   │                                 │
   │ [✓ Accept] [✗ Reject]          │
   └─────────────────────────────────┘
   ```

4. Update TextEditor to support highlights:
   ```
   - Add custom mark for suggestions
   - Track suggestion positions
   - Update when text changes
   - Recalculate positions after edits
   ```

5. Create `src/hooks/useSuggestions.ts`:
   ```
   Custom hook that:
   - Fetches suggestions when text changes (debounced)
   - Maps suggestions to text positions
   - Handles position updates after edits
   - Tracks accepted/rejected suggestions
   ```

6. Implement suggestion state management:
   ```
   - Store active suggestions in Zustand
   - Track which are accepted/rejected
   - Update database with user choices
   - Remove suggestion after action
   ```

7. Add animation and positioning:
   ```
   - Fade in suggestion highlights
   - Position card near clicked text
   - Ensure card stays within viewport
   - Smooth transitions
   ```

#### Test Phase

1. Type text with deliberate errors
2. Wait for suggestions to appear (colored underlines)
3. Click on a red underline
4. Verify suggestion card appears
5. Click "Accept"
6. Verify text updates immediately
7. Verify underline disappears
8. Click on another suggestion
9. Click "Reject"
10. Verify underline disappears but text unchanged

---

### TASK 8: Wire Frontend to Edge Function

#### Goal
Connect the React editor to the Supabase edge function, enabling real-time AI suggestions as users type. Implement proper error handling and loading states.

**Why this is important**: This integration brings the AI capabilities to life in the user interface. Smooth integration ensures users get timely, relevant suggestions without disrupting their writing flow.

**Verification**: As users type, suggestions appear within 2 seconds, errors show user-friendly messages, and the system gracefully handles network issues.

#### Implementation Details

1. Create `src/services/aiService.ts`:
   ```
   Service module with:
   - analyzeText() function
   - Proper error handling
   - Retry logic for network failures
   - Request cancellation for outdated requests
   ```

2. Update suggestion hook:
   ```
   In useSuggestions.ts:
   - Call aiService.analyzeText() on text change
   - Debounce API calls (2 second delay)
   - Cancel previous request if still pending
   - Show loading indicator during analysis
   ```

3. Add loading states to editor:
   ```
   - "Analyzing..." indicator in status bar
   - Subtle pulse animation while processing
   - Disable suggestion clicks during loading
   ```

3.5. Integrate suggestion highlights into TextEditor:
   ```
   - Add TipTap custom mark extension for suggestions
   - Apply suggestion marks when suggestions arrive from AI
   - Map suggestions to text positions with proper colors
   - Handle click/hover on marked text to show SuggestionCard
   - Connect accept/reject actions to update text and marks
   - Update marks when text changes or positions shift
   - Add CSS for different suggestion type underlines
   ```

4. Implement error handling:
   ```
   Error scenarios to handle:
   - Network timeout (show "Connection issue, retrying...")
   - API error (show "Analysis temporarily unavailable")
   - Rate limit (show "Please wait before analyzing")
   - Invalid response (log error, skip suggestions)
   ```

5. Create request queue:
   ```
   - Track pending analysis requests
   - Cancel outdated requests
   - Prevent duplicate requests
   - Batch small edits together
   ```

6. Add performance optimizations:
   ```
   - Only analyze changed paragraphs
   - Cache recent suggestions
   - Skip analysis for very short text (< 10 words)
   - Limit request size to 2000 words
   ```

7. Create suggestions pane (right sidebar):
   ```
   - Simple fixed panel showing all suggestions
   - Grouped by 6 user story categories:
     - Tone Adjustment
     - Persuasive Language
     - Conciseness
     - Headline Optimization
     - Readability Guidance
     - Vocabulary Variation
   - Click to navigate to suggestion in editor
   - Accept/reject buttons on each item
   - Shows count per category
   ```

8. Analyze existing text on document load:
   ```
   - Run AI analysis when document opens
   - Show suggestions for existing content
   - Create test document with each error type
   - Different loading message for initial analysis
   - Handle document switching gracefully
   ```

9. Verify document persistence:
   ```
   - Ensure auto-save works reliably
   - Test document loading across sessions
   - Handle offline/online transitions
   - Show save status indicators
   ```

10. Full integration testing:
    ```
    - Test complete user journey
    - Verify all features work together
    - Check performance with real usage
    - Ensure no console errors
    ```

#### Test Phase

1. Type a paragraph with errors (e.g., "This are a test")
2. Stop typing and count to 2
3. Verify "Analyzing..." appears
4. Verify suggestions appear within 1-2 seconds as colored underlines
5. Click on underlined text - verify SuggestionCard appears
6. Test Accept button - verify text updates and underline disappears
7. Test Reject button - verify underline disappears but text unchanged
8. Continue typing immediately - verify previous analysis cancels
9. Disconnect internet (turn off WiFi)
10. Try typing and verify error message appears
11. Reconnect internet
12. Verify system recovers and works again with new suggestions

---

### TASK 9: Implement Brand Voice Settings Page

#### Goal
Create a settings page where users can configure their brand voice preferences, including tone, reading level, and banned words. These settings affect all AI suggestions.

**Why this is important**: Customization ensures AI suggestions align with each company's unique brand voice. This personalization is key for marketing professionals who need consistency.

**Verification**: Changes to settings immediately affect new suggestions, and settings persist across sessions.

#### Implementation Details

1. Create `src/pages/SettingsPage.tsx`:
   ```
   Page layout with sections for:
   - Brand Voice configuration
   - Readability preferences
   - Banned words list
   - Save button
   - Cancel button
   ```

2. ASCII mockup of Settings Page:
   ```
   ┌────────────────────────────────────────────────┐
   │ WordWise AI - Settings           [Back to Editor]│
   ├────────────────────────────────────────────────┤
   │                                                │
   │ Brand Voice Settings                           │
   │ ┌────────────────────────────────────┐       │
   │ │ Tone:  [Friendly    ▼]             │       │
   │ │        • Professional              │       │
   │ │        • Casual                    │       │
   │ │        • Formal                    │       │
   │ │        • Playful                   │       │
   │ └────────────────────────────────────┘       │
   │                                                │
   │ Reading Level                                  │
   │ ┌────────────────────────────────────┐       │
   │ │ Target Grade Level: [8 ▼]          │       │
   │ │ (5 = Elementary, 12 = High School) │       │
   │ └────────────────────────────────────┘       │
   │                                                │
   │ Banned Words                                   │
   │ ┌────────────────────────────────────┐       │
   │ │ synergy                   [Remove] │       │
   │ │ leverage                  [Remove] │       │
   │ │ [Add new word...     ] [+ Add]     │       │
   │ └────────────────────────────────────┘       │
   │                                                │
   │        [Save Settings]  [Cancel]               │
   └────────────────────────────────────────────────┘
   ```

3. Create `src/components/settings/ToneSelector.tsx`:
   ```
   Dropdown component with:
   - Predefined tone options
   - Description for each tone
   - Visual preview of tone style
   ```

4. Create `src/components/settings/BannedWordsList.tsx`:
   ```
   List manager with:
   - Add new word input
   - Remove word buttons
   - Duplicate prevention
   - Sort alphabetically
   ```

5. Update user settings store:
   ```
   In authStore or create settingsStore:
   - Load settings on login
   - Save settings to database
   - Update local state immediately
   - Sync with edge function calls
   ```

6. Implement settings persistence:
   ```
   - Auto-save on change (debounced)
   - Show save status
   - Validate inputs
   - Handle save errors gracefully
   ```

#### Test Phase

1. Navigate to Settings from editor
2. Change tone from "Friendly" to "Professional"
3. Click Save Settings
4. Go back to editor
5. Type casual text like "Hey folks!"
6. Verify suggestion to make it more professional
7. Return to settings
8. Add "synergy" to banned words
9. Go to editor and type "synergy"
10. Verify suggestion to replace the word

---

### TASK 10: Enhance AI Prompt with All Features

#### Goal
Expand the edge function to support all seven user stories: tone adjustment, persuasive language, conciseness, headline optimization, readability guidance, vocabulary variation, and A/B alternatives.

**Why this is important**: Full feature implementation delivers on all promised value propositions. Each feature addresses specific marketing copy challenges.

**Verification**: Each feature type produces relevant, high-quality suggestions when appropriate text is analyzed.

#### Implementation Details

1. Update edge function prompt structure:
   ```
   Organize prompt into sections:
   1. Role definition (marketing copy expert)
   2. User settings context
   3. Analysis instructions for each feature
   4. Output format specification
   5. Examples of good suggestions
   ```

2. Implement feature-specific prompts:
   ```
   Grammar: Focus on correctness
   Tone: Match specified brand voice
   Persuasive: Add power words, emotional triggers
   Conciseness: Shorten without losing meaning
   Headlines: Grab attention, include keywords
   Readability: Simplify complex sentences
   Vocabulary: Suggest synonyms, avoid repetition
   A/B Testing: Provide alternative phrasings
   ```

3. Add suggestion ranking:
   ```
   - Priority 1: Grammar errors (always show)
   - Priority 2: Tone mismatches
   - Priority 3: Readability issues
   - Priority 4: Enhancement opportunities
   - Limit to top 10 suggestions per analysis
   ```

4. Create specialized analyzers:
   ```
   - Headline analyzer (for text in H1-H3 tags)
   - CTA analyzer (for buttons/links)
   - Body text analyzer (for paragraphs)
   ```

5. Implement A/B suggestion generator:
   ```
   For CTAs and key phrases:
   - Generate 2-3 alternatives
   - Vary emotional appeal
   - Test different word orders
   - Include metrics rationale
   ```

6. Add readability scoring:
   ```
   Calculate and return:
   - Flesch-Kincaid grade level
   - Average sentence length
   - Complex word percentage
   - Passive voice usage
   ```

#### Test Phase

1. Test each feature individually:
   - Grammar: "This are wrong"
   - Tone: Professional text in casual voice
   - Persuasive: "Our product is good"
   - Conciseness: Long, wordy paragraph
   - Headline: Generic title
   - Readability: Complex jargon
   - Vocabulary: Repeated words
   - A/B: "Buy Now" CTA

2. Verify each produces appropriate suggestions
3. Test with mixed content (multiple issues)
4. Verify suggestions don't conflict
5. Check suggestion explanations are clear

---

### TASK 11: Implement Suggestion Tracking

#### Goal
Track when users accept or reject suggestions, storing this data for analytics. This includes visual feedback and database updates.

**Why this is important**: Tracking suggestion acceptance helps measure AI effectiveness and provides data for the analytics dashboard. This feedback loop improves the product over time.

**Verification**: Accepting/rejecting suggestions updates the database, and the analytics page shows accurate acceptance rates.

#### Implementation Details

1. Update suggestion card actions:
   ```
   On Accept:
   - Apply text change
   - Mark suggestion as accepted in DB
   - Show brief success animation
   - Remove highlight
   
   On Reject:
   - Mark suggestion as rejected in DB
   - Show brief dismissal animation
   - Remove highlight
   - Keep original text
   ```

2. Create `src/services/analyticsService.ts`:
   ```
   Functions to:
   - Track suggestion acceptance/rejection
   - Calculate acceptance rates
   - Track document statistics
   - Send batch updates to database
   ```

3. Add visual feedback:
   ```
   - Green flash for accepted
   - Red flash for rejected
   - Fade out animation
   - Update counters in real-time
   ```

4. Implement batch tracking:
   ```
   - Queue tracking events
   - Send batch updates every 30 seconds
   - Include timestamp and context
   - Handle offline scenarios
   ```

5. Create summary statistics:
   ```
   Track per session:
   - Total suggestions shown
   - Accepted count
   - Rejected count
   - Ignored count (neither action)
   - By suggestion type
   ```

#### Test Phase

1. Create document with multiple errors
2. Accept 3 suggestions
3. Reject 2 suggestions
4. Check Supabase dashboard
5. Verify suggestions table shows correct accepted/rejected status
6. Verify analytics table has new entries
7. Calculate acceptance rate manually
8. Verify it matches what's stored

---

### TASK 12: Build Analytics Dashboard

#### Goal
Create a dashboard showing users their writing improvement metrics, including suggestion acceptance rates, readability trends, and usage patterns.

**Why this is important**: Analytics help marketers understand their writing patterns and improvement over time. This gamification element encourages continued use and improvement.

**Verification**: Dashboard displays accurate metrics with clear visualizations that update when new data is available.

#### Implementation Details

1. Create `src/pages/DashboardPage.tsx`:
   ```
   Layout with metric cards:
   - Overall acceptance rate
   - Suggestions by type
   - Readability trend
   - Documents analyzed
   - Time saved estimate
   ```

2. ASCII mockup of Dashboard:
   ```
   ┌─────────────────────────────────────────────────┐
   │ WordWise AI - Analytics Dashboard    [Editor]   │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │ ┌───────────────┐ ┌───────────────┐           │
   │ │ Acceptance    │ │ Documents     │           │
   │ │ Rate          │ │ Analyzed      │           │
   │ │               │ │               │           │
   │ │    85%        │ │     23        │           │
   │ │ ▲ +5%         │ │ This Week     │           │
   │ └───────────────┘ └───────────────┘           │
   │                                                 │
   │ Suggestions by Type                             │
   │ ┌─────────────────────────────────┐           │
   │ │ Grammar     ████████████ 45%    │           │
   │ │ Tone        ██████ 25%          │           │
   │ │ Clarity     █████ 20%           │           │
   │ │ Other       ██ 10%              │           │
   │ └─────────────────────────────────┘           │
   │                                                 │
   │ Readability Trend (Last 7 Days)                │
   │ ┌─────────────────────────────────┐           │
   │ │    Grade Level                   │           │
   │ │ 10 ┐                             │           │
   │ │  9 ├──┐                          │           │
   │ │  8 │  └──┬───┬───┐              │           │
   │ │  7 ┘     └───┘   └──            │           │
   │ └─────────────────────────────────┘           │
   └─────────────────────────────────────────────────┘
   ```

3. Create metric components:
   ```
   - MetricCard: Reusable card with title, value, trend
   - BarChart: Simple bar chart for categories
   - LineChart: Trend visualization
   - No external charting library needed (use CSS)
   ```

4. Implement data fetching:
   ```
   - Load analytics on mount
   - Calculate derived metrics
   - Handle empty states
   - Show loading skeletons
   ```

5. Add time period selector:
   ```
   - Today
   - Last 7 days
   - Last 30 days
   - All time
   ```

6. Create insight messages:
   ```
   - "Great job! Your acceptance rate is improving"
   - "Try focusing on conciseness suggestions"
   - "Your readability has improved by 2 grade levels"
   ```

#### Test Phase

1. Navigate to Dashboard
2. Verify metrics display correctly
3. Create and edit a document
4. Accept/reject some suggestions
5. Return to dashboard
6. Verify numbers updated
7. Change time period filter
8. Verify data changes appropriately
9. Check all visualizations render
10. Verify no console errors

---

### TASK 13: Implement Export Feature

#### Goal
Allow users to export their documents in multiple formats (Markdown, HTML, and plain text) with a simple download interface.

**Why this is important**: Marketers need to use their content in various platforms. Export functionality ensures WordWise fits into their existing workflow.

**Verification**: Clicking export downloads a properly formatted file in the selected format with the correct filename.

#### Implementation Details

1. Create `src/components/ExportModal.tsx`:
   ```
   Modal with:
   - Format selection (radio buttons)
   - Preview of exported format
   - Download button
   - Cancel button
   ```

2. ASCII mockup of Export Modal:
   ```
   ┌─────────────────────────────────────┐
   │        Export Document              │
   │                                     │
   │ Format:                             │
   │ ◉ Markdown (.md)                   │
   │ ○ HTML (.html)                     │
   │ ○ Plain Text (.txt)                │
   │                                     │
   │ Preview:                            │
   │ ┌─────────────────────────┐       │
   │ │ # My Document            │       │
   │ │                          │       │
   │ │ This is the content...   │       │
   │ └─────────────────────────┘       │
   │                                     │
   │   [Download]  [Cancel]              │
   └─────────────────────────────────────┘
   ```

3. Create export utilities:
   ```
   - convertToMarkdown(): Preserves formatting
   - convertToHTML(): Clean, semantic HTML
   - convertToPlainText(): Strip all formatting
   ```

4. Implement file download:
   ```
   - Generate file in browser
   - Use Blob API
   - Trigger download with proper filename
   - Include document title in filename
   ```

5. Add export button to editor:
   ```
   - Place in top toolbar
   - Icon with tooltip
   - Keyboard shortcut (Cmd/Ctrl + E)
   ```

#### Test Phase

1. Create document with formatted text
2. Add bold, italic, and headings
3. Click Export button
4. Select Markdown format
5. Verify preview shows correct markdown
6. Click Download
7. Verify file downloads with .md extension
8. Open file and verify formatting preserved
9. Repeat for HTML and plain text
10. Verify each format is correct

---

### TASK 14: Final Polish and Testing

#### Goal
Perform comprehensive testing, fix bugs, improve UI polish, and ensure all features work together seamlessly. Add helpful onboarding for new users.

**Why this is important**: Polish differentiates a demo from a professional product. First impressions matter, especially for a tool aimed at marketing professionals.

**Verification**: All features work without errors, UI animations are smooth, and new users can understand the product within 30 seconds.

#### Implementation Details

1. Create onboarding tour:
   ```
   - Welcome modal on first login
   - Highlight key features
   - Sample document with examples
   - Skip option for returning users
   ```

2. Add empty states:
   ```
   - No documents: "Create your first document"
   - No suggestions: "Start typing to see suggestions"
   - No analytics: "Complete a document to see stats"
   ```

3. Improve loading states:
   ```
   - Skeleton screens for all pages
   - Smooth transitions
   - Progress indicators
   - Prevent layout shift
   ```

4. Add keyboard shortcuts:
   ```
   - Cmd/Ctrl + S: Force save
   - Cmd/Ctrl + N: New document
   - Cmd/Ctrl + E: Export
   - /: Focus search
   ```

5. Polish UI details:
   ```
   - Consistent spacing (use 8px grid)
   - Hover states for all interactive elements
   - Focus indicators for accessibility
   - Smooth animations (200ms transitions)
   ```

6. Error boundary implementation:
   ```
   - Catch React errors
   - Show friendly error page
   - Include "Refresh" button
   - Log errors for debugging
   ```

7. Performance optimizations:
   ```
   - Lazy load routes
   - Optimize images
   - Minimize bundle size
   - Cache API responses
   ```

#### Test Phase

1. Complete user journey test:
   - Sign up as new user
   - See onboarding
   - Create document
   - Get suggestions
   - Accept some
   - Check analytics
   - Export document
   - Log out and back in

2. Test error scenarios:
   - Disconnect internet mid-edit
   - Enter invalid data
   - Rapid clicking/typing

3. Cross-browser testing:
   - Chrome
   - Safari
   - Firefox
   - Edge

4. Verify all features work together

---

### TASK 15: Deployment

#### Goal
Deploy the application to production with Vercel (frontend) and Supabase (backend), configure environment variables, and ensure everything works in the production environment.

**Why this is important**: Deployment makes your work accessible to others. A working demo URL is essential for showcasing the project.

**Verification**: The app is accessible at a public URL, all features work correctly, and performance is acceptable.

#### Implementation Details

1. Prepare for deployment:
   ```
   - Remove all console.log statements
   - Set production API endpoints
   - Enable production error tracking
   - Minify and optimize build
   ```

2. Deploy to Vercel:
   ```
   1. Install Vercel CLI: npm i -g vercel
   2. In frontend directory, run: vercel
   3. Follow prompts:
      - Link to new project
      - Framework: Vite
      - Build command: npm run build
      - Output directory: dist
   4. Add environment variables in Vercel dashboard
   ```

3. Configure Supabase for production:
   ```
   - Enable Row Level Security (RLS)
   - Set up production edge function URLs
   - Configure CORS for your Vercel domain
   - Enable rate limiting
   ```

4. Set up domain (optional):
   ```
   - Use Vercel's subdomain or
   - Configure custom domain
   - Enable HTTPS (automatic with Vercel)
   ```

5. Create demo accounts:
   ```
   - demo@wordwise.ai / demo123
   - Include sample documents
   - Pre-populate some analytics
   ```

6. Production checklist:
   ```
   □ Environment variables set
   □ API keys secured
   □ Error tracking enabled
   □ Analytics working
   □ All features tested
   □ Mobile responsive
   □ SEO meta tags added
   ```

7. Create demo video script:
   ```
   1. Show login
   2. Create new document
   3. Type with errors
   4. Show AI suggestions
   5. Accept suggestions
   6. Show brand voice settings
   7. View analytics
   8. Export document
   ```

#### Test Phase

1. Visit production URL
2. Sign up with new account
3. Test all features:
   - Document creation
   - AI suggestions
   - Settings persistence
   - Analytics accuracy
   - Export functionality
4. Test on mobile device
5. Share URL with colleague
6. Verify they can sign up and use
7. Monitor Supabase logs for errors
8. Check Vercel analytics
9. Verify edge function performance
10. Create demo video

---

## AI/ML Component Specification

### Model Configuration
- **Provider**: OpenAI
- **Model**: GPT-4o (optimized for speed and cost)
- **Temperature**: 0.3 (consistent, focused suggestions)
- **Max tokens**: 1000 per request
- **Timeout**: 10 seconds

### Prompt Engineering Strategy
1. **System prompt**: Define role as marketing copy expert
2. **User context**: Include brand voice and preferences
3. **Few-shot examples**: Provide examples of good suggestions
4. **Output format**: Structured JSON for easy parsing

### Performance Targets
- **Latency**: < 1.5s median response time
- **Accuracy**: > 85% useful suggestions
- **Cost**: < $0.01 per document analysis

---

## Testing Strategy

### Unit Testing
- **Coverage target**: 80% for business logic
- **Tools**: Vitest for React components
- **Focus areas**: Suggestion parsing, text manipulation, state management

### Integration Testing
- **API testing**: Test all edge function endpoints
- **Database**: Verify CRUD operations
- **Auth flows**: Test login/logout scenarios

### End-to-End Testing
- **Tool**: Playwright or Cypress
- **Key flows**: Complete user journey from signup to export
- **Cross-browser**: Chrome, Safari, Firefox

### Load Testing
- **Tool**: k6 or Artillery
- **Target**: 100 concurrent users
- **Metrics**: Response time, error rate

---

## DevOps & Deployment Pipeline

### Git Workflow
```
main (production)
  └── develop
       └── feature/[name]
```

### CI/CD Pipeline
1. **On Pull Request**:
   - Run linting
   - Run unit tests
   - Build check

2. **On Merge to Main**:
   - Run full test suite
   - Build production bundle
   - Deploy to Vercel
   - Run smoke tests

### Environment Variables
```
Development:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Production (additional):
- OPENAI_API_KEY (in Supabase)
- SENTRY_DSN (error tracking)
```

### Monitoring
- **Uptime**: Vercel Analytics
- **Errors**: Sentry or LogRocket
- **Performance**: Web Vitals tracking

---

## Risk Register & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OpenAI API downtime | High | Low | Implement fallback to cached suggestions |
| Slow AI response times | Medium | Medium | Show loading states, implement timeouts |
| Data loss | High | Low | Regular database backups, auto-save |
| Security breach | High | Low | Use Supabase RLS, validate all inputs |
| Poor suggestion quality | Medium | Medium | Collect feedback, iterate on prompts |

---

## Success Metrics Alignment

### Metric Tracking Implementation
1. **Grammar Accuracy (≥85%)**
   - Track via suggestion acceptance rate
   - Filter by suggestion type = 'grammar'

2. **Latency (≤1.5s median)**
   - Log edge function response times
   - Calculate median in analytics

3. **Suggestion Relevance (≥80% accepted)**
   - Track accept/reject/ignore rates
   - Dashboard visualization

4. **CTR Improvement (≥10%)**
   - Post-MVP: Survey users
   - Track in future version

---

## Next Steps & Open Questions

### Immediate Next Steps
1. Set up development environment
2. Create Supabase project
3. Begin with Task 1 (Docker setup)
4. Follow tasks sequentially

### Future Enhancements (Post-MVP)
1. Mobile app development
2. Team collaboration features
3. Advanced analytics
4. Chrome extension
5. API for third-party integrations

### Decisions Made
- Using Supabase built-in auth (not social login for MVP)
- English-only support
- Single brand voice profile per user
- No version history in MVP

---

## Clarifying Questions

None outstanding - all questions have been answered in the clarification section.

---

*This plan provides a complete roadmap for building WordWise AI from scratch. Each task builds upon the previous one, creating a logical progression from setup to deployment. The junior developer should follow these steps sequentially, testing thoroughly at each stage before moving forward.*