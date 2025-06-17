# WordWise AI – MVP Development Plan (o3pro Edition)

*Audience: A junior developer fresh out of college.
Follow the steps **in order**. Every numbered section has three parts: **Goal**, **Implementation**, **Test** so you always know what to do and how to prove it worked.*

---

## 1 Executive Summary
### Goal
Provide a single-paragraph overview that restates the product vision and MVP purpose so all stakeholders share the same mental model. Verifiable by asking *"Can I explain WordWise in ~30 seconds?"*

### Implementation
Summarize: "WordWise AI is a web-based writing assistant for B2B SaaS marketing managers that delivers real-time, on-brand improvement suggestions (grammar, tone, persuasion) and basic analytics, built with React 18, Supabase, OpenAI, and deployed to Vercel—all in one 7-day hackathon."

### Test
1. Read the paragraph aloud in ≤ 30 seconds.
2. A teammate confirms it matches the PRD’s 1-sentence summary and goals.

---

## 2 Technical Architecture Overview
### Goal
Define how frontend, backend, AI, data, and hosting fit together. Important because it guides folder structure, data flow, and deployment decisions.

### Implementation
1. **High-Level Diagram**
   ```
   [Browser: React + Vite + Tailwind]
        │  (HTTPS, JWT)
        ▼
   [Supabase Edge Function (Deno) ▸ OpenAI GPT-4o]
        │
   [Supabase Postgres + Realtime] ──▶ pgvector (future)
        │
   [Vercel Hosting] (static + SSR optional)
   ```
2. **Justification**
   • **React 18 + Vite** for fast dev refresh.
   • **Supabase** offers Postgres, Auth, Realtime channels and serverless Edge Functions in one service.
   • **OpenAI GPT-4o** supplies language intelligence without in-house model training.
   • **Vercel** excels at global edge caching and automatic CI/CD for frontend.

### Test
Open the diagram and verbally map user keystrokes through each component; a peer must confirm the path is logical and complete.

---

## 3 Data Model & Schemas
### Goal
Document every table and field so the database can be created without guesswork.

### Implementation
| Table | Field | Type | Notes | Indexes |
|-------|-------|------|-------|---------|
| `users` | `id` | uuid PK | Supabase Auth UID | PK |
|         | `email` | text | unique | UX: login | unique |
|         | `brand_tone` | text | "friendly" default |  |
| `documents` | `id` uuid PK |  | PK |  |
|            | `user_id` uuid FK → users.id |  | foreign index |
|            | `title` text |  |  |
|            | `content` text | up to 2000 words |  |
|            | `created_at` timestamptz | default now() |  |
| `suggestions` | `id` uuid PK |  | PK |
|              | `doc_id` uuid FK → documents.id |  | idx_doc |
|              | `start_idx` int | char position |  |
|              | `end_idx` int |  |  |
|              | `type` text | grammar / tone / etc. |  |
|              | `original_text` text |  |  |
|              | `suggestion_text` text |  |  |
|              | `explanation` text |  |  |
|              | `confidence` numeric | 0-1 |  |
| `analytics` | `id` uuid PK |  | PK |
|             | `user_id` uuid FK |  | idx_user |
|             | `metric` text | e.g., acceptance_rate |  |
|             | `value` numeric |  |  |
|             | `ts` timestamptz | |  |

**SQL example for `documents`**
```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  content text check (length(content) < 12000), -- ~2k words
  created_at timestamptz default now()
);
create index on documents(user_id);
```

### Test
Run `supabase db push` and confirm all tables are created with no errors. Verify indexes with `\d` in psql.

---

## 4 API & Integration Contracts
### Goal
List every endpoint so the frontend knows exactly how to communicate with the backend and Edge Functions.

### Implementation
| # | Method | Path | Request Body | Response | Auth |
|---|--------|------|--------------|----------|------|
| 1 | GET | `/api/documents` | — | `[Document]` | JWT |
| 2 | POST | `/api/documents` | `{title, content}` | `Document` | JWT |
| 3 | GET | `/api/documents/:id` | — | `Document` | JWT |
| 4 | PUT | `/api/documents/:id` | `{content}` | `Document` | JWT |
| 5 | DELETE | `/api/documents/:id` | — | `204 No Content` | JWT |
| 6 | POST | `/functions/v1/analyze` | `{docId, text}` | `[Suggestion]` | JWT |
| 7 | POST | `/functions/v1/accept` | `{suggestionId}` | `200 OK` | JWT |
| 8 | GET | `/api/analytics` | — | `{acceptanceRate, readabilityTrend}` | JWT |

**AI Prompt Flow**
```json
{
  "system": "You are WordWise AI assistant...",
  "user": "Analyze the following text for grammar, tone...",
  "text": "<2000-word chunk>",
  "tone": "friendly"
}
```
Expected JSON (Edge Function validates schema):
```json
[
  {
    "start_idx": 15,
    "end_idx": 32,
    "type": "tone",
    "suggestion_text": "Let's explore innovative solutions",
    "explanation": "More friendly tone",
    "confidence": 0.92
  }
]
```

### Test
Use `curl` or Postman: send each request, confirm HTTP status codes and JSON shape match the table.

---

## 5 Epic & Milestone Breakdown
### Goal
Translate the 7-day hackathon into clear epics for safe tracking.

### Implementation

| Day | Epic | Deliverables | Stories (IDs from section 6) | Effort |
|-----|------|--------------|------------------------------|--------|
| 1 | Project Scaffold | Vite + React repo, Tailwind, ESLint, Prettier, Supabase project, Docker dev env | T1-T4 | M |
| 2 | CRUD Documents | List/create/edit/delete docs in UI, save to Postgres | T5-T9 | L |
| 3 | Grammar + Spelling | Edge Function `/analyze` returns grammar fixes | T10-T13 | L |
| 4 | Tone & Persuasion | Extend analysis for tone + persuasion, inline cards UI | T14-T18 | L |
| 5 | Dashboard | Analytics page w/ acceptance rate, readability trend | T19-T22 | M |
| 6 | A/B Alternative Generator | AI CTA variants + accept flow | T23-T25 | M |
| 7 | Polish & Deploy | Responsive design, demo video, Vercel + Supabase prod | T26-T30 | M |

### Test
At end of each day, run the app locally and confirm deliverables table checklist is complete.

---

## 6 Detailed Task Board
*(Import these as Kanban cards in GitHub Projects or Trello.)*

### Goal
Provide atomic tasks with DoD (Definition of Done) so nothing is ambiguous.

### Implementation

| ID | Task Description | Definition of Done | Effort |
|----|------------------|--------------------|--------|
| T1 | Initialize Vite + React + TS repo | `npm run dev` shows Vite splash page | S |
| T2 | Add Tailwind & configure PostCSS | Hello-world page styled in Tailwind | S |
| T3 | Commit ESLint + Prettier config | `npm run lint` passes | S |
| T4 | Dockerfile & docker-compose for local dev | `docker compose up` serves frontend on localhost:5173 | M |
| T5 | Supabase project + env vars | `.env.local` contains SUPABASE_URL & ANON_KEY | S |
| T6 | Create `users`, `documents` tables | `supabase db push` succeeds | S |
| T7 | Build DocsList component (React) | Displays all docs from API | M |
| T8 | Build DocEditor page w/ textarea | Saves edits on debounce | M |
| T9 | API route `/api/documents` in Next.js | Unit test returns mock docs | M |
| T10 | Edge Function scaffold `analyze.ts` | Returns dummy suggestion array | S |
| T11 | Connect OpenAI GPT-4o | Live suggestions in console | M |
| T12 | Highlight text in editor | Underlines AI-flagged tokens | M |
| T13 | Inline SuggestionCard component | Clicking highlight shows card | M |
| … | *(continue list up to T30 as hinted in milestones)* | | |

### Test
Move a card to "Done" only when DoD statement is verifiably true (run command, UI state, etc.).

---

## 7 AI / ML Component Specification
### Goal
Clarify how the Edge Function interacts with OpenAI to meet latency and accuracy targets.

### Implementation
1. **Model**: `gpt-4o-mini` (context ≤ 8k tokens) for cost & speed.
2. **Prompt Engineering**: System + user instructions; include brand tone. Use numbered suggestion list for easy parsing.
3. **Latency Expectations**: ≤ 1.5 s median. Use streaming JSON chunks; show loading skeleton in UI.
4. **Evaluation**: Log `confidence`; later analyze acceptance vs. confidence.

### Test
Run `supabase functions deploy analyze` then `time curl ...` and verify p50 latency < 1.5 s.

---

## 8 Testing Strategy
### Goal
Ensure reliability with minimum false negatives; provide confidence to ship quickly.

### Implementation
| Level | Tool | Coverage Target |
|-------|------|-----------------|
| Unit | Vitest (TS) | ≥ 70 % |
| Integration | Playwright | Key editor flows |
| End-to-End | Cypress | Login ➜ Edit ➜ Accept suggestion |
| Load | k6 | 50 RPS to `/analyze` Edge Function |

### Test
CI run (`pnpm test`) must pass on every PR; coverage badge shows ≥ target.

---

## 9 DevOps & Deployment Pipeline
### Goal
Define how code moves from laptop to production with secrets managed safely.

### Implementation
1. **Branching**: `main` (prod), `dev` (daily work), feature branches → PRs.
2. **CI/CD**:
   - GitHub Actions → lint, test, build.
   - On merge to `main`: Vercel auto-deploy frontend, Supabase migration GitHub Action runs.
3. **Infra-as-Code**: `supabase/config.toml` tracked; no manual DB console changes.
4. **Secrets**: Github → Settings → Actions → Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`).
5. **Monitoring**: Vercel Analytics + Supabase Logs panel; install Logflare for function logs.

### Test
Merge dummy PR; verify Vercel deploy preview URL and Supabase migration run automatically.

---

## 10 Risk Register & Mitigations
### Goal
Proactively list major risks so the team can respond, not react.

### Implementation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OpenAI latency spike | Medium | High | Cache last 5 prompts in `suggestions` table; show spinner |
| Supabase downtime | Low | High | Enable automatic daily backups; read-only fallback |
| Scope creep | High | Med | Freeze requirements; add new ideas to backlog icebox |
| 7-day time crunch | High | High | Daily stand-ups + clear DoD; cut nice-to-have tasks first |

### Test
Review this table daily; if a risk occurs, log outcome and update status.

---

## 11 Success Metrics Alignment
### Goal
Tie PRD metrics to checkpoints so we know when we win.

### Implementation

| PRD Metric | Measurement Point | Pass Criteria |
|------------|-------------------|---------------|
| ≥ 85 % grammar accuracy | Unit tests on `analyze` suggestions | Precision ≥ 0.85 |
| ≤ 1.5 s median latency | k6 load test p50 | p50 ≤ 1.5 s |
| ≥ 80 % suggestions accepted | User event logs after 1 week beta | Acceptance_rate ≥ 0.80 |
| ≥ 10 % CTR lift (later) | Post-MVP survey | n/a for MVP |

### Test
Instrument dashboards; verify each metric auto-updates.

---

## 12 Next Steps & Open Questions
### Goal
Highlight any remaining decisions to keep momentum.

### Implementation
1. Finalize brand-tone default beyond "friendly"?
2. Choose UI library for dropdowns (Headless UI vs Radix)?
3. Confirm production OpenAI budget/limit.

### Test
All questions resolved by kickoff meeting; if not, assign an owner.

---

## 13 Clarifying Questions
None outstanding.

---

# Appendix A Local Development Setup (Docker, macOS)

### Goal
Ensure any new teammate can spin up the project locally in ≤ 10 minutes.

### Implementation
1. **Install Prerequisites**
   ```bash
   brew install git docker supabase/tap/supabase
   ```
2. **Clone & configure**
   ```bash
   git clone https://github.com/<your-org>/wordwise.git
   cd wordwise
   cp .env.example .env.local
   # add SUPABASE_URL, ANON_KEY, OPENAI_API_KEY
   ```
3. **Docker Compose**
   ```bash
   docker compose up --build
   ```
   Services:
   • `web` – React dev server at http://localhost:5173
   • `db` – Supabase Postgres at port 54322
   • `studio` – Supabase Studio at port 54323

### Test
Open http://localhost:5173 ➜ should display "WordWise – Hello, world".

---

# Appendix B Remote Deployment (Vercel + Supabase)

### Goal
Publish the application so stakeholders can access a live URL.

### Implementation
1. **Vercel**
   • Import GitHub repo.
   • Set environment variables identical to `.env.local`.
   • Framework preset: "Other" (Vite).
2. **Supabase**
   • Create new project.
   • Copy `SUPABASE_URL` + `ANON_KEY` into Vercel and local `.env`.
   • Push database schema: `supabase db push --linked`.
3. **Edge Functions**
   ```bash
   supabase functions deploy analyze
   ```
4. **Production Domain**
   • In Vercel, add custom domain if needed.

### Test
Open live URL, sign up, create a doc, and receive AI suggestions in ≤ 1.5 s.

---

*End of Plan — You’ve got this! 🚀*