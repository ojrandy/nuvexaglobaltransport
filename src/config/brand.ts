// Single source of truth for Nuvexa Global Transport brand facts (CLAUDE.md §1, BRAND_GUIDE.md).
// Import from here instead of hard-coding names, emails, domains or prefixes in components.
//
// Contact values left as '' are not known yet. UI that would show them must hide itself
// (see useCompanyContact). Never fill these with made-up numbers or addresses.

export const COMPANY = 'Nuvexa Global Transport';
export const COMPANY_SHORT = 'Nuvexa';
export const LEGAL_NAME = 'Nuvexa Global Transport Ltd';
// Written as on the logo artwork.
export const TAGLINE = 'Faster • Safer • Further';

export const EMAIL = 'info@nuvexaglobaltransport.com';
export const DOMAIN = 'nuvexaglobaltransport.com';
export const SITE_URL = `https://${DOMAIN}`;

// Logo files in Public/brand (BRAND_GUIDE §6). Full colour on light surfaces, white on Ink.
export const LOGO = '/brand/ngt-logo.png';
export const LOGO_WHITE = '/brand/ngt-logo-white.png';
// Header and mobile drawer: no tagline line, which is unreadable at header height.
export const LOGO_HEADER = '/brand/ngt-logo-header.png';
export const LOGO_ALT = COMPANY;

// The admin console only opens on <ADMIN_SUBDOMAIN>.<DOMAIN> (plus localhost for development).
export const ADMIN_SUBDOMAIN = 'private';
export const ADMIN_HOST = `${ADMIN_SUBDOMAIN}.${DOMAIN}`;
export const ADMIN_CONSOLE_NAME = `${COMPANY_SHORT} Operations Console`;

// Role label shown in the admin UI (CONTENT §10), also written as the operator on new records.
export const ADMIN_ROLE_LABEL = 'Administrator';
// Records created before the rebrand store the operator as "Super Admin". They're left as
// stored (audit history is not rewritten); the UI shows the current label instead.
export function displayOperator(operator?: string | null): string {
  return !operator || operator === 'Super Admin' ? ADMIN_ROLE_LABEL : operator;
}
// Public-facing desk names (REBRAND_MAP §1, CONTENT §10).
export const OPERATIONS_CENTRE = `${COMPANY_SHORT} Operations Centre`;
export const INTAKE_DESK = `${COMPANY_SHORT} Intake Desk`;

// Tracking ID = prefix + 5 characters, 8 total (BRAND_GUIDE §7), e.g. NGT7K2M9. Reference
// numbers (src/shared/references.ts) are built from the same prefix.
export const TRACKING_PREFIX = 'NGT';

// TBD: supplied by the owner.
export const PHONE = '';
export const WHATSAPP = '';
export const HQ_ADDRESS = '';

export const SOCIAL = {
  facebook: '',
  x: '',
  instagram: '',
  linkedin: '',
  youtube: '',
};

export type SocialNetwork = keyof typeof SOCIAL;
