# WordWise AI Demo Script

## Demo Video Script (~3-5 minutes)

### Introduction (30 seconds)
"Hi, I'm demonstrating WordWise AI, a marketing copy assistant that provides real-time writing suggestions. Let me show you what we've built so far."

### Part 1: Login & Navigation (30 seconds)
1. **Show login page**
   - "First, let me log in with our test account"
   - Use credentials: test@wordwise.ai
   - Show successful authentication

2. **Navigate to Editor**
   - Click on "Editor" in the navigation
   - "The editor is where the magic happens"

### Part 2: Document Management (30 seconds)
1. **Create a new document** (if needed)
   - Click "Create New Document"
   - Show the document appears in the list

2. **Select a document**
   - "Let me select a document to work with"
   - Click on a document from the list

### Part 3: Core Functionality Demo (2 minutes)

1. **Type text with intentional errors**
   ```
   Type slowly: "these are a bad sentence."
   ```
   - "Watch as I type text with some grammatical issues"
   - Wait 2 seconds after typing for analysis
   - "Notice the 2-second debounce before analysis runs"

2. **Show the underlines appearing**
   - "You can see different colored underlines appear:"
   - Point out blue underline on "these" (grammar)
   - Point out purple underline on "bad" (vocabulary)
   - "Blue indicates grammar issues, purple is for vocabulary improvements"

3. **Hover over suggestions**
   - Hover over "these"
   - "When I hover, I see the suggestion details"
   - Show popup: "these → These"
   - Hover over "bad"
   - Show popup: "bad → poor"

4. **Accept a suggestion**
   - Click on "these" underline
   - Click "Accept" in the popup
   - "Watch as the text updates to 'These'"
   - "Notice the underline disappears after accepting"

5. **Show re-analysis**
   - "The system automatically re-analyzes after changes"
   - Wait 2 seconds
   - "Now only the vocabulary suggestion remains"

6. **Accept second suggestion**
   - Click on "bad" underline
   - Click "Accept"
   - "The text now reads 'These are a poor sentence.'"

### Part 4: Show Test Features (1 minute)
1. **Mention test pages**
   - "We've built extensive test pages to verify each component"
   - Navigate to `/test/ai-service`
   - "This tests our AI integration"
   - Show it working

2. **Show another test**
   - Navigate to `/test/suggestion-colors`
   - "This demonstrates our color coding system"
   - Show the different suggestion types

### Part 5: Current Limitations (30 seconds)
"While the core functionality is working, there are some limitations we're addressing:

1. The AI doesn't catch all grammar errors - for example, it misses that 'These are a poor sentence' should be 'This is a poor sentence'
2. Sometimes character positions from the AI are incorrect, but we've built corrections for this
3. The integration is complex, requiring careful state management between TipTap and React"

### Closing (30 seconds)
"WordWise AI successfully provides:
- Real-time text analysis with visual feedback
- Color-coded suggestions by type
- Interactive hover tooltips
- One-click accept/reject functionality
- Automatic re-analysis after changes

This represents the completion of our core editor integration task. Thank you for watching!"

## Demo Tips

### DO:
- Type slowly so viewers can see the real-time updates
- Wait for the 2-second debounce to show analysis
- Mouse over suggestions slowly to show tooltips
- Click deliberately on Accept/Reject buttons
- Mention that this uses Docker for local development

### DON'T:
- Don't type too fast (the analysis won't keep up)
- Don't skip the waiting period for analysis
- Don't rush through the hover interactions
- Don't try to demonstrate edge cases that might fail

### Technical Setup:
1. Make sure Docker is running: `docker-compose up -d`
2. Access the app at http://localhost:3000
3. Have the browser console open to show logging (optional)
4. Use a screen recorder that captures mouse movements

### Backup Plan:
If something doesn't work as expected:
- "As you can see, we're still refining some edge cases"
- "The core functionality is working, but this particular scenario needs adjustment"
- Move on to the test pages which are more reliable 