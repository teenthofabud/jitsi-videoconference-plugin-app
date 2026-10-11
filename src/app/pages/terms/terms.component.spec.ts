import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { environment } from '../../../environments/environment';
import { TermsComponent } from './terms.component';

describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the title and last updated date', () => {
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Terms and Conditions');
    expect(element.textContent).toContain('Last updated: October 10, 2026');
  });

  it('names the registered company and the site host from the environment', () => {
    expect(element.textContent).toContain('We are TOAB SOFTWARE TECHNOLOGIES (OPC) PRIVATE LIMITED, doing business as TOAB');
    expect(element.textContent).toContain(`We operate the website ${new URL(environment.siteUrl).host}`);
    expect(element.textContent).not.toContain('Das Software');
  });

  it('renders all sections inside a card, separated by separators', () => {
    const sections = element.querySelectorAll('[hlmCard] section');
    expect(sections.length).toBe(9);
    expect(element.querySelectorAll('hlm-separator').length).toBe(8);
  });

  it('links each table of contents entry to its section', () => {
    const fragments = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href*="#"]'))
      .map(a => a.getAttribute('href')!.split('#')[1]);
    expect(fragments).toEqual(['services', 'ip', 'usercontent', 'payment', 'liability', 'changes', 'contact']);
    for (const id of fragments) {
      expect(element.querySelector(`section#${id}`)).toBeTruthy();
    }
  });
});
