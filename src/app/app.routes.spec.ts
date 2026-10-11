import { RenderMode } from '@angular/ssr';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { serverRoutes } from './app.routes.server';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { InstallComponent } from './pages/install/install.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

describe('App routes', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppRoutingModule] });
    router = TestBed.inject(Router);
  });

  it('maps each page path to its component with title and description', () => {
    const pages = router.config.filter((route) => route.component);
    expect(pages.map((route) => [route.path, route.component])).toEqual([
      ['', HomeComponent],
      ['privacy', PrivacyComponent],
      ['terms', TermsComponent],
      ['install', InstallComponent],
      ['contact', ContactComponent],
      ['notices', NoticesComponent],
      ['404', NotFoundComponent],
      ['**', NotFoundComponent],
    ]);
    for (const route of pages) {
      expect(route.data?.['seo'].title).toMatch(/TOAB Jitsi Plugin/);
      expect(route.data?.['seo'].description.length).toBeGreaterThan(20);
    }
  });

  it('redirects /home to the home page', () => {
    expect(router.config.find((route) => route.path === 'home')).toMatchObject({ redirectTo: '', pathMatch: 'full' });
  });

  it('shows the noindex not found page for unknown paths', () => {
    for (const path of ['404', '**']) {
      expect(router.config.find((route) => route.path === path)?.data?.['seo'].noindex).toBe(true);
    }
    expect(router.config.at(-1)?.path).toBe('**');
  });

  it('pre-renders every page and renders unknown paths on the client', () => {
    expect(serverRoutes).toEqual([
      { path: '', renderMode: RenderMode.Prerender },
      { path: 'privacy', renderMode: RenderMode.Prerender },
      { path: 'terms', renderMode: RenderMode.Prerender },
      { path: 'install', renderMode: RenderMode.Prerender },
      { path: 'contact', renderMode: RenderMode.Prerender },
      { path: 'notices', renderMode: RenderMode.Prerender },
      { path: '404', renderMode: RenderMode.Prerender },
      { path: '**', renderMode: RenderMode.Client },
    ]);
  });
});
