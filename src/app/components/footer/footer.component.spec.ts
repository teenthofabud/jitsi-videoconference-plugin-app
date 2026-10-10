import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { FooterComponent } from './footer.component';

@Component({ template: '' })
class BlankComponent { }

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;

  const navigate = async (url: string) => {
    await TestBed.inject(Router).navigateByUrl(url);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([
        { path: '', component: BlankComponent },
        { path: 'contact', component: BlankComponent },
      ])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be the contact section anchor', () => {
    expect(element.querySelector('footer')?.id).toBe('contact-section');
  });

  it('should show the contact card with email links outside the contact page', async () => {
    await navigate('/');
    expect(element.querySelector('h2')?.textContent).toContain('Contact Us');
    const mailtos = Array.from(element.querySelectorAll('a[href^="mailto:"]')).map(a => a.getAttribute('href'));
    expect(mailtos).toEqual(['mailto:anirban.das@t-online.de', 'mailto:anirban.das@t-online.de']);
    expect(element.textContent).toContain('anirban.das@t-online.de');
    const legal = Array.from(element.querySelectorAll('a[href="/privacy"], a[href="/terms"]')).map(a => a.textContent?.trim());
    expect(legal).toEqual(['Privacy Policy', 'Terms of Service']);
    expect(element.querySelector('hlm-separator')).toBeTruthy();
  });

  it('should hide the contact card on the contact page', async () => {
    await navigate('/contact?x=1');
    expect(element.querySelector('h2')).toBeNull();
    expect(element.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(element.querySelector('hlm-separator')).toBeNull();
    expect(element.textContent).toContain(`© ${new Date().getFullYear()} TOAB Jitsi Plugin. All rights reserved.`);
  });
});
