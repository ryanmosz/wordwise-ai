# WordWise AI MVP - Detailed Task List

## Relevant Files

### Docker & Configuration
- `docker-compose.yml` - Docker orchestration for development environment with frontend and postgres services
- `frontend/Dockerfile.dev` - Frontend container configuration
- `.env.example` - Environment variable template
- `.env` - Local environment configuration (created from .env.example)

### Frontend Core
- `frontend/package.json` - Project dependencies and scripts
- `frontend/vite.config.ts` - Vite build configuration
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/src/index.css` - Global styles with Tailwind directives
- `frontend/src/App.tsx` - Main application component with routing

### Authentication & Services
- `frontend/src/services/supabase.ts` - Supabase client initialization
- `frontend/src/store/authStore.ts` - Zustand store for authentication state
- `frontend/src/pages/LoginPage.tsx` - Login page component
- `frontend/src/pages/SignupPage.tsx` - Signup page component
- `frontend/src/components/auth/AuthForm.tsx` - Reusable authentication form

### Editor & Documents
- `frontend/src/pages/EditorPage.tsx` - Main editor interface
- `frontend/src/components/editor/TextEditor.tsx` - TipTap rich text editor component
- `frontend/src/store/documentStore.ts` - Document state management
- `frontend/src/components/editor/SuggestionHighlight.tsx` - Text highlighting for suggestions
- `frontend/src/components/editor/SuggestionCard.tsx` - Suggestion popup component

### AI Integration
- `supabase/functions/analyze-text/index.ts` - Edge function for AI text analysis
- `frontend/src/services/aiService.ts` - Frontend AI service integration
- `frontend/src/hooks/useSuggestions.ts` - Custom hook for suggestion management

### Settings & Analytics
- `frontend/src/pages/SettingsPage.tsx` - User settings interface
- `frontend/src/pages/DashboardPage.tsx` - Analytics dashboard
- `frontend/src/services/analyticsService.ts` - Analytics tracking service
- `frontend/src/components/ExportModal.tsx` - Document export functionality

### Common Components
- `frontend/src/components/common/LoadingSpinner.tsx` - Loading indicator
- `frontend/src/components/common/ErrorBoundary.tsx` - Error handling wrapper

### Notes
- Unit tests should be placed alongside code files (e.g., `Component.tsx` and `Component.test.tsx`)
- Use `npm test` to run tests, `npm test -- --watch` for watch mode
- Follow React/TypeScript conventions from the .cursor/rules folder

## Tasks

- [ ] 1.0 Docker Development Environment Setup
  - [x] 1.1 Create project directory structure
  - [x] 1.2 Create docker-compose.yml with frontend and postgres services
  - [ ] 1.3 Create frontend/Dockerfile.dev for Node.js development
  - [ ] 1.4 Create .env.example with placeholder values
  - [ ] 1.5 Test Docker environment startup

- [ ] 2.0 Initialize Frontend React Application
  - [ ] 2.1 Initialize Vite React TypeScript project
  - [ ] 2.2 Install core dependencies (zustand, supabase-js, react-router-dom)
  - [ ] 2.3 Configure Tailwind CSS
  - [ ] 2.4 Create component directory structure
  - [ ] 2.5 Set up basic App.tsx with welcome message
  - [ ] 2.6 Configure Vite for port 3000

- [ ] 3.0 Supabase Project Configuration
  - [ ] 3.1 Create Supabase project via dashboard
  - [ ] 3.2 Copy project credentials (URL and anon key)
  - [ ] 3.3 Create .env file from .env.example
  - [ ] 3.4 Execute database schema SQL
  - [ ] 3.5 Configure email authentication settings
  - [ ] 3.6 Create Supabase client service
  - [ ] 3.7 Create authentication store with Zustand

- [ ] 4.0 Authentication UI Implementation
  - [ ] 4.1 Create LoginPage component with form
  - [ ] 4.2 Create SignupPage component with validation
  - [ ] 4.3 Create reusable AuthForm component
  - [ ] 4.4 Implement React Router navigation
  - [ ] 4.5 Add test user login functionality
  - [ ] 4.6 Create LoadingSpinner component
  - [ ] 4.7 Implement form validation and error handling

- [ ] 5.0 Document Editor Interface
  - [ ] 5.1 Install TipTap editor dependencies
  - [ ] 5.2 Create EditorPage layout component
  - [ ] 5.3 Implement TextEditor with TipTap
  - [ ] 5.4 Create document store with Zustand
  - [ ] 5.5 Implement auto-save functionality
  - [ ] 5.6 Add document management dropdown
  - [ ] 5.7 Create word/character count display

- [ ] 6.0 AI Edge Function Development
  - [ ] 6.1 Install and configure Supabase CLI
  - [ ] 6.2 Initialize Supabase functions directory
  - [ ] 6.3 Create analyze-text edge function
  - [ ] 6.4 Implement OpenAI integration
  - [ ] 6.5 Add prompt engineering logic
  - [ ] 6.6 Configure OpenAI API key
  - [ ] 6.7 Deploy edge function to Supabase

- [ ] 7.0 Inline Suggestion UI
  - [ ] 7.1 Create SuggestionHighlight component
  - [ ] 7.2 Create SuggestionCard popup component
  - [ ] 7.3 Implement suggestion type color coding
  - [ ] 7.4 Add TipTap custom marks for highlights
  - [ ] 7.5 Create useSuggestions custom hook
  - [ ] 7.6 Implement suggestion state management
  - [ ] 7.7 Add accept/reject functionality

- [ ] 8.0 Frontend-Backend Integration
  - [ ] 8.1 Create AI service module
  - [ ] 8.2 Implement debounced text analysis
  - [ ] 8.3 Add loading states to editor
  - [ ] 8.4 Implement error handling
  - [ ] 8.5 Create request queue system
  - [ ] 8.6 Add performance optimizations

- [ ] 9.0 Brand Voice Settings
  - [ ] 9.1 Create SettingsPage component
  - [ ] 9.2 Implement ToneSelector dropdown
  - [ ] 9.3 Create BannedWordsList manager
  - [ ] 9.4 Add reading level selector
  - [ ] 9.5 Implement settings persistence
  - [ ] 9.6 Create settings store or extend authStore

- [ ] 10.0 Enhanced AI Features
  - [ ] 10.1 Update edge function prompt structure
  - [ ] 10.2 Implement feature-specific prompts
  - [ ] 10.3 Add suggestion ranking logic
  - [ ] 10.4 Create specialized analyzers
  - [ ] 10.5 Implement A/B testing generator
  - [ ] 10.6 Add readability scoring

- [ ] 11.0 Analytics Implementation
  - [ ] 11.1 Update suggestion card to track actions
  - [ ] 11.2 Create analytics service
  - [ ] 11.3 Implement visual feedback animations
  - [ ] 11.4 Add batch tracking system
  - [ ] 11.5 Create session statistics tracking

- [ ] 12.0 Analytics Dashboard
  - [ ] 12.1 Create DashboardPage layout
  - [ ] 12.2 Implement MetricCard components
  - [ ] 12.3 Create simple chart components
  - [ ] 12.4 Add data fetching logic
  - [ ] 12.5 Implement time period selector
  - [ ] 12.6 Add insight messages

- [ ] 13.0 Document Export Feature
  - [ ] 13.1 Create ExportModal component
  - [ ] 13.2 Implement format conversion utilities
  - [ ] 13.3 Add file download functionality
  - [ ] 13.4 Create export button in editor
  - [ ] 13.5 Add keyboard shortcut support

- [ ] 14.0 Final Polish
  - [ ] 14.1 Create onboarding tour
  - [ ] 14.2 Add empty state components
  - [ ] 14.3 Improve loading states
  - [ ] 14.4 Implement keyboard shortcuts
  - [ ] 14.5 Polish UI spacing and animations
  - [ ] 14.6 Add error boundary
  - [ ] 14.7 Optimize performance

- [ ] 15.0 Production Deployment
  - [ ] 15.1 Clean up console logs
  - [ ] 15.2 Deploy frontend to Vercel
  - [ ] 15.3 Configure production environment
  - [ ] 15.4 Set up Supabase production settings
  - [ ] 15.5 Create demo accounts
  - [ ] 15.6 Production testing checklist
  - [ ] 15.7 Create demo video

---

## Detailed Task Implementations

### Task 1.1: Create project directory structure

**Goal**: Set up the base project directory on macOS that will contain all WordWise AI code.

**Implementation**:
```bash
# Open Terminal application
# Navigate to home directory
cd ~
# Create project directory
mkdir wordwise-ai
# Enter the directory
cd wordwise-ai
# Create frontend subdirectory
mkdir frontend
```

**Test**:
```bash
# Verify you're in the correct directory
pwd
# Should output: /Users/[your-username]/wordwise-ai

# Verify frontend directory exists
ls -la
# Should show: frontend directory
```

---

### Task 1.2: Create docker-compose.yml with frontend and postgres services

**Goal**: Create a Docker Compose configuration that defines both the frontend development server and PostgreSQL database.

**Implementation**:
Create `docker-compose.yml` in project root with:
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

**Test**:
```bash
# Verify file exists
ls -la docker-compose.yml
# Should show the file with correct permissions

# Validate YAML syntax
docker-compose config
# Should output the parsed configuration without errors
```

---

### Task 1.3: Create frontend/Dockerfile.dev for Node.js development

**Goal**: Create a Dockerfile that sets up a Node.js development environment for the React application.

**Implementation**:
Create `frontend/Dockerfile.dev` with:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

**Test**:
```bash
# Navigate to frontend directory
cd frontend
# Verify file exists
ls -la Dockerfile.dev
# Should show the file

# Check Docker can parse it
docker build -f Dockerfile.dev --no-cache .
# Will fail at COPY package*.json but syntax should be valid
```

---

### Task 1.4: Create .env.example with placeholder values

**Goal**: Create an environment variable template that developers can copy and fill with their own values.

**Implementation**:
Create `.env.example` in project root:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Test**:
```bash
# Navigate to project root
cd ~/wordwise-ai
# Verify file exists
cat .env.example
# Should display the two placeholder lines
```

---

### Task 1.5: Test Docker environment startup

**Goal**: Verify that Docker Compose can start the PostgreSQL service successfully.

**Implementation**:
```bash
# Ensure Docker Desktop is running (check menu bar)
# From project root
docker-compose up postgres
```

**Test**:
Look for these indicators:
- "database system is ready to accept connections" message
- No error messages in red
- Container stays running (doesn't exit)
- Press Ctrl+C to stop when verified

---

### Task 2.1: Initialize Vite React TypeScript project

**Goal**: Create a new React application using Vite with TypeScript template in the frontend directory.

**Implementation**:
```bash
cd ~/wordwise-ai/frontend
npm create vite@latest . -- --template react-ts
# When prompted about non-empty directory, type 'y' to confirm
```

**Test**:
```bash
# Verify key files were created
ls -la
# Should see: package.json, tsconfig.json, vite.config.ts, src/

# Check package.json has react and typescript
cat package.json | grep -E "react|typescript"
# Should show both dependencies
```

---

### Task 2.2: Install core dependencies

**Goal**: Install all required npm packages for state management, database connectivity, and routing.

**Implementation**:
```bash
cd ~/wordwise-ai/frontend
npm install
npm install zustand @supabase/supabase-js react-router-dom
npm install -D @types/react-router-dom
```

**Test**:
```bash
# Verify installations
npm list zustand @supabase/supabase-js react-router-dom
# Should show all three packages installed

# Check no errors
npm audit
# May show vulnerabilities but no missing dependencies
```

---

### Task 2.3: Configure Tailwind CSS

**Goal**: Set up Tailwind CSS for utility-first styling following the project's styling conventions.

**Implementation**:
```bash
cd ~/wordwise-ai/frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Test**:
```bash
# Verify config files created
ls -la tailwind.config.js postcss.config.js
# Both files should exist

# Verify content paths
grep -A 3 "content:" tailwind.config.js
# Should show the content array with paths
```

---

### Task 2.4: Create component directory structure

**Goal**: Set up organized folder structure for React components following best practices.

**Implementation**:
```bash
cd ~/wordwise-ai/frontend/src
mkdir -p components/auth
mkdir -p components/editor
mkdir -p components/dashboard
mkdir -p components/common
mkdir -p pages
mkdir -p store
mkdir -p services
mkdir -p types
mkdir -p utils
mkdir -p hooks
```

**Test**:
```bash
# Verify all directories created
find . -type d -name "components" -o -name "pages" -o -name "store" -o -name "services" | sort
# Should list all created directories

# Check structure
tree -d -L 2
# Should show organized folder tree (install tree with: brew install tree)
```

---

### Task 2.5: Set up basic App.tsx with welcome message

**Goal**: Replace default Vite content with a simple welcome page using Tailwind CSS.

**Implementation**:
Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update `src/App.tsx`:
```typescript
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

**Test**:
```bash
# Start development server
npm run dev
# Open browser to http://localhost:5173
# Should see styled welcome message with blue heading
```

---

### Task 2.6: Configure Vite for port 3000

**Goal**: Change Vite's default port from 5173 to 3000 to match Docker configuration.

**Implementation**:
Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
```

**Test**:
```bash
# Stop server if running (Ctrl+C)
# Restart development server
npm run dev
# Should now show: Local: http://localhost:3000/
# Verify browser loads at port 3000
```

---

### Task 3.1: Create Supabase project via dashboard

**Goal**: Set up a new Supabase project that will provide authentication, database, and serverless functions.

**Implementation**:
1. Open browser to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub account
4. Click "New project"
5. Fill in:
   - Project name: wordwise-ai
   - Database Password: Generate strong password and save securely
   - Region: Select closest to your location
6. Click "Create new project"
7. Wait 2-3 minutes for provisioning

**Test**:
- Project dashboard loads without errors
- Shows "Setting up project" then transitions to dashboard
- Left sidebar shows all services (Database, Auth, Storage, etc.)

---

### Task 3.2: Copy project credentials

**Goal**: Retrieve the API credentials needed to connect the React app to Supabase.

**Implementation**:
1. In Supabase dashboard, click "Settings" (gear icon)
2. Click "API" in settings menu
3. Copy two values:
   - Project URL (starts with https://)
   - anon public key (long string)
4. Save these securely for next step

**Test**:
- Verify URL format: https://[random-string].supabase.co
- Verify anon key is a long JWT token (usually 200+ characters)
- Both values copied to clipboard or saved in temporary file

---

### Task 3.3: Create .env file from .env.example

**Goal**: Create local environment configuration with actual Supabase credentials.

**Implementation**:
```bash
cd ~/wordwise-ai
cp .env.example .env
# Edit .env file with your actual values
# Replace your_supabase_url_here with actual URL
# Replace your_supabase_anon_key_here with actual key
```

**Test**:
```bash
# Verify file created and not example
ls -la .env
# Should show .env (not .env.example)

# Verify values are set (be careful not to expose keys)
grep VITE_SUPABASE_URL .env
# Should show your actual URL (not placeholder)
```

---

### Task 3.4: Execute database schema SQL

**Goal**: Create all required database tables for users, documents, suggestions, and analytics.

**Implementation**:
1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy entire SQL schema from plan (users, documents, suggestions, analytics tables)
4. Paste into query editor
5. Click "Run" button
6. Verify "Success" message

**Test**:
1. Go to "Table Editor" in dashboard
2. Verify 4 tables exist:
   - users (with columns: id, email, brand_tone, etc.)
   - documents (with user_id foreign key)
   - suggestions (with document_id foreign key)
   - analytics (with user_id foreign key)
3. Check each table structure matches schema

---

### Task 3.5: Configure email authentication settings

**Goal**: Enable email-based authentication and disable email confirmation for easier development.

**Implementation**:
1. In Supabase dashboard, go to "Authentication"
2. Click "Providers"
3. Ensure "Email" is enabled (should be by default)
4. Click on Email provider settings
5. Toggle OFF "Confirm email"
6. Save changes

**Test**:
1. Go to Authentication > Users
2. Click "Add user" > "Create new user"
3. Create test user:
   - Email: test@wordwise.ai
   - Password: testpass123
4. User should appear immediately in list (no email confirmation needed)

---

### Task 3.6: Create Supabase client service

**Goal**: Create a TypeScript module that initializes the Supabase client for use throughout the application.

**Implementation**:
Create `src/services/supabase.ts`:
```typescript
// Import createClient from Supabase
// Get URL and key from environment variables
// Throw error if missing
// Export configured client instance
```

Pseudocode:
```
import createClient from @supabase/supabase-js

const url = get VITE_SUPABASE_URL from import.meta.env
const key = get VITE_SUPABASE_ANON_KEY from import.meta.env

if (!url || !key) {
  throw Error with message about missing env vars
}

export const supabase = createClient(url, key)
```

**Test**:
```bash
# In frontend directory
npm run dev
# Should start without errors
# Check browser console - no errors about missing Supabase credentials
```

---

### Task 3.7: Create authentication store with Zustand

**Goal**: Implement state management for user authentication using Zustand following the project patterns.

**Implementation**:
Create `src/store/authStore.ts`:
```typescript
// Define AuthState interface with:
//   - user (any | null)
//   - loading (boolean)
//   - signIn method
//   - signUp method
//   - signOut method
//   - checkUser method

// Create store with zustand
// Implement each method using supabase auth
```

Pseudocode:
```
interface AuthState {
  user: any | null
  loading: boolean
  signIn: (email, password) => Promise<void>
  signUp: (email, password) => Promise<void>
  signOut: () => Promise<void>
  checkUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({email, password})
    if (error) throw error
    set({ user: data.user })
  },
  
  // Similar for other methods
}))
```

**Test**:
```typescript
// In browser console (with app running):
// Test store is accessible
// window.useAuthStore should be undefined (not global)
// No TypeScript errors in editor
```

---

### Task 4.1: Create LoginPage component with form

**Goal**: Build a login page with email/password fields and a prominent test user button.

**Implementation**:
Create `src/pages/LoginPage.tsx`:
```
Component structure:
- Container div with centered content
- WordWise AI heading
- Form with:
  - Email input
  - Password input
  - Login button
  - Error message area
- Link to signup
- Divider
- Test User Login button (green, prominent)
```

Pseudocode:
```
export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuthStore()
  
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      // navigate to /editor
    } catch (err) {
      setError(err.message)
    }
  }
  
  const handleTestLogin = () => {
    setEmail('test@wordwise.ai')
    setPassword('testpass123')
    // trigger form submit
  }
  
  return (
    <div centered layout>
      <h1>WordWise AI</h1>
      <form onSubmit={handleLogin}>
        <input email />
        <input password />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <Link to="/signup">Sign up here</Link>
      <button onClick={handleTestLogin} green>Test User Login</button>
    </div>
  )
}
```

**Test**:
- Navigate to /login route
- Form displays with all fields
- Test User Login button is visible and green
- Clicking fields allows text input

---

### Task 4.2: Create SignupPage component with validation

**Goal**: Build a registration page with password confirmation and validation.

**Implementation**:
Create `src/pages/SignupPage.tsx`:
```
Component structure:
- Similar layout to login
- Form with:
  - Email input
  - Password input (with strength indicator)
  - Confirm password input
  - Terms checkbox
  - Create Account button
- Password validation rules displayed
- Link back to login
```

Pseudocode:
```
export function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})
  
  const validatePassword = (password) => {
    // Check length >= 6
    // Return strength level
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate all fields
    // Check passwords match
    // Check terms accepted
    // Call signUp from store
    // Handle errors
  }
  
  return (
    <form with all inputs and validation feedback>
  )
}
```

**Test**:
- Navigate to /signup route
- All form fields display
- Password field shows strength indicator
- Submit button disabled until valid
- Validation messages appear on blur

---

### Task 4.3: Create reusable AuthForm component

**Goal**: Extract common form logic into a reusable component for both login and signup.

**Implementation**:
Create `src/components/auth/AuthForm.tsx`:
```
Props interface:
- mode: 'login' | 'signup'
- onSubmit: (data) => Promise<void>
- error?: string

Component features:
- Email validation (contains @ and .)
- Password validation (min 6 chars)
- Loading state during submit
- Error display
- Consistent styling
```

Pseudocode:
```
interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthData) => Promise<void>
  error?: string
}

export function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.')
  }
  
  // Form with conditional fields based on mode
  // Show spinner when loading
  // Disable inputs when loading
}
```

**Test**:
- Refactor LoginPage to use AuthForm
- Verify login still works
- Check email validation (try "notanemail")
- Check loading state appears during submit

---

### Task 4.4: Implement React Router navigation

**Goal**: Set up routing system with protected routes that redirect unauthenticated users.

**Implementation**:
Update `src/App.tsx`:
```
Import:
- BrowserRouter, Routes, Route, Navigate
- All page components

Structure:
- Wrap app in BrowserRouter
- Define routes:
  - /login -> LoginPage
  - /signup -> SignupPage
  - /editor -> EditorPage (protected)
  - /settings -> SettingsPage (protected)
  - /dashboard -> DashboardPage (protected)
  - / -> Navigate to /login or /editor based on auth

Protected route logic:
- Check if user exists in auth store
- If not, redirect to /login
- If yes, render component
```

**Test**:
```bash
# With app running
# Navigate to http://localhost:3000/
# Should redirect to /login
# Try http://localhost:3000/editor
# Should redirect to /login if not authenticated
```

---

### Task 4.5: Add test user login functionality

**Goal**: Implement one-click test user login for development efficiency.

**Implementation**:
In LoginPage, update handleTestLogin:
```
const handleTestLogin = async () => {
  // Set loading state
  setIsLoading(true)
  
  // Auto-fill form
  setEmail('test@wordwise.ai')
  setPassword('testpass123')
  
  // Wait for state update
  setTimeout(() => {
    // Trigger form submit programmatically
    formRef.current?.requestSubmit()
  }, 100)
}
```

Style test button:
```
className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg"
```

**Test**:
1. Click "Test User Login" button
2. Form should auto-fill
3. Loading spinner appears
4. Redirects to /editor on success
5. Shows error if test user doesn't exist

---

### Task 4.6: Create LoadingSpinner component

**Goal**: Build a reusable loading indicator following Tailwind patterns.

**Implementation**:
Create `src/components/common/LoadingSpinner.tsx`:
```
export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return (
    <div className="flex justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-blue-600`} />
    </div>
  )
}
```

**Test**:
- Import and use in LoginPage during loading
- Spinner should rotate smoothly
- Different sizes work correctly
- Animation uses Tailwind's animate-spin

---

### Task 4.7: Implement form validation and error handling

**Goal**: Add comprehensive validation with clear error messages for better UX.

**Implementation**:
Enhance AuthForm validation:
```
Validation rules:
- Email: Required, valid format
- Password: Required, min 6 characters
- Confirm Password: Must match password

Error display:
- Field-level errors below inputs
- General errors at form top
- Clear errors on field change

const validateForm = () => {
  const errors = {}
  
  if (!email) errors.email = 'Email is required'
  else if (!validateEmail(email)) errors.email = 'Invalid email format'
  
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  
  return errors
}
```

**Test**:
1. Submit empty form - see "required" errors
2. Enter "test" as email - see "invalid format"
3. Enter "12345" as password - see "too short"
4. Fix errors - messages disappear
5. Network error - shows at form top

---

### Task 5.1: Install TipTap editor dependencies

**Goal**: Add the rich text editor library that will power the document editing experience.

**Implementation**:
```bash
cd ~/wordwise-ai/frontend
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight
```

**Test**:
```bash
# Verify packages installed
npm list @tiptap/react
# Should show @tiptap/react@2.x.x

# Check no peer dependency warnings
npm install
# Should complete without errors
```

---

### Task 5.2: Create EditorPage layout component

**Goal**: Build the main editor interface layout with header, editor area, and sidebar.

**Implementation**:
Create `src/pages/EditorPage.tsx`:
```
Layout structure:
- Header bar:
  - WordWise AI logo/title
  - Settings button
  - Export button
  - Logout button
- Document bar:
  - Document title (editable)
  - Save status indicator
- Main content area (flex):
  - Editor section (left, 2/3 width)
  - Suggestions panel (right, 1/3 width)
- Footer bar:
  - Word count
  - Character count
  - Readability score
```

Pseudocode:
```
export function EditorPage() {
  const [document, setDocument] = useState(null)
  const [saveStatus, setSaveStatus] = useState('saved')
  
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        // Logo and buttons
      </header>
      
      <div className="border-b px-4 py-2">
        // Document title and save status
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1">
          // TextEditor component
        </div>
        <aside className="w-80 border-l">
          // Suggestions panel
        </aside>
      </div>
      
      <footer className="border-t">
        // Stats
      </footer>
    </div>
  )
}
```

**Test**:
- Navigate to /editor (after login)
- Layout fills screen height
- Sections properly divided
- Responsive on window resize

---

### Task 5.3: Implement TextEditor with TipTap

**Goal**: Create the rich text editor component with basic formatting capabilities.

**Implementation**:
Create `src/components/editor/TextEditor.tsx`:
```
Features:
- Basic formatting (bold, italic, underline)
- Headings (H1, H2, H3)
- Paragraphs
- Custom highlight extension
- onChange callback
- Toolbar with format buttons

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'

export function TextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })
  
  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
```

**Test**:
1. Type in editor - text appears
2. Select text and press Cmd+B - becomes bold
3. Toolbar buttons work for formatting
4. Can create headings and paragraphs

---

### Task 5.4: Create document store with Zustand

**Goal**: Implement state management for documents including current document, list, and save status.

**Implementation**:
Create `src/store/documentStore.ts`:
```
interface Document {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface DocumentState {
  currentDocument: Document | null
  documents: Document[]
  saveStatus: 'saved' | 'saving' | 'error'
  
  loadDocuments: () => Promise<void>
  loadDocument: (id: string) => Promise<void>
  createDocument: () => Promise<void>
  updateDocument: (updates: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  setSaveStatus: (status: SaveStatus) => void
}

Implementation:
- Each method calls Supabase
- Updates local state optimistically
- Handles errors appropriately
- Updates saveStatus during operations
```

**Test**:
```javascript
// In browser console:
// After creating store, state should initialize
// Check TypeScript types are correct
// No console errors on load
```

---

### Task 5.5: Implement auto-save functionality

**Goal**: Save document changes automatically after user stops typing for 2 seconds.

**Implementation**:
In TextEditor component:
```
Add debounced save:

import { useCallback, useEffect } from 'react'
import { debounce } from 'lodash' // or implement custom

const debouncedSave = useCallback(
  debounce(async (content) => {
    setSaveStatus('saving')
    try {
      await updateDocument({ content })
      setSaveStatus('saved')
    } catch (error) {
      setSaveStatus('error')
    }
  }, 2000),
  []
)

// In editor onUpdate:
onUpdate: ({ editor }) => {
  const content = editor.getHTML()
  onChange(content)
  debouncedSave(content)
}
```

**Test**:
1. Type in editor
2. Stop typing and wait 2 seconds
3. "Saving..." should appear
4. Changes to "Saved"
5. Refresh page - content persists

---

### Task 5.6: Add document management dropdown

**Goal**: Create a dropdown to switch between documents and create new ones.

**Implementation**:
Add to EditorPage:
```
Document selector dropdown:
- Current document title
- Dropdown arrow
- Menu items:
  - List of recent documents
  - "New Document" option
  - Divider
  - "Delete Document" (if not new)

const DocumentSelector = () => {
  const { documents, currentDocument, createDocument, loadDocument } = useDocumentStore()
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        {currentDocument?.title || 'Untitled'} ▼
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-lg">
          {documents.map(doc => (
            <button onClick={() => loadDocument(doc.id)}>
              {doc.title}
            </button>
          ))}
          <button onClick={createDocument}>+ New Document</button>
        </div>
      )}
    </div>
  )
}
```

**Test**:
1. Click document title
2. Dropdown opens with document list
3. Click different document - loads it
4. Click "New Document" - creates new
5. Current document highlighted in list

---

### Task 5.7: Create word/character count display

**Goal**: Show real-time statistics about the document in the footer.

**Implementation**:
Create utility function and component:
```
// In utils/textStats.ts
export function getTextStats(html: string) {
  const text = html.replace(/<[^>]*>/g, '') // Strip HTML
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const characters = text.length
  
  return { words: words.length, characters }
}

// In EditorPage footer
const { words, characters } = getTextStats(document?.content || '')

<footer className="border-t px-4 py-2 text-sm text-gray-600">
  Words: {words} | Characters: {characters} | Readability: N/A
</footer>
```

**Test**:
1. Empty editor shows "Words: 0"
2. Type "Hello world" - shows "Words: 2"
3. Stats update as you type
4. HTML tags don't count as words

---

### Task 6.1: Install and configure Supabase CLI

**Goal**: Set up the command-line tools needed to develop and deploy edge functions.

**Implementation**:
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Verify installation
supabase --version
# Should show version number
```

**Test**:
```bash
# Check CLI is available
which supabase
# Should show: /opt/homebrew/bin/supabase or similar

# Check help works
supabase help
# Should show command list
```

---

### Task 6.2: Initialize Supabase functions directory

**Goal**: Set up the local project structure for Supabase edge functions.

**Implementation**:
```bash
cd ~/wordwise-ai
supabase init
# Creates supabase/ directory with config

supabase login
# Opens browser for authentication
# Log in with same account used for dashboard
```

**Test**:
```bash
# Verify structure created
ls -la supabase/
# Should show: config.toml, functions/, migrations/

# Verify logged in
supabase projects list
# Should show your wordwise-ai project
```

---

### Task 6.3: Create analyze-text edge function

**Goal**: Create the serverless function that will handle AI text analysis.

**Implementation**:
```bash
cd ~/wordwise-ai
supabase functions new analyze-text
```

This creates `supabase/functions/analyze-text/index.ts`

**Test**:
```bash
# Verify function created
ls -la supabase/functions/analyze-text/
# Should show: index.ts

# Check boilerplate content
cat supabase/functions/analyze-text/index.ts
# Should show Deno serve() example
```

---

### Task 6.4: Implement OpenAI integration

**Goal**: Write the edge function logic to call OpenAI's API and analyze text.

**Implementation**:
Update `supabase/functions/analyze-text/index.ts`:
```
Pseudocode structure:

import { serve } from 'deno/http'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  // Set CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Parse request body
    const { text, documentId, userSettings } = await req.json()
    
    // Validate inputs
    if (!text || !userSettings) {
      return error response 400
    }
    
    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: buildSystemPrompt(userSettings) },
          { role: 'user', content: buildUserPrompt(text) }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })
    
    // Parse OpenAI response
    const data = await openAIResponse.json()
    
    // Extract suggestions from GPT response
    const suggestions = parseSuggestions(data.choices[0].message.content)
    
    // Return formatted suggestions
    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return error response 500
  }
})
```

**Test**:
```bash
# Test function locally (after adding API key)
supabase functions serve analyze-text
# Should start local server on port 54321
```

---

### Task 6.5: Add prompt engineering logic

**Goal**: Create sophisticated prompts that generate high-quality suggestions for all feature types.

**Implementation**:
Add to edge function:
```
function buildSystemPrompt(userSettings) {
  return `You are an expert marketing copywriter and editor.
  
  Brand voice: ${userSettings.brandTone}
  Target reading level: Grade ${userSettings.readingLevel}
  Banned words: ${userSettings.bannedWords.join(', ')}
  
  Analyze the text and provide suggestions for:
  1. Grammar and spelling errors
  2. Tone alignment with brand voice
  3. More persuasive language
  4. Improved clarity and conciseness
  5. Better headlines (for headings)
  6. Simpler language (if above reading level)
  7. Alternative phrasings for A/B testing
  
  Format each suggestion as JSON with these fields:
  - startIndex: character position where issue starts
  - endIndex: character position where issue ends
  - type: one of [grammar, tone, persuasive, conciseness, headline, readability, ab_test]
  - originalText: the problematic text
  - suggestionText: your recommended replacement
  - explanation: why this change improves the text
  - confidence: 0.0 to 1.0 score
  
  Return an array of suggestion objects.`
}

function buildUserPrompt(text) {
  return `Analyze this marketing copy and provide improvement suggestions:
  
  "${text}"
  
  Return a JSON array of suggestions.`
}
```

**Test**:
- Prompt should be clear and specific
- Example outputs should parse as valid JSON
- All suggestion types covered

---

### Task 6.6: Configure OpenAI API key

**Goal**: Securely add the OpenAI API key to edge function environment.

**Implementation**:
```bash
# Get API key from https://platform.openai.com/api-keys
# Create new key if needed

# Set in Supabase
supabase secrets set OPENAI_API_KEY=sk-proj-...your-key-here

# Verify it's set (won't show actual value)
supabase secrets list
# Should show OPENAI_API_KEY in list
```

**Test**:
```bash
# Deploy function with secret
supabase functions deploy analyze-text

# Secret should be available in production
# Cannot test locally without setting env var
```

---

### Task 6.7: Deploy edge function to Supabase

**Goal**: Deploy the completed edge function to Supabase's edge runtime.

**Implementation**:
```bash
cd ~/wordwise-ai

# Deploy the function
supabase functions deploy analyze-text

# Should output:
# Deploying function: analyze-text
# Function deployed successfully!
```

**Test**:
1. Go to Supabase dashboard
2. Navigate to Edge Functions
3. Verify analyze-text appears in list
4. Click on it to see logs
5. Test with curl:
```bash
curl -X POST https://[project-id].supabase.co/functions/v1/analyze-text \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"text": "This are test.", "userSettings": {"brandTone": "friendly", "readingLevel": 8, "bannedWords": []}}'
```

---

### Task 7.1: Create SuggestionHighlight component

**Goal**: Build a component that wraps text spans with colored underlines based on suggestion type.

**Implementation**:
Create `src/components/editor/SuggestionHighlight.tsx`:
```
interface SuggestionHighlightProps {
  type: SuggestionType
  children: React.ReactNode
  onClick: () => void
}

Color mapping:
- grammar: 'border-b-2 border-red-500'
- tone: 'border-b-2 border-yellow-500'
- persuasive: 'border-b-2 border-blue-500'
- headline: 'border-b-2 border-green-500'

export function SuggestionHighlight({ type, children, onClick }: Props) {
  const colorClass = getColorForType(type)
  
  return (
    <span
      className={`cursor-pointer ${colorClass} hover:bg-gray-100`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
```

**Test**:
- Component renders children text
- Correct color for each type
- Hover effect works
- Click handler fires

---

### Task 7.2: Create SuggestionCard popup component

**Goal**: Build the popup card that displays suggestion details and action buttons.

**Implementation**:
Create `src/components/editor/SuggestionCard.tsx`:
```
interface SuggestionCardProps {
  suggestion: Suggestion
  position: { x: number, y: number }
  onAccept: () => void
  onReject: () => void
  onClose: () => void
}

Layout:
- Fixed position based on coordinates
- White background with shadow
- Header with suggestion type
- Original text (strikethrough)
- Suggested text (highlighted green)
- Explanation text
- Confidence indicator (progress bar)
- Accept/Reject buttons

Positioning logic:
- Calculate if card would go off screen
- Adjust position to stay visible
- Point arrow to highlighted text
```

**Test**:
1. Card appears at correct position
2. Stays within viewport bounds
3. Shows all suggestion data
4. Buttons are clickable
5. Close button/click outside closes

---

### Task 7.3: Implement suggestion type color coding

**Goal**: Create consistent color scheme for different suggestion types throughout the app.

**Implementation**:
Create `src/utils/suggestionColors.ts`:
```
export const SUGGESTION_COLORS = {
  grammar: {
    border: 'border-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '📝'
  },
  tone: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: '🎯'
  },
  persuasive: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '💪'
  },
  // ... other types
}

export function getColorScheme(type: SuggestionType) {
  return SUGGESTION_COLORS[type] || SUGGESTION_COLORS.grammar
}
```

**Test**:
- Import in both components
- Colors apply consistently
- All types have color schemes
- Fallback works for unknown types

---

### Task 7.4: Add TipTap custom marks for highlights

**Goal**: Extend TipTap to support custom highlight marks for suggestions.

**Implementation**:
Create custom extension:
```
import { Mark } from '@tiptap/core'

export const SuggestionMark = Mark.create({
  name: 'suggestion',
  
  addAttributes() {
    return {
      suggestionId: {
        default: null,
      },
      suggestionType: {
        default: 'grammar',
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-suggestion]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', {
      'data-suggestion': HTMLAttributes.suggestionId,
      'data-type': HTMLAttributes.suggestionType,
      class: `suggestion-${HTMLAttributes.suggestionType}`
    }, 0]
  },
})

// Add to editor extensions
const editor = useEditor({
  extensions: [
    StarterKit,
    SuggestionMark,
  ]
})
```

**Test**:
1. Editor accepts custom mark
2. Can apply mark to text selection
3. Mark persists in HTML output
4. Styling applies based on type

---

### Task 7.5: Create useSuggestions custom hook

**Goal**: Centralize suggestion fetching and state management logic in a reusable hook.

**Implementation**:
Create `src/hooks/useSuggestions.ts`:
```
interface UseSuggestionsOptions {
  text: string
  documentId: string
  enabled: boolean
}

export function useSuggestions({ text, documentId, enabled }: Options) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Debounced fetch function
  const fetchSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!enabled || text.length < 10) return
      
      setIsLoading(true)
      try {
        const result = await aiService.analyzeText(text, documentId)
        setSuggestions(result.suggestions)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }, 2000),
    [documentId, enabled]
  )
  
  useEffect(() => {
    fetchSuggestions(text)
  }, [text])
  
  const acceptSuggestion = async (suggestionId: string) => {
    // Update local state
    // Send to analytics
  }
  
  const rejectSuggestion = async (suggestionId: string) => {
    // Update local state
    // Send to analytics
  }
  
  return {
    suggestions,
    isLoading,
    error,
    acceptSuggestion,
    rejectSuggestion
  }
}
```

**Test**:
```javascript
// Hook should:
// - Debounce API calls by 2 seconds
// - Skip short text (< 10 chars)
// - Handle loading states
// - Update suggestions array
// - Provide accept/reject methods
```

---

### Task 7.6: Implement suggestion state management

**Goal**: Track suggestion state (pending/accepted/rejected) and sync with TipTap marks.

**Implementation**:
Add to document store:
```
interface SuggestionState {
  activeSuggestions: Map<string, Suggestion>
  suggestionStatus: Map<string, 'pending' | 'accepted' | 'rejected'>
  
  addSuggestions: (suggestions: Suggestion[]) => void
  updateSuggestionStatus: (id: string, status: Status) => void
  clearSuggestions: () => void
  getSuggestionById: (id: string) => Suggestion | undefined
}

// In store implementation:
addSuggestions: (suggestions) => set((state) => {
  const newActive = new Map([...state.activeSuggestions])
  const newStatus = new Map([...state.suggestionStatus])
  
  suggestions.forEach(s => {
    newActive.set(s.id, s)
    newStatus.set(s.id, 'pending')
  })
  
  return {
    activeSuggestions: newActive,
    suggestionStatus: newStatus
  }
})
```

**Test**:
- Add suggestions to store
- Status tracks correctly
- Can retrieve by ID
- Clear removes all

---

### Task 7.7: Add accept/reject functionality

**Goal**: Implement the logic to apply or dismiss suggestions with visual feedback.

**Implementation**:
In SuggestionCard:
```
const handleAccept = async () => {
  // Start animation
  setIsAccepting(true)
  
  // Update editor text
  editor.chain()
    .focus()
    .setTextSelection({ from: suggestion.startIndex, to: suggestion.endIndex })
    .insertContent(suggestion.suggestionText)
    .removeMark('suggestion')
    .run()
  
  // Update store
  await acceptSuggestion(suggestion.id)
  
  // Visual feedback
  showSuccessAnimation()
  setTimeout(() => {
    onClose()
  }, 300)
}

const handleReject = async () => {
  // Start animation
  setIsRejecting(true)
  
  // Remove highlight
  editor.chain()
    .focus()
    .setTextSelection({ from: suggestion.startIndex, to: suggestion.endIndex })
    .removeMark('suggestion')
    .run()
  
  // Update store
  await rejectSuggestion(suggestion.id)
  
  // Visual feedback
  showDismissAnimation()
  setTimeout(() => {
    onClose()
  }, 300)
}
```

**Test**:
1. Accept replaces text correctly
2. Reject keeps original text
3. Highlight removed in both cases
4. Animations play smoothly
5. Card closes after action

---

### Task 8.1: Create AI service module

**Goal**: Build a service layer that handles all communication with the Supabase edge function.

**Implementation**:
Create `src/services/aiService.ts`:
```
interface AnalyzeTextOptions {
  text: string
  documentId: string
  userSettings: UserSettings
}

interface AnalyzeTextResponse {
  suggestions: Suggestion[]
}

class AIService {
  private baseUrl: string
  private anonKey: string
  private abortController: AbortController | null = null
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL
    this.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  }
  
  async analyzeText(options: AnalyzeTextOptions): Promise<AnalyzeTextResponse> {
    // Cancel previous request if exists
    if (this.abortController) {
      this.abortController.abort()
    }
    
    this.abortController = new AbortController()
    
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/analyze-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.anonKey}`
        },
        body: JSON.stringify(options),
        signal: this.abortController.signal
      })
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        return { suggestions: [] }
      }
      throw error
    } finally {
      this.abortController = null
    }
  }
  
  cancelAnalysis() {
    if (this.abortController) {
      this.abortController.abort()
    }
  }
}

export const aiService = new AIService()
```

**Test**:
```javascript
// Service should:
// - Make POST request to edge function
// - Include auth header
// - Handle errors gracefully
// - Support request cancellation
// - Return typed response
```

---

### Task 8.2: Implement debounced text analysis

**Goal**: Optimize API calls by waiting for user to stop typing before analyzing.

**Implementation**:
Update useSuggestions hook:
```
import { debounce } from 'lodash-es' // or implement custom

const useSuggestions = ({ text, documentId, userSettings }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const requestRef = useRef<number>(0)
  
  const analyzeText = useCallback(
    debounce(async (text: string) => {
      // Skip if too short
      if (text.length < 10) {
        setSuggestions([])
        return
      }
      
      // Track request number
      const requestId = ++requestRef.current
      
      setIsAnalyzing(true)
      
      try {
        const result = await aiService.analyzeText({
          text,
          documentId,
          userSettings
        })
        
        // Only update if this is still the latest request
        if (requestId === requestRef.current) {
          setSuggestions(result.suggestions)
        }
      } catch (error) {
        // Only show error for latest request
        if (requestId === requestRef.current) {
          console.error('Analysis error:', error)
        }
      } finally {
        if (requestId === requestRef.current) {
          setIsAnalyzing(false)
        }
      }
    }, 2000), // 2 second delay
    [documentId, userSettings]
  )
  
  useEffect(() => {
    analyzeText(text)
    
    // Cleanup
    return () => {
      analyzeText.cancel()
      aiService.cancelAnalysis()
    }
  }, [text, analyzeText])
  
  return { suggestions, isAnalyzing }
}
```

**Test**:
1. Type rapidly - only one request after stopping
2. Resume typing - cancels previous request
3. Very short text - no API call
4. Loading state shows during analysis

---

### Task 8.3: Add loading states to editor

**Goal**: Show visual indicators when AI analysis is in progress.

**Implementation**:
Update EditorPage:
```
Add to status bar:
{isAnalyzing && (
  <span className="flex items-center text-sm text-blue-600">
    <LoadingSpinner size="sm" />
    <span className="ml-2">Analyzing...</span>
  </span>
)}

Add subtle overlay to editor:
<div className="relative">
  <TextEditor />
  {isAnalyzing && (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-2 right-2">
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm animate-pulse">
          AI analyzing...
        </div>
      </div>
    </div>
  )}
</div>
```

**Test**:
1. Start typing - no indicator yet
2. Stop for 2 seconds - "Analyzing..." appears
3. Suggestions appear - indicator disappears
4. Indicator doesn't block typing

---

### Task 8.4: Implement error handling

**Goal**: Gracefully handle network errors and API failures with user-friendly messages.

**Implementation**:
Create error handling utilities:
```
// In utils/errorMessages.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('network')) {
      return 'Connection issue. Please check your internet and try again.'
    }
    if (error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment before trying again.'
    }
    if (error.message.includes('timeout')) {
      return 'Analysis is taking longer than usual. Please try again.'
    }
  }
  return 'Analysis temporarily unavailable. Please try again later.'
}

// In useSuggestions hook
const [error, setError] = useState<string | null>(null)

catch (error) {
  const message = getErrorMessage(error)
  setError(message)
  
  // Auto-clear error after 5 seconds
  setTimeout(() => setError(null), 5000)
}

// In UI
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    {error}
  </div>
)}
```

**Test**:
1. Disconnect internet - see connection error
2. Error auto-dismisses after 5 seconds
3. Can continue typing during error
4. Next analysis attempt works when connected

---

### Task 8.5: Create request queue system

**Goal**: Manage multiple analysis requests efficiently and prevent overwhelming the API.

**Implementation**:
```
class RequestQueue {
  private queue: AnalysisRequest[] = []
  private processing = false
  private currentRequest: AbortController | null = null
  
  async add(request: AnalysisRequest): Promise<AnalysisResult> {
    // Cancel any pending requests for same document
    this.queue = this.queue.filter(r => r.documentId !== request.documentId)
    
    // Add new request
    const promise = new Promise<AnalysisResult>((resolve, reject) => {
      this.queue.push({ ...request, resolve, reject })
    })
    
    this.process()
    return promise
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    const request = this.queue.shift()!
    
    try {
      this.currentRequest = new AbortController()
      const result = await this.executeRequest(request, this.currentRequest.signal)
      request.resolve(result)
    } catch (error) {
      request.reject(error)
    } finally {
      this.processing = false
      this.currentRequest = null
      this.process() // Process next
    }
  }
  
  cancelAll() {
    if (this.currentRequest) {
      this.currentRequest.abort()
    }
    this.queue.forEach(r => r.reject(new Error('Cancelled')))
    this.queue = []
  }
}
```

**Test**:
- Multiple rapid edits queue properly
- Only latest request per document processed
- Can cancel all pending requests
- Queue processes in order

---

### Task 8.6: Add performance optimizations

**Goal**: Optimize analysis to reduce API calls and improve response time.

**Implementation**:
```
Performance optimizations:

1. Paragraph-level analysis:
const getChangedParagraphs = (oldText: string, newText: string) => {
  const oldParagraphs = oldText.split('\n\n')
  const newParagraphs = newText.split('\n\n')
  
  return newParagraphs
    .map((p, i) => ({ text: p, index: i, changed: p !== oldParagraphs[i] }))
    .filter(p => p.changed && p.text.length > 10)
}

2. Suggestion caching:
const suggestionCache = new Map<string, CachedSuggestions>()

const getCachedSuggestions = (text: string): Suggestion[] | null => {
  const hash = simpleHash(text)
  const cached = suggestionCache.get(hash)
  
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 min
    return cached.suggestions
  }
  
  return null
}

3. Request batching:
const batchAnalysis = (paragraphs: Paragraph[]) => {
  if (paragraphs.length === 0) return
  
  // Combine up to 2000 words
  const batches = []
  let currentBatch = []
  let wordCount = 0
  
  for (const p of paragraphs) {
    const words = p.text.split(' ').length
    if (wordCount + words > 2000) {
      batches.push(currentBatch)
      currentBatch = [p]
      wordCount = words
    } else {
      currentBatch.push(p)
      wordCount += words
    }
  }
  
  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }
  
  return batches
}
```

**Test**:
1. Edit single paragraph - only that analyzed
2. Previously analyzed text - loads from cache
3. Large document - batched appropriately
4. Performance noticeably improved

---

### Task 9.1: Create SettingsPage component

**Goal**: Build the main settings interface where users configure their brand preferences.

**Implementation**:
Create `src/pages/SettingsPage.tsx`:
```
Layout structure:
- Page header with back button
- Settings sections:
  - Brand Voice (dropdown)
  - Reading Level (slider/dropdown)
  - Banned Words (list manager)
- Save/Cancel buttons

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, updateSettings } = useAuthStore()
  const [settings, setSettings] = useState({
    brandTone: user?.brand_tone || 'friendly',
    readingLevel: user?.reading_level || 8,
    bannedWords: user?.banned_words || []
  })
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings(settings)
      navigate('/editor')
    } catch (error) {
      // Show error
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <header>
        <button onClick={() => navigate('/editor')}>← Back</button>
        <h1>Settings</h1>
      </header>
      
      <div className="space-y-6">
        <ToneSelector value={settings.brandTone} onChange={...} />
        <ReadingLevelSelector value={settings.readingLevel} onChange={...} />
        <BannedWordsList words={settings.bannedWords} onChange={...} />
      </div>
      
      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isSaving}>Save</Button>
        <Button variant="secondary" onClick={() => navigate('/editor')}>Cancel</Button>
      </div>
    </div>
  )
}
```

**Test**:
- Navigate to /settings from editor
- All sections display
- Current settings pre-filled
- Back button returns to editor

---

### Task 9.2: Implement ToneSelector dropdown

**Goal**: Create a dropdown component for selecting brand voice with descriptions.

**Implementation**:
Create `src/components/settings/ToneSelector.tsx`:
```
const TONE_OPTIONS = [
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'formal', label: 'Formal', description: 'Traditional and respectful' },
  { value: 'playful', label: 'Playful', description: 'Fun and energetic' }
]

export function ToneSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = TONE_OPTIONS.find(opt => opt.value === value)
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Brand Voice</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border rounded-lg px-4 py-2 text-left"
        >
          <div>
            <div className="font-medium">{selected?.label}</div>
            <div className="text-sm text-gray-500">{selected?.description}</div>
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg">
            {TONE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Test**:
1. Click dropdown - options appear
2. Each option shows label and description
3. Select option - dropdown closes
4. Selected value updates

---

### Task 9.3: Create BannedWordsList manager

**Goal**: Build a component to add and remove banned words from a list.

**Implementation**:
Create `src/components/settings/BannedWordsList.tsx`:
```
export function BannedWordsList({ words, onChange }) {
  const [newWord, setNewWord] = useState('')
  
  const handleAdd = () => {
    const word = newWord.trim().toLowerCase()
    if (word && !words.includes(word)) {
      onChange([...words, word].sort())
      setNewWord('')
    }
  }
  
  const handleRemove = (word: string) => {
    onChange(words.filter(w => w !== word))
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Banned Words</label>
      <div className="border rounded-lg p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add word..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
        
        <div className="space-y-2">
          {words.length === 0 ? (
            <p className="text-gray-500 text-sm">No banned words yet</p>
          ) : (
            words.map(word => (
              <div key={word} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span>{word}</span>
                <button
                  onClick={() => handleRemove(word)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

**Test**:
1. Type word and click Add - appears in list
2. Press Enter - also adds word
3. Try duplicate - not added
4. Click Remove - word disappears
5. Empty state shows when no words

---

### Task 9.4: Add reading level selector

**Goal**: Create a selector for target reading level with grade explanations.

**Implementation**:
```
export function ReadingLevelSelector({ value, onChange }) {
  const levels = [
    { value: 5, label: 'Grade 5', description: 'Elementary' },
    { value: 6, label: 'Grade 6', description: 'Middle School' },
    { value: 7, label: 'Grade 7', description: 'Middle School' },
    { value: 8, label: 'Grade 8', description: 'Middle School' },
    { value: 9, label: 'Grade 9', description: 'High School' },
    { value: 10, label: 'Grade 10', description: 'High School' },
    { value: 11, label: 'Grade 11', description: 'High School' },
    { value: 12, label: 'Grade 12', description: 'High School' }
  ]
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Target Reading Level
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border rounded-lg px-4 py-2"
      >
        {levels.map(level => (
          <option key={level.value} value={level.value}>
            {level.label} - {level.description}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-1">
        Content will be simplified to match this reading level
      </p>
    </div>
  )
}
```

**Test**:
1. Dropdown shows all grade levels
2. Current level is selected
3. Change updates value
4. Description helps understanding

---

### Task 9.5: Implement settings persistence

**Goal**: Save user settings to database and ensure they persist across sessions.

**Implementation**:
Update authStore:
```
interface AuthStore {
  // ... existing
  updateSettings: (settings: UserSettings) => Promise<void>
}

updateSettings: async (settings) => {
  const { error } = await supabase
    .from('users')
    .update({
      brand_tone: settings.brandTone,
      reading_level: settings.readingLevel,
      banned_words: settings.bannedWords,
      updated_at: new Date().toISOString()
    })
    .eq('id', get().user.id)
  
  if (error) throw error
  
  // Update local state
  set(state => ({
    user: {
      ...state.user,
      brand_tone: settings.brandTone,
      reading_level: settings.readingLevel,
      banned_words: settings.bannedWords
    }
  }))
}

// Load settings on login
checkUser: async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Fetch full user data including settings
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    set({ user: { ...user, ...data }, loading: false })
  } else {
    set({ user: null, loading: false })
  }
}
```

**Test**:
1. Change settings and save
2. Reload page
3. Settings persist
4. Use in different browser - same settings

---

### Task 9.6: Create settings store or extend authStore

**Goal**: Decide on state management approach and implement settings state.

**Implementation**:
Option chosen: Extend authStore (simpler for MVP)

Already implemented in 9.5, but add these helpers:
```
// Add to authStore
getUserSettings: () => {
  const state = get()
  return {
    brandTone: state.user?.brand_tone || 'friendly',
    readingLevel: state.user?.reading_level || 8,
    bannedWords: state.user?.banned_words || []
  }
}

// Use in components
const settings = useAuthStore(state => state.getUserSettings())
```

**Test**:
- Settings accessible throughout app
- Updates reflect immediately
- No prop drilling needed
- Type-safe access

---

### Task 10.1: Update edge function prompt structure

**Goal**: Reorganize the edge function prompt for better organization and all features.

**Implementation**:
Update edge function:
```
const SYSTEM_PROMPT_TEMPLATE = `You are WordWise AI, an expert marketing copywriter and editor.

Your role is to analyze marketing copy and provide actionable improvement suggestions.

User Context:
- Brand Voice: {brandTone}
- Target Reading Level: Grade {readingLevel}
- Banned Words: {bannedWords}

You must analyze for these specific areas:
1. Grammar & Spelling - Fix errors, improve sentence structure
2. Tone Alignment - Match the specified brand voice
3. Persuasiveness - Use power words, emotional triggers, urgency
4. Conciseness - Remove redundancy, tighten prose
5. Headlines - Make them attention-grabbing with keywords
6. Readability - Simplify complex sentences for target grade level
7. Vocabulary - Suggest synonyms, avoid repetition and banned words
8. A/B Testing - Provide alternative phrasings for key messages

Output Format:
Return a JSON array where each suggestion has:
{
  "startIndex": number (character position start),
  "endIndex": number (character position end),
  "type": "grammar" | "tone" | "persuasive" | "conciseness" | "headline" | "readability" | "vocabulary" | "ab_test",
  "originalText": "the original text segment",
  "suggestionText": "your improved version",
  "explanation": "why this change improves the copy",
  "confidence": 0.0-1.0 (your confidence in this suggestion)
}

Prioritize by importance: grammar errors first, then tone/brand alignment, then enhancements.`
```

**Test**:
- Prompt is clear and structured
- All 8 feature types included
- Output format specified
- Priority guidance given

---

### Task 10.2: Implement feature-specific prompts

**Goal**: Create targeted analysis logic for each suggestion type.

**Implementation**:
Add analysis examples to prompt:
```
const ANALYSIS_EXAMPLES = {
  grammar: `
Example: "This are the benefits"
Suggestion: "These are the benefits"
Explanation: "Subject-verb agreement: 'These' is plural"
`,
  
  tone: `
Example (Professional tone): "Hey folks, check this out!"
Suggestion: "Dear colleagues, please review this information"
Explanation: "Adjusted greeting and language to match professional tone"
`,
  
  persuasive: `
Example: "Our product is good"
Suggestion: "Our award-winning product transforms your workflow"
Explanation: "Added credibility marker and outcome-focused language"
`,
  
  conciseness: `
Example: "In order to achieve the goal of improving"
Suggestion: "To improve"
Explanation: "Removed redundant words without losing meaning"
`,
  
  headline: `
Example: "Product Features"
Suggestion: "5 Game-Changing Features That Boost Productivity 10x"
Explanation: "Added specificity, benefit, and quantified outcome"
`,
  
  readability: `
Example: "Utilize comprehensive solutions"
Suggestion: "Use complete solutions"
Explanation: "Simplified vocabulary for Grade 8 reading level"
`,
  
  vocabulary: `
Example: "Very unique and very special"
Suggestion: "Distinctive and exceptional"
Explanation: "Removed redundant 'very' and used more precise words"
`,
  
  ab_test: `
Example CTA: "Submit"
Alternatives:
- "Get Started Now"
- "Claim Your Free Trial"
- "Yes, I Want This!"
Explanation: "Testing urgency, value proposition, and enthusiasm"
`
}
```

**Test**:
- Each type has clear examples
- Suggestions match brand voice
- Explanations are helpful
- Variety in alternatives

---

### Task 10.3: Add suggestion ranking logic

**Goal**: Prioritize suggestions so users see most important ones first.

**Implementation**:
```
function rankSuggestions(suggestions: Suggestion[]): Suggestion[] {
  const priority = {
    grammar: 1,
    tone: 2,
    readability: 3,
    persuasive: 4,
    conciseness: 5,
    vocabulary: 6,
    headline: 7,
    ab_test: 8
  }
  
  return suggestions
    .sort((a, b) => {
      // First sort by priority
      const priorityDiff = priority[a.type] - priority[b.type]
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by confidence
      return b.confidence - a.confidence
    })
    .slice(0, 10) // Limit to top 10
}

// In edge function response
const allSuggestions = parseSuggestions(gptResponse)
const rankedSuggestions = rankSuggestions(allSuggestions)

return {
  suggestions: rankedSuggestions,
  totalFound: allSuggestions.length
}
```

**Test**:
1. Grammar errors appear first
2. Low confidence suggestions appear last
3. Maximum 10 suggestions returned
4. Response includes total count

---

### Task 10.4: Create specialized analyzers

**Goal**: Implement different analysis logic for headlines, CTAs, and body text.

**Implementation**:
```
function analyzeContent(text: string, html: string) {
  const segments = []
  
  // Extract headlines (H1-H3)
  const headlineRegex = /<h[1-3]>(.*?)<\/h[1-3]>/gi
  let match
  while ((match = headlineRegex.exec(html)) !== null) {
    segments.push({
      type: 'headline',
      text: match[1],
      start: match.index,
      end: match.index + match[0].length
    })
  }
  
  // Extract CTAs (buttons and links with action words)
  const ctaRegex = /<(button|a)[^>]*>(.*?(buy|start|get|claim|download|subscribe).*?)<\/\1>/gi
  while ((match = ctaRegex.exec(html)) !== null) {
    segments.push({
      type: 'cta',
      text: match[2],
      start: match.index,
      end: match.index + match[0].length
    })
  }
  
  // Remaining text is body
  // ... extract paragraphs
  
  return segments
}

// In prompt
const segments = analyzeContent(text, html)
const promptAddition = segments.map(segment => {
  if (segment.type === 'headline') {
    return `Analyze this headline for impact and keywords: "${segment.text}"`
  } else if (segment.type === 'cta') {
    return `Provide A/B test alternatives for this CTA: "${segment.text}"`
  }
  return `Analyze this body text: "${segment.text}"`
}).join('\n\n')
```

**Test**:
1. Headlines get headline-specific suggestions
2. CTAs get A/B alternatives
3. Body text gets general improvements
4. Proper text extraction

---

### Task 10.5: Implement A/B testing generator

**Goal**: Generate multiple variations of key phrases for testing.

**Implementation**:
```
const generateABVariations = (originalText: string, type: 'cta' | 'headline' | 'value_prop') => {
  const prompts = {
    cta: `Generate 3 alternative call-to-action variations for "${originalText}".
Consider: urgency, value, emotion, and action orientation.`,
    
    headline: `Generate 3 alternative headline variations for "${originalText}".
Consider: curiosity, benefits, numbers, and keywords.`,
    
    value_prop: `Generate 3 alternative value proposition variations for "${originalText}".
Consider: outcomes, differentiators, and customer pain points.`
  }
  
  // In GPT response format each as separate suggestion
  return [
    {
      type: 'ab_test',
      originalText,
      suggestionText: 'Start Your Free Trial Today',
      explanation: 'Emphasizes no-risk trial and urgency',
      confidence: 0.8
    },
    {
      type: 'ab_test',
      originalText,
      suggestionText: 'Get Instant Access',
      explanation: 'Focuses on immediate gratification',
      confidence: 0.7
    },
    // ... more variations
  ]
}
```

**Test**:
1. CTAs get action-oriented alternatives
2. Headlines get benefit-focused options
3. Each variation has unique angle
4. Explanations justify the approach

---

### Task 10.6: Add readability scoring

**Goal**: Calculate readability metrics and include in analysis response.

**Implementation**:
```
function calculateReadability(text: string) {
  // Remove HTML and clean text
  const cleanText = text.replace(/<[^>]*>/g, '').trim()
  
  // Count sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const sentenceCount = sentences.length || 1
  
  // Count words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length || 1
  
  // Count syllables (simplified)
  const syllableCount = words.reduce((count, word) => {
    // Basic syllable counting
    return count + Math.max(1, word.toLowerCase().replace(/[^aeiou]/g, '').length)
  }, 0)
  
  // Flesch-Kincaid Grade Level
  const gradeLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59
  
  // Stats
  return {
    gradeLevel: Math.max(1, Math.min(12, Math.round(gradeLevel))),
    avgSentenceLength: Math.round(wordCount / sentenceCount),
    complexWords: words.filter(w => w.length > 6).length,
    passiveVoiceCount: (text.match(/\b(was|were|been|being|is|are|am)\b.*\b(ed|en)\b/gi) || []).length
  }
}

// Add to edge function response
const readability = calculateReadability(text)

return {
  suggestions: rankedSuggestions,
  readability,
  totalFound: allSuggestions.length
}
```

**Test**:
1. Grade level calculates correctly
2. Sentence length accurate
3. Complex word count works
4. Passive voice detected

---

### Task 11.1: Update suggestion card to track actions

**Goal**: Modify the suggestion card component to track when users accept or reject suggestions.

**Implementation**:
Update SuggestionCard:
```
import { analyticsService } from '@/services/analyticsService'

const handleAccept = async () => {
  const startTime = Date.now()
  setIsAccepting(true)
  
  try {
    // Apply the suggestion
    editor.chain()
      .focus()
      .setTextSelection({ from: suggestion.startIndex, to: suggestion.endIndex })
      .insertContent(suggestion.suggestionText)
      .removeMark('suggestion')
      .run()
    
    // Track acceptance
    await analyticsService.trackSuggestion({
      suggestionId: suggestion.id,
      action: 'accepted',
      type: suggestion.type,
      confidence: suggestion.confidence,
      responseTime: Date.now() - startTime
    })
    
    // Update local state
    await acceptSuggestion(suggestion.id)
    
    // Success feedback
    showSuccessAnimation()
    setTimeout(onClose, 300)
    
  } catch (error) {
    console.error('Failed to accept suggestion:', error)
  } finally {
    setIsAccepting(false)
  }
}

const handleReject = async () => {
  // Similar but with action: 'rejected'
}

// Track when suggestion is shown
useEffect(() => {
  analyticsService.trackSuggestion({
    suggestionId: suggestion.id,
    action: 'viewed',
    type: suggestion.type
  })
}, [suggestion.id])
```

**Test**:
1. Accept a suggestion - tracks acceptance
2. Reject a suggestion - tracks rejection
3. View without action - tracks as viewed
4. Database shows all events

---

### Task 11.2: Create analytics service

**Goal**: Build a service to handle all analytics tracking with batching for efficiency.

**Implementation**:
Create `src/services/analyticsService.ts`:
```
interface TrackingEvent {
  suggestionId?: string
  action: 'viewed' | 'accepted' | 'rejected'
  type?: string
  confidence?: number
  responseTime?: number
  timestamp: string
}

class AnalyticsService {
  private queue: TrackingEvent[] = []
  private batchTimer: NodeJS.Timeout | null = null
  
  trackSuggestion(data: Omit<TrackingEvent, 'timestamp'>) {
    const event: TrackingEvent = {
      ...data,
      timestamp: new Date().toISOString()
    }
    
    this.queue.push(event)
    this.scheduleBatch()
  }
  
  trackDocumentStats(stats: DocumentStats) {
    // Track document-level metrics
  }
  
  private scheduleBatch() {
    if (this.batchTimer) return
    
    this.batchTimer = setTimeout(() => {
      this.sendBatch()
    }, 30000) // 30 seconds
  }
  
  private async sendBatch() {
    if (this.queue.length === 0) return
    
    const events = [...this.queue]
    this.queue = []
    this.batchTimer = null
    
    try {
      // Send to Supabase
      const { error } = await supabase
        .from('analytics')
        .insert(events.map(event => ({
          user_id: getCurrentUserId(),
          metric: `suggestion_${event.action}`,
          value: event.confidence || 1,
          timestamp: event.timestamp
        })))
      
      if (error) throw error
      
    } catch (error) {
      // Re-queue failed events
      this.queue.unshift(...events)
      console.error('Analytics batch failed:', error)
    }
  }
  
  // Force send on page unload
  flush() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }
    this.sendBatch()
  }
}

export const analyticsService = new AnalyticsService()

// Add page unload handler
window.addEventListener('beforeunload', () => {
  analyticsService.flush()
})
```

**Test**:
1. Track multiple events quickly
2. Wait 30 seconds - batch sends
3. Check database for events
4. Refresh page - pending events send

---

### Task 11.3: Implement visual feedback animations

**Goal**: Add smooth animations when suggestions are accepted or rejected.

**Implementation**:
```
// Add to SuggestionCard
const showSuccessAnimation = () => {
  // Create checkmark element
  const checkmark = document.createElement('div')
  checkmark.className = 'fixed z-50 pointer-events-none'
  checkmark.innerHTML = '✓'
  checkmark.style.cssText = `
    top: ${cardPosition.y}px;
    left: ${cardPosition.x}px;
    color: #10b981;
    font-size: 24px;
    font-weight: bold;
    animation: successPulse 0.5s ease-out;
  `
  
  document.body.appendChild(checkmark)
  
  setTimeout(() => {
    checkmark.remove()
  }, 500)
}

const showDismissAnimation = () => {
  // Red X animation similar to above
  setCardStyle({
    ...cardStyle,
    animation: 'dismissSlide 0.3s ease-out',
    opacity: 0
  })
}

// Add CSS animations
const styles = `
@keyframes successPulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}

@keyframes dismissSlide {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(20px); opacity: 0; }
}
`
```

**Test**:
1. Accept - green checkmark pulses
2. Reject - card slides away
3. Animations smooth at 60fps
4. No visual glitches

---

### Task 11.4: Add batch tracking system

**Goal**: Implement efficient batch updates to minimize database calls.

**Implementation**:
Enhance analytics service:
```
class BatchTracker {
  private batches: Map<string, AnalyticsBatch> = new Map()
  
  addEvent(event: TrackingEvent) {
    const batchKey = this.getBatchKey(event)
    
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, {
        type: event.type,
        action: event.action,
        count: 0,
        totalConfidence: 0,
        events: []
      })
    }
    
    const batch = this.batches.get(batchKey)!
    batch.count++
    batch.totalConfidence += event.confidence || 0
    batch.events.push(event)
  }
  
  private getBatchKey(event: TrackingEvent): string {
    return `${event.type}_${event.action}`
  }
  
  async flush() {
    const summaries = Array.from(this.batches.entries()).map(([key, batch]) => ({
      metric: key,
      count: batch.count,
      avgConfidence: batch.totalConfidence / batch.count,
      timestamp: new Date().toISOString()
    }))
    
    // Store summaries
    await supabase.from('analytics').insert(summaries)
    
    // Store detailed events if needed
    const allEvents = Array.from(this.batches.values())
      .flatMap(batch => batch.events)
    
    if (allEvents.length > 0) {
      await supabase.from('suggestion_events').insert(allEvents)
    }
    
    this.batches.clear()
  }
}
```

**Test**:
1. Track 10 grammar accepts
2. Track 5 tone rejects
3. Flush batch
4. Database shows aggregated data
5. Individual events preserved

---

### Task 11.5: Create session statistics tracking

**Goal**: Track per-session metrics for immediate user feedback.

**Implementation**:
```
interface SessionStats {
  startTime: Date
  suggestionsShown: number
  suggestionsAccepted: number
  suggestionsRejected: number
  suggestionsByType: Record<SuggestionType, TypeStats>
  documentsEdited: Set<string>
}

class SessionTracker {
  private stats: SessionStats = {
    startTime: new Date(),
    suggestionsShown: 0,
    suggestionsAccepted: 0,
    suggestionsRejected: 0,
    suggestionsByType: {},
    documentsEdited: new Set()
  }
  
  trackSuggestionShown(type: SuggestionType) {
    this.stats.suggestionsShown++
    this.updateTypeStats(type, 'shown')
  }
  
  trackSuggestionAccepted(type: SuggestionType) {
    this.stats.suggestionsAccepted++
    this.updateTypeStats(type, 'accepted')
  }
  
  trackDocumentEdit(documentId: string) {
    this.stats.documentsEdited.add(documentId)
  }
  
  private updateTypeStats(type: SuggestionType, action: string) {
    if (!this.stats.suggestionsByType[type]) {
      this.stats.suggestionsByType[type] = {
        shown: 0,
        accepted: 0,
        rejected: 0
      }
    }
    this.stats.suggestionsByType[type][action]++
  }
  
  getAcceptanceRate(): number {
    if (this.stats.suggestionsShown === 0) return 0
    return (this.stats.suggestionsAccepted / this.stats.suggestionsShown) * 100
  }
  
  getSessionDuration(): number {
    return Date.now() - this.stats.startTime.getTime()
  }
  
  getSummary() {
    return {
      duration: this.getSessionDuration(),
      acceptanceRate: this.getAcceptanceRate(),
      totalSuggestions: this.stats.suggestionsShown,
      documentsEdited: this.stats.documentsEdited.size,
      byType: this.stats.suggestionsByType
    }
  }
}

export const sessionTracker = new SessionTracker()
```

**Test**:
1. Edit document - tracks document
2. View suggestions - count increases
3. Accept/reject - rates update
4. Get summary - all metrics present
5. Accurate acceptance rate

---

### Task 12.1: Create DashboardPage layout

**Goal**: Build the analytics dashboard structure with metric cards and visualizations.

**Implementation**:
Create `src/pages/DashboardPage.tsx`:
```
export function DashboardPage() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('7d')
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    loadMetrics()
  }, [timeRange])
  
  const loadMetrics = async () => {
    setIsLoading(true)
    try {
      const data = await analyticsService.getMetrics(timeRange)
      setMetrics(data)
    } catch (error) {
      console.error('Failed to load metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <button
            onClick={() => navigate('/editor')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Editor
          </button>
        </div>
      </header>
      
      <div className="p-6">
        {/* Time range selector */}
        <div className="mb-6">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        
        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Acceptance Rate"
            value={metrics?.acceptanceRate}
            format="percentage"
            trend={metrics?.acceptanceTrend}
            loading={isLoading}
          />
          <MetricCard
            title="Documents Analyzed"
            value={metrics?.documentsAnalyzed}
            format="number"
            loading={isLoading}
          />
          <MetricCard
            title="Suggestions Made"
            value={metrics?.totalSuggestions}
            format="number"
            loading={isLoading}
          />
          <MetricCard
            title="Time Saved"
            value={metrics?.timeSaved}
            format="time"
            loading={isLoading}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Suggestions by Type</h2>
            <BarChart data={metrics?.suggestionsByType} loading={isLoading} />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Readability Trend</h2>
            <LineChart data={metrics?.readabilityTrend} loading={isLoading} />
          </div>
        </div>
        
        {/* Insights */}
        {metrics?.insights && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Insights</h3>
            <ul className="space-y-2">
              {metrics.insights.map((insight, i) => (
                <li key={i} className="text-blue-800">• {insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Test**:
1. Navigate to /dashboard
2. Layout renders correctly
3. Time range selector works
4. Loading states show
5. Back button returns to editor

---

### Task 12.2: Implement MetricCard components

**Goal**: Create reusable cards that display key metrics with trends.

**Implementation**:
Create `src/components/dashboard/MetricCard.tsx`:
```
interface MetricCardProps {
  title: string
  value: number | undefined
  format: 'number' | 'percentage' | 'time'
  trend?: number
  loading?: boolean
}

export function MetricCard({ title, value, format, trend, loading }: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'time':
        return `${Math.round(val)} min`
      case 'number':
      default:
        return val.toLocaleString()
    }
  }
  
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend > 0) return '↑'
    if (trend < 0) return '↓'
    return '–'
  }
  
  const getTrendColor = () => {
    if (!trend) return 'text-gray-500'
    if (trend > 0) return 'text-green-600'
    return 'text-red-600'
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold text-gray-900">
          {value !== undefined ? formatValue(value) : '–'}
        </span>
        {trend !== undefined && (
          <span className={`text-sm ${getTrendColor()} flex items-center`}>
            <span className="mr-1">{getTrendIcon()}</span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}
```

**Test**:
1. Shows loading skeleton
2. Formats percentages correctly
3. Shows trend arrows
4. Green for positive trends
5. Handles undefined values

---

### Task 12.3: Create simple chart components

**Goal**: Build bar and line charts using only CSS/HTML (no external libraries).

**Implementation**:
Create `src/components/dashboard/BarChart.tsx`:
```
interface BarChartProps {
  data?: Array<{ label: string; value: number; color: string }>
  loading?: boolean
}

export function BarChart({ data, loading }: BarChartProps) {
  if (loading || !data) {
    return (
      <div className="h-64 flex items-end justify-around">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-12 bg-gray-200 animate-pulse"
               style={{ height: `${Math.random() * 100 + 50}px` }} />
        ))}
      </div>
    )
  }
  
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="h-64 flex items-end justify-around">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center mx-2">
            <div className="w-full flex flex-col items-center">
              <span className="text-sm font-medium mb-2">{item.value}%</span>
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${height * 2}px`,
                  backgroundColor: item.color,
                  minHeight: '4px'
                }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// LineChart similar but with connected points
export function LineChart({ data, loading }: LineChartProps) {
  // Implementation with SVG or CSS positioning
  // Points connected by lines
  // X-axis: dates, Y-axis: values
}
```

**Test**:
1. Bars scale proportionally
2. Colors apply correctly
3. Labels readable
4. Animation on load
5. Handles empty data

---

### Task 12.4: Add data fetching logic

**Goal**: Implement methods to fetch and calculate analytics from the database.

**Implementation**:
Add to analyticsService:
```
async getMetrics(timeRange: TimeRange): Promise<DashboardMetrics> {
  const startDate = this.getStartDate(timeRange)
  
  // Fetch raw analytics data
  const { data: events, error } = await supabase
    .from('analytics')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true })
  
  if (error) throw error
  
  // Calculate metrics
  const metrics = this.calculateMetrics(events)
  
  // Get previous period for trends
  const previousMetrics = await this.getPreviousPeriodMetrics(timeRange)
  
  // Calculate trends
  const trends = this.calculateTrends(metrics, previousMetrics)
  
  // Generate insights
  const insights = this.generateInsights(metrics, trends)
  
  return {
    ...metrics,
    ...trends,
    insights
  }
}

private calculateMetrics(events: AnalyticsEvent[]): BaseMetrics {
  const suggestions = events.filter(e => e.metric.startsWith('suggestion_'))
  const shown = suggestions.filter(e => e.metric === 'suggestion_viewed').length
  const accepted = suggestions.filter(e => e.metric === 'suggestion_accepted').length
  
  const byType = this.groupByType(suggestions)
  
  return {
    acceptanceRate: shown > 0 ? (accepted / shown) * 100 : 0,
    totalSuggestions: shown,
    documentsAnalyzed: new Set(events.map(e => e.document_id)).size,
    timeSaved: accepted * 0.5, // Estimate 30 seconds per accepted suggestion
    suggestionsByType: this.formatByType(byType)
  }
}

private generateInsights(metrics: BaseMetrics, trends: Trends): string[] {
  const insights = []
  
  if (metrics.acceptanceRate > 80) {
    insights.push('Great job! Your acceptance rate is excellent.')
  }
  
  if (trends.acceptanceTrend > 5) {
    insights.push('Your acceptance rate is improving!')
  }
  
  // More insight logic...
  
  return insights
}
```

**Test**:
1. Fetch data for different time ranges
2. Metrics calculate correctly
3. Trends show period-over-period
4. Insights are relevant
5. Handles no data gracefully

---

### Task 12.5: Implement time period selector

**Goal**: Allow users to filter analytics by different time periods.

**Implementation**:
Already implemented in 12.1, but add date calculation:
```
private getStartDate(timeRange: TimeRange): Date {
  const now = new Date()
  
  switch (timeRange) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    case 'all':
      return new Date('2020-01-01') // Or user's signup date
    
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
}

// Format dates for display
const formatDateRange = (timeRange: TimeRange): string => {
  const start = getStartDate(timeRange)
  const end = new Date()
  
  if (timeRange === 'today') {
    return format(end, 'MMMM d, yyyy')
  }
  
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
}
```

**Test**:
1. Select "Today" - shows today's data
2. Select "7d" - shows week of data
3. Date range displays correctly
4. Data updates on change
5. Loading state between changes

---

### Task 12.6: Add insight messages

**Goal**: Generate helpful insights based on user's analytics data.

**Implementation**:
```
const generateInsights = (metrics: Metrics, trends: Trends): string[] => {
  const insights: string[] = []
  
  // Acceptance rate insights
  if (metrics.acceptanceRate >= 85) {
    insights.push('🌟 Excellent! Your acceptance rate is in the top tier.')
  } else if (metrics.acceptanceRate >= 70) {
    insights.push('👍 Good acceptance rate. Keep reviewing suggestions carefully.')
  } else if (metrics.acceptanceRate < 50) {
    insights.push('💡 Try reviewing more suggestions - many could improve your content.')
  }
  
  // Trend insights
  if (trends.acceptanceTrend > 10) {
    insights.push('📈 Your acceptance rate improved by ' + trends.acceptanceTrend + '% this period!')
  }
  
  // Type-specific insights
  const mostAcceptedType = getMostAcceptedType(metrics.suggestionsByType)
  if (mostAcceptedType) {
    insights.push(`✏️ You accept ${mostAcceptedType} suggestions most often.`)
  }
  
  // Readability insights
  if (metrics.avgReadabilityImprovement > 1) {
    insights.push(`📚 Your content readability improved by ${metrics.avgReadabilityImprovement} grade levels.`)
  }
  
  // Usage insights
  if (metrics.documentsAnalyzed > 20) {
    insights.push('🚀 Power user! You\'ve analyzed ' + metrics.documentsAnalyzed + ' documents.')
  }
  
  // Time-based insights
  const peakHour = getPeakUsageHour(events)
  if (peakHour) {
    insights.push(`⏰ You're most productive at ${peakHour}:00.`)
  }
  
  return insights.slice(0, 5) // Limit to 5 most relevant
}
```

**Test**:
1. High acceptance rate - positive message
2. Low rate - encouraging message
3. Improving trends highlighted
4. Personalized to user behavior
5. Maximum 5 insights shown

---

### Task 13.1: Create ExportModal component

**Goal**: Build a modal dialog for document export with format selection and preview.

**Implementation**:
Create `src/components/ExportModal.tsx`:
```
interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  document: Document
}

export function ExportModal({ isOpen, onClose, document }: ExportModalProps) {
  const [format, setFormat] = useState<'markdown' | 'html' | 'txt'>('markdown')
  const [preview, setPreview] = useState('')
  
  useEffect(() => {
    if (isOpen) {
      generatePreview()
    }
  }, [isOpen, format])
  
  const generatePreview = () => {
    let converted = ''
    
    switch (format) {
      case 'markdown':
        converted = convertToMarkdown(document.content)
        break
      case 'html':
        converted = convertToHTML(document.content)
        break
      case 'txt':
        converted = convertToPlainText(document.content)
        break
    }
    
    setPreview(converted)
  }
  
  const handleDownload = () => {
    const filename = `${document.title.replace(/[^a-z0-9]/gi, '_')}.${format}`
    const blob = new Blob([preview], { type: getMimeType(format) })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    
    URL.revokeObjectURL(url)
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Export Document</h2>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Format</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="markdown"
                  checked={format === 'markdown'}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="mr-2"
                />
                Markdown (.md)
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="html"
                  checked={format === 'html'}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="mr-2"
                />
                HTML (.html)
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="txt"
                  checked={format === 'txt'}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="mr-2"
                />
                Plain Text (.txt)
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <pre className="bg-gray-50 border rounded p-4 overflow-auto max-h-96 text-sm">
              {preview}
            </pre>
          </div>
        </div>
        
        <div className="p-6 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Test**:
1. Modal opens on export click
2. Format selection works
3. Preview updates on format change
4. Close on cancel or backdrop
5. Download triggers on button click

---

### Task 13.2: Implement format conversion utilities

**Goal**: Create functions to convert HTML content to different export formats.

**Implementation**:
Create `src/utils/exportUtils.ts`:
```
export function convertToMarkdown(html: string): string {
  let markdown = html
  
  // Headers
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
  
  // Formatting
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**')
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*')
  markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*')
  markdown = markdown.replace(/<u>(.*?)<\/u>/g, '$1')
  
  // Lists
  markdown = markdown.replace(/<ul>/g, '\n')
  markdown = markdown.replace(/<\/ul>/g, '\n')
  markdown = markdown.replace(/<li>(.*?)<\/li>/g, '- $1\n')
  
  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n')
  
  // Links
  markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
  
  // Clean up
  markdown = markdown.replace(/<br\s*\/?>/g, '\n')
  markdown = markdown.replace(/<[^>]*>/g, '') // Remove remaining tags
  markdown = markdown.replace(/\n{3,}/g, '\n\n') // Multiple newlines
  
  return markdown.trim()
}

export function convertToHTML(html: string): string {
  // Clean and format HTML
  const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { margin-top: 1.5em; }
        p { margin: 1em 0; }
    </style>
</head>
<body>
${html}
</body>
</html>`
  
  return template
}

export function convertToPlainText(html: string): string {
  // Remove all HTML tags
  let text = html
  
  // Add newlines for block elements
  text = text.replace(/<\/?(h[1-6]|p|div|br).*?>/g, '\n')
  
  // Remove all other tags
  text = text.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&/g, '&')
  text = text.replace(/</g, '<')
  text = text.replace(/>/g, '>')
  text = text.replace(/"/g, '"')
  text = text.replace(/&#039;/g, "'")
  
  // Clean up whitespace
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.trim()
  
  return text
}

export function getMimeType(format: string): string {
  const types = {
    markdown: 'text/markdown',
    html: 'text/html',
    txt: 'text/plain'
  }
  return types[format] || 'text/plain'
}
```

**Test**:
1. HTML headers → Markdown headers
2. Bold/italic formatting preserved
3. Lists convert correctly
4. Plain text strips all formatting
5. HTML