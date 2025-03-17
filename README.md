# CTW Monorepo
[![ctw-kit](https://github.com/ctwhome/portfolio/actions/workflows/publish-ctw-kit.yml/badge.svg?branch=main)](https://github.com/ctwhome/portfolio/actions/workflows/publish-ctw-kit.yml)

This monorepo contains my website and ctw-kit package. It uses bun workspaces to manage dependencies and configurations.
just go to
```bash
cd website
bun install
bun run dev
```
All dependencies from ctw-kit are linked to the website project.


### 📦 Using `ctw-kit` in projects

A comprehensive library of Svelte components and utilities published to npm. This package provides reusable UI components and helper functions that can be used across different Svelte projects.

**Key features:**
- Svelte/SvelteKit components
- Utility functions
- Built with TypeScript
- Styled with DaisyUI/Tailwind
- Published to npm

To use in your project:
```bash
bun add ctw-kit
```

### 🌐 website

My personal portfolio website showcasing projects, articles, and professional experience. Built with SvelteKit and modern web technologies.

**Key features:**
- Content management system
- Blog functionality
- Project showcase
- Responsive design
- SEO optimized

## Repository Structure

```
.
├── ctw-kit/           # Component library (npm package)
└── website/           # Personal portfolio website
```

### Workspace Dependencies

The website project uses `ctw-kit` as a workspace dependency with the configuration `"ctw-kit": "workspace:*"` in its package.json. This setup:

- Links the local ctw-kit package directly into the website project during development
- In production, it will be replaced with the actual published version of ctw-kit from npm
- Allows immediate testing of ctw-kit changes in the website without publishing
- Ensures consistent versioning between development and production environments

The asterisk (*) in `workspace:*` means it will use whatever version is available in the workspace, rather than being locked to a specific version. This is particularly useful during development as it always uses the local workspace version.

## License

MIT
