import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

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
