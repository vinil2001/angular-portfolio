import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from 'shared-data';
import { ProjectsService } from '../../core/services/projects.service';
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
    private projects: ProjectsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.project$ = this.projects.getProject(id);
  }

  goBack(): void {
    window.history.back();
  }
}
