# Ctwhome Portfolio

![](https://user-images.githubusercontent.com/4195550/271762629-a864e2a7-0cd5-40b6-8409-6c71f9da0246.png)

This is the fastest and most comfortable development experience started template.
Everything comes installed for a speedy staring with examples. Simply remove what you don't need and you are good to go :)

### Features
- [x] SvelteKit 2
  - [x] Svelte 4 (getting ready for Svelte 5 and refactor with Runes)
  - [x] 🦾 TypeScript
  - [x] ⭐️ Format on save with ESLint (VSCode Settings file and WebStorm)
  - [x] 🔌 Svelte Endpoint usage
  - [x] 🔄 Hybrid SSG + SSR + SPA mode with SvelteKit
  - [x] ⬇ [MDsveX](https://github.com/pngwn/MDsveX) Markdown parser (full blog example below)
  - [ ] Persist store with [svelte-persisted-store](https://github.com/joshnuss/svelte-persisted-store)
  - [ ] Advanced forms with Svelte
- [x] 💙 TailwindCSS 3.4
- [x] 🌼 DaisyUI 4
  - [x] 30+ Themes and custom theme
  - [ ] Theme selector

- [ ] 🚀 PWA
  - [ ] Offline mode, new content available prompt

- [ ] ⚡️ Site performance optimization and Web Core Vitals
- [ ] 💿 Database connections with endpoints
- [ ] 🗺️ Translation engine with [i18next](https://github.com/i18next/i18next)
- [ ] 🔐 Login with [Auth.js](https://authjs.dev/) 

- [ ] 🕺 Page transition animation API
- [x] ✨ All [Iconify](https://iconify.design/) on-demand with [unplugin Icons](https://github.com/unplugin/unplugin-icons) - +100.000 SVG icons completely customizable (use [icones](https://icones.js.org) to find icons)

### Development eXperience (DX)
- [ ] Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [ ] Automatic changelog
- [ ] Create realease command


### Custom features and Examples
- [x] ✍️ Blog with [MDsveX](https://github.com/pngwn/MDsveX)
  - [x] Structure with isolated content instead of the routing (root/content)
  - [x] Relative images
  - [ ] Automatic Assets optimization (jampack)
  - [ ] Reading Time
  - [ ] ToC
  - [ ] OG Tags and SEO Optimization with Svelte
  - [ ] RSS.xml
- [x] Native File API example
- [ ] ↕️ Scrolly Telling example
- Site analytics with:
  - [ ] Google
  - [ ] Matomo


### Components
- [x] Tiny gallery for svelte
- [x] Login with modal component
- [x] Autocomplete input field

### Experiments and Examples
- [x] ThreeJS and CameraControls
- [x] GIS with MapLibre and Svelte
- [x] Charting with Chart.js and Vega

 ### Essential pages:
  - [x] about.md
  - [x] privacy policy.md
  - [ ] sitemap.xml

## Motivation and Personal opinion
I use the same technologies in my web applications. SvelteKit is awesome, and developing with it is a pleasure. I use this repository as a showcase, resources and best practices to follow for all my applications. My motivation for keeping it updated is that, at the end of the day, this repository also serves as my official portfolio. If you find it interesting and use any of the ideas seen here, please give it some credit in your applications as well.


## Installation and running locally
```bash
npx degit ctwhome/portfolio <directory-name>
cd  <directory-name> && pnpm install
pnpm dev
```

## Updating fork
1.  Add remote from the original repository in your forked repository:
```shell
git remote add upstream git://github.com/ctwhome/portfolio.git
git fetch upstream
```
1.  Updating your fork from the original repo to keep up with their changes:
    `git pull upstream main`

Start the development server on [http://localhost:5173](http://localhost:5173)

```bash
yarn dev
```


## Production

Build the application for production:

```bash
yarn build
```

