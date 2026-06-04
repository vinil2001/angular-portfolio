import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
    private projects: ProjectsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.project$ = this.projects.getProject(id);
  }

  /** Convert a YouTube watch/youtu.be/embed URL into a sanitised embeddable URL. */
  embedUrl(url: string): SafeResourceUrl {
    let id = '';
    const watch = url.match(/[?&]v=([^?&]+)/);
    const short = url.match(/youtu\.be\/([^?&]+)/);
    const embed = url.match(/youtube\.com\/embed\/([^?&]+)/);
    id = watch?.[1] ?? short?.[1] ?? embed?.[1] ?? '';
    const src = id ? `https://www.youtube.com/embed/${id}` : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  goBack(): void {
    window.history.back();
  }
}
