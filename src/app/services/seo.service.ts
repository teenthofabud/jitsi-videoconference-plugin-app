import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';

const SITE_URL = environment.siteUrl.replace(/\/$/, '');
const SITE_NAME = 'TOAB Jitsi';
const CDN_URL = environment.cdnUrl.replace(/\/$/, '');
const API_ORIGIN = new URL(environment.apiUrl).origin;
const DEFAULT_IMAGE = `${CDN_URL}/toab-jitsi-logo-cropped.jpg`;
const FAVICON = `${CDN_URL}/toab-jitsi-logo-favicon-320x120.jpg`;

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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { }

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
    const path = url.split(/[?#]/)[0];
    const canonical = SITE_URL + (path === '/' ? '/' : path.replace(/\/$/, ''));

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

    const robots = !environment.indexable
      ? 'noindex, nofollow'
      : seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large';
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ name: 'bingbot', content: robots });

    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });

    this.setCanonical(canonical);
  }

  private setFavicon() {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'icon');
      this.document.head.appendChild(link);
    }
    link.setAttribute('type', 'image/jpeg');
    link.setAttribute('href', FAVICON);
  }

  // Opens the connection to the API while the page loads, ahead of the first
  // request. crossorigin matches the CORS mode of HttpClient's requests, or the
  // browser can't reuse the connection. scripts/csp-sources.mjs also reads this
  // link back from the pre-rendered page to allow the API in nginx's CSP.
  private setApiPreconnect() {
    let link = this.document.head.querySelector<HTMLLinkElement>('link#api-preconnect');
    if (!link) {
      link = this.document.createElement('link');
      link.id = 'api-preconnect';
      link.setAttribute('rel', 'preconnect');
      link.setAttribute('crossorigin', '');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', API_ORIGIN);
  }

  private setCanonical(href: string) {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setStructuredData() {
    const organizationId = `${SITE_URL}/#organization`;
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': organizationId,
          name: 'TOAB',
          legalName: 'Das Software',
          url: `${SITE_URL}/`,
          logo: DEFAULT_IMAGE,
          email: 'anirban.das@t-online.de',
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: 'en',
          publisher: { '@id': organizationId },
        },
        {
          '@type': 'SoftwareApplication',
          name: 'TOAB Jitsi Calendar Plugin',
          applicationCategory: 'BusinessApplication',
          applicationSubCategory: 'Video conferencing',
          operatingSystem: 'Web',
          url: `${SITE_URL}/`,
          description: 'Calendar plugin that adds Jitsi Meet video conferencing to Google Calendar, Outlook and Cal.com, using your own self-hosted Jitsi server or a curated public Jitsi server.',
          publisher: { '@id': organizationId },
        },
      ],
    };

    // Reuse the pre-rendered element on hydration instead of adding a second one
    let script = this.document.head.querySelector<HTMLScriptElement>('script#structured-data');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
