import { Component } from '@angular/core';
import { SITE } from './config/site';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = SITE.name;

  constructor(seo: SeoService) {
    seo.init();
  }
}
