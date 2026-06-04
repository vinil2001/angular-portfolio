import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Project } from 'shared-data';
import { AdminProjectsService } from '../../core/services/admin-projects.service';
import { apiErrorMessage, assetUrl } from '../../core/admin-util';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DragDropModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  private readonly api = inject(AdminProjectsService);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  /** True once the list order has been changed locally but not yet saved. */
  readonly dirty = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: list => {
        this.projects.set(list);
        this.loading.set(false);
        this.dirty.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(apiErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  drop(event: CdkDragDrop<Project[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const next = [...this.projects()];
    moveItemInArray(next, event.previousIndex, event.currentIndex);
    this.projects.set(next);
    this.dirty.set(true);
  }

  saveOrder(): void {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    const ordered = this.projects().map((p, i) => ({ ...p, order: i + 1 }));
    this.api.saveAll(ordered).subscribe({
      next: saved => {
        this.projects.set(saved);
        this.saving.set(false);
        this.dirty.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(apiErrorMessage(err));
        this.saving.set(false);
      }
    });
  }

  /** Id currently being deleted (drives the row's disabled/busy state). */
  readonly deletingId = signal<string | null>(null);

  remove(p: Project): void {
    if (this.deletingId()) {
      return;
    }
    const ok = confirm(`Delete "${p.title}"? This cannot be undone.`);
    if (!ok) {
      return;
    }
    this.deletingId.set(p.id);
    this.error.set(null);
    this.api.remove(p.id).subscribe({
      next: saved => {
        this.projects.set(saved);
        this.deletingId.set(null);
        this.dirty.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.deletingId.set(null);
        this.error.set(apiErrorMessage(err));
      }
    });
  }

  /** Public path of the project's first image (served as an admin asset), if any. */
  thumb(p: Project): string | null {
    return p.images?.length ? assetUrl(p.images[0]) : null;
  }

  trackById = (_: number, p: Project) => p.id;
}
