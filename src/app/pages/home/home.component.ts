import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from 'src/app/newsletter.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DefaultServer } from 'src/app/types/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  data: any;
  servers: DefaultServer[] = [];
  isLoadingServers = true;
  email: any;

  private fallbackServers: DefaultServer[] = [
    { name: '8x8 Jitsi Meet', serverUrl: 'https://meet.jit.si' },
    { name: 'Brave Talk', serverUrl: 'https://talk.brave.com' },
    { name: 'IONOS Video Chat', serverUrl: 'https://meet.videochat.ionos.com' },
    { name: 'openSUSE Meet', serverUrl: 'https://meet.opensuse.org' }
  ];

  constructor(
    private notificationService: NotificationService,
    private newsletterService: NewsletterService
  ) { }

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers() {
    this.newsletterService.fetchDefaultServers().subscribe({
      next: (response) => {
        this.servers = response;
        this.isLoadingServers = false;
      },
      error: (error) => {
        this.servers = this.fallbackServers;
        this.isLoadingServers = false;
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
