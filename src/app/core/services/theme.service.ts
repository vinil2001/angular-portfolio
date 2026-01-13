import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'dark-mode';
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());

  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  toggleDarkMode(): void {
    const currentTheme = this.darkModeSubject.value;
    const newTheme = !currentTheme;
    this.darkModeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem(this.DARK_MODE_KEY, newTheme.toString());
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(this.DARK_MODE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
