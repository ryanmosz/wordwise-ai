## Relevant Files

- `package.json` – Project dependencies and scripts.
- `vite.config.ts` – Vite configuration for React + TypeScript.
- `tailwind.config.ts` – Tailwind CSS configuration.
- `postcss.config.cjs` – PostCSS pipeline for Tailwind.
- `.eslintrc.cjs` – ESLint ruleset for consistent code quality.
- `.prettierrc` – Prettier formatting rules.
- `src/main.tsx` – React entry point; wraps the app with providers.
- `src/App.tsx` – Top-level router and layout.
- `src/components/AuthProvider.tsx` – Context provider wrapping Supabase Auth helpers.
- `src/pages/Login.tsx` – Email / password sign-in & sign-up form.
- `src/pages/Dashboard.tsx` – Documents list page.
- `src/components/DocumentTable.tsx` – Renders list of user documents.
- `src/pages/Editor.tsx` – Tiptap-powered rich-text editor page.
- `src/components/SuggestionPopover.tsx` – UI for suggestion cards.
- `src/components/BrandSettings.tsx` – Brand voice settings page.
- `supabase/migrations/**/*` – SQL migrations for tables (users, documents, suggestions, analytics).
- `supabase/functions/suggest/index.ts` – Edge Function calling OpenAI and returning suggestions.
- `Dockerfile` – Multi-stage container build definition.
- `docker-compose.yml` – Local stack with Postgres, Supabase Studio, and frontend.
- `.github/workflows/ci.yml` – GitHub Action for lint, test, build.
- `.github/workflows/deploy-functions.yml` – Deploys Edge Functions to Supabase.

### Notes

- Test files should reside next to their source files with the `.test.ts(x)` suffix.
- Run `npm test` to execute unit tests; run `npm run cy:open` for Cypress.
- For Edge Functions, use `supabase functions serve --no-verify-jwt suggest` for local testing.

## Tasks

- [ ] 1.0 Dev Environment Up
  - [ ] 1.1 Install prerequisites
    - **Goal:** Ensure developer workstation has Node 18, Docker, and Supabase CLI.
    - **Implementation:**
      ```bash
      brew install node@18 docker supabase/tap/supabase
      ```
    - **Test:** Run `node -v`, `docker -v`, and `supabase --version`; each should output a version string.
  - [ ] 1.2 Scaffold Vite + React + TS project
    - **Goal:** Create base React TypeScript project named `wordwise`.
    - **Implementation:** `npm create vite@latest wordwise -- --template react-ts && cd wordwise && npm install`.
    - **Test:** `npm run dev` opens Vite welcome page at `http://localhost:5173`.
  - [ ] 1.3 Integrate Tailwind CSS
    - **Goal:** Add Tailwind with JIT compilation.
    - **Implementation:** Follow Tailwind docs: install `tailwindcss postcss autoprefixer`, generate config, add `@tailwind` directives to `src/index.css`.
    - **Test:** Place `<div className="bg-red-500 w-4 h-4"/>` in `App.tsx`; red square renders in browser.
  - [ ] 1.4 Configure ESLint & Prettier
    - **Goal:** Enforce code quality and formatting.
    - **Implementation:** Install `eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-config-prettier prettier eslint-plugin-tailwindcss` and add configs.
    - **Test:** Run `npm run lint`; console shows no errors for fresh project.
  - [ ] 1.5 Create environment variable templates
    - **Goal:** Provide `.env.example` with all required keys.
    - **Implementation:** Add placeholders `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_OPENAI_KEY`.
    - **Test:** CI fails if `.env.example` missing when running `npm run ci:check-env` (simple script checks presence).

- [ ] 2.0 Supabase Auth Enabled
  - [ ] 2.1 Create Supabase project & retrieve keys
    - **Goal:** Have Supabase URL & anon/public keys available locally.
    - **Implementation:** Create project in Supabase dashboard; copy values into `.env.local`.
    - **Test:** `supabase projects list` shows the new project with status `ONLINE`.
  - [ ] 2.2 Add Supabase client & Auth helpers
    - **Goal:** Connect frontend to Supabase Auth.
    - **Implementation:** `npm install @supabase/supabase-js @supabase/auth-helpers-react` and initialize client in `src/lib/supabase.ts`.
    - **Test:** `console.log(supabase)` prints object without errors on app load.
  - [ ] 2.3 Implement `AuthProvider`
    - **Goal:** Provide session context across app.
    - **Implementation:** Create `src/components/AuthProvider.tsx` wrapping `SessionContextProvider` from helpers.
    - **Test:** In any component, `const { session } = useSessionContext();` returns `null` for new users.
  - [ ] 2.4 Build Login form
    - **Goal:** Users can sign up / sign in with email & password.
    - **Implementation:** Create `Login.tsx` with controlled inputs and `supabase.auth.signUp` / `signInWithPassword` calls.
    - **Test:** Signing up creates a row in `auth.users`; verified via Supabase dashboard.
  - [ ] 2.5 Protect routes with auth
    - **Goal:** Redirect unauthenticated users to Login.
    - **Implementation:** Add `ProtectedRoute` HOC that checks `session` and uses React Router `Navigate`.
    - **Test:** Visiting `/dashboard` when signed out redirects to `/login`.

- [ ] 3.0 Documents Table Ready
  - [ ] 3.1 Add `documents` SQL migration
    - **Goal:** Create `documents` table per schema.
    - **Implementation:** Write `supabase/migrations/20240101_documents.sql` containing DDL from Section 3.2.
    - **Test:** Run `supabase db reset`; `psql -c "\d documents"` shows expected columns.
  - [ ] 3.2 Expose REST endpoints
    - **Goal:** Supabase auto-generates `/rest/v1/documents`.
    - **Implementation:** No code; rely on Supabase.
    - **Test:** `curl -H "apikey: $VITE_SUPABASE_ANON_KEY" $VITE_SUPABASE_URL/rest/v1/documents` returns `[]` (HTTP 200).

- [ ] 4.0 Document Dashboard UI
  - [ ] 4.1 Fetch documents for current user
    - **Goal:** Display user-specific docs in dashboard.
    - **Implementation:** In `Dashboard.tsx`, `supabase.from('documents').select('*').eq('user_id', session.user.id)`.
    - **Test:** Seed two docs; dashboard lists exactly two rows.
  - [ ] 4.2 Create `DocumentTable` component
    - **Goal:** Encapsulate table rendering with Tailwind styles.
    - **Implementation:** Accept `documents` prop; map to rows with title, updated_at, adoption % placeholder.
    - **Test:** Jest snapshot matches expected HTML for sample data.
  - [ ] 4.3 Add "New Document" button
    - **Goal:** Allow users to create blank docs.
    - **Implementation:** Button triggers `supabase.from('documents').insert({ ... })` then navigates to editor.
    - **Test:** Clicking button creates DB row and redirects to `/editor/:id`.

- [ ] 5.0 Rich-Text Editor Skeleton
  - [ ] 5.1 Install & configure Tiptap
    - **Goal:** Provide basic rich-text editing experience.
    - **Implementation:** `npm install @tiptap/react @tiptap/starter-kit` and initialize editor in `Editor.tsx`.
    - **Test:** Typing text updates editor state; no console errors.
  - [ ] 5.2 Bind editor state to Zustand store
    - **Goal:** Persist content locally before save.
    - **Implementation:** Create `useDocumentStore` with `content` & `setContent`; on `editor.on('update')` call setter.
    - **Test:** Typing updates `useDocumentStore.getState().content`.
  - [ ] 5.3 Implement Save action
    - **Goal:** Persist content to Supabase.
    - **Implementation:** Add Save button calling `supabase.from('documents').update({ content }).eq('id', docId)`.
    - **Test:** Clicking Save updates `content` column; verified via REST call.

- [ ] 6.0 Edge Function Deployed
  - [ ] 6.1 Scaffold `suggest` Edge Function
    - **Goal:** Create Deno function to call OpenAI.
    - **Implementation:** `supabase functions new suggest`; implement handler with prompt scaffolding and environment check.
    - **Test:** `supabase functions serve suggest` returns HTTP 200 for `POST { text:"hi" }`.
  - [ ] 6.2 Add OpenAI key as secret
    - **Goal:** Securely access OpenAI.
    - **Implementation:** `supabase secrets set OPENAI_KEY=$OPENAI_KEY`.
    - **Test:** Inside function `Deno.env.get('OPENAI_KEY')` returns non-null.
  - [ ] 6.3 Deploy function to Supabase
    - **Goal:** Make function accessible at `/functions/v1/suggest`.
    - **Implementation:** `supabase functions deploy suggest`.
    - **Test:** `curl -H "Authorization: Bearer $JWT" -d '{"text":"Hi"}' $SUPABASE_URL/functions/v1/suggest` returns `{ "suggestions": [] }`.

- [ ] 7.0 Inline Highlighting
  - [ ] 7.1 Map suggestion indices to Tiptap decorations
    - **Goal:** Underline problematic spans.
    - **Implementation:** Convert `{ start, end }` to Tiptap decorations; apply CSS classes `underline-red` `underline-blue`.
    - **Test:** Mock suggestions highlight correct spans; visually confirmed.
  - [ ] 7.2 Debounce suggestion fetch
    - **Goal:** Avoid spamming API while typing.
    - **Implementation:** Use `lodash.debounce` on content change with 800 ms delay.
    - **Test:** DevTools network panel shows ≤1 request per second while typing fast.

- [ ] 8.0 Suggestion Card UI
  - [ ] 8.1 Build `SuggestionPopover` component
    - **Goal:** Display suggestion, explanation, Accept/Reject buttons.
    - **Implementation:** Headless UI Popover anchored to highlighted span; Tailwind styles.
    - **Test:** Clicking underlined word opens popover; snapshot test for HTML.
  - [ ] 8.2 Wire Accept/Reject callbacks
    - **Goal:** Trigger state update and DB write.
    - **Implementation:** On Accept, replace text in editor; both calls update local store.
    - **Test:** Accepting suggestion changes editor content; Reject closes popover without change.

- [ ] 9.0 Accept/Reject Persisted
  - [ ] 9.1 Insert suggestion decision into DB
    - **Goal:** Record user action for analytics.
    - **Implementation:** `supabase.from('suggestions').insert({ doc_id, start_idx, end_idx, type, action })`.
    - **Test:** DB row appears with `action = 'accepted'` or `'rejected'`.
  - [ ] 9.2 Sync decision state on reload
    - **Goal:** Maintain highlights on page refresh.
    - **Implementation:** On editor mount, fetch prior suggestions and their actions.
    - **Test:** Reloading page preserves replaced text and hides accepted spans.

- [ ] 10.0 Brand Voice Settings Page
  - [ ] 10.1 Create `BrandSettings` component
    - **Goal:** Form for tone, reading level, banned words.
    - **Implementation:** Controlled inputs bound to local state; Save button updates `users` table.
    - **Test:** Changing tone and saving updates row; verified via SQL query.
  - [ ] 10.2 Integrate settings into suggestion prompt
    - **Goal:** Pass user prefs to Edge Function.
    - **Implementation:** Include `brandTone`, `readingLevel`, `bannedWords` in `/suggest` request body.
    - **Test:** Network payload contains correct values; function logs show receipt.

- [ ] 11.0 Readability Score Display
  - [ ] 11.1 Install readability-score lib
    - **Goal:** Compute grade level client-side.
    - **Implementation:** `npm install @crowdlinker/readability-score` (or similar) and wrap in util function.
    - **Test:** `calculateReadability("Simple text.")` returns a numeric grade.
  - [ ] 11.2 Display score in editor toolbar
    - **Goal:** Show updating grade level.
    - **Implementation:** Call util on `content` change; update state `readability`.
    - **Test:** Typing longer words increases displayed grade number.

- [ ] 12.0 Analytics Dashboard
  - [ ] 12.1 Aggregate suggestion adoption %
    - **Goal:** Compute accepted / total suggestions per doc.
    - **Implementation:** SQL view or RPC to return counts; or compute in client with groupBy.
    - **Test:** Accepting a suggestion increments numerator; dashboard bar height changes after refresh.
  - [ ] 12.2 Render charts with Chart.js
    - **Goal:** Visualize metrics over time.
    - **Implementation:** `npm install chart.js react-chartjs-2`; render bar & line charts.
    - **Test:** Jest renders chart component without crashing; visual check.

- [ ] 13.0 Export Buttons
  - [ ] 13.1 Install Turndown & file-saver
    - **Goal:** Convert HTML to MD/TXT and trigger download.
    - **Implementation:** `npm install turndown file-saver`.
    - **Test:** Clicking Export MD downloads `.md` file; opened in VS Code shows markdown.
  - [ ] 13.2 Implement HTML export
    - **Goal:** Provide raw HTML download.
    - **Implementation:** Serialize editor content; create Blob with `text/html` MIME.
    - **Test:** HTML file opens in browser displaying formatted text.

- [ ] 14.0 Local Docker Build Passes
  - [ ] 14.1 Write multi-stage `Dockerfile`
    - **Goal:** Build React app then serve via Nginx.
    - **Implementation:** Stage 1: `node:18-alpine` run `npm ci && npm run build`; Stage 2: `nginx:alpine` copy `dist` to `/usr/share/nginx/html`.
    - **Test:** `docker build .` completes without error; image size < 300 MB.
  - [ ] 14.2 Compose services
    - **Goal:** One-command local stack.
    - **Implementation:** `docker-compose.yml` with `db`, `studio`, `frontend`.
    - **Test:** `docker compose up` serves app at `http://localhost:3000`.

- [ ] 15.0 Production Deploy
  - [ ] 15.1 Configure Vercel project
    - **Goal:** CI/CD pipeline for frontend.
    - **Implementation:** `vercel link`, set env vars, enable automatic deploys on `main`.
    - **Test:** Pushing commit to `main` triggers build visible in Vercel dashboard.
  - [ ] 15.2 GitHub Action for Edge Functions
    - **Goal:** Auto-deploy functions on merge.
    - **Implementation:** Add `.github/workflows/deploy-functions.yml` using `supabase functions deploy`.
    - **Test:** Merging PR runs action; logs show successful deployment.
  - [ ] 15.3 Smoke test production URL
    - **Goal:** Verify end-to-end functionality post-deploy.
    - **Implementation:** Run Cypress `prod.spec.ts` against `https://wordwise-demo.vercel.app`.
    - **Test:** All Cypress assertions pass. 