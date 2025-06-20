const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Sample document content with intentional errors
const sampleContent = `<h1>Welcome to WordWise AI - Your Writing Assistant</h1>
<p>This is a sample document to help you get started with WordWise AI. As you can see, their are several grammatical and spelling errors in this document that WordWise AI will help you fix.</p>
<p>Lets explore some common writing mistakes:</p>
<h2>Grammar and Spelling</h2>
<p>Its important to use proper grammer and spelling in you're writing. Many people confuse "your" and "you're" or "its" and "it's". These are common mistakes that effects the credibility of your writing.</p>
<h2>Punctuation Errors</h2>
<p>Proper punctuation is also crucial Have you ever read a sentence without proper punctuation it can be very confusing to understand what the writer is trying to say</p>
<p>Heres another example: using to many commas, or not using them, when they are needed, can make, your writing, hard to read.</p>
<h2>Conciseness and Clarity</h2>
<p>Being concise is very extremely important in order to communicate your ideas in a way that is clear and easy for readers to understand what you are trying to say without using too many unnecessary words that don't add value to your message.</p>
<p>Start editing this document to see how WordWise AI can help improve your writing!</p>`;

async function addSampleDocument() {
  try {
    // First, get the test user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    // Find the test user
    const testUser = users.find(user => user.email === 'test@wordwise.ai');
    
    if (!testUser) {
      console.error('Test user not found. Please make sure test@wordwise.ai exists.');
      return;
    }

    console.log('Found test user:', testUser.id);

    // Check if sample document already exists
    const { data: existingDocs, error: checkError } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', testUser.id)
      .eq('title', 'Welcome to WordWise - Sample Document');

    if (checkError) {
      console.error('Error checking existing documents:', checkError);
      return;
    }

    if (existingDocs && existingDocs.length > 0) {
      console.log('Sample document already exists for this user.');
      return;
    }

    // Insert the sample document
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title: 'Welcome to WordWise - Sample Document',
        content: sampleContent,
        user_id: testUser.id
      }])
      .select();

    if (error) {
      console.error('Error inserting document:', error);
      return;
    }

    console.log('Sample document added successfully!', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
addSampleDocument(); 