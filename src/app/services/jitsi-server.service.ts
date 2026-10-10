import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SITE } from '../config/site';
import { DefaultServer } from '../types/common';

@Injectable({
  providedIn: 'root'
})
export class JitsiServerService {
  private http = inject(HttpClient);

  fetchDefaultServers(): Observable<DefaultServer[]> {
    return this.http.get<DefaultServer[]>(`${SITE.apiUrl}/api/servers/default`);
  }
}
