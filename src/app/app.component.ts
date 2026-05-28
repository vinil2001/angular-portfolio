import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { PROFILE } from './data/profile.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();

  constructor(title: Title, meta: Meta) {
    title.setTitle(PROFILE.pageTitle);
    meta.updateTag({ name: 'description', content: PROFILE.metaDescription });
  }
}
