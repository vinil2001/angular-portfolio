import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project, PROJECTS } from 'shared-data';

/**
 * Serves portfolio projects from a static source (see projects.data.ts).
 * Returns observables so the components stay reactive and the data source
 * can later be swapped for an API without touching the UI.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  getProjects(): Observable<Project[]> {
    return of(PROJECTS);
  }

  getProject(id: string): Observable<Project | undefined> {
    return of(PROJECTS.find(p => p.id === id));
  }
}
