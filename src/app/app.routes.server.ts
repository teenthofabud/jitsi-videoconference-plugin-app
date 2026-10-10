import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes } from './app-routing.module';

// Pre-render every public page to static HTML at build time so crawlers that
// execute little or no JavaScript (Bingbot, which also feeds DuckDuckGo) see
// the full content and meta tags without needing to run the Angular bundle.
// Pages are the routes with a component; redirects fall through to the client.
export const serverRoutes: ServerRoute[] = [
  ...routes
    .filter((route) => route.component)
    .map((route) => ({ path: route.path!, renderMode: RenderMode.Prerender as const })),
  { path: '**', renderMode: RenderMode.Client },
];
