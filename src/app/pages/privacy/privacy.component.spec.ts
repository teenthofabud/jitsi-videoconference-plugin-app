import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyComponent } from './privacy.component';
import privacyData from '../../../assets/data/privacy.json';

describe('PrivacyComponent', () => {
  let component: PrivacyComponent;
  let fixture: ComponentFixture<PrivacyComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the title and last updated date', () => {
    expect(element.querySelector('h1')?.textContent?.trim()).toBe(privacyData.title);
    expect(element.textContent).toContain(`Last updated: ${privacyData.lastUpdated}`);
  });

  it('renders every section and item inside a card, separated by separators', () => {
    const sections = Array.from(element.querySelectorAll('[hlmCard] section'));
    expect(sections.map(s => s.querySelector('h2')?.textContent?.trim())).toEqual(privacyData.sections.map(s => s.title));
    expect(sections.map(s => s.querySelectorAll('li').length)).toEqual(privacyData.sections.map(s => s.items.length));
    expect(element.querySelectorAll('hlm-separator').length).toBe(privacyData.sections.length - 1);
  });
});
