#!/usr/bin/env python3
"""
Git Rollback Script
Safely reverts your entire working directory to the state of the last commit.
Default behavior is test mode (safe). Use --execute to actually perform rollback.
"""

import subprocess
import sys
import argparse
from typing import List, Tuple
import os

# ANSI color codes
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    BOLD = '\033[1m'
    NC = '\033[0m'  # No Color

def print_color(color: str, message: str):
    """Print colored output"""
    print(f"{color}{message}{Colors.NC}")

def print_separator():
    """Print a separator line"""
    print("━" * 80)

def run_command(cmd: List[str], capture_output: bool = True) -> Tuple[int, str]:
    """Run a shell command and return exit code and output"""
    try:
        if capture_output:
            result = subprocess.run(cmd, capture_output=True, text=True)
            return result.returncode, result.stdout + result.stderr
        else:
            result = subprocess.run(cmd)
            return result.returncode, ""
    except Exception as e:
        return 1, str(e)

def check_git_repository() -> bool:
    """Check if we're in a git repository"""
    returncode, _ = run_command(['git', 'rev-parse', '--git-dir'])
    return returncode == 0

def get_current_branch() -> str:
    """Get the current branch name"""
    returncode, output = run_command(['git', 'branch', '--show-current'])
    if returncode == 0 and output.strip():
        return output.strip()
    
    # Fallback for detached HEAD
    returncode, output = run_command(['git', 'rev-parse', '--abbrev-ref', 'HEAD'])
    return output.strip() if returncode == 0 else "unknown"

def get_last_commit() -> str:
    """Get the last commit info"""
    returncode, output = run_command(['git', 'log', '-1', '--oneline'])
    return output.strip() if returncode == 0 else "unknown"

def get_git_status() -> Tuple[List[str], List[str], List[str]]:
    """Get lists of modified, staged, and untracked files"""
    returncode, output = run_command(['git', 'status', '--porcelain'])
    
    if returncode != 0:
        return [], [], []
    
    modified = []
    staged = []
    untracked = []
    
    for line in output.strip().split('\n'):
        if not line:
            continue
        
        status = line[:2]
        filename = line[3:]
        
        if status == '??':
            untracked.append(filename)
        elif status[1] == 'M' or (status[0] == ' ' and status[1] == 'M'):
            modified.append(filename)
        elif status[0] in 'MADRC':
            staged.append(filename)
    
    return modified, staged, untracked

def get_untracked_files() -> List[str]:
    """Get list of files that would be removed by git clean"""
    returncode, output = run_command(['git', 'clean', '-n', '-d'])
    
    if returncode != 0:
        return []
    
    files = []
    for line in output.strip().split('\n'):
        if line.startswith('Would remove '):
            files.append(line.replace('Would remove ', ''))
    
    return files

def show_status():
    """Display current git status"""
    branch = get_current_branch()
    commit = get_last_commit()
    
    print_separator()
    print_color(Colors.BOLD, "🔄 Git Complete Rollback Tool")
    print_separator()
    print()
    print_color(Colors.BLUE, f"Current branch: {Colors.BOLD}{branch}{Colors.NC}")
    print_color(Colors.BLUE, f"Last commit: {Colors.BOLD}{commit}{Colors.NC}")
    print()
    
    modified, staged, untracked = get_git_status()
    
    print_color(Colors.YELLOW, "📊 Current Status:")
    print()
    
    if modified:
        print_color(Colors.YELLOW, f"  • {len(modified)} modified tracked file(s)")
        for i, file in enumerate(modified[:5]):
            print(f"    - {file}")
        if len(modified) > 5:
            print(f"    ... and {len(modified) - 5} more")
    
    if staged:
        print_color(Colors.YELLOW, f"  • {len(staged)} staged file(s)")
        for i, file in enumerate(staged[:5]):
            print(f"    - {file}")
        if len(staged) > 5:
            print(f"    ... and {len(staged) - 5} more")
    
    if untracked:
        print_color(Colors.YELLOW, f"  • {len(untracked)} untracked file(s)/folder(s)")
    
    print()
    
    if not modified and not staged and not untracked:
        print_color(Colors.GREEN, "✅ Working directory is already clean!")
        return False
    
    return True

def show_changes_preview():
    """Show what changes would be made"""
    untracked_files = get_untracked_files()
    
    print_color(Colors.RED, "⚠️  The following changes would be made:")
    print()
    
    print_color(Colors.YELLOW, "1. All modifications to tracked files would be discarded")
    print_color(Colors.YELLOW, "2. All staged changes would be unstaged and discarded")
    
    if untracked_files:
        print_color(Colors.YELLOW, "3. The following untracked files/folders would be PERMANENTLY DELETED:")
        print()
        for file in untracked_files:
            print(f"  • {file}")
    else:
        print_color(Colors.YELLOW, "3. No untracked files to remove")
    
    print()

def confirm_action() -> bool:
    """Ask for user confirmation"""
    print_separator()
    print_color(Colors.RED, f"{Colors.BOLD}⚠️  WARNING: This operation CANNOT be undone!{Colors.NC}")
    print_color(Colors.RED, "All local changes will be PERMANENTLY LOST!")
    print_separator()
    print()
    
    response = input("Are you sure you want to rollback to the last commit? (yes/no): ")
    if response.lower() != 'yes':
        return False
    
    print()
    response = input("Type 'ROLLBACK' to confirm you want to discard ALL changes: ")
    return response == 'ROLLBACK'

def execute_rollback(dry_run: bool = True):
    """Execute the rollback operation"""
    if dry_run:
        print()
        print_color(Colors.BLUE, "🔍 TEST MODE - No changes will be made")
        print()
        
        print_color(Colors.BLUE, "Would execute:")
        print("  1. git reset --hard HEAD")
        print("  2. git clean -f -d")
        print()
        
        print_color(Colors.GREEN, "✅ Test complete - no changes were made")
        print()
        print_separator()
        print_color(Colors.YELLOW, "💡 To actually perform the rollback, run:")
        print_color(Colors.BOLD, "   python3 scripts/git-rollback.py --execute")
        print_separator()
        return True
    
    print()
    print_color(Colors.BLUE, "🔄 Rolling back...")
    print()
    
    # Step 1: Discard all changes to tracked files
    print_color(Colors.BLUE, "Step 1: Discarding changes to tracked files...")
    returncode, output = run_command(['git', 'reset', '--hard', 'HEAD'])
    
    if returncode == 0:
        print_color(Colors.GREEN, "  ✅ Tracked files reset to last commit")
    else:
        print_color(Colors.RED, f"  ❌ Failed to reset tracked files: {output}")
        return False
    
    # Step 2: Delete all untracked files and directories
    print_color(Colors.BLUE, "Step 2: Removing untracked files and directories...")
    returncode, output = run_command(['git', 'clean', '-f', '-d'])
    
    if returncode == 0:
        print_color(Colors.GREEN, "  ✅ Untracked files removed")
    else:
        print_color(Colors.RED, f"  ❌ Failed to remove untracked files: {output}")
        return False
    
    print()
    print_separator()
    print_color(Colors.GREEN, f"{Colors.BOLD}✅ Rollback complete!{Colors.NC}")
    print_color(Colors.GREEN, f"Your working directory is now at: {Colors.BOLD}{get_last_commit()}{Colors.NC}")
    print_separator()
    
    # Show final status
    print()
    print_color(Colors.BLUE, "Final status:")
    run_command(['git', 'status', '--short'], capture_output=False)
    
    return True

def main():
    parser = argparse.ArgumentParser(
        description='Git Rollback Tool - Completely revert to last commit state',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s              # Default: Show what would be changed (safe mode)
  %(prog)s --execute    # Actually perform the rollback with confirmations
  %(prog)s -e --force   # Execute rollback without confirmations (DANGEROUS!)
        """
    )
    
    parser.add_argument(
        '--execute', '-e',
        action='store_true',
        help='Execute the rollback (default is test mode)'
    )
    
    parser.add_argument(
        '--force', '-f',
        action='store_true',
        help='Skip confirmation prompts when used with --execute (use with extreme caution!)'
    )
    
    args = parser.parse_args()
    
    # Check if we're in a git repository
    if not check_git_repository():
        print_color(Colors.RED, "Error: Not in a git repository!")
        sys.exit(1)
    
    # Show current status
    has_changes = show_status()
    
    if not has_changes:
        sys.exit(0)
    
    # Show what would be changed
    show_changes_preview()
    
    if args.execute:
        # Execute mode
        if args.force or confirm_action():
            execute_rollback(dry_run=False)
        else:
            print_color(Colors.YELLOW, "Operation cancelled.")
    else:
        # Default: test mode
        execute_rollback(dry_run=True)

if __name__ == "__main__":
    main() 