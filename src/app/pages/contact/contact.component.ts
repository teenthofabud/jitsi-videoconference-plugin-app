import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-contact',
  imports: [RouterModule, HlmButtonImports, HlmCardImports, HlmSeparatorImports],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {}
