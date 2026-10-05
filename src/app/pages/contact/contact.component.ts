import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    RouterModule,
    // Spartan NG button used via [brn-button] attribute
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  currentYear = new Date().getFullYear();
}
