# WordWise AI – MVP Build Plan (Marketing Manager Edition)

---

## 1. Executive Summary
WordWise AI will deliver a web-based, AI-powered writing assistant that gives marketing managers real-time, on-brand copy suggestions and actionable analytics within **7 days**. This plan breaks the work into atomic, confidence-building steps—each with a clear **Goal → Implementation → Test** cycle—so a new junior developer can progress from an empty directory to a live demo without ambiguity.

---

## 2. Technical Architecture Overview

### 2.1 High-Level Component Diagram (ASCII)

```
┌──────────────────────────┐
│  Browser (React + Vite)  │
│  • Tailwind UI           │
│  • Zustand State         │
└──────────┬───────────────┘
           │ HTTPS (REST/WebSocket)
┌──────────▼───────────┐      ┌───────────────────────────────┐
│   Supabase Services  │      │   Vercel Hosting (Frontend)   │
│  • Auth (JWT)        │      └───────────────────────────────┘
│  • Realtime WS       │
│  • Postgres DB       │
│  • Storage           │
│  • Edge Functions    │───┐   (Deno runtime)
└──────────┬───────────┘   │
           │ SQL / RPC     │
           ▼               │
   ┌──────────────────────────────┐
   │   OpenAI GPT-4o API          │
   │  (Grammar & Style Prompts)   │
   └──────────────────────────────┘
```

### 2.2 Component Descriptions
* **Frontend (React 18 + TypeScript + Vite)** – Fast local dev, modern JSX.
* **Tailwind CSS** – Utility-first styling; avoids custom design system overhead.
* **Zustand** – Minimal global state (user, document, UI flags).
* **Supabase** – Handles Auth, Postgres, Realtime, Storage, and Edge Functions in one SaaS (time-saving).
* **Edge Functions (Deno)** – Lightweight serverless layer to call OpenAI securely.
* **OpenAI GPT-4o** – Powers grammar, tone, and persuasion suggestions.

### 2.3 Technology Rationale
* **Single-page web app** meets "web-only MVP" requirement.
* Supabase offers **99.5 % uptime** SLAs close to NFR-1.
* Vercel auto-scales, has tight Vite integration.

### 2.4 UI Design & ASCII Mockups
#### 2.4.1 Login Screen
```
+--------------------------------------------------+
| WordWise AI (Logo)                               |
|--------------------------------------------------|
| [ Email ] ____________________________           |
| [ Password ] _________________________           |
|                                                  |
| (•) Sign In    ( ) Test User (FR-DEV_ONLY_1)     |
|                                                  |
| Forgot password?  ┆  Create account              |
+--------------------------------------------------+
```
Elements
• Email / Password inputs
• "Test User" button (creates demo creds)

#### 2.4.2 Document Dashboard
```
+--------------------------- WordWise AI ---------------------------+
| [+ New Document]    Brand Tone: Friendly  |  User ◉ ▼             |
|------------------------------------------------------------------|
| 📄  Welcome Email                |  Updated: 2 h ago  |  68% ✓   |
| 📄  Landing Page Copy            |  Updated: 1 d ago  |  72% ✓   |
| 📄  Social Post – Launch Teaser  |  Updated: 3 d ago  |  80% ✓   |
+------------------------------------------------------------------+
```
Columns: title, last edited, suggestion adoption %.

#### 2.4.3 Editor
```
+---------------- Document: Welcome Email ----------------+
| Back | Save | Export ▼ | Readability: 7th Grade (FR-5) |
+---------------------------------------------------------+
| *Inline rich-text area (ProseMirror/Tiptap)*            |
|                                                         |
|  "...Thanks for joining us at ►WordWise◄..."            |
|           ^                 ^                           |
| (grammar flag)      (tone flag)                        |
+---------------------------------------------------------+
| Suggestion Card (appears when flag clicked)             |
|  Original: "Thanks for joining..."                      |
|  Suggestion: "Thrilled to welcome you..."               |
|  Why: Persuasive, brand-friendly                        |
|  [Accept] [Reject]                                      |
+---------------------------------------------------------+
```

#### 2.4.4 Brand Voice Settings
* Tone dropdown (Friendly, Formal, etc.)
* Reading level slider
* "Banned words" comma-list input

#### 2.4.5 Analytics Dashboard
Bar/line charts for:
• Suggestion acceptance % over time
• Average readability score trend

---

## 3. Data Model & Schemas

### 3.1 Entities & Relationships
* **users** 1--* **documents**
* **documents** 1--* **suggestions**
* **users** 1--* **analytics**

### 3.2 PostgreSQL DDL Snippets

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  brand_tone text DEFAULT 'friendly',
  reading_level int DEFAULT 8,
  banned_words text[]
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  title text,
  content text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX ON documents(user_id);

CREATE TABLE suggestions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_id uuid REFERENCES documents(id),
  start_idx int,
  end_idx int,
  type text, -- grammar, tone, etc.
  original_text text,
  suggestion_text text,
  explanation text,
  confidence numeric
);

CREATE INDEX ON suggestions(doc_id);

CREATE TABLE analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  metric text,
  value numeric,
  ts timestamptz DEFAULT now()
);
```

---

## 4. API & Integration Contracts

| # | Method | Path | Auth | Request Body | Success - 200 Response |
|---|--------|------|------|--------------|-------------------------|
| 1 | POST | /auth/v1/token | — | { email, password } | { jwt } |
| 2 | GET  | /rest/v1/documents | Bearer | — | [{ id, title, updated_at }] |
| 3 | POST | /rest/v1/documents | Bearer | { title, content } | { id } |
| 4 | PATCH| /rest/v1/documents/:id | Bearer | { content } | { updated_at } |
| 5 | DELETE| /rest/v1/documents/:id | Bearer | — | 204 |
| 6 | POST | /rest/v1/suggestions | Bearer | { doc_id, start, end, action } | 204 |
| 7 | POST | /functions/v1/suggest | Bearer | { text, brandTone, readingLevel } | { suggestions:[…] } |

### 4.1 OpenAI Prompt - Edge Function Flow
1. Frontend sends chunk (≤ 2 000 words) to `/functions/v1/suggest`.
2. Edge Function builds prompt:

```
SYSTEM: You are WordWise...
USER: <json with text + brand settings>
```
3. GPT-4o returns JSON suggestions.
4. Function validates schema, stores to `suggestions`, returns to client.

---

## 5. Epic & Milestone Breakdown (7-Day Hack)

| Day | Goals & Deliverables | Effort | Dependencies |
|-----|----------------------|--------|--------------|
| 1 | Repo scaffold, Docker, Supabase project, Auth page | M | None |
| 2 | Document CRUD (backend + dashboard UI) | M | Day 1 |
| 3 | Edge Function ↔︎ OpenAI, grammar/spell | L | Day 2 |
| 4 | Tone & persuasion features, inline UI | L | Day 3 |
| 5 | Readability calc + Analytics dashboard | L | Day 4 |
| 6 | A/B CTA generator, export (md/html/txt) | M | Day 5 |
| 7 | End-to-end test, deploy to Vercel, demo | M | All |

*Each day below expands into atomic tasks (Section 6).*

---

## 6. Detailed Task Board (Atomic, Sequential)

Each item: **Goal → Implementation → Test**

### 6.1 Environment & Scaffold
1. **Goal:** "Dev Environment Up" – developer can run `npm run dev` and see "Hello WordWise".
   *Why:* Foundation for all tasks.
   **Implementation:**
   - Install Homebrew → `brew install docker supabase node@18`
   - `git clone` repo; `npm create vite@latest wordwise -- --template react-ts`.
   - Add Tailwind per docs.
   - Create `docker-compose.yml` with `services: db (postgres:14), studio (supabase/studio)`; expose 5432.
   - `supabase start` to launch local stack.
   - Verify environment vars in `.env.local`.
   **Test:** Browser `http://localhost:5173` shows Vite page.

2. **Goal:** "Supabase Auth Enabled" – user can sign up & login.
   **Implementation:**
   - In Supabase dashboard, enable Email/Password provider.
   - Add `@supabase/auth-helpers-react`.
   - Build `AuthProvider` wrapper; replace landing page with Login form.
   **Test:** Sign-up yields row in `auth.users` table; JWT available in LocalStorage.

### 6.2 Core Backend
3. **Goal:** "documents table ready" – CRUD via Supabase auto-generated REST.
   **Implementation:** Run SQL from Section 3 in Supabase SQL editor.
   **Test:** `curl -H "apikey: <anon>" /rest/v1/documents` returns `[]`.

4. **Goal:** "Document Dashboard UI" – list documents.
   **Implementation:**
   - Create `Dashboard.tsx`, fetch with `supabase.from('documents').select('*')`.
   - Render table rows.
   **Test:** Creating a doc in DB shows instantly after page refresh.

### 6.3 Editor & Suggestions
5. **Goal:** "Rich-Text Editor Skeleton" – user can type & save plain content.
   **Implementation:** Integrate Tiptap, bind `onUpdate` to Zustand doc state.
   **Test:** Type, click Save → DB `content` updates.

6. **Goal:** "Edge Function deployed" – POST returns sample suggestion.
   **Implementation:**
   - `supabase functions new suggest`; copy prompt logic.
   - Add OpenAI key via `supabase secrets set`.
   - Deploy: `supabase functions deploy suggest`.
   **Test:** `curl -X POST .../suggest` returns `{ suggestions: [] }`.

7. **Goal:** "Inline Highlighting" – problematic spans underlined.
   **Implementation:**
   - On suggestion payload, map indices to editor marks.
   - CSS red squiggle for grammar, blue for tone.
   **Test:** Typing "I is" triggers underline within 1.5 s.

8. **Goal:** "Suggestion Card UI" – shows on click.
   **Implementation:** Popover component reading selection metadata.
   **Test:** Click underline → card shows Accept/Reject.

9. **Goal:** "Accept/Reject Persisted" – click stores decision.
   **Implementation:** Insert row in `suggestions` table with action.
   **Test:** DB row `type='accepted'` appears.

### 6.4 Brand Settings & Analytics
10. **Goal:** "Brand Voice Settings Page" – update user prefs.
    **Implementation:** Form -> update `users` row via Supabase.
    **Test:** Refresh editor, new tone persists.

11. **Goal:** "Readability Score Display" – grade level visible.
    **Implementation:** Use `readability-score` npm lib on content change.
    **Test:** Score updates within 1 s.

12. **Goal:** "Analytics Dashboard" – chart suggestion adoption %.
    **Implementation:**
    - Query `analytics` or aggregate `suggestions`.
    - Render with Chart.js.
    **Test:** Accept suggestions; chart bar increases after refresh.

### 6.5 Export & Deployment
13. **Goal:** "Export Buttons" – markdown/html/txt download.
    **Implementation:** Convert `content` to desired formats using `turndown`.
    **Test:** Downloaded file opens in VS Code with matching text.

14. **Goal:** "Local Docker Build Passes" – `docker compose up` serves app on 3000.
    **Implementation:**
    - Dockerfile multistage: `node:18-alpine` build → `nginx:alpine` serve.
    - Update compose to include frontend.
    **Test:** Visit `localhost:3000`, full app works w/ local Supabase.

15. **Goal:** "Production Deploy" – Vercel + hosted Supabase.
    **Implementation:**
    - `vercel link`, set env vars (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
    - Push `main` → Vercel CI/CD builds.
    - Supabase Edge Function deployed from GitHub action.
    **Test:** `https://wordwise-demo.vercel.app` loads and functions end-to-end.

---

## 7. AI/ML Component Specification

| Aspect | Decision |
|--------|----------|
| Model  | OpenAI GPT-4o (latest, multi-modal capable but we use text) |
| Prompt | System + JSON schema enforcing fields: `start`, `end`, `type`, `suggestion`, `explanation`, `confidence` |
| Latency Target | ≤ 1.5 s median |
| Throughput | ≤ 10 req/min/user (no limit enforced for MVP) |
| Evaluation | Manual spot-check + acceptance % analytics |

---

## 8. Testing Strategy

* **Unit:** Jest for utilities (readability calc, export formatter).
* **Integration:** Cypress for Auth → Editor → Suggestion loop.
* **Load:** k6 hitting `/functions/v1/suggest` with 50 RPS to verify 99p latency < 3 s.
* **Coverage Goal:** 70 % statements.

---

## 9. DevOps & Deployment Pipeline

1. **Branching:** `main` (protected) → `feat/*` PRs.
2. **CI:** GitHub Actions
   - Lint (ESLint, Prettier)
   - Test (Jest)
   - Build (Vite)
3. **CD:**
   - Frontend auto-deploy to Vercel on `main`.
   - `supabase/functions/deploy.yml` pushes Edge Functions.
4. **Secrets:** Managed in Vercel & Supabase dashboards (never committed).
5. **Monitoring:**
   - Vercel Analytics (Web Vitals)
   - Supabase Logs → Slack webhook

---

## 10. Risk Register & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| OpenAI latency spike | Poor UX | Med | Cache last response, show skeleton loader |
| 7-day scope creep | Delay | High | Freeze feature list; daily stand-ups |
| Rate-limit abuse | Cost | Low | Add limit headers in week-2 post-MVP |

---

## 11. Success Metrics Alignment

| PRD Metric | Where Measured |
|------------|----------------|
| 85 % grammar accuracy | Manual QA sample vs. ground truth |
| ≤ 1.5 s suggestion latency | k6 + Supabase logs |
| ≥ 80 % suggestions accepted | `suggestions` table aggregation |
| 10 % CTR lift | Deferred (out of MVP scope) |

---

## 12. Next Steps & Open Questions
* Confirm exact copy for onboarding emails.
* Decide on optional dark mode scope.
* Choose final brand color palette (Tailwind config).

---

## 13. Clarifying Questions
None outstanding.

---