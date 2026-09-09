# Umami Cloud analytics

The repository is ready for Umami Cloud, but analytics is **disabled by default**. The production hostname is **usevoro.app**. Umami account setup and the website UUID are still pending; the site has not been deployed. No paid plan or GitHub Actions job is needed for the preparation.

## Activate after deploying the website

1. Sign up for or sign in to [Umami Cloud](https://cloud.umami.is). Choose the free Hobby plan; a paid trial is not required for this setup. Confirm current account limits before enabling collection.
2. In **Websites → Add website**, create **VORO** with domain **usevoro.app** (no protocol or path). Keep the dashboard private; do not enable public sharing. If the site already exists, reuse it.
3. Open **Edit → Tracking code** and copy `data-website-id`. It is a public website UUID, not an API key. This integration uses the standard Cloud tracker at `https://cloud.umami.is/script.js`; confirm that the account's tracking snippet matches before activating it.
4. In the Vercel project's **Production** environment, set:

   ```dotenv
   SITE_ORIGIN=https://usevoro.app
   UMAMI_ENABLED=true
   UMAMI_WEBSITE_ID=your-website-uuid
   ```

   Replace `your-website-uuid` with the actual public ID from the VORO website entry. Keep Vercel system environment variables enabled so `VERCEL_ENV=production` is available. No API key, account password, or secret belongs in the repository or browser bundle. `SITE_INDEXABLE` remains a separate SEO setting.

5. Redeploy. The site is static, so changing environment variables alone does not update the existing HTML. The build rejects missing/invalid IDs and missing explicit origins when production tracking is enabled.
6. Visit the canonical production hostname. Confirm the Cloud script loads and its event requests succeed, then check Umami for the visit. Click the documentation and GitHub links; once actual release downloads exist, test one platform download too. Verify event properties against the table below. These verification visits will appear in the dashboard.

Only the configured hostname is allowed at runtime. Redirect aliases such as `www` to the canonical origin. Local and Vercel preview/development builds omit the tracker even if analytics variables are accidentally inherited. A production build served on another hostname cannot send events. Keep production-only variables out of preview scopes.

## Events

| Event                    | Properties                            | Meaning                                                                                                             |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pageview (Umami default) | Standard page/browser metadata        | Visit to the landing page; URL fragments are excluded.                                                              |
| `download_click`         | `platform`, `architecture`, `version` | Click on an available desktop archive. Does not confirm download completion or installation.                        |
| `github_click`           | `destination`                         | Repository, organization, releases, issues, or website-source link. Does not prove that a visitor starred the repo. |
| `documentation_click`    | None                                  | Open the configured desktop documentation link.                                                                     |
| `sample_review_click`    | None                                  | Download the public synthetic review example.                                                                       |
| `release_notes_click`    | `platform`, `architecture`            | Open release notes for an available build.                                                                          |
| `checksum_click`         | `platform`, `architecture`            | Open the published checksum file.                                                                                   |
| `scroll_depth`           | `percent`                             | Reach 25%, 50%, 75%, or 90% of the document, once each per page load. Measures reach, not time spent reading.       |

Unavailable platforms have no download links or download events. Clicks retain native navigation, modifier keys, and middle-click behavior; they never wait for telemetry. Blockers, failed requests, or interaction before the script loads can result in missing events. There is no retry queue or event-delivery guarantee.

For a basic dashboard, inspect referrals and UTM campaigns, compare `download_click` by platform/architecture, and compare visits with download clicks. Keep event totals distinct from unique-visitor conversion rates. Umami counts pageviews, events, and event properties toward Cloud usage; inspect actual usage before increasing event granularity. No scheduled billing or reporting job is configured here.

## Data boundaries

The local `voroBeforeSend` hook allows pageviews and this fixed event list. It removes arbitrary URL parameters and fragments, keeps only `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term` (up to 100 characters each), and reduces referrers to origins. Campaign values must not contain personal data. Browser language, screen information, and ordinary network request metadata still reach the provider.

No identified users, session replay, heatmaps, performance collection, or desktop telemetry are enabled. No asset files, private filenames, review notes, or project exports are used as event properties. The helper respects Do Not Track and Global Privacy Control; it does not add cookies or bypass ad blockers. Umami's own opt-out behavior is also retained.

The footer links to a generated website privacy notice whose opening sentence reflects whether tracking is enabled for that deployment. Hosting logs and GitHub download requests are separate from Umami. Keep this notice aligned with any later tracking changes; configuration is not a blanket legal-compliance claim.

## Local verification and rollback

Run `npm run check`. Tests cover production gating, disabled previews, HTML event wiring, URL filtering, DNT/GPC, blocked trackers, unchanged navigation, and bounded scroll events. Tests use a synthetic website ID and mock tracker; they do not send live analytics.

To stop collection, set `UMAMI_ENABLED=false` in Vercel Production and redeploy. Verify the resulting HTML no longer references the Cloud tracker. Historical data remains managed in Umami. A rollback to an older analytics-enabled deployment can re-enable collection, so check deployment configuration when rolling back.

References: [collect data](https://docs.umami.is/docs/collect-data), [events](https://docs.umami.is/docs/track-events), [tracker configuration](https://docs.umami.is/docs/tracker-configuration), [Cloud usage and plans](https://docs.umami.is/docs/cloud/faq).
