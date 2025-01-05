# ThemeChange Component

A Svelte component that provides theme switching functionality using DaisyUI themes. This component creates a dropdown menu that allows users to switch between different color themes in your application.

## Requirements

- DaisyUI
- theme-change package
- Tailwind CSS

## Installation

The component is part of the CTW Kit and comes pre-configured with the necessary dependencies.

## Configuration

The themes need to be enabled in your `tailwind.config.ts` file under the DaisyUI configuration:

```typescript
export default {
  // ... other tailwind config
  daisyui: {
    themes: [
      {
        ctw: {
          primary: '#ffb83d',
          'primary-focus': '#db8b00',
          'primary-content': 'black',
          secondary: '#5e9c91',
          'secondary-focus': '#3e655f',
          'secondary-content': '#FFFFFF',
          accent: '#37cdbe',
          'accent-focus': '#2aa79b',
          'accent-content': '#FFFFFF',
          neutral: '#3d4451',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#171717',
          'base-200': '#333',
          'base-300': '#555',
          'base-content': '#E8E8E8',
          info: '#2094f3',
          success: '#009485',
          warning: '#FF9900',
          error: '#ff5724'
        }
      },
      "dark",
      "light",
      "night",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "coffee",
      "winter",
    ]
  }
}
```

The `ctw` theme is a custom theme with specific color configurations, while the other themes are pre-defined DaisyUI themes.

## Usage

```svelte
<script>
  import { ThemeChange } from 'ctw-kit';
</script>

<ThemeChange />
```

## Props

| Prop    | Type     | Default     | Description                           |
|---------|----------|-------------|---------------------------------------|
| class   | string   | undefined   | Additional CSS classes for the button |

## Features

- Dropdown theme selector
- Visual preview of each theme
- Persists theme selection across page reloads
- Responsive design
- Keyboard accessible

## Available Themes

The component includes 30 pre-configured themes:

| Theme ID    | Display Name    | Description                    |
|-------------|----------------|--------------------------------|
| ctw         | Ctw           | Default CTW theme              |
| dark        | 🌚 dark        | Dark mode theme               |
| light       | 🌝 light       | Light mode theme              |
| cupcake     | 🧁 cupcake     | Light, sweet theme            |
| bumblebee   | 🐝 bumblebee   | Yellow and black theme        |
| emerald     | ✳️ Emerald     | Green theme                   |
| corporate   | 🏢 Corporate   | Professional business theme   |
| synthwave   | 🌃 synthwave   | Retro-futuristic theme       |
| retro       | 👴 retro       | Vintage style theme          |
| cyberpunk   | 🤖 cyberpunk   | High-tech theme              |
| valentine   | 🌸 valentine   | Pink love theme              |
| halloween   | 🎃 halloween   | Spooky theme                 |
| garden      | 🌷 garden      | Natural, floral theme        |
| forest      | 🌲 forest      | Dark green nature theme      |
| aqua        | 🐟 aqua        | Water-inspired theme         |
| lofi        | 👓 lofi        | Minimal, calm theme          |
| pastel      | 🖍 pastel      | Soft color theme             |
| fantasy     | 🧚‍♀️ fantasy    | Magical theme                |
| wireframe   | 📝 Wireframe   | Minimal black and white      |
| black       | 🏴 black       | Pure black theme             |
| luxury      | 💎 luxury      | Elegant dark theme           |
| dracula     | 🧛‍♂️ dracula    | Dark vampire theme           |
| cmyk        | 🖨 CMYK        | Print-inspired theme         |
| autumn      | 🍁 Autumn      | Fall colors theme            |
| business    | 💼 Business    | Professional theme           |
| acid        | 💊 Acid        | Bright, psychedelic theme    |
| lemonade    | 🍋 Lemonade    | Fresh yellow theme           |
| night       | 🌙 Night       | Dark mode alternative        |
| coffee      | ☕️ Coffee      | Brown, warm theme            |
| winter      | ❄️ Winter      | Cold, blue theme             |

## Implementation Example

```svelte
<script>
  import { ThemeChange } from 'ctw-kit';
</script>

<!-- Basic usage -->
<ThemeChange />

<!-- With custom class -->
<ThemeChange class=" ml-4" />
```

## How it Works

The component uses the `theme-change` package to handle theme switching. When a theme is selected:

1. The selected theme is stored in localStorage
2. The theme is applied to the document using DaisyUI's theme system
3. The theme persists across page reloads
4. The component automatically initializes theme handling on mount

## Accessibility

- The dropdown is keyboard accessible
- Uses proper ARIA attributes
- Includes a visible theme name for screen readers
- Maintains proper contrast ratios for all themes
