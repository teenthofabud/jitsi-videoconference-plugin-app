import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { SITE } from '../config/site';

// Raster images, since Bing, social networks and chat apps don't render SVG previews
const SOCIAL_IMAGE = {
  url: SITE.cdnAsset('toab-jitsi-logo-1200x630.png'),
  width: 1200,
  height: 630,
  alt: `${SITE.name} logo: Jitsi Meet video conferencing for your calendar`,
};
const LOGO = SITE.cdnAsset('toab-jitsi-icon-512x512.png');

export interface SeoData {
  title?: string;
  description?: string;
  noindex?: boolean;
}

/**
 * Keeps <title>, meta description, canonical link, robots, Open Graph and
 * Twitter tags in sync with the active route. Runs during pre-rendering too,
 * so every static HTML file ships with its own correct tags.
 *
 * URLs, the CDN and indexability come from the build's environment file, so QA
 * builds point at the QA domain and CDN and are marked noindex while live builds
 * are indexable. The API and CDN preconnects, the PNG favicon and the touch icon
 * are set here too, since index.html can't vary by environment.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  init() {
    this.setApiPreconnect();
    this.setCdnPreconnect();
    this.setIcons();
    this.setStructuredData();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.apply(this.collectRouteData(), this.router.url));
  }

  private collectRouteData(): SeoData {
    let route = this.route.snapshot;
    let seo: SeoData = {};
    while (route) {
      seo = { ...seo, ...(route.data['seo'] ?? {}) };
      route = route.firstChild!;
    }
    return seo;
  }

  private apply(seo: SeoData, url: string) {
    const canonical = canonicalUrl(url);

    if (seo.title) {
      this.title.setTitle(seo.title);
      this.meta.updateTag({ property: 'og:title', content: seo.title });
      this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    }
    if (seo.description) {
      this.meta.updateTag({ name: 'description', content: seo.description });
      this.meta.updateTag({ property: 'og:description', content: seo.description });
      this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    }

    const robots = robotsDirective(seo);
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ name: 'bingbot', content: robots });

    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.meta.updateTag({ property: 'og:image', content: SOCIAL_IMAGE.url });
    this.meta.updateTag({ property: 'og:image:width', content: String(SOCIAL_IMAGE.width) });
    this.meta.updateTag({ property: 'og:image:height', content: String(SOCIAL_IMAGE.height) });
    this.meta.updateTag({ property: 'og:image:alt', content: SOCIAL_IMAGE.alt });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: SOCIAL_IMAGE.url });
    this.meta.updateTag({ name: 'twitter:image:alt', content: SOCIAL_IMAGE.alt });

    // A canonical URL on a noindex page (like the 404 page) sends search
    // engines conflicting signals, so it's left out there
    if (seo.noindex) {
      this.document.head.querySelector('link[rel="canonical"]')?.remove();
    } else {
      this.headElement('link[rel="canonical"]', 'link', (link) => link.setAttribute('rel', 'canonical'))
        .setAttribute('href', canonical);
    }
  }

  // Opens the connection to the API while the page loads, ahead of the first
  // request. crossorigin matches the CORS mode of HttpClient's requests, or the
  // browser can't reuse the connection. scripts/csp-sources.mjs also reads this
  // link back from the pre-rendered page to allow the API in nginx's CSP.
  private setApiPreconnect() {
    if(!SITE.apiUrl.startsWith('http'))
      return;
    this.headElement('link#api-preconnect', 'link', (link) => {
      link.id = 'api-preconnect';
      link.setAttribute('rel', 'preconnect');
      link.setAttribute('crossorigin', '');
    }).setAttribute('href', new URL(SITE.apiUrl).origin);
  }

  // The navbar logo loads from the CDN on every page. scripts/csp-sources.mjs
  // also reads this link back to allow the CDN in nginx's CSP.
  private setCdnPreconnect() {
    if (!SITE.cdnUrl.startsWith('http'))
      return;
    this.headElement('link#cdn-preconnect', 'link', (link) => {
      link.id = 'cdn-preconnect';
      link.setAttribute('rel', 'preconnect');
    }).setAttribute('href', new URL(SITE.cdnUrl).origin);
  }

  private setIcons() {
    const icons = [
      { id: 'icon-png', rel: 'icon', href: SITE.cdnAsset('toab-jitsi-icon-48x48.png'), sizes: '48x48', type: 'image/png' },
      { id: 'apple-touch-icon', rel: 'apple-touch-icon', href: SITE.cdnAsset('toab-jitsi-icon-180x180.png') },
    ];
    for (const { id, rel, href, sizes, type } of icons) {
      const link = this.headElement(`link#${id}`, 'link', (link) => {
        link.id = id;
        link.setAttribute('rel', rel);
        if (sizes) link.setAttribute('sizes', sizes);
        if (type) link.setAttribute('type', type);
      });
      link.setAttribute('href', href);
    }
  }

  private setStructuredData() {
    this.headElement('script#structured-data', 'script', (script) => {
      script.id = 'structured-data';
      script.type = 'application/ld+json';
    }).textContent = JSON.stringify(structuredData());
  }

  /**
   * Returns the head element matching the selector, creating it with `init`
   * when missing. Reusing the element keeps hydration and repeated calls from
   * adding duplicates of what pre-rendering already put in the page.
   */
  private headElement<K extends keyof HTMLElementTagNameMap>(
    selector: string,
    tag: K,
    init: (element: HTMLElementTagNameMap[K]) => void
  ): HTMLElementTagNameMap[K] {
    const existing = this.document.head.querySelector<HTMLElementTagNameMap[K]>(selector);
    if (existing) {
      return existing;
    }
    const element = this.document.createElement(tag);
    init(element);
    this.document.head.appendChild(element);
    return element;
  }
}

function canonicalUrl(url: string): string {
  const path = url.split(/[?#]/)[0];
  return SITE.url + (path === '/' ? '/' : path.replace(/\/$/, ''));
}

function robotsDirective(seo: SeoData): string {
  if (!environment.indexable) {
    return 'noindex, nofollow';
  }
  return seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large';
}

function structuredData() {
  const organizationId = `${SITE.url}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'TOAB',
        legalName: SITE.legalName,
        url: `${SITE.url}/`,
        logo: LOGO,
        email: SITE.contactEmail,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        name: SITE.name,
        alternateName: SITE.alternateNames,
        url: `${SITE.url}/`,
        inLanguage: 'en',
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE.name,
        alternateName: SITE.alternateNames,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Video conferencing',
        operatingSystem: 'Web',
        url: `${SITE.url}/`,
        image: SOCIAL_IMAGE.url,
        description: SITE.description,
        featureList: [
          'Adds a Jitsi Meet link to Google Calendar events',
          'Adds a Jitsi Meet link to Cal.com bookings',
          'Curated public Jitsi servers, including meet.jit.si',
          'Automatically generated unique room names',
          'Bring your own self-hosted Jitsi server (coming soon)',
          'Microsoft Outlook add-in (coming soon)',
        ],
        publisher: { '@id': organizationId },
      },
    ],
  };
}
