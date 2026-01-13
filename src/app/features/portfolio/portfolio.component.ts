import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Project } from '../../models/project';
import { Portfolio } from '../../core/services/portfolio';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { TechFilterComponent } from '../../components/tech-filter/tech-filter.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ProjectCardComponent, TechFilterComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  projects$!: Observable<Project[]>;
  activeFilters$!: Observable<string[]>;

  constructor(private portfolio: Portfolio) {}

  ngOnInit() {
    this.projects$ = this.portfolio.getFilteredProjects();
    this.activeFilters$ = this.portfolio.getActiveFilters();
  }

  clearFilters(): void {
    this.portfolio.filterByTechnologies([]);
  }
}
