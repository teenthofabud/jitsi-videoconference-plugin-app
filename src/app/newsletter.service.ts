import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface AccessListRequest {
  email: string;
}

export interface AccessListResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/access-list`;

  constructor(private http: HttpClient) { }

  saveEmail(payload: AccessListRequest): Observable<AccessListResponse> {
    return this.http.post<AccessListResponse>(this.apiUrl, payload);
  }
}
