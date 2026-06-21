# ronaldluo.com

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

The official bilingual personal site of **Ronald Luo (羅永能)** — Co-Founder, Board Director & CTO of Prinsur Tech. Built to be the canonical, machine-readable source of identity for both search and answer engines (SEO / AEO / GEO).

Live at **[ronaldluo.com](https://ronaldluo.com)**.

## Tech Stack

- **Next.js 16** (App Router, React 19) on **TypeScript**
- **next-intl** for `en` / `zh-TW` localization
- **Tailwind CSS v4** with **shadcn** (`base-maia`) on **@base-ui/react**
- **next-themes** for light/dark, **motion** + **cobe** for the interactive globe
- **Biome** + **ESLint** for linting/formatting, deployed on **Vercel**

## Features

- **Bilingual** routing (`en`, `zh-TW`) with locale-aware navigation and `hreflang` / `x-default` alternates.
- **Structured data** — schema.org `Person` / `Organization` / `WebSite` / `ProfilePage` JSON-LD with bilingual names and romanizations for entity disambiguation.
- **Answer-engine ready** — robots explicitly opts in to AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …).
- **Dynamic OG images** generated per locale via `next/og`.
- **Social shortlinks** — `/(github|linkedin|x|instagram|…)` permanently redirect to the matching profile.
- **Interactive globe**, theme toggle, and locale switcher.

## Development

Requires **Node.js 20+** (CI uses Node 24) and **pnpm**.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm validate   # typecheck + lint
pnpm format     # auto-fix with Biome
```

## Project Structure

```
app/[locale]/   Pages (home, contact), layout, metadata, OG image, sitemap, robots, manifest
components/      UI components (globe, header, theme/locale switchers, JSON-LD)
i18n/            next-intl routing and request config
lib/             Identity, SEO, socials, and contact-channel data
messages/        en / zh-TW translations
```

## Quality & CI

Every push and PR to `main` runs **typecheck**, **lint**, and **build**, plus **gitleaks** (secret scanning), **lychee** (link checking), and **typos** (spell checking). **Lighthouse** audits the production deployment.

## License

[MIT](LICENSE)
