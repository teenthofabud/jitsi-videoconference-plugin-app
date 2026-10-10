import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { ContactConsentComponent } from '../contact-consent/contact-consent.component';
import { SITE } from '../../config/site';

@Component({
  selector: 'app-footer',
  imports: [ContactConsentComponent, HlmButtonImports, HlmCardImports, HlmSeparatorImports],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly siteName = SITE.name;
  readonly contactEmail = SITE.contactEmail;
  readonly mailto = `mailto:${SITE.contactEmail}`;

  private router = inject(Router);

  // The contact page has its own contact card, so the footer's is hidden there
  isContactPage = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split(/[?#]/)[0] === '/contact')
    ),
    { initialValue: false }
  );
}
