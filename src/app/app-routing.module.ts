import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SeoData } from './services/seo.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      seo: {
        title: 'Jitsi Calendar Plugin for Google Calendar, Outlook & Cal.com | TOAB Jitsi',
        description: 'Add Jitsi Meet video conferencing to Google Calendar, Outlook and Cal.com. Use your own self-hosted Jitsi server or a curated public Jitsi server. Join the preview access list.',
      } satisfies SeoData,
    },
  },
  // Single canonical URL for the home page; /home only redirects
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      seo: {
        title: 'Privacy Policy | TOAB Jitsi Calendar Plugin',
        description: 'How the TOAB Jitsi calendar plugin collects, uses and protects your data, including Google account sign-in, Jitsi server URLs and conference room names.',
      } satisfies SeoData,
    },
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: {
      seo: {
        title: 'Terms and Conditions | TOAB Jitsi Calendar Plugin',
        description: 'Terms and conditions for using the TOAB Jitsi plugin for Google Calendar and Cal.com with self-hosted and curated public Jitsi servers.',
      } satisfies SeoData,
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contact Us | TOAB Jitsi Calendar Plugin',
        description: 'Get in touch with the TOAB Jitsi team for support, feature requests or to revoke your preview access list participation. We respond within 24 hours.',
      } satisfies SeoData,
    },
  },
  { path: '**', redirectTo: '' }, // Wildcard route for 404 page
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
