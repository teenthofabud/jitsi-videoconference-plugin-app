import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  show(notification: Notification) {
    this.notificationSubject.next({
      duration: 3000,
      ...notification
    });
  }

  success(title: string, message: string) {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message: string) {
    this.show({ type: 'error', title, message });
  }

  warning(title: string, message: string) {
    this.show({ type: 'warning', title, message });
  }

  info(title: string, message: string) {
    this.show({ type: 'info', title, message });
  }
}
