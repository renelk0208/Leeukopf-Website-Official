# Contributing to Leeukopf Laboratories Website

Thank you for your interest in contributing to the Leeukopf Laboratories website! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Need Help?](#need-help)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Git

### Initial Setup

1. **Fork the repository**
   - Navigate to https://github.com/renelk0208/leeeukopf
   - Click the "Fork" button in the top right corner

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/leeeukopf.git
   cd leeeukopf
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/renelk0208/leeeukopf.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The application should now be running at http://localhost:5173

## Development Workflow

### 1. Create a New Branch

Always create a new branch for your work:

```bash
# Update your main branch first
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring
- `style/` - for formatting changes

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the existing code style
- Add comments where necessary
- Update documentation if needed

### 3. Test Your Changes

Before committing, ensure your changes work correctly:

```bash
# Run the linter
npm run lint

# Type check
npm run typecheck

# Build the project
npm run build

# Preview the production build
npm run preview
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "Brief description of your changes"
```

See [Commit Messages](#commit-messages) section for guidelines.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Pull Request Process

### Creating a Pull Request

1. **Push your branch** to your fork on GitHub
2. **Navigate** to the original repository
3. **Click** "New Pull Request"
4. **Select** your fork and branch
5. **Fill out** the pull request template with all required information
6. **Submit** the pull request

### Pull Request Guidelines

- **One feature per PR**: Keep pull requests focused on a single feature or fix
- **Clear description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Link issues**: Reference any related issues (e.g., "Closes #123")
- **Tests**: Ensure all tests pass (when applicable)
- **Documentation**: Update docs if you changed functionality
- **Clean history**: Squash commits if requested

### What to Expect

- **Review time**: PRs are typically reviewed within 2-3 business days
- **Feedback**: Maintainers may request changes or ask questions
- **Iteration**: You may need to make updates based on feedback
- **Approval**: Once approved, your PR will be merged

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type when possible
- Define interfaces for complex objects
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design (mobile-first approach)
- Test on different screen sizes

### Code Formatting

This project uses ESLint for code quality:

```bash
# Check for linting errors
npm run lint

# Some errors can be auto-fixed
npx eslint . --fix
```

### File Organization

- Place components in `/src/components`
- Place pages in `/src/pages`
- Place utilities in `/src/lib`
- Place contexts in `/src/contexts`
- Keep related files together

## Commit Messages

Write clear, concise commit messages that explain what and why:

### Format

```
<type>: <subject>

<body (optional)>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add contact form validation

fix: resolve mobile menu toggle issue

docs: update README with deployment instructions

refactor: simplify authentication logic
```

## Testing

### Manual Testing

Since this project doesn't have automated tests yet, please:

1. Test your changes in multiple browsers (Chrome, Firefox, Safari)
2. Test on different screen sizes (mobile, tablet, desktop)
3. Verify no console errors appear
4. Check that existing features still work

### Before Submitting

Run these commands to verify everything works:

```bash
npm run lint          # Check code quality
npm run typecheck     # Check TypeScript types
npm run build         # Ensure production build works
npm run preview       # Test the production build
```

## Need Help?

- **Questions?** Open an issue with the "question" label
- **Bug report?** Open an issue with a detailed description
- **Feature request?** Open an issue to discuss before implementing

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Leeukopf Laboratories! 🎉
