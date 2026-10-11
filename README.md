# TOAB Jitsi Plugin — Website

The public website for **TOAB Jitsi Plugin**, an add-on that brings Jitsi Meet video conferencing to Google Calendar, Microsoft Outlook and Cal.com events.

The site is an Angular 21 app that is **pre-rendered to static HTML** at build time, so search engines see the full content and meta tags without running JavaScript. It ships either to an S3 bucket behind Cloudflare, or as an nginx Docker image.

## ✨ Pages

| Route      | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| `/`        | Home: features, how it works, Google OAuth scopes, list of public Jitsi servers |
| `/install` | How to install for Google Calendar, Microsoft Outlook and Cal.com           |
| `/contact` | Contact details and the sign-up form for the preview access list            |
| `/privacy` | Privacy policy (content in `src/assets/data/privacy.json`)                  |
| `/terms`   | Terms and conditions (content in `src/assets/data/terms.json`)              |

`/home` redirects to `/`. Any unknown path also redirects to `/`.

The app calls two backend endpoints on the environment's `apiUrl`:

- `GET  /api/servers/default`: the list of curated public Jitsi servers. If it fails, the home page shows the fallback list in `src/app/pages/home/home.content.ts`.
- `POST /api/users/preview`: adds an email address to the preview access list.

## 🧰 Tech stack

- **Angular 21** with `@angular/ssr` in static output mode (every routed page is pre-rendered; see `src/app/app.routes.server.ts`)
- **Tailwind CSS v4** with **Spartan NG** (`@spartan-ng/brain` + helm components in `libs/ui`, imported as `@spartan-ng/helm`)
- **Lucide icons** via `@ng-icons`
- **Vitest** + jsdom for unit tests, run through `ng test`
- **nginx** (unprivileged) for the Docker image

## 📁 Project structure

```
src/
  app/
    components/     navbar, footer, legal-page, contact-consent
    pages/          home, install, contact, privacy, terms
    services/       jitsi-server, preview-access, seo, notification
    config/site.ts  site name, contact email, URLs (built from the environment)
    app-routing.module.ts   routes plus per-page SEO title and description
  assets/           images and legal page JSON
  environments/     environment.ts (default), .local, .dev, .live
  styles/theme.css  Tailwind theme tokens and Spartan preset
libs/ui/            Spartan helm components (badge, button, card, input, separator, sonner, table)
scripts/            post-build scripts (SEO files and CSP hashes)
ci/                 local scripts to build the Docker image
nginx.conf          nginx config used in the Docker image
deploy.js           script that uploads a build to S3 or MinIO
```

## 📦 Getting started

Requires Node.js 24 (the version CI uses).

```bash
git clone <repository-url>
cd jitsi-videoconference-plugin-app
npm install
npm start
```

Open `http://localhost:4200/`. `npm start` serves the `dev` configuration by default. To use a different one:

```bash
npx ng serve --configuration local
```

## 🌍 Environments

Every environment-specific value lives in `src/environments/environment.<env>.ts` and is baked in at build time. Nothing is read at runtime.

| Config    | File                     | `siteUrl`                   | `apiUrl`                       | Indexable |
|-----------|--------------------------|-----------------------------|--------------------------------|-----------|
| (default) | `environment.ts`         | `http://localhost:4200`     | `http://localhost:8080`        | no        |
| `local`   | `environment.local.ts`   | `http://localhost:4200`     | same origin                    | no        |
| `dev`     | `environment.dev.ts`     | `https://jitsi.dpdns.org`   | `https://api.jitsi.dpdns.org`  | no        |
| `live`    | `environment.live.ts`    | `https://www.toab-jitsi.com`| `https://api.toab-jitsi.com`   | yes       |

Each environment also sets a `cdnUrl` (the S3 bucket that serves the favicon and images). Only `live` is indexable, so the QA site never competes with production in search results.

## 🏗️ Build

```bash
npm run build        # live (the default build configuration)
npm run build:dev    # dev
npm run build:live   # live
```

Output goes to `dist/toab-jitsi-website/`:

- `browser/`: the static site. It contains `index.html` (home), `<route>/index.html` for each pre-rendered page, and `index.csr.html` (the app shell used for any other path).
- `nginx/csp-sources.conf`: the build-specific parts of the Content-Security-Policy.

After each build, two post-build scripts run automatically:

- `scripts/seo-postbuild.mjs` writes `robots.txt`. For indexable builds it also writes `sitemap.xml` (with `<lastmod>` taken from each page's last git commit) and the IndexNow key file.
- `scripts/csp-sources.mjs` hashes the inline scripts and event handlers in the pre-rendered pages and reads the CDN and API origins back from them. nginx includes the result, so the CSP always matches the build.

Both scripts read values from the pre-rendered `index.html`, so the environment file stays the single source of truth.

### Building for a sub-path (e.g. floci.io)

Angular sets the base href to `/`, so scripts and styles don't load when the site is served from a bucket sub-path, as when testing locally with floci.io. Set `BASE_HREF` to the bucket path and use the local build:

```bash
export BASE_HREF=/<bucket-name>/
npm run local-build
```

A real AWS S3 static website serves from the root and doesn't need this.

## 🧪 Testing

```bash
npm test                     # watch mode
npm test -- --watch=false    # single run, as in CI
```

## 🚀 Deployment

### AWS S3 + Cloudflare (GitHub Actions)

`.github/workflows/deploy.yaml` is triggered manually (`workflow_dispatch`) with two inputs: the environment (`dev` or `live`) and whether to purge the Cloudflare cache. It:

1. Installs dependencies, runs the unit tests and builds with `--configuration <env>`.
2. Assumes an AWS IAM role through GitHub OIDC and syncs `dist/toab-jitsi-website/browser` to the environment's bucket:
   - Hashed assets are cached for a year.
   - HTML files are uploaded with `no-cache`.
   - Each pre-rendered route is also uploaded as an extension-less object (`privacy/index.html` → `privacy`), so `/privacy` returns a 200 without a redirect.
   - `robots.txt` and `sitemap.xml` are cached for an hour. `sitemap.xml` is removed for non-indexable builds.
3. Optionally purges the Cloudflare cache. The token and zone ID come from Bitwarden Secrets Manager.
4. For indexable builds, sends the sitemap URLs to IndexNow (Bing, DuckDuckGo, Yandex and others).

### Docker (nginx)

Build the site first, then the image. The `ci/` scripts do both and build for `linux/amd64` and `linux/arm64`:

```bash
sh ci/build-dev.sh     # npm test, npm run build:dev, then docker buildx (tag :X-dev)
sh ci/build-live.sh    # npm test, npm run build:live, then docker buildx (tag :X-live)
```

The image is based on `nginxinc/nginx-unprivileged` and runs as a non-root user. nginx listens on:

- `8080`: plain HTTP that only redirects to HTTPS
- `8443`: HTTPS

It serves the pre-rendered pages with `try_files $uri $uri/index.html /index.csr.html`, exposes `GET /health`, and sends HSTS, CSP, `X-Frame-Options` and other security headers.

The TLS certificate and key are **not** baked into the image. Mount them read-only at `/etc/nginx/tls` as `example.com+5.pem` and `example.com+5-key.pem`:

```bash
docker run -p 8443:8443 -v "$PWD/tls:/etc/nginx/tls:ro" ghcr.io/teenthofabud/jitsi-videoconference-plugin-app:X-dev
```

The image needs no environment variables.

### S3 / MinIO with `deploy.js`

`deploy.js` uploads a local build to any S3-compatible endpoint, sets content types, and by default deletes remote files that aren't in the build. Without credentials in the environment it uses the MinIO defaults (`minioadmin` / `minioadmin`).

It uploads `dist/toab-jitsi-website/browser` unless you pass `--path`:

```bash
npm run deploy             # MinIO at http://localhost:9000, bucket "test"
npm run deploy:aws         # AWS S3, bucket "test"
npm run build-and-deploy   # live build, then deploy to MinIO
node deploy.js --endpoint https://s3.amazonaws.com --bucket <bucket>
node deploy.js --help
```

Add `--no-delete` to keep remote files that aren't in the build.

For a local MinIO bucket, allow public reads and enable static website hosting in the MinIO Console (`http://localhost:9001`):

```bash
aws s3api put-bucket-policy --bucket test --endpoint-url http://localhost:9000 \
  --policy '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::test/*"}]}'
```

The site is then at `http://localhost:9000/test/index.html`.

## 🔧 Development

### Adding a page

1. Create the component under `src/app/pages/`.
2. Add a route with a `data.seo` title and description in `src/app/app-routing.module.ts`. Every route with a component is pre-rendered automatically and added to the sitemap.

### Adding UI components

Spartan helm components live in `libs/ui` (configured in `components.json`). Add more with the Spartan CLI:

```bash
npx ng g @spartan-ng/cli:ui
```

### Theming

Colors and fonts are Tailwind v4 `@theme` tokens in `src/styles/theme.css`.

### Site-wide settings

The site name, contact email and URL helpers are in `src/app/config/site.ts`.

## 📝 License

MIT License
