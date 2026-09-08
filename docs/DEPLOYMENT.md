# Deploy to Vercel

1. Import `usevoro/website` in Vercel.
2. Leave **Root Directory** at **`.`**. This standalone repository contains everything required; no desktop repository access is needed.
3. Choose **Other** as the framework and **Node.js 22.x** (24.x is also tested).
4. Keep the checked-in `vercel.json` defaults: `npm ci --ignore-scripts`, `npm run refresh && npm run check`, output `dist`.
5. Set `SITE_ORIGIN` to your approved production HTTPS origin, without a path. Keep `SITE_INDEXABLE=false` for prelaunch.
6. Deploy a preview and review it. For a public launch, connect the approved domain and set `SITE_INDEXABLE=true` in the **Production** environment.

Vercel preview/development environments remain noindex even if the indexing flag is enabled. Noindex is not access control; enable Vercel Deployment Protection when a preview should be restricted. This public source repository does not automatically publish a website or desktop release.

Keep Vercel’s system environment variables enabled. Without `SITE_ORIGIN`, noindex previews use `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. Local builds fall back to `https://localhost`. Indexable production builds require an explicit production origin to prevent accidental canonical URLs on ephemeral deployments.

The build emits HTML, CSS, JavaScript, local images/fonts, a sitemap, robots.txt, and a custom 404 page. It has no request-time server, analytics, uploads, or application accounts. Unknown paths must remain 404s; do not add a catch-all rewrite to the home page.

## Release freshness

See [RELEASES.md](RELEASES.md) before enabling desktop downloads or stars. CI does not publish binaries. Public release checks run anonymously at deployment time. An hourly refresh/build/deploy must be arranged before enabling cached download/star data; a deployed static page retains its build-time snapshot. No scheduled deployment is configured by this repository.

## SEO verification before launch

Check the final domain’s canonical link, Open Graph URL/image, robots.txt, sitemap.xml, and actual download destinations. Preview deployments should stay noindex. No ratings, prices, testimonials, or availability claims should be added without evidence. Structured data describes the software without claiming a Google rich-result entitlement. Field Core Web Vitals and a Lighthouse score have not been measured.

## Rollback

Use Vercel’s deployment history to restore a known-good deployment, then correct the source through a pull request. A withdrawn or unavailable release must not be restored by rolling back an old download snapshot; verify release availability before promoting a rollback.

References: [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build), [vercel.json](https://vercel.com/docs/project-configuration/vercel-json), [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables).
