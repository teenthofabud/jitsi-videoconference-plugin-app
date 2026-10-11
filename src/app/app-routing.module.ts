import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ContactComponent } from './pages/contact/contact.component';
import { InstallComponent } from './pages/install/install.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { SeoData } from './services/seo.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      seo: {
        title: 'TOAB Jitsi Plugin | Jitsi Meet for Google Calendar & Cal.com',
        description: 'TOAB Jitsi Plugin adds Jitsi Meet video conferencing to Google Calendar and Cal.com events, using curated public Jitsi servers. Self-hosted Jitsi support is coming soon.',
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
        title: 'Privacy Policy | TOAB Jitsi Plugin',
        description: 'How TOAB Jitsi Plugin collects, uses and protects your data, including the Google Calendar permissions it uses and why.',
      } satisfies SeoData,
    },
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: {
      seo: {
        title: 'Terms and Conditions | TOAB Jitsi Plugin',
        description: 'Terms and conditions for using TOAB Jitsi Plugin with Google Calendar and Cal.com.',
      } satisfies SeoData,
    },
  },
  {
    path: 'install',
    component: InstallComponent,
    data: {
      seo: {
        title: 'How to Install | TOAB Jitsi Plugin',
        description: 'How to install TOAB Jitsi Plugin for Google Calendar, Microsoft Outlook and Cal.com, and add Jitsi meetings to your calendar events.',
      } satisfies SeoData,
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contact Us | TOAB Jitsi Plugin',
        description: 'Get in touch with the TOAB Jitsi Plugin team for support, feature requests or to revoke your preview access list participation. We respond within 24 hours.',
      } satisfies SeoData,
    },
  },
  {
    path: 'notices',
    component: NoticesComponent,
    data: {
      seo: {
        title: 'Notices | TOAB Jitsi Plugin',
        description: 'The permissions and data TOAB Jitsi Plugin uses in Google Calendar and Cal.com, and why it needs each one.',
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
