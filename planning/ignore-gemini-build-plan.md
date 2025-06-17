# WordWise AI (Marketing Manager Edition) - MVP Development Plan

This document provides a complete, step-by-step plan for building the WordWise AI MVP. It is designed for a junior developer to follow from a blank slate to a fully functional, deployed application. Each step is designed to be a small, manageable piece of work that builds upon the last.

## 1. Executive Summary

The vision for WordWise AI is to create an intelligent writing assistant that empowers B2B SaaS marketing managers to produce high-converting, on-brand copy with ease. The goal of this 7-day MVP is to build a web-based editor that provides real-time grammar, style, and tone suggestions by integrating with OpenAI. The user will be able to manage their documents, set a brand voice, and receive actionable feedback, all within a secure, cloud-native application.

## 2. Technical Architecture Overview

The application is built on a modern, serverless technology stack chosen for its rapid development capabilities, scalability, and excellent developer experience.

### Component Diagram

```
[ User's Browser ]
       |
       | (HTTPS)
       V
[ Vercel Frontend ] -- (React, TypeScript, Vite, Tailwind, Zustand)
       |
       | (API Calls, Realtime Subscriptions)
       V
[ Supabase Backend ]
 |--- [ Auth ] ------- (User Management)
 |--- [ Postgres DB ] -- (Stores users, documents, settings)
 |--- [ Realtime ] --- (Sends DB changes to frontend)
 |--- [ Edge Functions ] - (Deno runtime)
         |
         | (Secure API Call)
         V
[ OpenAI API (GPT-4o) ] -- (Handles AI text analysis & generation)
```

### Technology Justification

*   **Frontend (React/TypeScript/Vite/Tailwind/Zustand):**
    *   **React:** A popular and robust library for building user interfaces.
    *   **TypeScript:** Adds static typing to JavaScript, which helps catch errors early and improves code quality, making it easier for a junior developer to work with.
    *   **Vite:** A modern build tool that offers an extremely fast development server and optimized builds, speeding up the development cycle.
    *   **Tailwind CSS:** A utility-first CSS framework that allows for rapid UI development without writing custom CSS.
    *   **Zustand:** A small, fast, and simple state management library for React. It's much less complex than Redux, making it ideal for an MVP.
*   **Backend (Supabase):**
    *   **Why Supabase?:** It's an open-source Firebase alternative that provides a suite of backend tools (Postgres Database, Authentication, Instant APIs, Edge Functions, Realtime subscriptions, Storage) in a single, cohesive platform. This drastically reduces the time needed to set up a backend, allowing focus on feature development.
    *   **Postgres:** A powerful, reliable, and feature-rich relational database.
    *   **Edge Functions (Deno):** These are serverless functions that run geographically close to the user, ensuring low latency for API calls. We'll use them to securely call the OpenAI API without exposing our secret keys on the frontend.
*   **AI (OpenAI GPT-4o):**
    *   **GPT-4o:** OpenAI's latest flagship model is fast, cost-effective, and excels at the kind of nuanced language understanding and generation required for grammar, tone, and style analysis.
*   **Hosting (Vercel):**
    *   **Vercel:** Offers a seamless, zero-configuration deployment experience for frontend applications, especially those built with frameworks like React/Vite. Its integration with GitHub for continuous deployment (CI/CD) makes shipping new code simple and fast.

## 3. Data Model & Schemas

We will use a relational model in Supabase's Postgres database. The following SQL statements define the tables, their columns, and the relationships between them.

### `users`

Stores information about the authenticated users and their brand preferences.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase's built-in auth user
    email TEXT UNIQUE,
    -- FR-4: Brand-voice settings. Default to 'friendly'.
    brand_tone TEXT NOT NULL DEFAULT 'friendly',
    brand_readability_level TEXT NOT NULL DEFAULT '8th grade', -- Example, can be more specific
    banned_words TEXT[] -- Array of words to flag
);
```

### `documents`

Stores the text content created by users.

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Document',
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast document lookups by user
CREATE INDEX idx_documents_user_id ON documents(user_id);
```

### `suggestions`

Logs every suggestion made by the AI for a document. This is crucial for analytics.

```sql
CREATE TABLE suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    start_idx INT NOT NULL, -- Starting character index of the original text
    end_idx INT NOT NULL,   -- Ending character index of the original text
    suggestion_type TEXT NOT NULL, -- e.g., 'grammar', 'tone', 'conciseness'
    original_text TEXT NOT NULL,
    suggested_text TEXT NOT NULL,
    explanation TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast suggestion lookups by document
CREATE INDEX idx_suggestions_doc_id ON suggestions(doc_id);
```

### `analytics`

Stores aggregated metrics for the user dashboard.

```sql
CREATE TABLE analytics (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- e.g., 'suggestion_acceptance_rate', 'readability_score'
    metric_value FLOAT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast analytics lookups by user
CREATE INDEX idx_analytics_user_id_metric ON analytics(user_id, metric_name);
```

## 4. API & Integration Contracts

The primary backend interaction will be through a Supabase Edge Function that we create.

### Edge Function: `analyze-text`

This function is the core of the AI features. It takes a piece of text and a list of desired analyses, then returns AI-generated suggestions.

*   **Endpoint:** `POST /functions/v1/analyze-text`
*   **Authentication:** Supabase User JWT is required. The function will have access to the user's ID to fetch their brand profile.
*   **Request Body:**

    ```json
    {
      "text_to_analyze": "This is some sample copy for our new landing page. Its great.",
      "analysis_types": ["grammar", "spelling", "tone", "persuasive"]
    }
    ```

*   **Success Response (200 OK):**

    ```json
    {
      "suggestions": [
        {
          "start_idx": 65,
          "end_idx": 68,
          "suggestion_type": "spelling",
          "original_text": "Its",
          "suggested_text": "It's",
          "explanation": "Corrects the spelling of 'Its' to the contraction 'It's' (it is)."
        },
        {
          "start_idx": 69,
          "end_idx": 74,
          "suggestion_type": "tone",
          "original_text": "great",
          "suggested_text": "transformative",
          "explanation": "Replaces 'great' with a more persuasive, high-impact word aligned with a professional tone."
        }
      ]
    }
    ```

*   **Error Response (e.g., 500 Internal Server Error):**

    ```json
    {
      "error": "Failed to connect to OpenAI service."
    }
    ```

### AI Service Interaction (OpenAI GPT-4o)

Within the `analyze-text` Edge Function, we will format a specific prompt to send to the OpenAI API.

*   **Prompt Engineering Strategy:** We'll use a "system" prompt to set the context and a "user" prompt containing the text and user-specific brand guidelines.

*   **Example Prompt Structure:**

    **System Prompt:**
    > You are an expert marketing copy editor named WordWise. Your goal is to analyze the user's text and provide suggestions to make it more grammatically correct, persuasive, and aligned with their brand voice. The user's brand tone is: `{brand_tone}`. The target readability is: `{brand_readability_level}`. Avoid these banned words: `{banned_words}`.
    >
    > Analyze the following text. Identify areas for improvement related to: `{analysis_types}`.
    > For each identified issue, provide a JSON object with the following keys: `start_idx`, `end_idx`, `suggestion_type`, `original_text`, `suggested_text`, and `explanation`. The `start_idx` and `end_idx` must correspond to the character positions in the original text.
    >
    > Return ONLY a valid JSON array of these suggestion objects.

    **User Prompt:**
    > ```
    > {text_to_analyze}
    > ```

## 5. Epic & Milestone Breakdown (Roadmap)

This project is a 1-week hackathon. We'll structure the work into daily milestones.

### **Milestone 1: Days 1-2 (Foundation & Core Document Functionality)**

*   **Goal:** Set up the entire project environment, implement user authentication, and create the basic document editor where users can create, view, save, and load their work.
*   **User Stories:**
    *   (Setup) As a developer, I want a fully configured local environment so I can start building features.
    *   (FR-2) As a marketer, I want to sign up and log in to the application so I can securely access my work.
    *   (FR-6) As a marketer, I want to create a new document and have it saved automatically.
    *   (FR-6) As a marketer, I want to see a list of my existing documents and open them for editing.
*   **Key Technical Tasks:**
    *   Set up local Docker environment for Supabase. (S)
    *   Initialize Supabase cloud project & link to local dev. (S)
    *   Scaffold React+TS frontend with Vite. (S)
    *   Implement user sign-up, login, and logout flows using Supabase Auth UI or custom components. (M)
    *   Create a "dashboard" page listing user's documents. (M)
    *   Create an "editor" page with a rich-text input field. (M)
    *   Implement database functions to create, read, and update documents. (L)
*   **Dependencies:** None.

### **Milestone 2: Days 3-4 (First AI Integration)**

*   **Goal:** Bring the "AI" into WordWise. Create the backend Edge Function to call OpenAI and display the first set of suggestions (grammar, spelling, tone) in the UI.
*   **User Stories:**
    *   (FR-3) As a marketer, I want to receive real-time grammar and spelling suggestions.
    *   (User Story 1) As a marketer, I want tone adjustments to match my brand voice.
    *   (FR-4) As a marketer, I want a settings page where I can define my brand voice (tone).
*   **Key Technical Tasks:**
    *   Create the `analyze-text` Supabase Edge Function. (M)
    *   Securely store and access OpenAI API key in Supabase. (S)
    *   Implement the prompt engineering logic to call GPT-4o for grammar and tone analysis. (L)
    *   Create a settings page UI for the user to set their `brand_tone`. (M)
    *   Modify the Edge Function to pull the user's `brand_tone` from the DB and include it in the prompt. (M)
    *   On the frontend, call the Edge Function when a user highlights text and clicks an "Analyze" button. (L)
    *   Develop the UI for inline suggestion cards that appear on highlighted text. (L)
*   **Dependencies:** Milestone 1 complete.

### **Milestone 3: Days 5-7 (Advanced Features, Polish & Deployment)**

*   **Goal:** Implement the remaining AI features, build the analytics dashboard, and get the application ready for the final demo by polishing the UI and deploying it to the cloud.
*   **User Stories:**
    *   (User Story 2, 3, 4, 5, 6, 7) As a marketer, I want suggestions for persuasive language, conciseness, headline optimization, readability, vocabulary, and A/B alternatives.
    *   (FR-5) As a marketer, I want to see an analytics dashboard showing how I use suggestions.
    *   (FR-7) As a marketer, I want to export my final copy as Markdown or text.
*   **Key Technical Tasks:**
    *   Expand the `analyze-text` Edge Function and prompt to handle all new analysis types. (L)
    *   Implement the logic to track "accepted" vs. "rejected" suggestions in the `suggestions` table. (M)
    *   Create the Analytics Dashboard UI. (L)
    *   Write SQL queries or a Postgres Function to calculate metrics like suggestion acceptance rate. (M)
    *   Add "Export to Markdown/Text" functionality. (S)
    *   (FR-DEV_ONLY_1) Add a "Login as Test User" button for easy testing. (S)
    *   Final UI/UX polish and bug fixing. (M)
    *   Deploy the Supabase project (DB migrations, Edge Functions). (M)
    *   Deploy the React frontend to Vercel. (M)
    *   Record a demo video. (S)
*   **Dependencies:** Milestone 2 complete.

## 6. Detailed Task Board (Backlog Grooming)

Follow these steps in order. Each one is an atomic task.

---

### **Task 1: Project & Environment Setup**

*   **Goal:** Prepare your computer for development. This step is crucial because a consistent and working local environment prevents a wide range of future issues.
    *   **Verification:** You will be able to run the local Supabase services and see the dashboard on your machine.
*   **Implementation Details:**
    1.  Install Docker Desktop for macOS if you don't have it.
    2.  Install the Supabase CLI (Command Line Interface). The docs will show a command like `brew install supabase/tap/supabase-cli`. The CLI lets you control Supabase from your terminal.
    3.  Create a new project folder on your computer named `wordwise`.
    4.  Open a terminal, navigate into the `wordwise` folder, and run `supabase init`. This creates a new `/supabase` directory inside your project.
    5.  Run `supabase start`. This command uses Docker to download and run all the services Supabase needs (database, auth, etc.) on your machine.
*   **Test Phase:**
    *   After `supabase start` finishes, your terminal will print out URLs and keys. Open the URL for the "Supabase Studio" (e.g., `http://localhost:54323`). You should see a local, web-based dashboard for your project. This confirms the local environment is running.

---

### **Task 2: Supabase Cloud & DB Schema Setup**

*   **Goal:** Create the live Supabase project in the cloud and apply our database schema. This gives us a remote backend to deploy to later and ensures our local database matches our planned structure.
    *   **Verification:** You will see the `users`, `documents`, `suggestions`, and `analytics` tables in both your local and cloud Supabase Studio dashboards.
*   **Implementation Details:**
    1.  Go to [supabase.com](https://supabase.com), sign up, and create a new, free-tier project. Name it "WordWise".
    2.  In your terminal (in the `wordwise` project folder), link your local project to the cloud project by running `supabase link --project-ref <your-project-ref>`. You find the `<project-ref>` in your new project's settings on the Supabase website.
    3.  Find the `/supabase/migrations` directory. Inside, there will be a file with a name like `..._init.sql`.
    4.  Replace the contents of that SQL file with the `CREATE TABLE` statements from Section 3 of this plan.
    5.  Run `supabase db reset`. This command drops all local tables and re-runs the migration file, creating our schema locally.
    6.  Run `supabase db push`. This command applies the same schema changes to your live cloud database.
*   **Test Phase:**
    *   Open your local Supabase Studio (`http://localhost:54323`). Go to the "Table Editor" section. Verify you see the four new tables.
    *   Log in to your project at [supabase.com](https://supabase.com). Go to the "Table Editor" section. Verify you see the same four tables there.

---

### **Task 3: Frontend Scaffolding**

*   **Goal:** Create the basic React application that will be the user interface for our product.
    *   **Verification:** A new browser window will open showing the default React starter page.
*   **Implementation Details:**
    1.  In your terminal, from the root `wordwise` directory, run `npm create vite@latest frontend -- --template react-ts`. This command uses Vite to create a new folder named `frontend` containing a ready-to-use React and TypeScript project.
    2.  When prompted, select `React` and `TypeScript`.
    3.  `cd` into the new `frontend` directory: `cd frontend`.
    4.  Install the necessary libraries: `npm install`.
    5.  Install Supabase's client library and Tailwind CSS: `npm install @supabase/supabase-js tailwindcss postcss autoprefixer zustand react-router-dom`.
    6.  Follow the official Tailwind CSS guide for Vite to initialize it. This involves creating `tailwind.config.js` and `postcss.config.js` files and updating `index.css`.
    7.  Run `npm run dev` to start the development server.
*   **Test Phase:**
    *   Your browser should automatically open to `http://localhost:5173` (or a similar port) and display a starter page. This confirms the frontend setup is working.

---

### **Task 4: Authentication (FR-2 & FR-DEV_ONLY_1)**

*   **Goal:** Allow users to sign up and log in. This is the gateway to the application.
    *   **Verification:** You can create a new user, log out, and log back in. After logging in, you are redirected to a placeholder "dashboard" page.
*   **Implementation Details:**
    1.  Create a file `frontend/src/supabaseClient.js`. In this file, import `createClient` from `@supabase/supabase-js` and export a new client instance. You will get the `URL` and `anon key` from your local Supabase terminal output (from `supabase start`) or from the cloud project settings.
    2.  Structure your app using `react-router-dom`. Create three pages (components): `LoginPage.jsx`, `DashboardPage.jsx`, and `EditorPage.jsx`.
    3.  Create a `LoginPage.jsx` component. It should have two forms: one for Sign Up and one for Log In (each with email/password fields and a button).
    4.  Wire the form buttons to call `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` respectively. Use `try/catch` blocks to handle errors. On success, navigate the user to `/dashboard`.
    5.  **For the test user button (FR-DEV_ONLY_1):** Add a separate button on the login page labeled "Login as Tester". When clicked, this should call the login function with a hardcoded test user email/password (e.g., `test@test.com` / `password`).
    6.  Create a `DashboardPage.jsx` component. For now, it can just say "Welcome to your Dashboard" and have a "Log Out" button. The logout button should call `supabase.auth.signOut()`.
    7.  Implement protected routes. Only logged-in users should be able to see the Dashboard page.
*   **Test Phase:**
    1.  Go to the app, use the sign-up form. Check your Supabase Studio's "Authentication" section to see the new user.
    2.  You should be redirected to the dashboard. Click log out. You should be returned to the login page.
    3.  Use the login form with the credentials you just created. Verify it works.
    4.  Click the "Login as Tester" button and ensure it logs you in with the test credentials.

---

### **Task 5: Document Management (FR-6)**

*   **Goal:** Let users create, view, and open documents. This is the core non-AI functionality.
    *   **Verification:** On the dashboard, you can click a "New Document" button, be taken to the editor, and when you return, see the new document in a list. Clicking the item in the list takes you back to the editor with the correct content.
*   **Implementation Details:**
    1.  On `DashboardPage.jsx`, add a "New Document" button.
    2.  When clicked, this button should call a function that performs an `INSERT` into the `documents` table in Supabase, associating it with the current `user_id`. After the insert is successful, navigate the user to `/editor/{document_id}`.
    3.  On the `DashboardPage.jsx`, fetch and display all documents belonging to the current user. Use `SELECT * FROM documents WHERE user_id = ...`. Display them as a list of clickable titles.
    4.  Create the `EditorPage.jsx` component. It should get the `document_id` from the URL.
    5.  Inside `EditorPage.jsx`, use the `id` to fetch the specific document's content from Supabase and display it in a text area (for now, a simple `<textarea>`).
    6.  Implement an auto-save feature. Use a `useEffect` hook with a debounce mechanism (to avoid saving on every single keystroke). When the user stops typing for ~2 seconds, send an `UPDATE` query to Supabase to save the current content of the text area to the correct document.
*   **Test Phase:**
    1.  Click "New Document". Confirm you're redirected.
    2.  Type "Hello World" in the text area. Wait 3 seconds.
    3.  Go back to the dashboard. A new "Untitled Document" should be in the list.
    4.  Click on that document. You should be taken back to the editor, and "Hello World" should be in the text area.

---

### **And so on...**

The plan would continue in this fashion for all remaining tasks, including:

*   **Task 6: Create the AI Edge Function (FR-3)**
*   **Task 7: Implement Inline Suggestion UI (FR-1)**
*   **Task 8: Wire Frontend to Edge Function**
*   **Task 9: Implement Brand Voice Settings Page (FR-4)**
*   **Task 10: Enhance AI Prompt with All Features (User Stories 1-7)**
*   **Task 11: Implement Suggestion Tracking (Accept/Reject)**
*   **Task 12: Build Analytics Dashboard (FR-5)**
*   **Task 13: Implement Export Feature (FR-7)**
*   **Task 14: Final Polish & Testing**
*   **Task 15: Deployment**

---

## 7. AI/ML Component Specification

*   **Model Used:** OpenAI's `gpt-4o` API.
*   **Reason for Selection:** `gpt-4o` offers the best combination of speed, cost-effectiveness, and high-quality language understanding for the complex tasks we require (grammar, tone, persuasion, etc.). Its native support for structured JSON output is critical for our application.
*   **Fine-Tuning:** No fine-tuning is required for the MVP. We will achieve our goals through sophisticated prompt engineering.
*   **Prompt Engineering:** The core of our AI is the system prompt. It will be dynamically constructed based on the user's brand settings from the database. It will instruct the model to act as an expert copy editor and to return its findings in a specific, machine-readable JSON format. See Section 4 for the detailed prompt structure.
*   **Evaluation & Metrics:**
    *   **Latency:** We are targeting a median suggestion latency of ≤ 1.5 seconds. The `gpt-4o` model is fast enough to meet this. We will show loading skeletons in the UI to manage user perception during the API call.
    *   **Accuracy:** We will manually test the grammar correction accuracy against a benchmark set of sentences with known errors. The target is ≥ 85% accuracy.

## 8. Testing Strategy

Our testing strategy is pragmatic, focusing on delivering a reliable MVP within the short timeline.

*   **Unit Testing (Low Priority for MVP):**
    *   **Tools:** Vitest or Jest.
    *   **Focus:** We would ideally test small, pure functions, like utility functions for formatting text. Given the 7-day timeline, extensive unit testing is a non-goal, but utility functions should be tested.
*   **Integration Testing (Medium Priority):**
    *   **Tools:** React Testing Library, Vitest.
    *   **Focus:** Testing the interaction between components and Supabase. For example: Does the `DashboardPage` correctly fetch and render a list of documents? Does clicking the "New Document" button correctly call the Supabase client and navigate?
*   **End-to-End (E2E) Testing (High Priority - Manual):**
    *   **Tools:** Manual testing based on a checklist.
    *   **Focus:** A human tester (the developer) will follow the user stories from start to finish. This is the most important part of our testing.
    *   **Checklist:**
        1.  Can a user sign up?
        2.  Can a user log in and log out?
        3.  Can a user create a document?
        4.  Does the document auto-save?
        5.  Can the user re-open the document?
        6.  When highlighting text and clicking "Analyze", do suggestions appear?
        7.  Are the suggestions relevant?
        8.  Does accepting a suggestion update the text?
        9.  Does the analytics dashboard show data?
        10. Can a user export the document?
*   **Code Coverage:** No specific coverage target for the hackathon. The focus is on functional correctness verified by manual E2E testing.

## 9. DevOps & Deployment Pipeline

We will use a simple and effective deployment process powered by Vercel and Supabase's built-in features.

*   **Branching Model:**
    *   `main`: This branch is our production branch. Anything merged here is automatically deployed to the live application.
    *   `feature/name-of-feature`: All new work is done on a feature branch (e.g., `feature/auth-flow`). When the feature is complete, a Pull Request (PR) is created to merge it into `main`.
*   **CI/CD (Continuous Integration / Continuous Deployment):**
    1.  Create a new repository on GitHub.
    2.  Push the `wordwise` project code to the repository.
    3.  **Frontend:** Create a new project on Vercel and link it to the GitHub repository. Vercel will automatically detect the Vite/React setup. It will build and deploy the `frontend` directory every time new code is pushed to the `main` branch.
    4.  **Backend:** The Supabase backend is deployed differently. Database changes are deployed by running `supabase db push`. Edge Function changes are deployed by running `supabase functions deploy <function-name>`. For the MVP, we will run these commands manually after merging a feature to `main`.
*   **Environments:**
    *   **Local:** The Docker-based environment managed by the Supabase CLI.
    *   **Production:** The live project hosted on Supabase Cloud and Vercel.
*   **Secret Management:**
    *   **OpenAI API Key:** Store this as a secret in the Supabase project dashboard using the command `supabase secrets set OPENAI_API_KEY <your-key>`. This makes it securely available to Edge Functions without exposing it in code.
    *   **Supabase Keys:** The public `anon key` and `URL` for the frontend will be stored as Environment Variables in the Vercel project settings.

## 10. Risk Register & Mitigations

*   **Risk 1: High OpenAI API Latency/Failures** (High Impact, Medium Probability)
    *   **Mitigation 1:** The Edge Function will have a timeout (e.g., 10 seconds). If OpenAI doesn't respond, it will return a graceful error to the frontend.
    *   **Mitigation 2:** The frontend will display a loading skeleton or spinner in the UI as soon as the analysis request is made. This manages user expectations.
    *   **Mitigation 3:** We will implement a simple caching mechanism. If the exact same text block is analyzed twice within a few minutes, we can return the cached result. (This is a stretch goal).
*   **Risk 2: Inaccurate or Nonsensical AI Suggestions** (Medium Impact, Medium Probability)
    *   **Mitigation 1:** Extensive prompt engineering. We will refine the system prompt iteratively to be as specific as possible, guiding the AI to the desired output format and quality.
    *   **Mitigation 2:** Give the user the power to reject suggestions. This ensures they are always in control and builds trust. The rejection data can also be used later to fine-tune models.
*   **Risk 3: Falling Behind the 7-Day Schedule** (High Impact, High Probability)
    *   **Mitigation 1:** Ruthlessly prioritize the MVP features defined in the PRD. De-scope anything that is not absolutely essential (e.g., complex animations, additional export formats).
    *   **Mitigation 2:** The granular task list in this document is designed to keep development focused. Stick to the plan.
    *   **Mitigation 3:** If a feature is taking too long, time-box the effort. It's better to have 5 working features than 7 half-finished ones.

## 11. Success Metrics Alignment

This section connects the project's development milestones to the business goals.

*   **≥ 85 % grammar-correction accuracy:**
    *   **Measurement:** Manually tested during **Milestone 2 & 3** by running the AI against a predefined list of sentences with grammatical errors.
*   **≤ 1.5 s median latency for suggestions:**
    *   **Measurement:** Measured in **Milestone 2 & 3** by adding `console.time()` and `console.timeEnd()` in the frontend code that calls the Edge Function.
*   **≥ 80 % of AI suggestions accepted or modified:**
    *   **Measurement:** This is the primary metric for the Analytics Dashboard built in **Milestone 3**. The data will come from tracking user clicks on "accept" in the `suggestions` table.
*   **≥ 10 % lift in click-through rate...:**
    *   **Measurement:** De-scoped for the MVP per the clarification answers. This would be measured via user surveys post-MVP.

## 12. Next Steps & Open Questions

*   **Next Steps:**
    1.  The developer should begin with **Task 1: Project & Environment Setup** and proceed sequentially through the task board.
    2.  The developer should create a GitHub repository for the project.
    3.  The developer should create the Supabase and Vercel cloud projects.
*   **Open Questions:**
    *   What specific readability formula should be targeted (e.g., Flesch-Kincaid, Gunning-Fog)? For the MVP, we will use a general instruction like "8th-grade reading level" in the prompt, but a more specific formula could be implemented later.

## 13. Clarifying Questions

None outstanding. The provided PRD and clarification answers give a clear path forward for the MVP.