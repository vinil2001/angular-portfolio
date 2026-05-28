import { Project } from '../models/project.model';

/**
 * Portfolio projects — single source of truth.
 * Edit this file to add/update/remove projects (no backend required).
 * Replace the sample entries below with your real work.
 */
export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with an Angular storefront and a .NET Core API.',
    technologies: ['Angular', '.NET Core', 'SQL Server', 'Azure'],
    featured: true,
    images: [
      'https://picsum.photos/640/400?random=1',
      'https://picsum.photos/640/400?random=2',
      'https://picsum.photos/640/400?random=3'
    ]
  },
  {
    id: '2',
    title: 'Task Management System',
    description: 'Real-time task management application with team collaboration features.',
    technologies: ['Angular', 'SignalR', 'Entity Framework', 'PostgreSQL'],
    images: [
      'https://picsum.photos/640/400?random=4',
      'https://picsum.photos/640/400?random=5'
    ]
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Modern weather dashboard with forecasting and location-based services.',
    technologies: ['Angular', 'REST API', 'Chart.js', 'OpenWeather API'],
    images: ['https://picsum.photos/640/400?random=6']
  },
  {
    id: '4',
    title: 'Blog Platform',
    description: 'Content management system with markdown support and SEO optimisation.',
    technologies: ['Angular', 'Node.js', 'MongoDB', 'Express'],
    images: [
      'https://picsum.photos/640/400?random=7',
      'https://picsum.photos/640/400?random=8'
    ]
  },
  {
    id: '5',
    title: 'Social Media Analytics',
    description: 'Analytics dashboard for social-media metrics and insights.',
    technologies: ['Angular', 'D3.js', 'Python', 'Flask'],
    images: [
      'https://picsum.photos/640/400?random=10',
      'https://picsum.photos/640/400?random=11'
    ]
  },
  {
    id: '6',
    title: 'Video Streaming Platform',
    description: 'Video streaming service with user authentication and recommendations.',
    technologies: ['Angular', 'AWS', 'Node.js', 'Redis'],
    images: [
      'https://picsum.photos/640/400?random=12',
      'https://picsum.photos/640/400?random=13'
    ]
  }
];
