import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link the contact email twice', () => {
    const mailtos = Array.from(element.querySelectorAll('a[href^="mailto:"]'));
    expect(mailtos.map(a => a.getAttribute('href'))).toEqual(['mailto:anirban.das@t-online.de', 'mailto:anirban.das@t-online.de']);
    expect(mailtos.map(a => a.textContent?.trim())).toEqual(['anirban.das@t-online.de', 'Send Email Now']);
  });

  it('should link the privacy policy and terms', () => {
    const legal = Array.from(element.querySelectorAll('a[href="/privacy"], a[href="/terms"]')).map(a => a.textContent?.trim());
    expect(legal).toEqual(['Privacy Policy', 'Terms of Service']);
    expect(element.textContent).toContain('By contacting us, you agree to our');
  });
});
