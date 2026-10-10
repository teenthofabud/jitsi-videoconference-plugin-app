import { RenderMode, ServerRoute } from '@angular/ssr';

// Pre-render every public page to static HTML at build time so crawlers that
// execute little or no JavaScript (Bingbot, which also feeds DuckDuckGo) see
// the full content and meta tags without needing to run the Angular bundle.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'install', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
