/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — the only file you need to edit to rebrand.
 *  Change the name, contact info and socials here; the whole
 *  site (navbar, footer, login, admin, SEO, contact, booking
 *  panels) updates automatically.
 * ─────────────────────────────────────────────────────────────
 */
export const SITE = {
  /** Short brand word shown in the logo (big word) */
  name: 'Ascent',
  /** Second word shown beneath the logo */
  line: 'Himalaya',
  /** Full display name used in text, SEO and toasts */
  fullName: 'Ascent Himalaya',
  /** Legal entity for the footer copyright line */
  legalName: 'Ascent Himalaya Trekking Pvt. Ltd.',
  /** Browser tab default (overridden per page via useSeo) */
  defaultTitle: 'Ascent Himalaya — Treks, Tours & Expeditions in the Himalaya',

  email: 'hello@ascenthimalaya.com',
  adminEmail: 'admin@ascenthimalaya.com',

  phoneDisplay: '+977 1 4412 345',
  phoneHref: 'tel:+97714412345',
  whatsappDisplay: '+977 98510 41234',
  whatsappHref: 'https://wa.me/9779851041234',

  addressLine1: 'Tridevi Marg, Thamel',
  addressLine2: 'Kathmandu 44600, Nepal',
  officeHours: 'Sun–Fri, 9:00–18:00 NPT',

  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    pinterest: 'https://pinterest.com',
  },

  /**
   * Where inquiry / booking notification emails are delivered.
   * Set VITE_NOTIFY_EMAIL to override without touching code.
   */
  notifyEmail: import.meta.env.VITE_NOTIFY_EMAIL || 'hello@ascenthimalaya.com',
} as const;

/**
 * Web3Forms access key (free) — enables real email delivery of every
 * booking & inquiry straight to the admin inbox, with no backend.
 * Get a key at https://web3forms.com  →  put it in .env as
 * VITE_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? '';
export const emailDeliveryReady = WEB3FORMS_KEY.length > 10;
