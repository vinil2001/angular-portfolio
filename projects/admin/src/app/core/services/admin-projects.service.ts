import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Project } from 'shared-data';

/** The editable fields of a project (everything except the managed id/order). */
export type ProjectInput = Omit<Project, 'id' | 'order'>;

/**
 * Talks to the local admin API (tools/admin-api). During `ng serve` the `/api`
 * path is proxied to the .NET server (see proxy.conf.json), so relative URLs
 * work without CORS concerns.
 *
 * The backend only exposes "get full list" and "save full list" — create /
 * update / delete are expressed as a read-modify-write of that list, which the
 * server then re-normalises (order → contiguous 1..n).
 */
@Injectable({ providedIn: 'root' })
export class AdminProjectsService {
  private static readonly BASE = '/api/projects';
  private readonly http = inject(HttpClient);

  /** Full list, sorted by order (the API guarantees the ordering). */
  list(): Observable<Project[]> {
    return this.http.get<Project[]>(AdminProjectsService.BASE);
  }

  /** A single project by id (undefined if not found). */
  getOne(id: string): Observable<Project | undefined> {
    return this.list().pipe(map(list => list.find(p => p.id === id)));
  }

  /** Replace the entire list. The API normalises `order` to a contiguous 1..n. */
  saveAll(projects: Project[]): Observable<Project[]> {
    return this.http.put<Project[]>(AdminProjectsService.BASE, projects);
  }

  /** Append a new project (id auto-assigned, order placed last). */
  create(input: ProjectInput): Observable<Project[]> {
    return this.list().pipe(
      switchMap(list => {
        const project: Project = { id: nextId(list), order: list.length + 1, ...input };
        return this.saveAll([...list, project]);
      })
    );
  }

  /** Update an existing project in place (id and order preserved). */
  update(id: string, input: ProjectInput): Observable<Project[]> {
    return this.list().pipe(
      switchMap(list => {
        const next = list.map(p => (p.id === id ? { ...p, ...input, id, order: p.order } : p));
        return this.saveAll(next);
      })
    );
  }

  /** Remove a project by id. */
  remove(id: string): Observable<Project[]> {
    return this.list().pipe(switchMap(list => this.saveAll(list.filter(p => p.id !== id))));
  }

  /** Upload a single image for a project; resolves to the stored relative path. */
  uploadImage(id: string, file: File): Observable<{ path: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ path: string }>(`${AdminProjectsService.BASE}/${id}/image`, form);
  }
}

/** Next free numeric id as a string (ids are numeric strings: "1", "2", …). */
function nextId(list: Project[]): string {
  const max = list.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
  return String(max + 1);
}
