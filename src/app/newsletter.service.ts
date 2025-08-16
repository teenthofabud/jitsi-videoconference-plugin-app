import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/emails`;

  constructor(private http: HttpClient) { }

  saveEmail(payload: any) {
    return this.http.post<any>(this.apiUrl, payload);
  }
  
}
