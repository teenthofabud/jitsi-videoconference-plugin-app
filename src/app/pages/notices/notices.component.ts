import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { CALCOM_ACCESS, GOOGLE_PERMISSIONS } from './notices.content';

@Component({
  selector: 'app-notices',
  imports: [NgTemplateOutlet, RouterLink, HlmCardImports, HlmTableImports],
  templateUrl: './notices.component.html'
})
export class NoticesComponent {
  readonly googlePermissions = GOOGLE_PERMISSIONS;
  readonly calcomAccess = CALCOM_ACCESS;
}
