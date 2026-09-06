import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NewsletterService } from 'src/app/newsletter.service';
@Component({
  selector: 'app-home',
  imports: [FormsModule, ButtonModule, InputTextModule, CardModule, MessageModule, ToastModule],
  templateUrl: './home.component.html',
  providers: [MessageService],
  styleUrl: './home.component.css'
})
export class HomeComponent {
  data: any;
  // messageService = inject(MessageService);
  constructor(private messageService: MessageService, private newsletterService: NewsletterService) { }
  email: any;

  onSubmit(form: any) {
    if (form.valid) {
      const email = form.value.email;
      const payload = {
        email: email
      }

      this.newsletterService.saveEmail(payload).subscribe({
        next: (response) => {
          this.data = response;
          // console.log(this.data);
          form.resetForm();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Email successfully subscribed!',
            life: 3000
          });
        },
        error: (error) => {
          // console.error('Subscription error:', error);
          const errorMessage = error?.message || 'An error occurred';
          this.messageService.add({
            severity: 'info',
            summary: 'Error',
            detail: errorMessage,
            life: 3000
          });
        }
      });
    }
  }
}
