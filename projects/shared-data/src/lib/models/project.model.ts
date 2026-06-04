export interface Project {
  id: string;
  /** Display position in the portfolio grid (ascending). Managed by the admin. */
  order: number;
  title: string;
  description: string;
  technologies: string[];
  images?: string[];
  /** External live URL. Omit (or '#') to hide the "view live" action. */
  link?: string;
  githubUrl?: string;
  /** Demo/overview video. Accepts a YouTube watch, youtu.be or embed URL. */
  videoUrl?: string;
  featured?: boolean;
}
