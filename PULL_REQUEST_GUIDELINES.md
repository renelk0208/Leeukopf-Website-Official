# Pull Request Guidelines

This document outlines the required standards for all pull requests to ensure quality, consistency, and maintainability.

## PR Merge Readiness Requirements

Every pull request must include the following sections before it can be merged:

### A. PR Summary

A clear and concise summary that includes:

1. **What Changed**: 1-3 bullet points summarizing the changes
   - Example: "Fixed category image paths for all gel polish collections"
   - Example: "Added developer safeguard for missing category images"

2. **Affected Files/Areas**: List of key files or functional areas modified
   - Example: "src/data/productCategories.ts, src/components/products/ProductCategoryGrid.tsx"

### B. Required Checks

Before marking a PR as ready to merge, verify and document the following:

#### Build & Test Checks
- [ ] **Build passes**: Run `npm run build` without errors
- [ ] **Lint passes**: Run `npm run lint` (existing issues are acceptable if unrelated)
- [ ] **Type check passes**: Run `npm run typecheck` without errors

#### Visual & Functional Validation
- [ ] **Development server**: Tested changes in dev mode (`npm run dev`)
- [ ] **Production preview**: Tested changes in production build (`npm run preview`)
- [ ] **Visual validation**: Screenshots provided for any UI changes
- [ ] **Cross-browser testing**: Tested in Chrome, Firefox, Safari (when applicable)
- [ ] **Mobile responsive**: Tested on mobile viewports (when applicable)

#### Content & Asset Validation
- [ ] **Image paths verified**: All image paths point to existing files
- [ ] **No 404s**: Checked browser console for missing resources
- [ ] **Case-sensitive paths**: All paths use correct case (important for Vite production)

#### Security & Quality
- [ ] **No security vulnerabilities**: Run `npm audit` for critical issues
- [ ] **Code quality**: Changes follow existing code patterns
- [ ] **Documentation updated**: README, guides, or comments updated if needed

### C. Merge Status

Every PR must explicitly state one of the following:

#### ✅ Ready to Merge
```
**Merge Status**: This pull request is ready to be merged once checks pass.
```

Use this when:
- All required checks have passed
- Code review feedback has been addressed
- No known issues remain

#### ⏸️ Not Ready to Merge
```
**Merge Status**: This pull request is not ready to merge yet. 

**Pending**:
- [ ] Item 1 that needs completion
- [ ] Item 2 that needs completion
```

Use this when:
- Tests are still failing
- Code review feedback needs to be addressed
- Dependencies or blockers exist
- Work is in progress

## Example PR Description

```markdown
## Summary

Fixed all category images across the website and added developer safeguards for missing images.

### What Changed
- Updated image paths for 9 gel polish categories to point to actual product images
- Fixed Professional Gel Polish Collection hero image path
- Added 2 new Primers & Liquids categories with correct images
- Implemented dev-mode warning for categories with missing images

### Affected Files
- src/data/productCategories.ts
- src/pages/products/GelPolishPage.tsx
- src/components/products/ProductCategoryGrid.tsx

## Required Checks

### Build & Test
- [x] Build passes
- [x] Lint passes (pre-existing issues unrelated to changes)
- [x] Type check passes

### Visual & Functional
- [x] Development server tested
- [x] Production build tested
- [x] Visual validation completed (screenshots below)
- [x] All category images load correctly
- [x] No 404 errors in console

### Screenshots
![Products Page](url-to-screenshot)
![Gel Polish Page](url-to-screenshot)

## Merge Status

**Merge Status**: This pull request is ready to be merged once checks pass.
```

## Notes for Reviewers

- Pre-existing linting or test failures should be noted but don't necessarily block the PR
- Security vulnerabilities introduced by the PR must be fixed before merge
- Documentation should be updated for any new patterns or significant changes
- Visual changes should always include screenshots

## Notes for Contributors

- Use `report_progress` tool to commit changes incrementally
- Run linters and tests early and often during development
- Test both development and production builds before requesting review
- Provide context in commit messages for why changes were made
