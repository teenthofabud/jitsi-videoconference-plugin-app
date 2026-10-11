#!/usr/bin/env node
// Generates robots.txt, sitemap.xml and the IndexNow key file for the build
// that was just produced, and publishes the pre-rendered 404 page as error.html,
// the page the hosting serves with a 404 status for unknown paths. The site URL and indexability are read back from the
// pre-rendered home page, so src/environments/environment.<env>.ts stays the
// single source of truth and QA builds never advertise themselves to crawlers.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// IndexNow keys are public by design: search engines verify ownership by
// fetching https://<host>/<key>.txt and comparing its contents with the key.
const INDEXNOW_KEY = 'ea43aac2b52fbffd1f4e1248436566f7';

const distDir = 'dist/toab-jitsi-website';
const browserDir = path.join(distDir, 'browser');

const indexHtml = readFileSync(path.join(browserDir, 'index.html'), 'utf8');
const canonical = indexHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const robotsMeta = indexHtml.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
if (!canonical) {
  throw new Error('No canonical link in pre-rendered index.html; is SeoService running during pre-rendering?');
}
const siteUrl = new URL(canonical).origin;
const indexable = !robotsMeta.includes('noindex');

copyFileSync(path.join(browserDir, '404', 'index.html'), path.join(browserDir, 'error.html'));

// Pre-rendered page file for a route, e.g. /privacy -> privacy/index.html
const pageFile = (route) => path.join(browserDir, route.slice(1), 'index.html');
const isNoindex = (route) => /<meta name="robots" content="[^"]*noindex/.test(readFileSync(pageFile(route), 'utf8'));

// Last commit date of a page's sources, so lastmod only moves when content does
function lastModified(route) {
  const page = route === '/' ? 'home' : route.slice(1);
  const sources = [`src/app/pages/${page}`, `src/assets/data/${page}.json`].filter((p) => existsSync(p));
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], { encoding: 'utf8' }).trim();
    return date || null;
  } catch {
    return null;
  }
}

if (indexable) {
  const routes = Object.keys(JSON.parse(readFileSync(path.join(distDir, 'prerendered-routes.json'), 'utf8')).routes)
    .filter((route) => !isNoindex(route));
  const urls = routes.map((route) => {
    const lastmod = lastModified(route);
    return [
      '  <url>',
      `    <loc>${siteUrl}${route}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  });
  writeFileSync(
    path.join(browserDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  );
  writeFileSync(path.join(browserDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  writeFileSync(path.join(browserDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
} else {
  // Crawling stays allowed so search engines can see the noindex meta tag on
  // every page; blocking here would hide it and URLs could still get listed.
  writeFileSync(path.join(browserDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
}

console.log(`SEO files generated for ${siteUrl} (${indexable ? 'indexable' : 'noindex'})`);
