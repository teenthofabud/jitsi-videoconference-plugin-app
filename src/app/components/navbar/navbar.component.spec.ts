import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render desktop menu items', () => {
    const labels = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.lg\\:flex a span')
    ).map(el => el.textContent?.trim());
    expect(labels).toEqual(['Home', 'How to Install', 'Contact', 'Privacy', 'Terms']);
  });

  it('should have proper router links for menu items', () => {
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.lg\\:flex a[href]')
    ).map(el => el.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/install', '/privacy', '/terms']);
  });

  it('should toggle and close the mobile menu', () => {
    expect(component.mobileMenuOpen).toBe(false);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBe(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen).toBe(false);
  });
});
