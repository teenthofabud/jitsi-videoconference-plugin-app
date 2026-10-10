import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { ContactConsentComponent } from '../../components/contact-consent/contact-consent.component';
import { SITE } from '../../config/site';

@Component({
  selector: 'app-contact',
  imports: [ContactConsentComponent, HlmButtonImports, HlmCardImports, HlmSeparatorImports],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  readonly contactEmail = SITE.contactEmail;
  readonly mailto = `mailto:${SITE.contactEmail}`;
}
