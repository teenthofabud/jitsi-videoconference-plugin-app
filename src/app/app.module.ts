import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ContactComponent } from './pages/contact/contact.component';


// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { HttpClientModule } from '@angular/common/http';

// custom blue theme preset
const BluePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ButtonModule,
    MenubarModule,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PrivacyComponent,
    TermsComponent,
    ContactComponent,
    HttpClientModule
  ],
  providers: [
    providePrimeNG({
      theme: {
        preset: BluePreset,
        options: {
          darkModeSelector: '.dark-mode'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
