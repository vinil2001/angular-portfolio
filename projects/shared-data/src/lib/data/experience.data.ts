import { Experience } from '../models/experience.model';

/**
 * Work experience, newest first.
 * Single source of truth — reused by the portfolio Experience section and
 * intended to feed the CV / PDF export as well.
 */
export const EXPERIENCE: Experience[] = [
  {
    role: 'Senior Full Stack .NET Developer',
    company: 'SOLVVE',
    employmentType: 'Full-time',
    start: 'Apr 2026',
    end: 'Present',
    current: true,
    location: 'Dnipro, Ukraine',
    locationType: 'Remote',
    summary:
      'Developing enterprise headless Umbraco and multisite solutions across the full stack — ' +
      'backend services, APIs and Azure integrations with ASP.NET Core, plus responsive ' +
      'frontends with Next.js and modern JavaScript.',
    highlights: [
      'Design and build backend services, APIs and Azure integrations with ASP.NET Core.',
      'Develop responsive frontend applications with Next.js and modern JavaScript.',
      'Architecture collaboration, code reviews and ongoing performance improvements.',
      'Use AI tools like Claude to streamline development and maintain high code quality.',
    ],
    skills: ['ASP.NET Core', 'Umbraco', 'Azure', 'Next.js', 'Node.js', 'TypeScript'],
  },
  {
    role: 'Full Stack .NET Umbraco Developer',
    company: 'Volkorn',
    employmentType: 'Full-time',
    start: 'Nov 2025',
    end: 'Apr 2026',
    location: 'Manchester, UK',
    locationType: 'Remote',
    summary:
      'Full Stack .NET / Umbraco Developer on “Food – a Fact of Life” (British Nutrition ' +
      'Foundation) — a nationwide educational platform supporting food and nutrition ' +
      'education for schools across the UK.',
    highlights: [
      'Built custom Umbraco components, data types and content structures (Umbraco 10–13, .NET 6–8).',
      'Implemented full-stack features with C#, Razor, APIs, Azure services and front-end technologies.',
      'Improved performance, accessibility and reliability for high-volume educational use.',
      'Delivered new modules and refactored legacy components for long-term scalability.',
    ],
    skills: ['.NET 8', 'Umbraco', 'C#', 'SQL Server', 'Azure', 'uSkinned'],
  },
];
