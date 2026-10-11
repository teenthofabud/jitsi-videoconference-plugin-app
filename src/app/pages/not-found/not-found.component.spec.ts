import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let fixture: ComponentFixture<NotFoundComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('shows the not found heading', () => {
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Page not found');
  });

  it('links back to the home, install and contact pages', () => {
    const hrefs = Array.from(element.querySelectorAll('a')).map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/install', '/contact']);
  });
});
