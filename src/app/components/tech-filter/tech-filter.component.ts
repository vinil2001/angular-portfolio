import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Portfolio } from '../../core/services/portfolio';

@Component({
  selector: 'app-tech-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-filter.component.html',
  styleUrls: ['./tech-filter.component.scss']
})
export class TechFilterComponent implements OnInit {
  technologies$!: Observable<string[]>;
  activeFilters$!: Observable<string[]>;

  constructor(private portfolio: Portfolio) {}

  ngOnInit() {
    this.technologies$ = this.portfolio.getAllTechnologies();
    this.activeFilters$ = this.portfolio.getActiveFilters();
  }

  toggleTech(tech: string): void {
    this.activeFilters$.subscribe(currentFilters => {
      const index = currentFilters.indexOf(tech);
      let newFilters: string[];
      
      if (index > -1) {
        newFilters = [...currentFilters];
        newFilters.splice(index, 1);
      } else {
        newFilters = [...currentFilters, tech];
      }
      
      this.portfolio.filterByTechnologies(newFilters);
    }).unsubscribe();
  }

  clearFilters(): void {
    this.portfolio.filterByTechnologies([]);
  }

  isActive(tech: string): Observable<boolean> {
    return this.activeFilters$.pipe(
      map(filters => filters.includes(tech))
    );
  }
}
