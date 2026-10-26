import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { MAINTENANCE_ENABLED, isMaintenanceAsset, isPublicBlogPath, maintenanceHtml, maintenanceHeaders } from '../lib/site-maintenance.ts';

test('maintenance mode is explicitly enabled and reversible', () => {
  assert.equal(MAINTENANCE_ENABLED, true);
  const source = readFileSync(new URL('../middleware.ts', import.meta.url), 'utf8');
  assert.ok(source.indexOf('if (MAINTENANCE_ENABLED)') < source.indexOf('logBotVisit(request)'));
  assert.match(source, /status: 503/);
  assert.match(source, /matcher: \["\/:path\*"\]/);
});

test('only the holding page assets bypass maintenance', () => {
  for (const p of ['/maintenance/cactus.webp', '/maintenance/fjalla-one.ttf', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/_next/static/example.js']) {
    assert.equal(isMaintenanceAsset(p), true, p);
  }
  for (const p of ['/', '/contact', '/blog/a', '/home.md', '/llms.txt', '/mcp-explorer/index.html', '/agent-ready/api/scan', '/.well-known/agent-card.json', '/_next/image']) {
    assert.equal(isMaintenanceAsset(p), false, p);
  }
});

test('the blog exception is bounded and leaves APIs and other pages in maintenance', () => {
  for (const p of ['/blog', '/blog/', '/blog/php2shell-patchbeheer', '/blog/archief', '/blog/images/strategie-christmas-claude.webp']) {
    assert.equal(isPublicBlogPath(p), true, p);
  }
  for (const p of ['/', '/contact', '/blogger', '/blog.md', '/agent-scan/api/scan', '/blog/api/scan', '/blog/../contact', '/blog/%2e%2e/contact', '/blog\\\\contact']) {
    assert.equal(isPublicBlogPath(p), false, p);
  }
  assert.equal(isMaintenanceAsset('/images/blog/php2shell-patchbeheer.jpg'), true);
  assert.equal(isMaintenanceAsset('/images/blog/arbitrary.html'), false);
});

test('all published featured images are available directly during maintenance', () => {
  const posts = new URL('../content/posts/', import.meta.url);
  for (const file of readdirSync(posts).filter(f => f.endsWith('.md'))) {
    const text = readFileSync(new URL(file, posts), 'utf8');
    const src = text.match(/^featuredImage:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]?.trim();
    if (!src) continue;
    assert.ok(isMaintenanceAsset(src) || isPublicBlogPath(src), `${file}: featured image blocked: ${src}`);
    // This regression test covers the maintenance gate, not historical asset inventory.
  }
  assert.ok(existsSync(new URL('../public/images/blog/php2shell-patchbeheer.jpg', import.meta.url)));
  for (const component of ['image-lightbox.tsx', 'blog-post-card.tsx']) {
    const source = readFileSync(new URL(`../app/blog/components/${component}`, import.meta.url), 'utf8');
    assert.match(source, /unoptimized=\{[^}]*startsWith\('\/images\/blog\/'\)[^}]*startsWith\('\/blog\/images\/'\)/);
  }
});

test('temporary response is not cached and asks clients to retry', () => {
  assert.match(maintenanceHeaders['Cache-Control'], /no-store/);
  assert.equal(maintenanceHeaders['Retry-After'], '3600');
  assert.match(maintenanceHeaders['Content-Security-Policy'], /default-src 'none'/);
});

test('renovation page has accessible content, real contacts and no app scripts', () => {
  assert.equal((maintenanceHtml.match(/<h1\b/g) || []).length, 1);
  assert.match(maintenanceHtml, /<html lang="nl">/);
  assert.match(maintenanceHtml, /href="mailto:pim@code-lieshout.nl"/);
  assert.match(maintenanceHtml, /href="tel:\+31612419980"/);
  assert.match(maintenanceHtml, /href="https:\/\/wa.me\/31612419980"/);
  assert.match(maintenanceHtml, /prefers-reduced-motion/);
  assert.doesNotMatch(maintenanceHtml, /<script\b|googletagmanager|clarity.ms/);
});
