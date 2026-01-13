import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../models/project';
import { ImageCarouselComponent } from '../../../../components/image-carousel/image-carousel.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ImageCarouselComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
