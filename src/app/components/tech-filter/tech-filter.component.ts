import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-filter.component.html',
  styleUrls: ['./tech-filter.component.scss']
})
export class TechFilterComponent {
  @Input() technologies: string[] = [];
  @Input() active: string[] = [];

  @Output() toggle = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  isActive(tech: string): boolean {
    return this.active.includes(tech);
  }
}
