import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/projects-list.component').then(m => m.ProjectsListComponent)
  },
  {
    path: 'projects/new',
    loadComponent: () =>
      import('./features/projects/project-form.component').then(m => m.ProjectFormComponent)
  },
  {
    path: 'projects/:id/edit',
    loadComponent: () =>
      import('./features/projects/project-form.component').then(m => m.ProjectFormComponent)
  },
  { path: '**', redirectTo: 'projects' }
];
