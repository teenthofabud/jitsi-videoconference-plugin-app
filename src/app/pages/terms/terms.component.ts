import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { LegalPageComponent } from '../../components/legal-page/legal-page.component';
import { SITE } from '../../config/site';

@Component({
  selector: 'app-terms',
  imports: [RouterModule, LegalPageComponent, HlmSeparatorImports],
  templateUrl: './terms.component.html',
})
export class TermsComponent {
  readonly legalName = SITE.legalName;
  readonly siteHost = new URL(SITE.url).host;
}
