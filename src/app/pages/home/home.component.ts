import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core/primitives/di';
@Component({
  selector: 'app-home',
  imports: [FormsModule, ButtonModule, TableModule, DatePickerModule, InputTextModule, CardModule, MessageModule, ToastModule],
  templateUrl: './home.component.html',
  providers: [MessageService],
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // messageService = inject(MessageService);
  constructor(private messageService: MessageService) { }
  email: any;
  onSubmit(form: any) {
    if (form.valid) {
      console.log(form)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      form.resetForm();
    }
  }
}
