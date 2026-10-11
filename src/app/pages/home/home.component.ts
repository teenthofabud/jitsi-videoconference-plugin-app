import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { provideErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { JitsiServerService } from '../../services/jitsi-server.service';
import { NotificationService } from '../../services/notification.service';
import { PreviewAccessService } from '../../services/preview-access.service';
import { DefaultServer } from '../../types/common';
import { FALLBACK_SERVERS, HOW_IT_WORKS_STEPS } from './home.content';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, HlmBadgeImports, HlmButtonImports, HlmCardImports, HlmInputImports],
  // Only flag the email input once the user has typed or submitted, not on blur of an empty field
  providers: [provideErrorStateMatcher(ShowOnDirtyErrorStateMatcher)],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private jitsiServerService = inject(JitsiServerService);
  private previewAccessService = inject(PreviewAccessService);
  private platformId = inject(PLATFORM_ID);

  readonly steps = HOW_IT_WORKS_STEPS;

  email = '';

  // Start with the fallback list so pre-rendered HTML contains real server
  // names for crawlers; the live list replaces it once loaded in the browser.
  servers: readonly DefaultServer[] = FALLBACK_SERVERS;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadServers();
    }
  }

  private loadServers() {
    this.jitsiServerService.fetchDefaultServers()
      .pipe(catchError(() => EMPTY))
      .subscribe((servers) => {
        if (servers?.length) {
          this.servers = servers;
        }
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.previewAccessService.join({ email: form.value.email }).subscribe({
      next: (response) => {
        form.resetForm();
        this.notificationService.success('Success', response.message || 'Email successfully subscribed!');
      },
      error: (error: HttpErrorResponse) => this.notifyJoinError(error)
    });
  }

  private notifyJoinError(error: HttpErrorResponse) {
    const message = error.error?.message || 'Something unexpected happened';
    // 409: the email is already on the list, which isn't a failure for the user
    if (error.status === 409) {
      this.notificationService.info('Notice', message);
    } else {
      this.notificationService.warning('Error', message);
    }
  }
}
