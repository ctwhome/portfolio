# ctw-kit

Custom components and utilities for Svelte and TailwindCSS (DaisyUI)

## Installation

```bash
bun add ctw-kit
# or
npm install ctw-kit
```

## Prerequisites

This library requires the following peer dependencies to be installed and configured in your application:

```bash
bun add -d tailwindcss daisyui
# or
npm install -D tailwindcss daisyui
```

Make sure to configure TailwindCSS and DaisyUI in your application's `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/ctw-kit/**/*.{html,js,svelte,ts}'],
  plugins: [require('daisyui')],
}
```

## Components

- [x] [SEO](src/lib/components/SEO/README.md) - SEO meta tags management including Open Graph and Twitter cards
- [x] Carousel - A customizable carousel component
- [x] Emails - Email sending component using Resend
- [x] Feedback - User feedback collection component
- [x] Hello - Simple greeting component
- [x] ThemeChange - Theme switcher component for DaisyUI
- [x] TiltContent - Tilt effect component using vanilla-tilt

## Development

1. Clone the repository
```bash
git clone https://github.com/ctwhome/ctw-kit.git
cd ctw-kit
```

2. Install dependencies
```bash
bun install
```

3. Build the package
```bash
bun run build
```

## Publishing

This package uses fully automated releases. Push your changes to main using [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Features (minor version bump)
git commit -m "feat: add new component"

# Bug fixes (patch version bump)
git commit -m "fix: resolve styling issue"

# Breaking changes (major version bump)
git commit -m "feat!: redesign API"

git push origin main
```

The automation will:
1. Check if the version exists in npm registry
2. Bump the version (patch)
3. Create a git tag and GitHub release
4. Build and publish to npm

Everything happens automatically in the correct order - no manual steps needed after the initial setup.

### First-time Setup

You'll need to set up two tokens in your repository's secrets (Settings → Secrets and variables → Actions):

1. `PAT_TOKEN`: A GitHub Personal Access Token with repo permissions
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Select scopes: `repo` (full control of private repositories)
   - Copy the token and add it as a repository secret named `PAT_TOKEN`

2. `NPM_TOKEN`: An npm automation token
   - Go to npmjs.com → Access Tokens → Generate New Token
   - Select type: Automation
   - Make sure 2FA is not required for automation tokens in your npm account settings
     - Go to npmjs.com → Profile Settings → Authentication & Authorization
     - Under "Two-Factor Authentication", ensure it's not set to "Required for all operations"
   - Copy the token and add it as a repository secret named `NPM_TOKEN`

After setting up these tokens, the automation will handle everything else - just push your changes to main using conventional commits.

## License

MIT
