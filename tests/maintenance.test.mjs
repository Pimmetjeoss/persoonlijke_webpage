import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { MAINTENANCE_ENABLED, isMaintenanceAsset, maintenanceHtml, maintenanceHeaders } from '../lib/site-maintenance.ts';

test('maintenance mode is explicitly enabled and reversible', () => {
  assert.equal(MAINTENANCE_ENABLED, true);
  const source = readFileSync(new URL('../middleware.ts', import.meta.url), 'utf8');
  assert.ok(source.indexOf('if (MAINTENANCE_ENABLED)') < source.indexOf('logBotVisit(request)'));
  assert.match(source, /status: 503/);
  assert.match(source, /matcher: \["\/:path\*"\]/);
});

test('only the holding page assets bypass maintenance', () => {
  for (const p of ['/maintenance/cactus.webp', '/maintenance/fjalla-one.ttf', '/favicon.ico', '/_next/static/example.js']) {
    assert.equal(isMaintenanceAsset(p), true, p);
  }
  for (const p of ['/', '/contact', '/blog/a', '/home.md', '/llms.txt', '/mcp-explorer/index.html', '/agent-ready/api/scan', '/.well-known/agent-card.json', '/_next/image', '/robots.txt', '/sitemap.xml']) {
    assert.equal(isMaintenanceAsset(p), false, p);
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
