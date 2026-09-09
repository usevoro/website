# VORO website

[![License: MIT](https://img.shields.io/badge/license-MIT-755087.svg)](LICENSE)

**Small details. Bigger worlds.**

The product website for **VORO**, a local 3D asset review workspace for people making games. Built with static HTML, CSS, and a small JavaScript enhancement layer. No runtime npm dependencies; optional Umami analytics loads its hosted tracker only when configured for production.

![VORO’s sprout mascot and painted miniature world](public/images/social.jpg)

This repository contains the **website**, not the desktop application. The first [early-access release](https://github.com/usevoro/voro/releases/tag/v0.1.0-alpha.1) includes Mac Apple silicon/Intel and Windows/Linux x64. Mac builds are Developer ID signed and Apple-notarized; Windows and Linux are unsigned experimental cross-builds. Download cards show the actual signing and native-testing limitations.

## Run locally

Requires **Node.js 22 or 24** and npm.

```sh
git clone https://github.com/usevoro/website.git
cd website
npm ci --ignore-scripts
npm run dev
```

Open [localhost:4173](http://127.0.0.1:4173). The development server builds once at startup. After editing, run `npm run build` and refresh the browser. It does not implement hot reloading.

```sh
npm run check   # Formatting, tests, and production build
npm run format  # Format source and documentation
npm run build   # Generate dist/
```

GitHub Actions is disabled, and main has no required CI checks. Run validation locally before opening a PR.

The only development dependency is the pinned formatter. Building and serving the page itself use Node’s standard library.

## What’s included

- VORO’s original artbook identity, local fonts, and actual application screenshots using sample assets.
- Responsive layouts, keyboard focus, native FAQ disclosures, reduced motion, and usable content without JavaScript.
- Search and social metadata, canonical URLs, structured data, sitemap, and preview noindex controls.
- Explicit macOS, Windows, and Linux availability, with validated public release mapping and bounded build-time GitHub caches.
- A downloadable review-sidecar example, GitHub organization links, and a separate website-source link.
- Optional production-only Umami analytics for download/link clicks and scroll depth, with preview exclusion and a website privacy notice.

## Deploy

Import **`usevoro/website`** into Vercel. Keep **Root Directory at the repository root (`.`)** and choose **Framework Preset: Other**. The checked-in `vercel.json` sets the install, validation/build command, output directory, and response headers. Nitro is not required.

See [deployment instructions](docs/DEPLOYMENT.md) for environment variables, preview protection, and public indexing. The production domain is `usevoro.app`; the repository is ready to deploy, but the site is not live yet. [Umami setup](docs/ANALYTICS.md) records the existing VORO website entry in the EU region and the exact Production variables; tracking remains off until enabled for deployment.

## Project map

| Path                                  | Purpose                                               |
| ------------------------------------- | ----------------------------------------------------- |
| `scripts/render.mjs`                  | Semantic HTML and product copy                        |
| `public/styles.css`, `public/main.js` | Responsive styles and progressive enhancement         |
| `public/brand/`, `public/images/`     | Self-hosted branding, fonts, and app captures         |
| `data/`                               | Site configuration and desktop-release manifest       |
| `scripts/releases.mjs`                | Release validation, refresh, and cache expiry         |
| `tests/`                              | Release, SEO configuration, and build checks          |
| `docs/`                               | Deployment, release maintenance, and asset provenance |

[Design guide](DESIGN.md) · [Page brief](BRIEF.md) · [Release maintenance](docs/RELEASES.md)

## Contribute

Bug reports, accessibility improvements, copy corrections, and focused patches are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). Use [GitHub Issues](https://github.com/usevoro/website/issues) for website feedback and [private vulnerability reporting](https://github.com/usevoro/website/security/advisories/new) for security issues.

## License and attribution

The website source and VORO-provided materials are available under the [MIT License](LICENSE), to the extent applicable rights are held. Bundled font software retains its **SIL Open Font License 1.1**; see [third-party notices](THIRD_PARTY_NOTICES.md). VORO’s name and marks identify the project; the license does not imply endorsement of a fork or grant trademark rights. Please use your own product identity when repurposing the site.
