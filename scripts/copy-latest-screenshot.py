#!/usr/bin/env python3
"""
Copy the most recent screenshot from ~/Documents/Screenshots to the project's docs/screenshots folder.
Usage: python copy-latest-screenshot.py [optional_new_name]
"""

import os
import shutil
import sys
from pathlib import Path
from datetime import datetime

def get_latest_screenshot(source_dir):
    """Find the most recent screenshot file in the source directory."""
    screenshots = []
    
    # Common screenshot extensions
    extensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.PNG', '.JPG', '.JPEG']
    
    for file in Path(source_dir).iterdir():
        if file.is_file() and file.suffix in extensions:
            # Get file modification time
            mtime = file.stat().st_mtime
            screenshots.append((mtime, file))
    
    if not screenshots:
        return None
    
    # Sort by modification time (newest first)
    screenshots.sort(reverse=True)
    return screenshots[0][1]  # Return the path of the newest file

def main():
    # Define paths
    home = Path.home()
    source_dir = home / "Documents" / "Screenshots"
    
    # Get the script's directory and find project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    dest_dir = project_root / "docs" / "screenshots"
    
    # Check if source directory exists
    if not source_dir.exists():
        print(f"Error: Source directory does not exist: {source_dir}")
        sys.exit(1)
    
    # Create destination directory if it doesn't exist
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Get the latest screenshot
    latest_screenshot = get_latest_screenshot(source_dir)
    
    if not latest_screenshot:
        print(f"No screenshots found in {source_dir}")
        sys.exit(1)
    
    # Determine destination filename
    if len(sys.argv) > 1:
        # Use provided name
        new_name = sys.argv[1]
        if not new_name.lower().endswith(('.png', '.jpg', '.jpeg')):
            new_name += latest_screenshot.suffix
    else:
        # Generate name based on current date/time
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        new_name = f"screenshot_{timestamp}{latest_screenshot.suffix}"
    
    dest_path = dest_dir / new_name
    
    # Copy the file
    try:
        shutil.copy2(latest_screenshot, dest_path)
        print(f"✓ Copied: {latest_screenshot.name}")
        print(f"  To: {dest_path.relative_to(project_root)}")
        print(f"  As: {new_name}")
        
        # Show file size
        size_kb = dest_path.stat().st_size / 1024
        print(f"  Size: {size_kb:.1f} KB")
        
    except Exception as e:
        print(f"Error copying file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 