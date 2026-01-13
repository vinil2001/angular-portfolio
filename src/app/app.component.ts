import { Component } from '@angular/core';
import { PortfolioComponent } from './features/portfolio/portfolio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PortfolioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-portfolio';
}
