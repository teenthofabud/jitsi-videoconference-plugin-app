import { environment } from '../../environments/environment';

const withoutTrailingSlash = (url: string) => url.replace(/\/$/, '');
const cdnUrl = withoutTrailingSlash(environment.cdnUrl);

// Read these as SITE.<key> rather than destructuring into class fields: the
// unit-test bundle initializes shared modules lazily, and Vite snapshots a
// field initialized with a bare imported name before that happens.
export const SITE = {
  name: 'TOAB Jitsi Plugin',
  // Names the product appears under in calendars and app stores
  alternateNames: ['TOAB Jitsi', 'TOAB Jitsi Addon', 'TOAB Jitsi App'],
  // Summary shared by the home page meta description and structured data
  description:
    'TOAB Jitsi Plugin adds Jitsi Meet video meetings to Google Calendar events and Cal.com bookings ' +
    'using curated public Jitsi servers. Outlook is coming soon.',
  // Registered company that operates the site, named in the terms and structured data
  legalName: 'TOAB SOFTWARE TECHNOLOGIES (OPC) PRIVATE LIMITED',
  contactEmail: 'anirban.das@t-online.de',
  url: withoutTrailingSlash(environment.siteUrl),
  apiUrl: environment.apiUrl,
  cdnUrl,
  cdnAsset: (file: string) => `${cdnUrl}/${file}`,
} as const;
