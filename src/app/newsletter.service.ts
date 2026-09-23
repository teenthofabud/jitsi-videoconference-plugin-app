import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AccessListRequest, AccessListResponse, DefaultServer } from './types/common';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  fetchDefaultServers(): Observable<DefaultServer[]> {
    let url = `${this.apiUrl}/api/servers/default`
    return this.http.get<DefaultServer[]>(url)
  }

  saveEmail(payload: AccessListRequest): Observable<AccessListResponse> {
    let url = `${this.apiUrl}/api/users/preview`
    return this.http.post<AccessListResponse>(url, payload);
  }


}
