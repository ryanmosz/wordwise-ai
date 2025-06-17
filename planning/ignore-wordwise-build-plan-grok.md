# WordWise AI MVP Development Plan

This document outlines the step-by-step process to build the WordWise AI Minimum Viable Product (MVP), an AI-powered writing assistant for marketing managers. Each step is designed to be clear and straightforward, guiding you from scratch to a working demo in 7 days. Follow the steps in order, and you'll create a tool that helps users write better marketing copy with real-time suggestions and analytics.

---

## Step 1: Project Setup and Authentication

### Goal
- **What You'll Accomplish:** Set up the basic project structure and enable users to sign up, log in, and log out securely.
- **Why It’s Important:** This step lays the foundation for everything else. Without a working project and secure user access, no one can use the app.
- **How to Verify:** You can sign up with an email and password, log in, and log out successfully, with the editor showing up after login.

### Implementation Details
1. **Start the React Project:**
   - Open your terminal on your Mac.
   - Run `npm create vite@latest wordwise -- --template react-ts` to create a new React project with TypeScript.
   - Move into the project folder: `cd wordwise`.
   - Install extra tools: `npm install tailwindcss postcss autoprefixer zustand`.
   - Set up Tailwind by running `npx tailwindcss init -p`, then edit the `tailwind.config.js` file to include your project files (add `content: ['./src/**/*.{js,ts,jsx,tsx}']`).
2. **Set Up Supabase:**
   - Go to supabase.com, sign up, and create a new project called "WordWise".
   - In the Supabase dashboard, find your project’s API URL and anon key (under Settings > API).
   - Install the Supabase client: `npm install @supabase/supabase-js`.
   - Create a file at `src/supabaseClient.js` and add code to connect to Supabase using your URL and key.
3. **Add Authentication:**
   - Make a new folder `src/components/auth` and create three files: `Signup.js`, `Login.js`, and `Logout.js`.
   - In `Signup.js`, create a form with email and password fields that calls Supabase’s sign-up function when submitted.
   - In `Login.js`, make a similar form that calls Supabase’s login function.
   - In `Logout.js`, add a button that calls Supabase’s logout function.
   - Update `src/App.js` to show these components based on whether a user is logged in (use Zustand to track this state).
4. **Create a Basic Editor:**
   - Install a text editor library: `npm install react-quill`.
   - Create `src/components/Editor.js` and add a simple React Quill editor that shows text as you type.

### Test Phase
- Run `npm run dev` in your terminal and open `localhost:5173` in your browser.
- Sign up with a test email and password, then log in—check that you see the editor.
- Click the logout button and confirm you’re back at the login screen.

---

## Step 2: Document Management

### Goal
- **What You'll Accomplish:** Let users create, save, and load their documents in the app.
- **Why It’s Important:** Users need a way to work on their marketing copy and keep it safe, which is the core of the writing assistant.
- **How to Verify:** You can create a new document, save it, and see it load back into the editor later.

### Implementation Details
1. **Set Up the Documents Table in Supabase:**
   - In the Supabase dashboard, go to the SQL Editor.
   - Run a command to create a table called "documents" with columns: `id` (uuid, auto-generated), `user_id` (uuid), `title` (text), `content` (text), `created_at` (timestamp, default to now).
   - Enable Row Level Security (RLS) and add a policy so users can only see their own documents (match `user_id` to the logged-in user’s ID).
2. **Create API Functions:**
   - In `src/supabaseClient.js`, add functions to:
     - Create a new document (insert into "documents" with user_id from the logged-in user).
     - Get all documents for the current user (select where user_id matches).
     - Get one document by its ID.
     - Update a document’s content by ID.
     - Delete a document by ID.
3. **Build the Document List:**
   - Create `src/components/DocumentList.js` to show all documents for the logged-in user (fetch them using your get-all-documents function).
   - Add a "New Document" button that calls your create-document function with a default title like "Untitled".
4. **Connect the Editor:**
   - In `Editor.js`, load the content of a selected document when you click it from the list.
   - Save changes to the document whenever you stop typing for a second (use a timer to call the update-document function).

### Test Phase
- Log in, click "New Document", type something in the editor, and save it.
- Refresh the page and click the document from the list—check that your text loads back.
- Delete the document and confirm it’s gone from the list.

---

## Step 3: Grammar and Spelling Suggestions

### Goal
- **What You'll Accomplish:** Add real-time grammar and spelling suggestions that users can see and accept.
- **Why It’s Important:** This is a key feature that makes WordWise helpful—it catches mistakes as users write.
- **How to Verify:** Type a sentence with errors, see suggestions appear, and accept one to fix the text.

### Implementation Details
1. **Set Up an Edge Function:**
   - In the Supabase dashboard, go to Edge Functions and create a new one called "generate-suggestions".
   - Write code in Deno (Supabase’s language) to take document text, send it to OpenAI’s GPT-4o API (you’ll need an OpenAI API key from openai.com), and return suggestions like "change 'teh' to 'the'".
   - Add your OpenAI key to the Edge Function’s environment variables in Supabase.
2. **Generate Suggestions:**
   - In `Editor.js`, whenever the text changes, send the current content to your Edge Function (wait 1 second after typing stops to avoid spamming).
   - Store the returned suggestions in a new Supabase table called "suggestions" with columns: `id` (uuid), `doc_id` (uuid), `start_idx` (number), `end_idx` (number), `type` (text, e.g., "grammar"), `original_text` (text), `suggestion_text` (text), `explanation` (text), `confidence` (number).
3. **Show Suggestions in the Editor:**
   - Highlight text in the editor where suggestions apply (use the start_idx and end_idx).
   - When you click a highlighted area, show a small card with the suggestion text and an "Accept" button.
   - If "Accept" is clicked, replace the original text with the suggestion and update the document.

### Test Phase
- Type "I writed teh best copy" in the editor.
- Click the highlighted "writed" and "teh", check that suggestion cards show "wrote" and "the".
- Accept one suggestion and see the text change in the editor.

---

## Step 4: Tone and Persuasiveness Features

### Goal
- **What You'll Accomplish:** Add suggestions to match the user’s brand tone and make copy more persuasive.
- **Why It’s Important:** This helps marketing managers keep their brand voice consistent and boost conversions.
- **How to Verify:** Suggestions appear that adjust tone or improve persuasiveness when you write.

### Implementation Details
1. **Update the Edge Function:**
   - Change the "generate-suggestions" function to include the user’s brand tone (default "friendly") and ask OpenAI for tone and persuasiveness suggestions too.
   - Get the brand tone from a new "users" table column `brand_tone` (text, default "friendly")—add this table in Supabase with `id` (uuid), `email` (text), and `brand_tone`.
2. **Add New Suggestion Types:**
   - In the "suggestions" table, store "tone" and "persuasiveness" as possible values for the `type` column.
3. **Update the Editor UI:**
   - In `Editor.js`, make sure suggestion cards show the type ("tone" or "persuasiveness") and explanation clearly when you click highlighted text.

### Test Phase
- Type "Buy this now!" and click the highlighted text.
- Check that a "tone" suggestion offers a friendlier version like "Ready to grab this?".
- Accept it and confirm the text updates.

---

## Step 5: Headline Optimization and Readability

### Goal
- **What You'll Accomplish:** Provide suggestions to improve headlines and show readability scores.
- **Why It’s Important:** Great headlines grab attention, and readable text keeps readers engaged—both are vital for marketing.
- **How to Verify:** You get headline suggestions and see a readability score update as you type.

### Implementation Details
1. **Improve the Edge Function:**
   - Add a section to the OpenAI prompt in "generate-suggestions" to look for headlines (first line or bold text) and suggest better versions.
   - Ask OpenAI to calculate a readability score (like Flesch-Kincaid) for the whole document.
2. **Calculate and Show Readability:**
   - In `Editor.js`, display the readability score from the Edge Function response at the top of the editor.
3. **Build an Analytics Dashboard:**
   - Create `src/components/AnalyticsDashboard.js` to show two things: how often you accept suggestions (count "Accept" clicks) and the latest readability score.
   - Store these in a new Supabase table "analytics" with `id` (uuid), `user_id` (uuid), `metric` (text, e.g., "suggestion_acceptance"), `value` (number), `ts` (timestamp).

### Test Phase
- Write a headline like "Get Stuff" and check for a suggestion like "Boost Your Results Today".
- Type a long sentence and see the readability score drop below 60 (harder to read).
- Look at the dashboard and confirm it shows your suggestion acceptance rate.

---

## Step 6: A/B Suggestion Generator and Polish

### Goal
- **What You'll Accomplish:** Offer A/B phrasing options for key sentences and make the app look nice.
- **Why It’s Important:** A/B options let users test what works best, and a polished app builds confidence in the tool.
- **How to Verify:** You see two phrasing options for a call-to-action, and the app feels smooth to use.

### Implementation Details
1. **Add A/B Suggestions:**
   - Update the Edge Function to detect calls-to-action (like "Buy now") and return two different suggestion options from OpenAI.
   - In the "suggestions" table, store both options in `suggestion_text` (e.g., as a list or separate rows linked by `doc_id`).
2. **Show A/B Options:**
   - In `Editor.js`, when you click a highlighted call-to-action, show two buttons in the suggestion card (e.g., "Option A: Sign Up Today" and "Option B: Join Now").
   - Clicking one updates the text with that option.
3. **Polish the App:**
   - Use Tailwind to style buttons, cards, and the editor—make them clean and easy to read (e.g., blue buttons, white backgrounds).
   - Test all features to fix any bugs, like suggestions not showing up.

### Test Phase
- Type "Click here" and click it—check that you get two options like "Tap Now" and "Explore Today".
- Pick one and see the text update.
- Visually confirm the app looks neat and all buttons work.

---

## Step 7: Testing and Deployment

### Goal
- **What You'll Accomplish:** Test everything works and put the app online for others to use.
- **Why It’s Important:** Testing ensures the app is reliable, and deployment makes it real—your hard work pays off!
- **How to Verify:** All tests pass, and you can use the app at a live web address.

### Implementation Details
1. **Write Tests:**
   - Install Jest: `npm install --save-dev jest`.
   - In `src/__tests__`, write tests for:
     - Authentication (signup works).
     - Document saving (content matches what you typed).
     - Suggestions (returns something for "teh").
   - Add an end-to-end test with Cypress (`npm install cypress --save-dev`) to log in and edit a document.
2. **Set Up Local Docker:**
   - Install Docker Desktop on your Mac from docker.com.
   - Create a `Dockerfile` in the project root to build the React app (use a Node.js base image, copy files, run `npm install` and `npm run build`).
   - Create `docker-compose.yml` to run the app (link it to Supabase’s local setup if needed).
   - Run `docker-compose up` to start it locally.
3. **Deploy Remotely:**
   - **Frontend (Vercel):**
     - Push your code to a GitHub repo.
     - Sign up at vercel.com, connect your repo, and deploy (set build command to `npm run build`).
     - Add environment variables in Vercel for Supabase URL, key, and OpenAI key.
   - **Backend (Supabase):**
     - In Supabase, deploy your Edge Function from the dashboard.
     - Check that tables and RLS policies are set up.

### Test Phase
- Run `npm test` and confirm all Jest tests pass.
- Open Cypress (`npx cypress open`), run the end-to-end test, and watch it succeed.
- Go to your Vercel URL (e.g., wordwise.vercel.app), log in, and edit a document—check it works.

---

## Local and Remote Deployment Instructions

### Local Development
- **Setup:**
  - Install Docker Desktop on your Mac from docker.com.
  - In your project folder, create a `Dockerfile`:
    - Start with `FROM node:18`, copy your project files, run `npm install`, and set the start command to `npm run dev`.
  - Create a `docker-compose.yml` file:
    - Define a service for your app (build from the Dockerfile, map port 5173 to 5173).
  - Run `docker-compose up` in your terminal.
- **Check:** Open `localhost:5173` in your browser and see the app running.

### Remote Deployment
- **Frontend (Vercel):**
  - Push your project to GitHub (e.g., `git push origin main`).
  - Log in to vercel.com, import your repo, and deploy it.
  - In Vercel’s dashboard, go to Settings > Environment Variables and add your Supabase and OpenAI keys.
- **Backend (Supabase):**
  - In the Supabase dashboard, go to Edge Functions and deploy "generate-suggestions".
  - Confirm your tables ("users", "documents", "suggestions", "analytics") are ready.
- **Check:** Visit your Vercel URL and use the app as you did locally.

---

Congratulations! By following these steps, you’ve built WordWise AI from scratch. Take a moment to feel proud—you’ve turned an idea into a working tool!