import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-install',
  imports: [RouterModule, HlmBadgeImports, HlmButtonImports, HlmCardImports],
  templateUrl: './install.component.html',
  styleUrl: './install.component.css'
})
export class InstallComponent {}
