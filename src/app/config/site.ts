import { environment } from '../../environments/environment';

const withoutTrailingSlash = (url: string) => url.replace(/\/$/, '');
const cdnUrl = withoutTrailingSlash(environment.cdnUrl);

// Read these as SITE.<key> rather than destructuring into class fields: the
// unit-test bundle initializes shared modules lazily, and Vite snapshots a
// field initialized with a bare imported name before that happens.
export const SITE = {
  name: 'TOAB Jitsi Plugin',
  contactEmail: 'anirban.das@t-online.de',
  url: withoutTrailingSlash(environment.siteUrl),
  apiUrl: environment.apiUrl,
  cdnAsset: (file: string) => `${cdnUrl}/${file}`,
} as const;
