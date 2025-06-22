#!/usr/bin/env node

// Node.js test script for SuggestionMark implementation
// This provides automated verification without needing a browser

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing SuggestionMark Implementation');
console.log('=====================================\n');

// Test results collector
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to run a test
function test(description, testFn) {
  try {
    testFn();
    results.passed++;
    results.tests.push({ description, status: '✅ PASS' });
    console.log(`✅ ${description}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ description, status: '❌ FAIL', error: error.message });
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
  }
}

// Test 1: Check if SuggestionMark.ts file exists
test('SuggestionMark.ts file exists', () => {
  const filePath = path.join(__dirname, '../src/components/editor/SuggestionMark.ts');
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }
});

// Test 2: Check if the file exports SuggestionMark
test('SuggestionMark is exported', () => {
  const filePath = path.join(__dirname, '../src/components/editor/SuggestionMark.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const SuggestionMark')) {
    throw new Error('SuggestionMark export not found');
  }
});

// Test 3: Check for required TipTap imports
test('Has required TipTap imports', () => {
  const filePath = path.join(__dirname, '../src/components/editor/SuggestionMark.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("import { Mark } from '@tiptap/core'")) {
    throw new Error('Missing Mark import from @tiptap/core');
  }
});

// Test 4: Check for suggestion type imports
test('Imports SuggestionType', () => {
  const filePath = path.join(__dirname, '../src/components/editor/SuggestionMark.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("import type { SuggestionType }")) {
    throw new Error('Missing SuggestionType import');
  }
});

// Test 5: Check CSS file for suggestion styles
test('CSS contains suggestion mark styles', () => {
  const cssPath = path.join(__dirname, '../src/index.css');
  const content = fs.readFileSync(cssPath, 'utf8');
  
  const requiredStyles = [
    '.suggestion {',
    '.suggestion-grammar',
    '.suggestion-tone',
    '.suggestion-persuasive',
    '.suggestion-conciseness',
    '.suggestion-headline',
    '.suggestion-readability',
    '.suggestion-vocabulary',
    '.suggestion-ab_test'
  ];
  
  for (const style of requiredStyles) {
    if (!content.includes(style)) {
      throw new Error(`Missing CSS class: ${style}`);
    }
  }
});

// Test 6: Check TextEditor includes SuggestionMark
test('TextEditor imports SuggestionMark', () => {
  const editorPath = path.join(__dirname, '../src/components/editor/TextEditor.tsx');
  const content = fs.readFileSync(editorPath, 'utf8');
  if (!content.includes("import { SuggestionMark }")) {
    throw new Error('TextEditor does not import SuggestionMark');
  }
  if (!content.includes("SuggestionMark,")) {
    throw new Error('TextEditor does not use SuggestionMark in extensions');
  }
});

// Test 7: Check test page exists
test('TestSuggestionMark page exists', () => {
  const testPagePath = path.join(__dirname, '../src/pages/TestSuggestionMark.tsx');
  if (!fs.existsSync(testPagePath)) {
    throw new Error('Test page not found');
  }
});

// Test 8: Check verification utility exists
test('Verification utility exists', () => {
  const utilPath = path.join(__dirname, '../src/utils/verifySuggestionMark.ts');
  if (!fs.existsSync(utilPath)) {
    throw new Error('Verification utility not found');
  }
});

// Test 9: Check App.tsx has test route
test('App.tsx includes test route', () => {
  const appPath = path.join(__dirname, '../src/App.tsx');
  const content = fs.readFileSync(appPath, 'utf8');
  if (!content.includes('path="/test-marks"')) {
    throw new Error('Test route not found in App.tsx');
  }
});

// Summary
console.log('\n📊 Test Summary');
console.log('==============');
console.log(`Total tests: ${results.passed + results.failed}`);
console.log(`Passed: ${results.passed}`);
console.log(`Failed: ${results.failed}`);

if (results.failed > 0) {
  console.log('\n❌ Failed tests:');
  results.tests
    .filter(t => t.status.includes('FAIL'))
    .forEach(t => {
      console.log(`  - ${t.description}`);
      console.log(`    ${t.error}`);
    });
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  console.log('\nNext steps for manual verification:');
  console.log('1. Visit http://localhost:3001/test-marks');
  console.log('2. Check browser console for verification logs');
  console.log('3. Click "Apply Sample Marks" button');
  console.log('4. Verify colored underlines appear');
  console.log('5. Test hover states on marked text');
} 