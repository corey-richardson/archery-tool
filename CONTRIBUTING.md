# Contributing to Archery Tool

Thank you for your interest in contributing to the Archery Tool! This project is an open-source archery club management system that helps clubs manage members, track scores, and maintain records. We welcome contributions from developers of all skill levels.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Contribution Workflow](#contribution-workflow)
- [Areas for Contribution](#areas-for-contribution)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)
- **PostgreSQL** (for database)
- **Git** (for version control)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/archery-tool.git
   cd archery-tool
   ```

## Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/archery_tool"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (optional for development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed the database with test data
pnpm prisma db seed
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Code Standards

### TypeScript

- All new code must be written in TypeScript
- Use strict typing - avoid `any` unless absolutely necessary
- Utilise the existing type definitions in `/src/types/`
- Follow the existing patterns for API route typing

### ESLint Rules

We use ESLint with the following key rules:

- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Double quotes for strings
- **Unused Variables**: Prefix with underscore (`_`) if intentionally unused
- **React**: Standard React/Next.js patterns

Run linting:
```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Strict check (no warnings)
pnpm lint:check
```

### File Organization

```
src/
├── app/                    # Next.js app router
│   ├── (protected)/        # Protected routes (require auth)
│   ├── (unprotected)/      # Public routes
│   ├── api/               # API routes
│   ├── actions/           # Server actions
│   └── lib/               # Shared utilities
├── ui/                    # Reusable UI components
└── types/                 # TypeScript type definitions
```

### Naming Conventions

- **Files**: kebab-case for pages, camelCase for components
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Database Models**: PascalCase (following Prisma conventions)

## Contribution Workflow

### 1. Create a Branch

Create a descriptive branch name:

```bash
git checkout -b feature/add-score-validation
git checkout -b fix/member-deletion-bug
git checkout -b docs/api-documentation
```

### 2. Make Changes

- Write clean, readable code following our standards
- Add comments for complex logic
- Update tests if applicable
- Update documentation if needed

### 3. Commit Messages

Use conventional commit format:

```bash
feat: add score validation for indoor rounds
fix: resolve member deletion cascade issue
docs: update API endpoint documentation
refactor: simplify club membership logic
test: add unit tests for score calculations
```

### 4. Testing

Before submitting:

```bash
# Run linter
pnpm lint:check

# Build the project
pnpm build

# Test database migrations (if applicable)
pnpm prisma migrate reset --force
pnpm prisma migrate dev
```

### 5. Submit Pull Request

1. Push your branch to your fork
2. Create a Pull Request with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Screenshots for UI changes
   - Any breaking changes noted

## Issue Guidelines

### Reporting Bugs

Use the bug report template and include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, browser, Node.js version)
- Screenshots if applicable

### Feature Requests

- Check existing issues to avoid duplicates
- Describe the problem you're solving
- Provide use cases and examples
- Consider implementation complexity

### Security Issues

**DO NOT** create public issues for security vulnerabilities. Instead:
- Email the maintainers directly
- Use GitHub's security advisory feature
- Allow time for fixes before disclosure

## Testing

### Database Testing

When making database changes:
- Test migrations both up and down
- Verify seed data works correctly
- Test with both empty and populated databases

### Manual Testing

For UI changes:
- Test on different screen sizes
- Verify accessibility with keyboard navigation
- Test with different user roles and permissions

## Documentation

### User Documentation

- Update relevant sections in `/docs/` if applicable
- Include screenshots for UI changes
- Write clear, step-by-step instructions

## Getting Help

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Code Reviews**: Learn from feedback on pull requests

## Recognition

Contributors will be acknowledged in:
- GitHub contributors list
- Project documentation
- Release notes for significant contributions

Thank you for contributing to the Archery Tool project!

## License

This project is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://github.com/corey-richardson/archery-tool/blob/main/LICENSE).

All source code is publicly available, and contributions are encouraged from archers, developers, and clubs worldwide.

If you use this project, you must:
- Retain the original copyright notice.
- Clearly state if you have made modifications.
- Provide a link back to the original repository.

This is consistent with the requirements of the GPL-3.0 license.

## Support

To report a bug, please open a GitHub Issue or contact me directly; I have an archery-based Instagram where you can follow and reach me!

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/corey.richardson.archery/) 

[@corey.richardson.archery](https://www.instagram.com/corey.richardson.archery/)
