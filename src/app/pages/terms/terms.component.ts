import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  imports: [CommonModule, CardModule, DividerModule, RouterModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
})
export class TermsComponent implements AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (!fragment) return;
      setTimeout(() => {
        const el = document.getElementById(fragment);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}
