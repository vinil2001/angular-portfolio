import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class Portfolio {
    private projects$ = new BehaviorSubject<Project[]>([]);

  //Get all projects
  getProjects() {
    return this.projects$.asObservable();
  }

  //Add project
  addProject (project: Omit<Project, 'id'>) {
    const newProject: Project = {
      ...project,
      id: Date.now()
    };
    const current = this.projects$.value;
    this.projects$.next([...current, newProject]);
  }

  constructor() {
    this.loadDefaultProjects();
  }

  private loadDefaultProjects(): void {
    const defaultProjects: Project[] = [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with Angular and .NET Core',
        icon: '🛒',
        link: 'https://example.com',
        technologies: ['Angular', '.NET Core', 'SQL Server', 'Azure'],
        featured: true,
        images: [
          'https://picsum.photos/400/300?random=1',
          'https://picsum.photos/400/300?random=2',
          'https://picsum.photos/400/300?random=3'
        ]
      },
      {
        id: 2,
        title: 'Task Management System',
        description: 'Real-time task management application with team collaboration features',
        icon: '📋',
        link: 'https://example.com',
        technologies: ['Angular', 'SignalR', 'Entity Framework', 'PostgreSQL'],
        images: [
          'https://picsum.photos/400/300?random=4',
          'https://picsum.photos/400/300?random=5'
        ]
      },
      {
        id: 3,
        title: 'Weather Dashboard',
        description: 'Modern weather dashboard with forecasting and location-based services',
        icon: '�️',
        link: '#',
        technologies: ['Angular', 'REST API', 'Chart.js', 'OpenWeather API'],
        images: [
          'https://picsum.photos/400/300?random=6'
        ]
      },
      {
        id: 4,
        title: 'Blog Platform',
        description: 'Content management system with markdown support and SEO optimization',
        icon: '📝',
        link: '#',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Express'],
        images: [
          'https://picsum.photos/400/300?random=7',
          'https://picsum.photos/400/300?random=8',
          'https://picsum.photos/400/300?random=9'
        ]
      },
      {
        id: 5,
        title: 'Social Media Analytics',
        description: 'Analytics dashboard for social media metrics and insights',
        icon: '📊',
        link: '#',
        technologies: ['Angular', 'D3.js', 'Python', 'Flask'],
        images: [
          'https://picsum.photos/400/300?random=10',
          'https://picsum.photos/400/300?random=11'
        ]
      },
      {
        id: 6,
        title: 'Video Streaming Platform',
        description: 'Video streaming service with user authentication and recommendations',
        icon: '🎬',
        link: '#',
        technologies: ['Angular', 'AWS', 'Node.js', 'Redis'],
        images: [
          'https://picsum.photos/400/300?random=12',
          'https://picsum.photos/400/300?random=13',
          'https://picsum.photos/400/300?random=14',
          'https://picsum.photos/400/300?random=15'
        ]
      }
    ];
    
    this.projects$.next(defaultProjects);
  }

}
