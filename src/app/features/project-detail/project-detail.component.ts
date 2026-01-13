import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../../models/project';
import { Portfolio } from '../../core/services/portfolio';
import { ImageCarouselComponent } from '../../components/image-carousel/image-carousel.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ImageCarouselComponent],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project$!: Observable<Project | undefined>;
  
  constructor(
    private route: ActivatedRoute,
    private portfolio: Portfolio
  ) {}

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.project$ = this.portfolio.getProjects().pipe(
      map(projects => {
        const project = projects.find(p => p.id === projectId);
        console.log('Found project:', project);
        console.log('Project images:', project?.images);
        return project;
      })
    );
  }

  goBack(): void {
    window.history.back();
  }
}
