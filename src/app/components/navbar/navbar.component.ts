import { AfterViewInit, Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit {

  routerSubscription: any;
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.scrollBasedOnUrl(this.router.url);
    this.routerSubscription = this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.scrollBasedOnUrl(event.urlAfterRedirects);
      });
   }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private scrollBasedOnUrl(url: string): void {
    if (url.startsWith('/contact')) {
      this.scrollToElement('contact');
    }
  }

  private scrollToElement(elementId: string): void {
    setTimeout(() => {
      document.getElementById(elementId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

}
