# Contributing

Thanks for helping make VORO’s website clearer, more useful, and more accessible.

## Scope

This repository maintains the product website. Desktop application changes, binaries, and integrations are outside its scope. For a substantial redesign or new dependency, open a focused proposal before implementing it. Small fixes can go straight to a pull request.

## Development

1. Fork the repository and create a descriptive branch.
2. Use Node.js 22 or 24; `.nvmrc` selects 22.
3. Run `npm ci --ignore-scripts` and `npm run dev`.
4. After editing, rebuild with `npm run build` and refresh the browser.
5. Run `npm run check` before opening a pull request. Use `npm run format` to fix formatting.

Keep changes focused and commits understandable. A fix should include a regression test when it changes release handling, metadata, or build behavior. Don’t add tests that merely repeat CSS declarations.

## Design and content

Follow [DESIGN.md](DESIGN.md). For visible changes, check narrow mobile, tablet, and desktop widths; keyboard access; reduced motion; and content without JavaScript. Include before/after screenshots in your PR, using only synthetic or shareable content. Keep body copy concrete and preserve useful focus indicators and native controls.

Do not invent download availability, supported platforms, customers, ratings, prices, or integration claims. Website stars are not desktop-product adoption. Keep source links distinct from application download destinations. See [release maintenance](docs/RELEASES.md).

## Pull requests

Explain the problem, resulting behavior, and relevant checks. Link the issue if there is one. Update documentation when configuration or workflow changes. Local checks must pass; maintainers may request changes or decline work that expands the product’s scope.

Never commit tokens, `.env` files, customer assets, personal paths, or generated build output. Report vulnerabilities through [SECURITY.md](SECURITY.md), not a public issue. Contributions are provided under this repository’s MIT license; retain third-party notices and identify assets you did not create.

Participation follows our [Code of Conduct](CODE_OF_CONDUCT.md).
