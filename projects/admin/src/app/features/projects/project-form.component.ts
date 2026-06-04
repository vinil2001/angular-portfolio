import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Project } from 'shared-data';
import { AdminProjectsService, ProjectInput } from '../../core/services/admin-projects.service';
import { apiErrorMessage, assetUrl } from '../../core/admin-util';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Edit target id, or null when creating. */
  readonly editId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  /** Technologies are managed outside the reactive form (chip add/remove). */
  readonly technologies = signal<string[]>([]);
  /** Image paths (relative, e.g. "projects/foo.png"); first is the cover. */
  readonly images = signal<string[]>([]);
  readonly uploading = signal(false);
  readonly dragOver = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    link: [''],
    githubUrl: [''],
    videoUrl: [''],
    featured: [false]
  });

  readonly isEdit = computed(() => this.editId() !== null);

  /** Live preview model derived from the current form + tech chips. */
  readonly preview = computed(() => ({
    title: this.form.controls.title.value || 'Untitled project',
    description: this.form.controls.description.value,
    technologies: this.technologies(),
    featured: this.form.controls.featured.value,
    image: this.images()[0] ? assetUrl(this.images()[0]) : null
  }));

  /** Public src for an image path (served as an admin asset). */
  imageSrc(path: string): string {
    return assetUrl(path);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.editId.set(id);
    this.loading.set(true);
    this.api.getOne(id).subscribe({
      next: project => {
        this.loading.set(false);
        if (!project) {
          this.error.set(`Project "${id}" not found.`);
          return;
        }
        this.patch(project);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(err));
      }
    });
  }

  private patch(p: Project): void {
    this.form.patchValue({
      title: p.title,
      description: p.description,
      link: p.link ?? '',
      githubUrl: p.githubUrl ?? '',
      videoUrl: p.videoUrl ?? '',
      featured: p.featured ?? false
    });
    this.technologies.set([...p.technologies]);
    this.images.set([...(p.images ?? [])]);
  }

  /** Upload one or more image files for the (already saved) project. */
  uploadFiles(files: FileList | null | undefined): void {
    const id = this.editId();
    if (!id || !files || files.length === 0) {
      return;
    }
    const queue = Array.from(files);
    this.uploading.set(true);
    this.error.set(null);

    const uploadNext = (index: number): void => {
      if (index >= queue.length) {
        this.uploading.set(false);
        return;
      }
      this.api.uploadImage(id, queue[index]).subscribe({
        next: ({ path }) => {
          this.images.update(list => [...list, path]);
          uploadNext(index + 1);
        },
        error: (err: HttpErrorResponse) => {
          this.uploading.set(false);
          this.error.set(apiErrorMessage(err));
        }
      });
    };
    uploadNext(0);
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadFiles(input.files);
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    this.uploadFiles(event.dataTransfer?.files);
  }

  removeImage(path: string): void {
    this.images.update(list => list.filter(p => p !== path));
  }

  moveImage(index: number, dir: -1 | 1): void {
    const next = [...this.images()];
    const target = index + dir;
    if (target < 0 || target >= next.length) {
      return;
    }
    [next[index], next[target]] = [next[target], next[index]];
    this.images.set(next);
  }

  addTech(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && !this.technologies().includes(value)) {
      this.technologies.update(list => [...list, value]);
    }
    input.value = '';
  }

  removeTech(tech: string): void {
    this.technologies.update(list => list.filter(t => t !== tech));
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const input: ProjectInput = {
      title: raw.title.trim(),
      description: raw.description.trim(),
      technologies: this.technologies(),
      link: blankToUndefined(raw.link),
      githubUrl: blankToUndefined(raw.githubUrl),
      videoUrl: blankToUndefined(raw.videoUrl),
      featured: raw.featured ? true : undefined,
      images: this.images().length ? this.images() : undefined
    };

    const request = this.isEdit()
      ? this.api.update(this.editId()!, input)
      : this.api.create(input);

    request.subscribe({
      next: () => this.router.navigate(['/projects']),
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(err));
      }
    });
  }
}

function blankToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}
