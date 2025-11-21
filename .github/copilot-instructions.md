# GitHub Copilot Instructions for Leeukopf Laboratories

This file provides instructions for GitHub Copilot when working with this repository.

## Project Overview

This is the Leeukopf Laboratories website - a premium gel polish manufacturing website built with modern web technologies.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (authentication and database)
- **Routing**: React Router DOM
- **Deployment**: Netlify (deploys from `main` branch)
- **Icons**: Lucide React

## Project Structure

```
/src
  /components     - Reusable React components
  /pages         - Page components for routing
  /contexts      - React contexts (e.g., AuthContext)
  /lib           - Utility functions and helpers
  index.css      - Global styles
  main.tsx       - Application entry point
  App.tsx        - Main application component
/public          - Static assets (images, certificates, etc.)
/scripts         - Build and deployment scripts
/supabase        - Supabase configuration and migrations
```

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (includes version update)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Coding Standards

### TypeScript Guidelines

- **Always use TypeScript** for new code
- **Avoid `any` type** - use proper types or `unknown` when needed
- **Define interfaces** for complex objects and component props
- Use **meaningful variable and function names**
- Enable strict type checking

### React Guidelines

- Use **functional components with hooks** (not class components)
- Keep components **small and focused** on a single responsibility
- Use **proper prop types** with TypeScript interfaces
- Follow **React best practices** and hooks rules
- Use `useCallback` and `useMemo` appropriately to prevent unnecessary re-renders

### Component Organization

- Place reusable components in `/src/components`
- Place page components in `/src/pages`
- Place utilities in `/src/lib`
- Place contexts in `/src/contexts`
- Keep related files together

### Styling

- **Use Tailwind CSS** for all styling
- Follow the existing design system and color scheme
- Ensure **responsive design** with mobile-first approach
- Test on different screen sizes (mobile, tablet, desktop)
- Use consistent spacing and typography from Tailwind

### Code Formatting

- This project uses **ESLint** for code quality
- Run `npm run lint` to check for errors
- Some errors can be auto-fixed with `npx eslint . --fix`
- Follow existing code style and patterns

## Development Workflow

### Branch Naming

- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring
- `style/` - for formatting changes

### Commit Message Format

Follow conventional commits:

```
<type>: <subject>

<body (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
- `feat: add contact form validation`
- `fix: resolve mobile menu toggle issue`
- `docs: update README with deployment instructions`

### Testing Before Commit

Run these commands before committing:

```bash
npm run lint          # Check code quality
npm run typecheck     # Check TypeScript types
npm run build         # Ensure production build works
npm run preview       # Test the production build
```

### Manual Testing

Since this project doesn't have automated tests yet:
1. Test changes in multiple browsers (Chrome, Firefox, Safari)
2. Test on different screen sizes (mobile, tablet, desktop)
3. Verify no console errors appear
4. Check that existing features still work

## Deployment

- **Platform**: Netlify
- **Branch**: Deploys automatically from `main` branch
- **Build**: Runs `npm run build` which includes version update
- **Environment Variables**: Set in Netlify dashboard
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Deployment Workflow

1. Make changes on a feature branch
2. Test locally with `npm run build`
3. Create a Pull Request to `main` branch
4. Merge the PR
5. Netlify automatically builds and deploys

## Key Considerations

### Authentication

- Uses Supabase authentication
- Auth state managed via `AuthContext` in `/src/contexts/AuthContext.tsx`
- Protected routes use authentication checks

### Environment Variables

- All environment variables must be prefixed with `VITE_`
- Example: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Copy `.env.example` to `.env` for local development

### Browser Compatibility

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Ensure mobile responsiveness
- Test on different screen sizes

### Performance

- Optimize images and assets
- Use lazy loading where appropriate
- Minimize bundle size
- Follow React performance best practices

## Common Patterns

### Component Structure

```typescript
import { useState, useEffect } from 'react';
import { Component } from 'lucide-react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Component content */}
    </div>
  );
}
```

### Error Handling

- Always handle errors from async operations
- Provide user-friendly error messages
- Log errors for debugging (but not in production with sensitive data)

### Data Fetching with Supabase

```typescript
import { supabase } from '@/lib/supabase';

async function fetchData() {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
```

## Resources

- [Contributing Guidelines](../CONTRIBUTING.md) - Detailed contribution instructions
- [README](../README.md) - Project overview and setup
- [Netlify Deployment Guide](../NETLIFY_DEPLOYMENT_GUIDE.md) - Deployment instructions

## Questions?

- Open an issue with the "question" label
- Refer to CONTRIBUTING.md for more information
- Check existing issues for similar questions
