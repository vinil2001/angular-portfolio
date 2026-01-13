import { Routes } from '@angular/router';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { ProjectDetailComponent } from './features/project-detail/project-detail.component';

export const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'project/:id', component: ProjectDetailComponent },
  { path: '**', redirectTo: '' }
];
