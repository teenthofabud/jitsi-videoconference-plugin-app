import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { LegalPageComponent } from '../../components/legal-page/legal-page.component';

@Component({
  selector: 'app-terms',
  imports: [RouterModule, LegalPageComponent, HlmSeparatorImports],
  templateUrl: './terms.component.html',
})
export class TermsComponent {}
