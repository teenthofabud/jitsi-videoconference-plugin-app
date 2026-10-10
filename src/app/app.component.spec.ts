import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HlmToaster } from '../../libs/ui/sonner/src';

// AppComponent is NgModule-declared, so the AOT test build needs a module that provides its template scope
@NgModule({
  declarations: [AppComponent],
  // 2. Add HlmToaster to your mock module's imports
  imports: [RouterModule, NavbarComponent, FooterComponent, HlmToaster]
})
class AppTestingModule { }

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppTestingModule],
    providers: [provideRouter([])]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TOAB Jitsi Plugin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('TOAB Jitsi Plugin');
  });

  it('should render navbar, router outlet, footer, and toaster', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    // 3. Verify the toaster renders successfully!
    expect(compiled.querySelector('hlm-toaster')).toBeTruthy();
  });
});
