# Desktop release data

## Availability and indexing

The site defaults to `noindex`. `data/site.json` contains an optional canonical HTTPS origin and `indexable` flag. Set `SITE_ORIGIN` and `SITE_INDEXABLE=true` in the public production environment to enable indexing and the sitemap. Vercel preview/development environments remain noindex even when the flag is enabled. Noindex is an indexing directive, not access control; use Vercel Deployment Protection for restricted previews.

The desktop repository [usevoro/voro](https://github.com/usevoro/voro) is public under MIT. Download data will point to exact early-access archives in that repository once publisher signing and publication are complete. No release assets are public yet. Each card shows the release channel, requirements, signing status, and platform testing limitations. A successful cross-build does not establish native runtime compatibility.

To activate real downloads:

1. Build, inspect, and publish the intended platform archives. Record native runtime testing separately from cross-packaging. Early-access builds may be unnotarized or unsigned, and platforms without native smoke testing must say so on the card and in release notes. Never label a prerelease stable.
2. Set `publicRepository` to the approved public `usevoro/<repo>` in `data/site.json` and the same `repository` in `data/releases.json`. Optional documentation and issue links must resolve publicly inside that repository. Stars refer to this exact repository; use a source project name if a distribution-only repository would make the count misleading.
3. For each validated target, set `status: "available"`, `version`, exact `tag`, exact `assetName`, `channel` (`stable` or `prerelease`), `minimumOS`, `fileType`, `sizeBytes`, `url`, `releaseNotesUrl`, human-readable `signing`, and ISO `verifiedAt`. Optional `checksumUrl` points to a published checksum asset. Preserve all four target IDs; unsupported targets remain unavailable/planned.
4. Run `npm run refresh` from this directory. Anonymous GitHub API requests verify that the repository and each explicitly mapped asset are public, the release channel matches, and the download URL belongs to the repository. The script updates sizes and verification times, never guesses asset names. Withdrawn assets become unavailable. Re-enabling a withdrawn asset is an explicit manifest edit.
5. Run `npm run refresh` and `npm run check`, then redeploy. Repeat this manual verification before each deployment and immediately when withdrawing or replacing a release. No scheduled builds or GitHub Actions are configured. The page is a static snapshot: the 24-hour expiry is checked at build, not by a live server. Published versioned download links remain on an existing deployment until it is replaced; a withdrawn asset can therefore leave a stale link until the next manual deploy. Visitors never make GitHub API requests. Cached stars are a build-time snapshot, not a live counter.

API failures retain the last cache. Build-time validation suppresses counts and available builds with verification older than 24 hours or in the future; zero stars is a valid value, not an error placeholder. HTTPS and approved GitHub repository paths are enforced. No credentials enter the client bundle.

The public `usevoro/website` repository is website source only. Do not configure it as the desktop release repository or use its stars to suggest desktop-app adoption.
