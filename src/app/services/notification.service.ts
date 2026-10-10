import { Injectable } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  success(title: string, message: string) {
    toast.success(title, { description: message, duration: 3000 });
  }

  error(title: string, message: string) {
    toast.error(title, { description: message, duration: 3000 });
  }

  warning(title: string, message: string) {
    toast.warning(title, { description: message, duration: 3000 });
  }

  info(title: string, message: string) {
    toast.info(title, { description: message, duration: 3000 });
  }
}
