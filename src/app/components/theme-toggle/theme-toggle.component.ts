import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  darkMode$!: Observable<boolean>;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.darkMode$ = this.themeService.darkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
