import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrnButton } from '@spartan-ng/brain/button';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, BrnButton],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
