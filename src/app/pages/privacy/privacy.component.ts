import { Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { LegalPageComponent } from '../../components/legal-page/legal-page.component';
import privacyData from '../../../assets/data/privacy.json';

interface PrivacySection {
  title: string;
  items: string[];
}

interface PrivacyData {
  title: string;
  lastUpdated: string;
  sections: PrivacySection[];
}

@Component({
  selector: 'app-privacy',
  imports: [LegalPageComponent, HlmSeparatorImports],
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent {
  privacyData: PrivacyData = privacyData;
}
