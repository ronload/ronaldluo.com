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

- **Bilingual** routing with canonical unprefixed English paths and `/zh-TW/...` paths; legacy `/en/...` URLs permanently redirect to their English equivalents. Includes locale-aware navigation and `hreflang` / `x-default` alternates.
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
pnpm font:cjk   # regenerate subsetted CJK fonts after changing zh-TW content (requires uvx)
```

## Project Structure

```
app/             App Router routes, global metadata, and the llms.txt endpoint
app/[locale]/    Localized pages (home, contact, FAQ, for-LLMs), layout, OG image, errors, and CJK fonts
components/      UI components (globe, header, theme/locale switchers, JSON-LD)
i18n/            next-intl routing and request config
lib/             Identity, SEO, socials, and contact-channel data
messages/        en / zh-TW translations
public/          Static images, app icons, and the IndexNow verification key
scripts/         CJK font subsetting and IndexNow submission scripts
proxy.ts         next-intl locale middleware
.github/         CI, security, link, spelling, and Lighthouse workflows
```

## Quality & CI

Every push and PR targeting `main` runs **typecheck**, **lint**, and **build**, plus **gitleaks** (secret scanning), **lychee** (link checking), and **typos** (spell checking). **Lychee** also runs weekly. **Lighthouse** audits the production site after a successful deployment to the `Production` environment.

## License

[MIT](LICENSE)
