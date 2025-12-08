# Quick Fix: Cannot Push to Main Branch

## The Problem
You see this error when trying to push:
```
One or more rules apply to the branch main that will prevent pushing.
Want to switch branches?
```

## The Quick Fix

### ⚠️ IMPORTANT: Repository Rulesets (Your Issue!)

**You have a ruleset called "Copilot review for default branch"** blocking pushes to `main`.

**🔧 Fix in 2 minutes:**
1. Go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings/rules
2. Click on **"Copilot review for default branch"**
3. **Choose one:**
   - **Delete**: Scroll down → Click **"Delete ruleset"** (removes it permanently)
   - **Disable**: Change "Enforcement status" from "Active" to "Disabled" (keeps it for later)
   - **Bypass**: Add yourself to "Bypass list" (lets you push, keeps rule for others)
4. Test: `git push origin main`

**📖 Detailed guide**: See [REPOSITORY_RULESETS_FIX.md](../REPOSITORY_RULESETS_FIX.md)

---

### Alternative: Traditional Branch Protection

If you DO see branch protection rules:

1. Go to: https://github.com/renelk0208/Leeukopf-Website-Official/settings/branches
2. Find the rule for `main` branch
3. Click **"Delete"** button
4. Test: `git push origin main`

## Done! ✅

You can now push directly to main.

---

**Need more details?** See [BRANCH_PROTECTION_REMOVAL.md](../../BRANCH_PROTECTION_REMOVAL.md)

**Alternative methods:**
- Use the automated script: `./scripts/check-branch-protection.sh`
- Configure via `.github/settings.yml` with GitHub Settings App
