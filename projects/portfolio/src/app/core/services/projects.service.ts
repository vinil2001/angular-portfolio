import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Project, PROJECTS } from 'shared-data';

/**
 * Serves portfolio projects by fetching `projects.json` at runtime (so edits
 * made via the admin take effect after a redeploy without recompiling the app)
 * and sorting by `order`. Falls back to the compiled-in snapshot (PROJECTS)
 * if the fetch fails. The result is shared so list + detail views reuse one
 * request.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private static readonly URL = 'projects.json';

  private readonly http = inject(HttpClient);

  private readonly projects$: Observable<Project[]> = this.http
    .get<Project[]>(ProjectsService.URL)
    .pipe(
      catchError(() => of(PROJECTS)),
      map(list => [...list].sort((a, b) => a.order - b.order)),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProject(id: string): Observable<Project | undefined> {
    return this.projects$.pipe(map(list => list.find(p => p.id === id)));
  }
}
