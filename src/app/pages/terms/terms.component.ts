import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import termsData from '../../../assets/data/terms.json';

interface TermsSection {
  title: string;
  items: string[];
}

interface TermsData {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
}

@Component({
  selector: 'app-terms',
  imports: [CommonModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  termsData: TermsData = termsData;
}
