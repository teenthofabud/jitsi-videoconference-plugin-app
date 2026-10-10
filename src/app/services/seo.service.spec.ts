import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { SeoService } from './seo.service';

@Component({ template: '' })
class BlankComponent { }

const siteUrl = environment.siteUrl.replace(/\/$/, '');
const cdnUrl = environment.cdnUrl.replace(/\/$/, '');

describe('SeoService', () => {
  let document: Document;
  let router: Router;

  const meta = (attr: 'name' | 'property', key: string) =>
    document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content');
  const linkHref = (selector: string) => document.head.querySelector(selector)?.getAttribute('href');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: BlankComponent, data: { seo: { title: 'Home title', description: 'Home description' } } },
          { path: 'hidden', component: BlankComponent, data: { seo: { title: 'Hidden', noindex: true } } },
          { path: 'bare', component: BlankComponent },
        ]),
      ],
    });
    document = TestBed.inject(DOCUMENT);
    document.head.innerHTML = '';
    document.title = '';
    router = TestBed.inject(Router);
    TestBed.inject(SeoService).init();
  });

  it('sets the favicon, API preconnect and structured data on init', () => {
    const icon = document.head.querySelector('link[rel="icon"]')!;
    expect(icon.getAttribute('type')).toBe('image/jpeg');
    expect(icon.getAttribute('href')).toBe(`${cdnUrl}/toab-jitsi-icon-123x120.svg `);

    const preconnect = document.head.querySelector('link#api-preconnect')!;
    expect(preconnect.getAttribute('rel')).toBe('preconnect');
    expect(preconnect.hasAttribute('crossorigin')).toBe(true);
    expect(preconnect.getAttribute('href')).toBe(new URL(environment.apiUrl).origin);

    const script = document.head.querySelector<HTMLScriptElement>('script#structured-data')!;
    expect(script.type).toBe('application/ld+json');
    const data = JSON.parse(script.textContent!);
    expect(data['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(['Organization', 'WebSite', 'SoftwareApplication']);
    expect(data['@graph'][0]).toMatchObject({
      '@id': `${siteUrl}/#organization`,
      name: 'TOAB',
      legalName: 'Das Software',
      url: `${siteUrl}/`,
      logo: `${cdnUrl}/toab-jitsi-icon-123x120.svg `,
      email: 'anirban.das@t-online.de',
    });
    expect(data['@graph'][1]).toMatchObject({ name: 'TOAB Jitsi Plugin', publisher: { '@id': `${siteUrl}/#organization` } });
  });

  it('reuses existing head elements instead of duplicating them', () => {
    TestBed.inject(SeoService).init();
    expect(document.head.querySelectorAll('link[rel="icon"]').length).toBe(1);
    expect(document.head.querySelectorAll('link#api-preconnect').length).toBe(1);
    expect(document.head.querySelectorAll('script#structured-data').length).toBe(1);
  });

  it('applies the route SEO data on navigation', async () => {
    await router.navigateByUrl('/');

    expect(document.title).toBe('Home title');
    expect(meta('name', 'description')).toBe('Home description');
    expect(meta('property', 'og:title')).toBe('Home title');
    expect(meta('property', 'og:description')).toBe('Home description');
    expect(meta('name', 'twitter:title')).toBe('Home title');
    expect(meta('name', 'twitter:description')).toBe('Home description');
    expect(meta('property', 'og:url')).toBe(`${siteUrl}/`);
    expect(meta('property', 'og:type')).toBe('website');
    expect(meta('property', 'og:site_name')).toBe('TOAB Jitsi Plugin');
    expect(meta('property', 'og:image')).toBe(`${cdnUrl}/toab-jitsi-icon-123x120.svg `);
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'twitter:image')).toBe(`${cdnUrl}/toab-jitsi-icon-123x120.svg `);
    expect(linkHref('link[rel="canonical"]')).toBe(`${siteUrl}/`);
  });

  it('strips query and fragment from the canonical URL', async () => {
    await router.navigateByUrl('/bare?a=1#x');
    expect(linkHref('link[rel="canonical"]')).toBe(`${siteUrl}/bare`);
    expect(meta('property', 'og:url')).toBe(`${siteUrl}/bare`);
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });

  it('keeps the previous title when the route has no SEO data', async () => {
    await router.navigateByUrl('/');
    await router.navigateByUrl('/bare');
    expect(document.title).toBe('Home title');
  });

  it('sets robots from environment indexability and route noindex', async () => {
    const expected = (noindex: boolean) => !environment.indexable
      ? 'noindex, nofollow'
      : noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large';

    await router.navigateByUrl('/');
    expect(meta('name', 'robots')).toBe(expected(false));
    expect(meta('name', 'bingbot')).toBe(expected(false));

    await router.navigateByUrl('/hidden');
    expect(meta('name', 'robots')).toBe(expected(true));
    expect(meta('name', 'bingbot')).toBe(expected(true));
  });
});
