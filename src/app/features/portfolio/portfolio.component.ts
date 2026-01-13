import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Project } from '../../models/project';
import { Portfolio } from '../../core/services/portfolio';
import { ProjectCardComponent } from './components/project-card/project-card.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ProjectCardComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  projects$!: Observable<Project[]>;

  constructor(private portfolio: Portfolio) {}

  ngOnInit() {
    this.projects$ = this.portfolio.getProjects();
  }
}
