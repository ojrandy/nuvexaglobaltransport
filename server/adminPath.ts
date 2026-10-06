// The admin console lives at <DOMAIN><ADMIN_PATH>/, served by the same Node app as the public
// site (one Hostinger app, no subdomain). Server-only on purpose: the browser never receives
// this string — the server marks the page it serves there (see index.ts) — so it can't be read
// from the public JS bundle, robots.txt or the sitemap. ADMIN_PATH in the environment overrides
// the default. Read lazily, because dotenv only loads .env after the imports have run.
const DEFAULT_ADMIN_PATH = '/private-user';

export function adminPath(): string {
  const trimmed = (process.env.ADMIN_PATH || '').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : DEFAULT_ADMIN_PATH;
}

// Exact match only: "<path>" or "<path>/".
export function isAdminPath(urlPath: string): boolean {
  const base = adminPath();
  return urlPath === base || urlPath === `${base}/`;
}
