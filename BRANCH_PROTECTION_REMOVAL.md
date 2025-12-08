# Branch Protection Removal Guide

## Issue

You are currently blocked from committing directly to the `main` branch. GitHub shows: **"One or more rules apply to the branch main that will prevent pushing. Want to switch branches?"**

This document provides instructions for removing branch protection rules so you can commit and push directly to `main` from your local machine and from the GitHub web editor.

## Solution Options

### Option 1: Manual Removal via GitHub UI (Immediate)

This is the quickest way to remove branch protection rules.

#### Steps:

1. **Navigate to Repository Settings**
   - Go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings

2. **Open Branch Protection Rules**
   - In the left sidebar, click on **"Branches"** (under "Code and automation")
   - Or directly go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings/branches

3. **Identify the Main Branch Rule**
   - Look for any rule that targets the `main` branch
   - It will be listed under "Branch protection rules"

4. **Delete or Modify the Rule**
   
   **Option A: Delete the Rule** (Recommended for complete removal)
   - Click the **"Delete"** button next to the `main` branch rule
   - Confirm the deletion
   
   **Option B: Edit the Rule** (If you want to keep some protections)
   - Click **"Edit"** next to the `main` branch rule
   - **Disable these settings:**
     - ☐ Require a pull request before merging
     - ☐ Require status checks to pass before merging
     - ☐ Require conversation resolution before merging
     - ☐ Require signed commits
     - ☐ Require linear history
     - ☐ Restrict who can push to matching branches
   - **Enable these settings if needed:**
     - ☐ Allow force pushes (check if you need this)
   - Click **"Save changes"**

5. **Verify**
   - Try pushing to main from your local machine:
     ```bash
     git push origin main
     ```
   - Or try making a commit directly in the GitHub web editor

### Option 2: Using GitHub Settings App (Automated)

If you have the [GitHub Settings App (Probot)](https://github.com/apps/settings) installed:

1. The `.github/settings.yml` file in this repository is already configured to allow direct pushes
2. The app will automatically apply these settings
3. Settings will be enforced whenever the file is updated

**To install the GitHub Settings App:**
1. Go to: https://github.com/apps/settings
2. Click "Install"
3. Select this repository
4. The app will read `.github/settings.yml` and apply the settings

### Option 3: Using GitHub CLI (gh)

If you have GitHub CLI installed and proper permissions:

```bash
# List current branch protection rules
gh api repos/renelk0208/Leeukopf-Website-Official/branches/main/protection

# Delete branch protection
gh api -X DELETE repos/renelk0208/Leeukopf-Website-Official/branches/main/protection
```

### Option 4: Using GitHub API

Using curl or any HTTP client with a personal access token:

```bash
# Get current protection (requires 'repo' scope token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/renelk0208/Leeukopf-Website-Official/branches/main/protection

# Delete protection
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/renelk0208/Leeukopf-Website-Official/branches/main/protection
```

## Common Branch Protection Settings to Disable

To allow direct pushes to `main`, ensure these are **DISABLED** or **REMOVED**:

| Setting | Why it blocks direct pushes |
|---------|---------------------------|
| **Require a pull request before merging** | Forces all changes through PRs |
| **Require status checks to pass before merging** | Blocks pushes if CI/CD checks fail |
| **Require conversation resolution before merging** | Requires PR discussions to be resolved |
| **Restrict who can push to matching branches** | Limits who can push directly |
| **Require signed commits** | Requires GPG-signed commits |
| **Require linear history** | Prevents merge commits |

## After Removal

Once branch protection is removed, you will be able to:

✅ Push commits directly to `main` from your local machine  
✅ Make commits directly in the GitHub web editor  
✅ Merge pull requests without waiting for reviews or status checks  
✅ Force push to `main` (if enabled)

## Important Notes

⚠️ **Security Consideration**: Removing branch protection makes it easier to accidentally push breaking changes directly to production.

**Best Practices if Removing Protection:**
- Always run `npm run build` and `npm run lint` locally before pushing
- Test changes thoroughly before pushing to main
- Consider using feature branches even without enforced protection
- Keep CI/CD checks running even if not required for merges

## Configuration File

The `.github/settings.yml` file in this repository defines the desired settings with branch protection disabled. This file can be used with automation tools to manage repository settings.

## Troubleshooting

### Still Can't Push After Removing Protection?

1. **Check for Repository Rulesets**
   - Go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings/rules
   - Rulesets are a newer feature that can also block pushes
   - Delete or modify any rulesets that target `main`

2. **Verify Your Permissions**
   - Ensure you have "Write" or "Admin" access to the repository
   - Go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings/access

3. **Check Organization Settings**
   - If this is an organization repository, organization-level rules may apply
   - Ask an organization admin to check organization settings

4. **Clear Git Credentials**
   ```bash
   # Clear cached credentials
   git credential reject https://github.com
   
   # Try pushing again
   git push origin main
   ```

## Support

If you continue to experience issues:
- Check GitHub Status: https://www.githubstatus.com/
- Review GitHub Docs: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- Contact: Repository maintainers

---

**Last Updated**: 2025-12-08  
**Repository**: renelk0208/Leeukopf-Website-Official
