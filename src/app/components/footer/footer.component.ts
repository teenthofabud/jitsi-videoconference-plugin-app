import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, HlmButtonImports, HlmCardImports],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

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
