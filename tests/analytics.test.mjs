import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { resolveConfig } from '../scripts/config.mjs';
import { renderPage } from '../scripts/render.mjs';

const input = { origin: null, indexable: false };
const env = {
  VERCEL_ENV: 'production',
  SITE_ORIGIN: 'https://voro.example',
  UMAMI_ENABLED: 'true',
  UMAMI_WEBSITE_ID: '11111111-1111-4111-8111-111111111111',
};
test('analytics is opt-in and production-only, independent of indexing', () => {
  assert.equal(resolveConfig(input, {}).analytics, null);
  assert.equal(resolveConfig(input, { ...env, UMAMI_ENABLED: 'false' }).analytics, null);
  for (const environment of ['preview', 'development', undefined])
    assert.equal(resolveConfig(input, { ...env, VERCEL_ENV: environment }).analytics, null);
  const config = resolveConfig(input, env);
  assert.equal(config.indexable, false);
  assert.deepEqual(config.analytics, { websiteId: env.UMAMI_WEBSITE_ID, domain: 'voro.example' });
});
test('enabled production analytics fails on missing or invalid public configuration', () => {
  for (const changes of [
    { UMAMI_WEBSITE_ID: '' },
    { UMAMI_WEBSITE_ID: '"><script>bad</script>' },
    { SITE_ORIGIN: '' },
    { SITE_ORIGIN: 'https://localhost' },
    { SITE_ORIGIN: 'https://voro.example:1234' },
  ])
    assert.throws(() => resolveConfig(input, { ...env, ...changes }));
});
test('only available downloads have platform events; disabled analytics emits no tracker', () => {
  const config = {
    ...resolveConfig(input, env),
    publicRepository: 'usevoro/voro',
    organizationUrl: 'https://github.com/usevoro',
    docsUrl: 'https://github.com/usevoro/voro/blob/main/README.md',
  };
  const releases = {
    stars: null,
    targets: [
      {
        platform: 'macOS',
        architecture: 'Apple silicon',
        status: 'available',
        version: '0.1.0-alpha.1',
        channel: 'prerelease',
        minimumOS: 'macOS 13+',
        fileType: 'ZIP',
        sizeBytes: 1000000,
        signing: 'Test fixture',
        url: 'https://github.com/usevoro/voro/releases/download/test/test.zip',
        releaseNotesUrl: 'https://github.com/usevoro/voro/releases/tag/test',
      },
      { platform: 'Windows', architecture: 'x64', status: 'unavailable' },
    ],
  };
  const html = renderPage(config, releases);
  assert.equal((html.match(/data-voro-event="download_click"/g) || []).length, 1);
  assert.match(html, /data-platform="macOS" data-architecture="Apple silicon"/);
  assert.match(html, /data-before-send="voroBeforeSend"/);
  assert.ok(
    html.indexOf('src="/analytics.js"') < html.indexOf('src="https://cloud.umami.is/script.js"'),
  );
  const disabled = renderPage({ ...config, analytics: null }, releases);
  assert.doesNotMatch(disabled, /cloud\.umami|src="\/analytics.js"|data-voro-event/);
});

const code = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
function browser({ hostname = 'voro.example', navigator = {}, tracker } = {}) {
  const events = [];
  const listeners = {};
  const document = {
    currentScript: { dataset: { domain: 'voro.example' } },
    documentElement: { scrollHeight: 1000 },
    addEventListener: (name, fn) => {
      listeners[name] = fn;
    },
  };
  const window = {
    innerHeight: 100,
    scrollY: 0,
    umami: tracker || { track: (name, data) => events.push({ name, data }) },
    requestAnimationFrame: (fn) => fn(),
    addEventListener: (name, fn) => {
      listeners[name] = fn;
    },
  };
  vm.runInNewContext(code, {
    document,
    window,
    navigator,
    location: { hostname, origin: `https://${hostname}` },
    URL,
    URLSearchParams,
  });
  return { events, listeners, window };
}
test('privacy hook strips unrelated query parameters, fragments, referrer paths, and identity data', () => {
  const { window } = browser();
  const result = window.voroBeforeSend('event', {
    website: env.UMAMI_WEBSITE_ID,
    url: '/?email=private&utm_source=itch&utm_campaign=launch#private',
    referrer: 'https://example.org/private/path?token=secret#private',
    id: 'private-user-id',
    name: 'download_click',
    data: { platform: 'macOS', architecture: 'Intel', email: 'private', review: 'private' },
  });
  assert.equal(result.url, '/?utm_source=itch&utm_campaign=launch');
  assert.equal(result.referrer, 'https://example.org');
  assert.equal(result.id, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(result.data)), {
    platform: 'macOS',
    architecture: 'Intel',
  });
  assert.equal(window.voroBeforeSend('identify', { id: 'private' }), false);
  assert.equal(window.voroBeforeSend('event', { name: 'unknown' }), false);
});
test('runtime domain guard, DNT, and GPC suppress tracking and listeners', () => {
  for (const options of [
    { hostname: 'preview.vercel.app' },
    { navigator: { doNotTrack: '1' } },
    { navigator: { globalPrivacyControl: true } },
  ]) {
    const { window, listeners, events } = browser(options);
    assert.equal(window.voroBeforeSend('event', {}), false);
    assert.deepEqual(Object.keys(listeners), []);
    assert.equal(events.length, 0);
  }
});
test('click events keep native navigation and tolerate a blocked tracker', () => {
  const { events, listeners, window } = browser();
  const event = {
    type: 'click',
    target: {
      closest: () => ({
        dataset: {
          voroEvent: 'download_click',
          platform: 'macOS',
          architecture: 'Intel',
          version: '1.0',
        },
      }),
    },
    preventDefault: () => assert.fail('Navigation was blocked'),
  };
  listeners.click(event);
  assert.equal(events[0].name, 'download_click');
  listeners.auxclick({ ...event, type: 'auxclick', button: 1 });
  assert.equal(events.length, 2);
  listeners.auxclick({ ...event, type: 'auxclick', button: 2 });
  assert.equal(events.length, 2);
  window.umami = undefined;
  assert.doesNotThrow(() => listeners.click(event));
  window.umami = {
    track: () => {
      throw new Error('blocked');
    },
  };
  assert.doesNotThrow(() => listeners.click(event));
});
test('each scroll milestone is recorded at most once and waits for a tracker', () => {
  const { events, listeners, window } = browser();
  const tracker = window.umami;
  window.umami = undefined;
  window.scrollY = 900;
  listeners.scroll();
  assert.equal(events.length, 0);
  window.umami = tracker;
  listeners.scroll();
  listeners.scroll();
  assert.deepEqual(
    events.map((e) => e.data.percent),
    [25, 50, 75, 90],
  );
});
