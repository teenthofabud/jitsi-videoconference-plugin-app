import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Attribute selector so the paragraph renders without a wrapper element
@Component({
  selector: 'p[appContactConsent]',
  imports: [RouterLink],
  templateUrl: './contact-consent.component.html'
})
export class ContactConsentComponent {}
