import { Component } from '@angular/core';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'TOAB Jitsi Plugin';

  constructor(seo: SeoService) {
    seo.init();
  }
}
