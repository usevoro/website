# Desktop release data

## Availability and indexing

The site defaults to `noindex`. `data/site.json` contains an optional canonical HTTPS origin and `indexable` flag. Set `SITE_ORIGIN` and `SITE_INDEXABLE=true` in the public production environment to enable indexing and the sitemap. Vercel preview/development environments remain noindex even when the flag is enabled. Noindex is an indexing directive, not access control; use Vercel Deployment Protection for restricted previews.

The desktop application repository, `usevoro/voro`, is private and has no published releases. Until a public source or distribution repository is explicitly approved, the site links to the public `usevoro` organization, omits repository stars, and shows all platform builds as unavailable. Changing this configuration does not change GitHub repository visibility. Do not publish desktop source or binaries as a side effect of website deployment.

To activate real downloads:

1. Agree on public distribution and licensing. Publish and validate each intended platform build, including signing/notarization and supported OS versions. Do not label a prerelease stable.
2. Set `publicRepository` to the approved public `usevoro/<repo>` in `data/site.json` and the same `repository` in `data/releases.json`. Optional documentation and issue links must resolve publicly inside that repository. Stars refer to this exact repository; use a source project name if a distribution-only repository would make the count misleading.
3. For each validated target, set `status: "available"`, `version`, exact `tag`, exact `assetName`, `channel` (`stable` or `prerelease`), `minimumOS`, `fileType`, `sizeBytes`, `url`, `releaseNotesUrl`, human-readable `signing`, and ISO `verifiedAt`. Optional `checksumUrl` points to a published checksum asset. Preserve all four target IDs; unsupported targets remain unavailable/planned.
4. Run `npm run refresh` from this directory. Anonymous GitHub API requests verify that the repository and each explicitly mapped asset are public, the release channel matches, and the download URL belongs to the repository. The script updates sizes and verification times, never guesses asset names. Withdrawn assets become unavailable. Re-enabling a withdrawn asset is an explicit manifest edit.
5. Run tests and build, then redeploy. Arrange an hourly refresh/build/deploy in the chosen production host before enabling public downloads or star counts. A static deployment keeps its build-time snapshot: the 24-hour expiry is checked at build, not by a live server. If scheduled publishing is unavailable, omit star counts and pause download availability until a manual verification/redeploy. Visitors never make GitHub API requests.

API failures retain the last cache. Build-time validation suppresses counts and available builds with verification older than 24 hours or in the future; zero stars is a valid value, not an error placeholder. HTTPS and approved GitHub repository paths are enforced. No credentials enter the client bundle.

The public `usevoro/website` repository is website source only. Do not configure it as the desktop release repository or use its stars to suggest desktop-app adoption.
