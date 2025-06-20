-- Script to add sample document to test user account
-- Run this in Supabase SQL Editor

-- First, find the test user's ID
WITH test_user AS (
  SELECT id 
  FROM auth.users 
  WHERE email = 'test@wordwise.ai'
  LIMIT 1
)

-- Insert the sample document if it doesn't already exist
INSERT INTO documents (user_id, title, content)
SELECT 
  tu.id,
  'Welcome to WordWise - Sample Document',
  '<h1>Welcome to WordWise AI - Your Writing Assistant</h1>
<p>This is a sample document to help you get started with WordWise AI. As you can see, their are several grammatical and spelling errors in this document that WordWise AI will help you fix.</p>
<p>Lets explore some common writing mistakes:</p>
<h2>Grammar and Spelling</h2>
<p>Its important to use proper grammer and spelling in you''re writing. Many people confuse "your" and "you''re" or "its" and "it''s". These are common mistakes that effects the credibility of your writing.</p>
<h2>Punctuation Errors</h2>
<p>Proper punctuation is also crucial Have you ever read a sentence without proper punctuation it can be very confusing to understand what the writer is trying to say</p>
<p>Heres another example: using to many commas, or not using them, when they are needed, can make, your writing, hard to read.</p>
<h2>Conciseness and Clarity</h2>
<p>Being concise is very extremely important in order to communicate your ideas in a way that is clear and easy for readers to understand what you are trying to say without using too many unnecessary words that don''t add value to your message.</p>
<p>Start editing this document to see how WordWise AI can help improve your writing!</p>'
FROM test_user tu
WHERE NOT EXISTS (
  SELECT 1 
  FROM documents d 
  WHERE d.user_id = tu.id 
  AND d.title = 'Welcome to WordWise - Sample Document'
);

-- Return the result
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'Sample document added successfully!'
    ELSE 'Sample document already exists or test user not found.'
  END as result
FROM documents 
WHERE title = 'Welcome to WordWise - Sample Document'
AND user_id = (SELECT id FROM auth.users WHERE email = 'test@wordwise.ai' LIMIT 1); 