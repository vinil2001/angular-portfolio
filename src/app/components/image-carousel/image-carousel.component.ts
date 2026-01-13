import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss'
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() height: string = 'h-48'; // Динамічна висота
  @Input() showPreview: boolean = false; // Показувати превью
  currentIndex = 0;
  isPreviewOpen = false;
  previewImageIndex = 0;

  ngOnInit() {
    console.log('Carousel images:', this.images);
    console.log('Carousel height:', this.height);
    console.log('Carousel showPreview:', this.showPreview);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    console.log('Next slide, current index:', this.currentIndex);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    console.log('Prev slide, current index:', this.currentIndex);
  }

  goToSlide(index: number) {
    console.log('Going to slide:', index);
    this.currentIndex = index;
  }

  openPreview(index: number) {
    if (this.showPreview) {
      this.previewImageIndex = index;
      this.isPreviewOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closePreview() {
    this.isPreviewOpen = false;
    document.body.style.overflow = '';
  }

  nextPreview() {
    this.previewImageIndex = (this.previewImageIndex + 1) % this.images.length;
  }

  prevPreview() {
    this.previewImageIndex = (this.previewImageIndex - 1 + this.images.length) % this.images.length;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isPreviewOpen) return;
    
    switch (event.key) {
      case 'Escape':
        this.closePreview();
        break;
      case 'ArrowLeft':
        this.prevPreview();
        break;
      case 'ArrowRight':
        this.nextPreview();
        break;
    }
  }
}
