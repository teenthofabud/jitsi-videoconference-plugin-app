import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { SITE } from '../config/site';

const DEFAULT_IMAGE = SITE.cdnAsset('toab-jitsi-logo-cropped.jpg');
const FAVICON = SITE.cdnAsset('toab-jitsi-logo-favicon-320x120.jpg');

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
 * are indexable. The favicon and the API preconnect are set here too, since
 * index.html can't vary by environment.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  init() {
    this.setFavicon();
    this.setApiPreconnect();
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
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });

    this.headElement('link[rel="canonical"]', 'link', (link) => link.setAttribute('rel', 'canonical'))
      .setAttribute('href', canonical);
  }

  private setFavicon() {
    const link = this.headElement('link[rel="icon"]', 'link', (link) => link.setAttribute('rel', 'icon'));
    link.setAttribute('type', 'image/jpeg');
    link.setAttribute('href', FAVICON);
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
        legalName: 'Das Software',
        url: `${SITE.url}/`,
        logo: DEFAULT_IMAGE,
        email: SITE.contactEmail,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        name: SITE.name,
        url: `${SITE.url}/`,
        inLanguage: 'en',
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE.name,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Video conferencing',
        operatingSystem: 'Web',
        url: `${SITE.url}/`,
        description: 'Calendar plugin that adds Jitsi Meet video conferencing to Google Calendar and Cal.com, using curated public Jitsi servers.',
        publisher: { '@id': organizationId },
      },
    ],
  };
}
