# CTW Monorepo
[![ctw-kit](https://github.com/ctwhome/portfolio/actions/workflows/publish-ctw-kit.yml/badge.svg?branch=main)](https://github.com/ctwhome/portfolio/actions/workflows/publish-ctw-kit.yml)

This monorepo contains multiple projects built with SvelteKit and modern web technologies, including a component library, project templates, and a portfolio website.

## Projects

### 📦 ctw-kit

A comprehensive library of Svelte components and utilities published to npm. This package provides reusable UI components and helper functions that can be used across different Svelte projects.

**Key features:**
- Svelte/SvelteKit components
- Utility functions
- Built with TypeScript
- Styled with DaisyUI/Tailwind
- Published to npm

**Setup:**
```bash
cd ctw-kit
bun install
bun run dev
```

To use in your project:
```bash
bun add @ctw-kit/components
```

### 🎯 top-sveltekit

A collection of SvelteKit project templates with different configurations and features.

#### Templates:

1. **postgres** - Basic SvelteKit template with PostgreSQL integration
   - Authentication ready
   - Database migrations
   - DaisyUI styling
   - TypeScript support

2. **postgres-rls** - Advanced template with Row Level Security
   - All features from basic template
   - Row Level Security (RLS) implementation
   - Enhanced security patterns
   - Multi-tenant ready

**Using templates:**
```bash
# Basic PostgreSQL template
cd top-sveltekit/postgres
bun install

# Copy environment variables
cp _example\ .env .env
# Configure your environment variables

# Start development
bun run dev

# For postgres-rls template
cd top-sveltekit/postgres-rls
# Follow similar steps with example .env and example .env.local
```

### 🌐 website

My personal portfolio website showcasing projects, articles, and professional experience. Built with SvelteKit and modern web technologies.

**Key features:**
- Content management system
- Blog functionality
- Project showcase
- Responsive design
- SEO optimized

**Setup:**
```bash
cd website
bun install
bun run dev
```

## Repository Structure

```
.
├── ctw-kit/           # Component library (npm package)
├── top-sveltekit/     # Project templates
│   ├── postgres/      # Basic PostgreSQL template
│   └── postgres-rls/  # Template with Row Level Security
└── website/           # Personal portfolio website
```

## Development

Each project maintains its own dependencies and can be developed independently. Navigate to the specific project directory to run its development commands.

### Prerequisites

- [Bun](https://bun.sh/) (preferred) or [pnpm](https://pnpm.io/)
- Node.js 18+
- PostgreSQL (for template projects)

### Global Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install workspace dependencies
```bash
bun install
```

3. Choose a project to work on and follow its specific setup instructions above.

Note: The root-level `bun install` is necessary as this is a monorepo using workspaces for `ctw-kit` and `website`. The templates in `top-sveltekit` are standalone and require their own separate installation as shown in their setup instructions.

### Workspace Dependencies

The website project uses `ctw-kit` as a workspace dependency with the configuration `"ctw-kit": "workspace:*"` in its package.json. This setup:

- Links the local ctw-kit package directly into the website project during development
- In production, it will be replaced with the actual published version of ctw-kit from npm
- Allows immediate testing of ctw-kit changes in the website without publishing
- Ensures consistent versioning between development and production environments

The asterisk (*) in `workspace:*` means it will use whatever version is available in the workspace, rather than being locked to a specific version. This is particularly useful during development as it always uses the local workspace version.

## License

MIT
