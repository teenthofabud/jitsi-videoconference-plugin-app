import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';

@Component({ template: '' })
class BlankComponent { }

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let element: HTMLElement;

  const desktopLinks = () => Array.from(element.querySelectorAll<HTMLAnchorElement>('.lg\\:flex a'));
  const mobileLinks = () => Array.from(element.querySelectorAll<HTMLAnchorElement>('div.lg\\:hidden a'));
  const labels = (links: HTMLAnchorElement[]) => links.map(el => el.querySelector('span')?.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([
        { path: '', component: BlankComponent },
        { path: 'install', component: BlankComponent },
      ])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
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

  it('should render the same items with an icon each in the mobile menu', () => {
    expect(labels(mobileLinks())).toEqual(['Home', 'How to Install', 'Contact', 'Privacy', 'Terms']);
    expect(mobileLinks().map(el => el.getAttribute('href'))).toEqual(['/', '/install', null, '/privacy', '/terms']);
    for (const link of [...desktopLinks(), ...mobileLinks()]) {
      expect(link.querySelector('svg path')?.getAttribute('d')).toBeTruthy();
    }
  });

  it('should keep the desktop and mobile link styles', () => {
    expect(desktopLinks()[0].className).toContain('gap-2');
    expect(mobileLinks()[0].className).toContain('gap-3');
    expect(mobileLinks()[0].className).toContain('px-4 py-3');
    expect(desktopLinks()[2].className).toContain('cursor-pointer');
    expect(mobileLinks()[2].className).toContain('cursor-pointer');
  });

  it('should render the logo from the CDN', () => {
    const img = element.querySelector('img')!;
    expect(img.getAttribute('src')).toMatch(/\/toab-jitsi-logo-cropped-296x80\.jpg$/);
    expect(img.getAttribute('alt')).toBe('TOAB Jitsi Plugin');
  });

  it('should mark Home active only on an exact match', async () => {
    await TestBed.inject(Router).navigateByUrl('/install');
    fixture.detectChanges();
    expect(desktopLinks()[0].classList.contains('active')).toBe(false);
    expect(desktopLinks()[1].classList.contains('active')).toBe(true);

    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    expect(desktopLinks()[0].classList.contains('active')).toBe(true);
    expect(mobileLinks()[0].classList.contains('active')).toBe(true);
  });

  it('should toggle and close the mobile menu', () => {
    expect(component.mobileMenuOpen).toBe(false);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBe(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen).toBe(false);
  });

  it('should show the mobile menu and update the toggle label when open', () => {
    const menu = element.querySelector('div.lg\\:hidden')!;
    const toggle = element.querySelector('button')!;
    expect(menu.classList.contains('hidden')).toBe(true);
    expect(toggle.getAttribute('aria-label')).toBe('Open menu');

    toggle.click();
    fixture.detectChanges();
    expect(menu.classList.contains('hidden')).toBe(false);
    expect(toggle.getAttribute('aria-label')).toBe('Close menu');
  });

  it('should close the mobile menu when a mobile link is clicked', () => {
    component.toggleMobileMenu();
    fixture.detectChanges();
    mobileLinks()[1].click();
    expect(component.mobileMenuOpen).toBe(false);
  });

  it('should scroll to the contact section from both menus', () => {
    const section = document.createElement('div');
    section.id = 'contact-section';
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    desktopLinks()[2].click();
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    component.toggleMobileMenu();
    mobileLinks()[2].click();
    expect(section.scrollIntoView).toHaveBeenCalledTimes(2);
    expect(component.mobileMenuOpen).toBe(false);

    section.remove();
  });
});
