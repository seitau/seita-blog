# CLAUDE.md - AI Assistant Guide for seita-blog

## Project Overview

**seita-blog** is a personal blog and portfolio website for Seita Uchimura, hosted at https://seita.tokyo/

- **Static Site Generator:** Hugo v0.56.0 (extended)
- **Hosting:** Firebase Hosting
- **Serverless Backend:** Firebase Cloud Functions
- **CI/CD:** CircleCI
- **Theme:** hugo-icarus-theme (git submodule)

## Repository Structure

```
seita-blog/
├── content/                    # Blog posts and pages (Markdown)
│   ├── post/                   # Blog articles (23 posts)
│   ├── about/                  # About pages (ja/en)
│   └── portfolio/              # Project portfolio
├── static/                     # Static assets
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript (src → dist build)
│   └── img/                    # Images
├── layouts/                    # Hugo template overrides
│   ├── _default/               # Base templates
│   ├── partials/               # Reusable components
│   └── shortcodes/             # Custom shortcodes
├── themes/hugo-icarus-theme/   # Theme (git submodule)
├── functions/                  # Firebase Cloud Functions
├── assets/                     # Bulma CSS framework
├── data/                       # Localization (l10n.toml)
├── archetypes/                 # Post templates
├── config.toml                 # Hugo configuration
├── package.json                # Node dependencies
├── firebase.json               # Firebase config
└── .circleci/config.yml        # CI/CD pipeline
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Static Site | Hugo v0.56.0 extended |
| Frontend JS | p5.js, jQuery, Browserify, Babel |
| CSS | Bulma, custom stylesheets |
| Backend | Firebase Cloud Functions (Node 8) |
| Hosting | Firebase Hosting |
| CI/CD | CircleCI v2 |
| Container | Docker (seitauc/docker-hugo-firebase) |

## Quick Commands

### Local Development

```bash
# Install dependencies
npm install
cd functions && npm install && cd ..

# Watch JavaScript for development
npm run watch-js

# Build JavaScript bundle
npm run build

# Start Hugo dev server
hugo server -t hugo-icarus-theme

# Firebase local emulator (for Cloud Functions)
cd functions && npm run serve
```

### Production Build

```bash
# Full production build
hugo -t hugo-icarus-theme --ignoreCache

# Output goes to: public/
```

### Firebase Deployment

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Cloud Functions
cd functions && npm run deploy
```

## Content Authoring

### Creating New Blog Posts

Use the archetype template or create manually in `content/post/`:

```markdown
---
title: "Article Title"
date: 2024-01-01T00:00:00+09:00
banner: "img/featured-image.png"
narrowBanner: true
description: "Brief description for previews"
images: ["img/og-image.png"]
categories: ["programming"]
tags: ["tag1", "tag2"]
draft: false
---

Content here...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Article title |
| `date` | Yes | Publication date (ISO 8601) |
| `banner` | No | Featured image path (relative to /static) |
| `narrowBanner` | No | Use narrow banner layout |
| `description` | No | Preview text for listings |
| `images` | No | OG images for social sharing |
| `categories` | No | Content categories |
| `tags` | No | Content tags |
| `draft` | No | Set `true` to hide from production |

### Available Shortcodes

**Web Embed (OGP Link Preview):**
```go
{{< web-embed url="https://example.com" >}}
```
Creates Hatena-style link preview using OGP metadata.

**Script Injection:**
```go
{{< script >}}
console.log("inline script");
{{< /script >}}
```

## Multilingual Support

The site supports Japanese (ja) and English (en):

- Japanese content: `filename.ja.md` or default
- English content: `filename.en.md`
- Translations: `data/l10n.toml`

## JavaScript Development

### Build Pipeline

```
static/js/src/*.js → Babel (ES6+) → Browserify → static/js/dist/bundle.js
```

### Source Files

- `static/js/src/main.js` - Entry point
- `static/js/src/boucing_ball.js` - Interactive profile animation (p5.js)
- `static/js/src/sample.js` - Mouse tracking demo (p5.js)

## Cloud Functions

### OGP Parser (`functions/index.js`)

Fetches and parses Open Graph metadata for URL previews.

**Endpoint:** `GET /ogp?url={url}`

**Response:**
```json
{
  "title": "Page Title",
  "description": "Page description",
  "image": "https://example.com/image.png",
  "site_name": "Site Name"
}
```

## CI/CD Pipeline

CircleCI automatically deploys on push to `master`:

1. Checkout code
2. Initialize git submodules (theme)
3. Build with Hugo
4. Deploy to Firebase Hosting

**Required Environment Variable:** `FIREBASE_DEPLOY_TOKEN`

## Git Conventions

### Commit Message Format

Uses emoji prefixes (Japanese convention):
- `:+1:` - Updates/improvements
- `:watermelon:` - New features
- `:wrench:` - Fixes/repairs

### Branch Naming

- `master` - Production branch (auto-deploys)
- `claude/*` - AI-assisted feature branches

### Submodule Management

Theme is a git submodule:
```bash
git submodule update --init --recursive
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Blog posts | kebab-case | `intro-to-puppeteer.md` |
| Categories | lowercase | `programming` |
| Tags | kebab-case | `headless-browser` |
| Images | kebab-case | `firebase-logo.png` |
| JS variables | camelCase | `bounceParticle` |
| Template vars | snake_case | `site_name` |

## Key Configuration Files

| File | Purpose |
|------|---------|
| `config.toml` | Hugo main configuration |
| `firebase.json` | Firebase hosting & rewrites |
| `.firebaserc` | Firebase project binding |
| `package.json` | Root npm dependencies |
| `functions/package.json` | Cloud Functions dependencies |
| `.circleci/config.yml` | CI/CD pipeline |
| `Dockerfile` | Container definition |
| `data/l10n.toml` | UI translations |

## Template Customization

### Layout Override Priority

1. `layouts/` (project overrides)
2. `themes/hugo-icarus-theme/layouts/` (theme defaults)

### Key Partials

- `partials/head.html` - Meta tags, CSS, SEO
- `partials/header.html` - Navigation
- `partials/profile.html` - Sidebar profile
- `partials/single_article.html` - Post content
- `partials/twitter-card.html` - Social meta tags

## External Services

| Service | Purpose |
|---------|---------|
| Firebase Hosting | Static site hosting |
| Firebase Functions | Serverless backend |
| Disqus | Comment system |
| Google Adsense | Monetization |
| Google Cloud Language | NLP features |

## Important Notes for AI Assistants

1. **Theme is a submodule** - Don't modify files in `themes/` directly; override in `layouts/`
2. **Hugo version** - Requires v0.56.0 extended for SCSS support
3. **Node version** - Cloud Functions use Node 8
4. **Japanese content** - Primary language is Japanese; respect existing style
5. **Build before deploy** - Always run `hugo` before Firebase deploy
6. **Submodules** - Run `git submodule update --init` after clone
7. **JavaScript bundle** - Run `npm run build` if modifying JS source
8. **Cache clearing** - Use `--ignoreCache` flag for clean Hugo builds

## Common Tasks

### Add a New Blog Post

1. Create `content/post/my-new-post.md`
2. Add required frontmatter
3. Write content in Markdown
4. Add images to `static/img/`
5. Test with `hugo server`

### Modify Site Configuration

Edit `config.toml` for:
- Site metadata
- Menu items
- Social links
- Widget settings
- Language settings

### Update Theme

```bash
cd themes/hugo-icarus-theme
git pull origin master
cd ../..
git add themes/hugo-icarus-theme
git commit -m ":+1: Update: theme update"
```

### Debug Cloud Functions Locally

```bash
cd functions
npm run serve
# Access at http://localhost:5001/{project}/us-central1/ogp
```
