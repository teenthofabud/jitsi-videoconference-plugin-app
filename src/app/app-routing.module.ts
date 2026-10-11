import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ContactComponent } from './pages/contact/contact.component';
import { InstallComponent } from './pages/install/install.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SeoData } from './services/seo.service';
import { SITE } from './config/site';

const notFoundSeo: SeoData = {
  title: 'Page Not Found | TOAB Jitsi Plugin',
  description: "The page you're looking for doesn't exist or has moved.",
  noindex: true,
};

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      seo: {
        title: 'TOAB Jitsi Plugin | Jitsi Meet for Google Calendar, Cal.com, Outlook',
        description: SITE.description,
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
        description: 'How TOAB Jitsi Plugin collects, uses and protects your data in Google Calendar and Cal.com, how long we keep it and how to have it deleted.',
      } satisfies SeoData,
    },
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: {
      seo: {
        title: 'Terms and Conditions | TOAB Jitsi Plugin',
        description: 'The terms and conditions for using TOAB Jitsi Plugin and its Jitsi Meet integrations for Google Calendar and Cal.com.',
      } satisfies SeoData,
    },
  },
  {
    path: 'install',
    component: InstallComponent,
    data: {
      seo: {
        title: 'How to Install TOAB Jitsi Plugin for Google Calendar & Cal.com',
        description: 'Step-by-step setup for TOAB Jitsi Plugin: install the Google Calendar add-on or the Cal.com app, pick a Jitsi server and add Jitsi Meet links to your events.',
      } satisfies SeoData,
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contact Us | TOAB Jitsi Plugin',
        description: 'Contact the TOAB Jitsi Plugin team for installation help, feature requests or to leave the preview access list. We reply within 24 hours.',
      } satisfies SeoData,
    },
  },
  {
    path: 'notices',
    component: NoticesComponent,
    data: {
      seo: {
        title: 'Data and Permissions | TOAB Jitsi Plugin',
        description: 'Every Google Calendar permission and Cal.com data item TOAB Jitsi Plugin uses, and why it needs each one. We never sell your data or store event details.',
      } satisfies SeoData,
    },
  },
  // Pre-rendered and published as the hosting's error page (error.html), which is
  // served with a 404 status for any unknown path
  { path: '404', component: NotFoundComponent, data: { seo: notFoundSeo } },
  // Unknown paths reached by in-app navigation, or after error.html boots the app
  { path: '**', component: NotFoundComponent, data: { seo: notFoundSeo } },
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
