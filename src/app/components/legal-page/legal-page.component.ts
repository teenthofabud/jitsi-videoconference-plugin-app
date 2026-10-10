import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';

/** Page shell shared by the legal pages: a heading, the update date and the content in a card */
@Component({
  selector: 'app-legal-page',
  imports: [HlmCardImports],
  templateUrl: './legal-page.component.html',
  host: { class: 'block' }
})
export class LegalPageComponent {
  readonly title = input.required<string>();
  readonly lastUpdated = input.required<string>();
}
