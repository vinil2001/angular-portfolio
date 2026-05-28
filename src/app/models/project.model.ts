export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images?: string[];
  /** External live URL. Omit (or '#') to hide the "view live" action. */
  link?: string;
  githubUrl?: string;
  featured?: boolean;
}
