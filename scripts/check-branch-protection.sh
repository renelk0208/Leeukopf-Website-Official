#!/bin/bash

# Script to check and optionally remove branch protection rules for the main branch
# This script requires GitHub CLI (gh) to be installed and authenticated

set -e

REPO="renelk0208/Leeukopf-Website-Official"
BRANCH="main"

echo "================================================"
echo "Branch Protection Checker"
echo "Repository: $REPO"
echo "Branch: $BRANCH"
echo "================================================"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "To install:"
    echo "  - macOS: brew install gh"
    echo "  - Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo "  - Windows: https://github.com/cli/cli/releases"
    echo ""
    echo "After installation, authenticate with: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Check current branch protection
echo "Checking current branch protection rules..."
echo ""

# Try to get branch protection and capture the output and status
PROTECTION_OUTPUT=$(gh api "repos/$REPO/branches/$BRANCH/protection" 2>&1)
API_STATUS=$?

if [ $API_STATUS -eq 0 ]; then
    # Successfully retrieved protection rules - they exist
    echo "$PROTECTION_OUTPUT"
    echo ""
    echo "⚠️  Branch protection IS ENABLED on $BRANCH"
    echo ""
    echo "Current protection rules are shown above."
    echo ""

    # Ask if user wants to remove protection
    read -p "Do you want to REMOVE branch protection from $BRANCH? (yes/no): " -r
    echo

    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Removing branch protection..."
        if gh api -X DELETE "repos/$REPO/branches/$BRANCH/protection"; then
            echo ""
            echo "✅ Branch protection has been REMOVED from $BRANCH"
            echo ""
            echo "You can now push directly to $BRANCH:"
            echo "  git push origin $BRANCH"
        else
            echo ""
            echo "❌ Failed to remove branch protection."
            echo "You may not have sufficient permissions."
        fi
    else
        echo "Branch protection was NOT removed."
        echo ""
        echo "To remove it manually:"
        echo "1. Go to: https://github.com/$REPO/settings/branches"
        echo "2. Click 'Delete' or 'Edit' next to the $BRANCH rule"
        echo "3. Disable all protection settings or delete the rule"
    fi
else
    # API call failed - check if it's a 404 (no protection) or real error
    if echo "$PROTECTION_OUTPUT" | grep -q "404"; then
        echo "✅ No branch protection rules found on $BRANCH"
        echo ""
        echo "You should be able to push directly to $BRANCH:"
        echo "  git push origin $BRANCH"
    else
        echo "❌ Error checking branch protection:"
        echo "$PROTECTION_OUTPUT"
        echo ""
        echo "Possible reasons:"
        echo "- You don't have permission to view branch protection"
        echo "- The repository or branch doesn't exist"
        echo "- GitHub API is having issues"
    fi
fi

echo ""
echo "================================================"
echo "Alternative Methods:"
echo "================================================"
echo ""
echo "1. GitHub Web Interface:"
echo "   https://github.com/$REPO/settings/branches"
echo ""
echo "2. Check for Repository Rulesets (newer feature):"
echo "   https://github.com/$REPO/settings/rules"
echo ""
echo "3. See BRANCH_PROTECTION_REMOVAL.md for detailed instructions"
echo ""
