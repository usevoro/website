// Public tracker configuration only. Umami API keys never belong in the site.
export function resolveAnalytics(config, env = process.env) {
  if (env.UMAMI_ENABLED !== 'true' || env.VERCEL_ENV !== 'production') return null;
  if (!env.SITE_ORIGIN && !config.explicitOrigin)
    throw new Error('Umami requires an explicit production SITE_ORIGIN.');
  const origin = new URL(config.origin);
  if (origin.hostname === 'localhost' || origin.port)
    throw new Error('Umami requires a public production origin without a port.');
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      env.UMAMI_WEBSITE_ID || '',
    )
  )
    throw new Error('UMAMI_WEBSITE_ID must be the website UUID from Umami Cloud.');
  return { websiteId: env.UMAMI_WEBSITE_ID, domain: origin.hostname };
}
