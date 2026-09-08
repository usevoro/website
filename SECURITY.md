# Security policy

## Supported code

Security fixes target the latest `main` branch of this website repository. Older snapshots are not maintained separately. The desktop application is a separate product; do not submit private desktop source or user projects here.

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/usevoro/website/security/advisories/new). Include the affected commit, a concise description, reproduction steps using synthetic data, impact, and a proposed mitigation if known. Remove real credentials and personal information.

Do not disclose an unpatched vulnerability in a public issue or pull request. If private reporting is temporarily unavailable, open a public issue requesting a private security contact **without vulnerability details**. No response-time or bounty commitment is offered.

Maintainers will assess reports and coordinate fixes and disclosure with the reporter when possible. Good-faith reports are welcome.

## Security boundaries

The site is static. There is no application login, upload API, or runtime database. GitHub release refreshes run at build time without tokens and accept only explicitly approved public repository assets. API failures use a bounded cache; the deployed page retains its build-time snapshot until rebuilt.

Do not place secrets in `data/`, `public/`, source metadata, or client JavaScript. Vercel indexing controls are not access controls. See [deployment guidance](docs/DEPLOYMENT.md).
