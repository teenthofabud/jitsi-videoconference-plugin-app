import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SITE } from '../config/site';
import { AccessListRequest, AccessListResponse } from '../types/common';

@Injectable({
  providedIn: 'root'
})
export class PreviewAccessService {
  private http = inject(HttpClient);

  join(request: AccessListRequest): Observable<AccessListResponse> {
    return this.http.post<AccessListResponse>(`${SITE.apiUrl}/api/users/preview`, request);
  }
}
