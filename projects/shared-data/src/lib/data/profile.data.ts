/**
 * Profile data — the values themselves live in `profile.json` so they can be
 * consumed by non-TypeScript tools too (e.g. the CV build script reads the
 * JSON directly with `fs`). This file adds typing on top.
 */
import profileData from './profile.json';

export interface ProfileLinks {
  linkedin: string;
  github: string;
  cv: string;
}

export interface ContactConfig {
  /**
   * Formspree endpoint (https://formspree.io/f/XXXXXXX). Leave empty to keep the
   * form as a visual mock; ContactComponent will show a friendly "configure me"
   * message instead of attempting to POST.
   */
  formspreeEndpoint: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  email: string;
  /** Digits only (for `tel:` links). */
  phone: string;
  /** Formatted for display. */
  phoneDisplay: string;
  location: string;
  availability: string;
  /** Document title shown in the browser tab and used by social previews. */
  pageTitle: string;
  metaDescription: string;
  /** Core technologies shown as chips on the home page. */
  stack: string[];
  links: ProfileLinks;
  contact: ContactConfig;
}

export const PROFILE: Profile = profileData as Profile;
