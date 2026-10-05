import { Component } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [BrnButton, CommonModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  currentYear = new Date().getFullYear();
}
