# Test Archive

This directory contains test files that are no longer actively used in the current development workflow but may be valuable for future reference or retesting.

## Purpose

- **Historical Reference**: Keep test files that validated important functionality
- **Regression Testing**: Rerun old tests to ensure system still works as expected
- **Documentation**: Tests often serve as documentation of how components should work
- **Learning Resource**: See how different parts of the system were tested

## Organization

Test files should be named descriptively and include:
- The date they were archived (if relevant)
- What component/feature they test
- Any special context needed to run them

## Archived Tests

### test-prompts.ts (Task 6.5)
- **Purpose**: Validates the prompt engineering logic for the analyze-text edge function
- **Created**: During implementation of sophisticated prompt engineering
- **How to run**: `cd supabase/functions/analyze-text && deno run test-prompts.ts`
- **What it tests**: 
  - All 8 suggestion types are included in prompts
  - Brand voice customization works correctly
  - Reading level is properly incorporated
  - Banned words are handled
  - JSON output format is specified

## Guidelines

1. Don't delete test files - archive them here instead
2. Add a brief description to this README when archiving
3. Include any special instructions needed to run the test
4. Consider organizing into subfolders if archive grows large 