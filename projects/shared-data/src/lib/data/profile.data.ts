/**
 * Single source of truth for personal / profile data used across the site.
 * Edit values here — components and the document title/meta tags pick them up.
 */
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

export const PROFILE: Profile = {
  name: 'Andrii Boiko',
  role: 'Full-Stack .NET Developer',
  tagline: 'Umbraco, Azure & modern web.',
  email: 'andriiboiko.vn@gmail.com',
  phone: '+380675081588',
  phoneDisplay: '+380 67 508 15 88',
  location: 'Kyiv, Ukraine · Remote',
  availability: 'Available for new projects',
  pageTitle: 'Andrii Boiko — Full-Stack .NET Developer',
  metaDescription:
    'Andrii Boiko — Full-Stack .NET developer specialising in Umbraco, Azure and modern web. Portfolio, experience and projects.',
  stack: ['.NET', 'C#', 'Umbraco', 'Azure', 'ASP.NET Core', 'Next.js', 'Angular', 'TypeScript'],
  links: {
    linkedin: 'https://www.linkedin.com/in/andrii-boiko-9908066b/',
    github: 'https://github.com/vinil2001',
    cv: 'https://vinil2001.github.io/cv-andrii-boiko/'
  },
  contact: {
    // Paste your Formspree endpoint here, e.g. 'https://formspree.io/f/xxxxxxx'
    formspreeEndpoint: ''
  }
};
