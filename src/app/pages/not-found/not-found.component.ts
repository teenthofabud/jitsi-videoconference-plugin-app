import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, HlmButtonImports, HlmCardImports],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
