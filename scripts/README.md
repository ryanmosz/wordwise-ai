# WordWise Utility Scripts

This directory contains utility scripts to help with development tasks.

## copy-latest-screenshot.py

Copies the most recent screenshot from `~/Documents/Screenshots` to the project's `docs/screenshots` folder.

### Usage

```bash
# Copy with auto-generated timestamp name
./scripts/copy-latest-screenshot.py

# Copy with custom name
./scripts/copy-latest-screenshot.py "task-5.3-editor-implementation"

# Or run with python
python scripts/copy-latest-screenshot.py "custom-name"
```

### Features
- Automatically finds the most recent screenshot based on modification time
- Supports common image formats (png, jpg, jpeg, gif, bmp)
- Can specify a custom name or use auto-generated timestamp
- Shows file size and destination path after copying
- Creates the destination directory if it doesn't exist

### Examples
```bash
# After taking a screenshot of a completed feature
./scripts/copy-latest-screenshot.py "task-5.2-final-layout"

# Quick copy with timestamp
./scripts/copy-latest-screenshot.py
# Output: screenshot_2025-06-19_15-30-45.png
``` 