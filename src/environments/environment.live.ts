export const environment = {
  apiUrl: 'https://api.toab-jitsi.com',
  // Cloudflare redirects www to the apex domain, so canonical URLs, the sitemap and
  // IndexNow must use the apex or crawlers are sent to redirecting URLs
  siteUrl: 'https://toab-jitsi.com',
  cdnUrl: 'https://toab-jitsi-cdn-live-414772275073-eu-central-1-an.s3.eu-central-1.amazonaws.com',
  indexable: true
};
