import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const source = fileURLToPath(new URL('../', import.meta.url));
test('standalone production and preview builds emit correct SEO and complete local assets', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'voro-website-build-'));
  try {
    for (const entry of ['scripts', 'data', 'public'])
      await cp(path.join(source, entry), path.join(root, entry), { recursive: true });
    for (const environment of ['production', 'preview']) {
      const built = spawnSync(process.execPath, ['scripts/build.mjs'], {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          SITE_ORIGIN: 'https://voro.example',
          SITE_INDEXABLE: 'true',
          VERCEL_ENV: environment,
        },
      });
      assert.equal(built.status, 0, built.stderr);
      const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
      assert.ok(html.includes('rel="canonical" href="https://voro.example/"'));
      assert.ok(
        html.includes(
          environment === 'production'
            ? 'index, follow, max-image-preview:large'
            : 'noindex, nofollow',
        ),
      );
      const robots = await readFile(path.join(root, 'dist/robots.txt'), 'utf8');
      assert.ok(robots.includes(environment === 'production' ? 'Allow: /' : 'Disallow: /'));
      const sitemap = await readFile(path.join(root, 'dist/sitemap.xml'), 'utf8');
      assert.equal(
        sitemap.includes('<loc>https://voro.example/</loc>'),
        environment === 'production',
      );
      assert.match(await readFile(path.join(root, 'dist/404.html'), 'utf8'), /Page not found/);
      for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#]+)"/g))
        await readFile(path.join(root, 'dist', match[1]));
      assert.ok(html.includes('href="https://github.com/usevoro/website">Website source</a>'));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
