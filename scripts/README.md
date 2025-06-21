# Scripts Directory

This directory contains utility scripts for the WordWise AI project.

## Available Scripts

### add-sample-document.js
Adds a sample document to the database for new users. This helps with onboarding and provides a starting point for users to see how the application works.

**Usage:**
```bash
node scripts/add-sample-document.js
```

### add-sample-document.sql
SQL script version of the sample document insertion. Can be run directly in the Supabase SQL editor.

### copy-latest-screenshot.py
Python script to copy the latest screenshot to the docs/screenshots directory with proper naming.

**Usage:**
```bash
python scripts/copy-latest-screenshot.py
```

### delete-duplicate-samples.js
Removes duplicate sample documents from the database to keep data clean.

**Usage:**
```bash
node scripts/delete-duplicate-samples.js
```

### test-edge-function-prompts.sh
Tests the analyze-text edge function with various prompts to verify it's working correctly.

**Usage:**
```bash
./scripts/test-edge-function-prompts.sh
```

### git-rollback.sh
**⚠️ DANGEROUS**: Bash script that completely reverts your working directory to the last commit state.

This script will:
- Discard ALL changes to tracked files
- DELETE all untracked files and directories
- Cannot be undone!

**Features:**
- Shows current git status before proceeding
- Dry-run preview of files to be deleted
- Double confirmation required for safety
- Colored output for clarity
- Comprehensive error handling

**Usage:**
```bash
./scripts/git-rollback.sh
```

### git-rollback.py
**⚠️ DANGEROUS**: Python version of the git rollback script with safety-first design.

**Default behavior is SAFE** - it only shows what would be changed without making any modifications.

This script provides:
- **Default (safe) mode**: Preview changes without making them
- **Execute mode**: Actually perform the rollback (requires `--execute` flag)
- **Force mode**: Skip confirmations when executing (requires both `--execute` and `--force`)

**Features:**
- Defaults to safe test mode - no accidental data loss
- Clear display of all changes that would be made
- Instructions on how to run the destructive version
- Double confirmation required in execute mode
- Colored output for clarity
- Command-line argument support
- Type hints and better error handling

**Usage:**
```bash
# DEFAULT: Preview what would be changed (SAFE - no changes made)
python3 scripts/git-rollback.py

# Execute rollback with confirmation prompts
python3 scripts/git-rollback.py --execute
# OR
python3 scripts/git-rollback.py -e

# Execute rollback without confirmations (EXTREMELY DANGEROUS!)
python3 scripts/git-rollback.py --execute --force
# OR
python3 scripts/git-rollback.py -e -f

# Show help
python3 scripts/git-rollback.py --help
```

**When to use:**
- When you want to completely abandon all current changes
- After experiments that created many unwanted files
- To ensure a clean state matching the last commit

**Safety measures:**
1. Default behavior is safe mode (just preview)
2. Must explicitly use `--execute` to perform rollback
3. In execute mode, requires typing "yes" to proceed
4. Requires typing "ROLLBACK" as final confirmation
5. Shows the commit you're reverting to
6. The `--force` flag only works with `--execute` and bypasses confirmations

## Notes

- All scripts should be run from the project root directory
- Make sure you have the necessary environment variables set up before running database scripts
- The git-rollback scripts are particularly destructive - use with extreme caution!
- The Python rollback script defaults to safe mode - you must explicitly choose to execute the rollback 