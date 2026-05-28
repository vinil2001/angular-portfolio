export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  employmentType: string;
  /** Human-readable start, e.g. "Apr 2026" */
  start: string;
  /** Human-readable end, e.g. "Present" */
  end: string;
  location: string;
  locationType: string;
  summary: string;
  highlights: string[];
  skills: string[];
  current?: boolean;
}
