import { Component } from '@angular/core';
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
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  privacyData: PrivacyData = privacyData;
}
