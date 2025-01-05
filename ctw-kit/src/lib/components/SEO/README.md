# SEO Component

A Svelte component for managing SEO meta tags including Open Graph and Twitter card metadata.

## Usage

```svelte
<script lang="ts">
  import { SEO } from 'ctw-kit';
  import { siteSettings } from './your-settings';

  // All props are optional and will fall back to siteSettings values
  // Only siteSettings is required
</script>

<SEO
  siteSettings={{
    title: "Your Site Title",
    description: "Your site description",
    image: "/path/to/default-image.jpg",
    baseUrl: "https://your-site.com"
  }}
  title="Optional Page Title"
  desc="Optional Page Description"
  img="/optional-page-image.jpg"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| siteSettings | `SiteSettings` | Yes | Object containing default site metadata |
| title | `string` | No | Page title (falls back to siteSettings.title) |
| desc | `string` | No | Page description (falls back to siteSettings.description) |
| img | `string` | No | Page image path (falls back to siteSettings.image) |

## SiteSettings Interface

```typescript
interface SiteSettings {
  title: string;      // Default site title
  description: string; // Default site description
  image: string;      // Default image path
  baseUrl: string;    // Your site's base URL (e.g., https://example.com)
}
```

The SEO component will automatically generate:
- Page title
- Meta description
- Twitter Card metadata
- Open Graph metadata
