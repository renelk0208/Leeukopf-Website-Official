# Fix: Repository Rulesets Blocking Pushes to Main

## The Problem

You see this error when trying to push to `main`:
```
One or more rules apply to the branch main that will prevent pushing.
Want to switch branches?
```

**BUT** when you check Branch Protection settings, there are NO rules shown.

## The Solution: Repository Rulesets

GitHub introduced a **newer feature called "Repository Rulesets"** that can block pushes, separate from traditional branch protection rules. 

**In your case**, there is a ruleset called **"Copilot review for default branch"** that is preventing direct pushes to `main`.

## How to Fix (3 Steps)

### Step 1: Go to Repository Rulesets Settings

Click this direct link:
**https://github.com/renelk0208/Leeukopf-Website-Official/settings/rules**

Or manually navigate:
1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. In the left sidebar, scroll down to **Rules** section
4. Click **Rulesets** (NOT "Branches")

### Step 2: Identify and Delete/Disable the Ruleset

You should see a ruleset named **"Copilot review for default branch"** (or similar).

**Option A: Delete the Ruleset** (Recommended)
1. Click on **"Copilot review for default branch"**
2. Scroll to the bottom of the page
3. Click **"Delete ruleset"** button
4. Confirm the deletion

**Option B: Disable the Ruleset** (Keeps it for future use)
1. Click on **"Copilot review for default branch"**
2. Find the **"Enforcement status"** dropdown at the top
3. Change from **"Active"** to **"Disabled"**
4. Click **"Save changes"**

**Option C: Bypass the Ruleset** (Temporary)
1. Click on **"Copilot review for default branch"**
2. Scroll to **"Bypass list"**
3. Add yourself or your role to the bypass list
4. Click **"Save changes"**

### Step 3: Test Pushing

```bash
git push origin main
```

You should now be able to push successfully!

## What Are Repository Rulesets?

Repository Rulesets are GitHub's **newer way** to enforce rules on branches. They:
- Provide more flexibility than traditional branch protection
- Can apply to multiple branches with pattern matching
- Can be configured at repository or organization level
- May not show up in the traditional "Branch protection rules" section

## Still Blocked? Check These

### 1. Organization-Level Rulesets

If your repository is part of an organization, there might be **organization-level rulesets** blocking pushes:

**Check:**
1. Go to your organization settings (not repository settings)
2. Navigate to **Repository rulesets**
3. Look for rulesets that apply to this repository
4. Ask an organization admin to disable or modify them

### 2. Verify Your Permissions

Ensure you have the correct access level:
- Go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings/access
- You need **"Write"** or **"Admin"** permission
- If you only have "Read", ask the repository owner for Write access

### 3. Check Multiple GitHub Accounts

If you have multiple GitHub accounts:
```bash
# Check which account Git is using
git config user.email

# Check remote URL
git remote -v

# Make sure it matches your GitHub account with write access
```

### 4. Clear Git Credentials Cache

Sometimes Git caches old credentials:
```bash
# For Windows (Credential Manager)
git credential-manager uninstall

# For macOS (Keychain)
git credential-osxkeychain erase
host=github.com
protocol=https
[Press Enter twice]

# For Linux (Cache)
git credential-cache exit

# Then try pushing again
git push origin main
```

## Comparison: Branch Protection vs Rulesets

| Feature | Branch Protection | Repository Rulesets |
|---------|------------------|---------------------|
| **Location** | Settings → Branches | Settings → Rules → Rulesets |
| **When Introduced** | Original feature | Newer (2023+) |
| **Applies To** | Single branch | Multiple branches (patterns) |
| **Visibility** | Obvious in UI | Less obvious, separate section |
| **Scope** | Repository only | Repository or Organization |

## Alternative: Using GitHub CLI

If you have GitHub CLI (`gh`) installed and authenticated:

```bash
# List all rulesets
gh api repos/renelk0208/Leeukopf-Website-Official/rulesets

# Delete a specific ruleset (replace RULESET_ID with actual ID from above)
gh api -X DELETE repos/renelk0208/Leeukopf-Website-Official/rulesets/RULESET_ID
```

## Prevention: Future Management

To prevent this in the future:

1. **Document access**: Keep track of who has admin access
2. **Review regularly**: Periodically check Settings → Rules → Rulesets
3. **Use `.github/settings.yml`**: Consider using GitHub Settings App (Probot) to version control your repository settings
4. **Communicate**: If you're working in a team, coordinate before adding rulesets

## Related Documentation

- [BRANCH_PROTECTION_REMOVAL.md](./BRANCH_PROTECTION_REMOVAL.md) - For traditional branch protection
- [.github/QUICK_FIX_BRANCH_PROTECTION.md](./.github/QUICK_FIX_BRANCH_PROTECTION.md) - Quick reference
- [GitHub Docs: Repository Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)

---

**Last Updated**: 2025-12-08  
**Issue**: Repository Rulesets blocking pushes to `main`  
**Status**: Follow the steps above to resolve ✅
