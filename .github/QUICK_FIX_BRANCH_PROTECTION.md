# Quick Fix: Cannot Push to Main Branch

## The Problem
You see this error when trying to push:
```
One or more rules apply to the branch main that will prevent pushing.
Want to switch branches?
```

## The Quick Fix (2 minutes)

### Step 1: Go to Branch Settings
Click here: https://github.com/renelk0208/Leeukopf-Website-Official/settings/branches

### Step 2: Remove Protection
- Find the rule for `main` branch
- Click **"Delete"** button
- Confirm deletion

### Step 3: Test
```bash
git push origin main
```

## Done! ✅

You can now push directly to main.

---

**Need more details?** See [BRANCH_PROTECTION_REMOVAL.md](../../BRANCH_PROTECTION_REMOVAL.md)

**Alternative methods:**
- Use the automated script: `./scripts/check-branch-protection.sh`
- Configure via `.github/settings.yml` with GitHub Settings App
