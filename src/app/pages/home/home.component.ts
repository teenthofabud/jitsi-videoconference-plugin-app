import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { NewsletterService } from '../../newsletter.service';
import { NotificationService } from '../../services/notification.service';
import { DefaultServer } from '../../types/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, HlmBadgeImports, HlmButtonImports, HlmCardImports, HlmInputImports, HlmSpinnerImports, HlmTableImports],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  data: any;
  email: any;

  private fallbackServers: DefaultServer[] = [
    { name: '8x8 Jitsi Meet', serverUrl: 'https://meet.jit.si' },
    { name: 'Brave Talk', serverUrl: 'https://talk.brave.com' },
    { name: 'IONOS Video Chat', serverUrl: 'https://meet.videochat.ionos.com' },
    { name: 'openSUSE Meet', serverUrl: 'https://meet.opensuse.org' }
  ];

  // Start with the fallback list so pre-rendered HTML contains real server
  // names for crawlers; the live list replaces it once loaded in the browser.
  servers: DefaultServer[] = this.fallbackServers;
  isLoadingServers = false;

  constructor(
    private notificationService: NotificationService,
    private newsletterService: NewsletterService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadServers();
    }
  }

  loadServers() {
    this.newsletterService.fetchDefaultServers().subscribe({
      next: (response) => {
        if (response?.length) {
          this.servers = response;
        }
      },
      error: (error) => {
        this.servers = this.fallbackServers;
      }
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      const email = form.value.email;
      const payload = { email };

      this.newsletterService.saveEmail(payload).subscribe({
        next: (response) => {
          this.data = response;
          form.resetForm();
          this.notificationService.success('Success', response.message || 'Email successfully subscribed!');
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Something unexpected happened';
          if (error.status === 409) {
            this.notificationService.info('Notice', errorMessage);
          } else {
            this.notificationService.warning('Error', errorMessage);
          }
        }
      });
    }
  }
}
