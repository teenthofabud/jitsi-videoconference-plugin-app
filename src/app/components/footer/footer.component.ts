import { Component } from '@angular/core';
import { SITE } from '../../config/site';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly siteName = SITE.name;
}
