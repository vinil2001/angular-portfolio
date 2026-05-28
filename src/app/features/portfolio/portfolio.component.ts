import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectsService } from '../../core/services/projects.service';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { TechFilterComponent } from '../../components/tech-filter/tech-filter.component';
import { Project, Experience, EXPERIENCE, PROFILE } from 'shared-data';

interface PortfolioView {
  technologies: string[];
  active: string[];
  projects: Project[];
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, ProjectCardComponent, TechFilterComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  vm$!: Observable<PortfolioView>;
  readonly profile = PROFILE;
  readonly experience: Experience[] = EXPERIENCE;

  private activeFilters$ = new BehaviorSubject<string[]>([]);

  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.vm$ = combineLatest([
      this.projectsService.getProjects(),
      this.activeFilters$
    ]).pipe(
      map(([projects, active]) => ({
        technologies: this.collectTechnologies(projects),
        active,
        projects: this.applyFilters(projects, active)
      }))
    );
  }

  toggleTech(tech: string): void {
    const current = this.activeFilters$.value;
    this.activeFilters$.next(
      current.includes(tech) ? current.filter(t => t !== tech) : [...current, tech]
    );
  }

  clearFilters(): void {
    this.activeFilters$.next([]);
  }

  private collectTechnologies(projects: Project[]): string[] {
    return Array.from(new Set(projects.flatMap(p => p.technologies ?? []))).sort();
  }

  private applyFilters(projects: Project[], active: string[]): Project[] {
    if (active.length === 0) {
      return projects;
    }
    return projects.filter(p => active.every(tech => (p.technologies ?? []).includes(tech)));
  }
}
