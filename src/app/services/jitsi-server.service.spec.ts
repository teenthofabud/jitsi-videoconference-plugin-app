import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

import { JitsiServerService } from './jitsi-server.service';

describe('JitsiServerService', () => {
  let service: JitsiServerService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(JitsiServerService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('fetches the default servers', () => {
    const servers = [{ name: 'A', serverUrl: 'https://a.example' }];
    let result: unknown;
    service.fetchDefaultServers().subscribe((response) => result = response);

    const req = http.expectOne(`${environment.apiUrl}/api/servers/default`);
    expect(req.request.method).toBe('GET');
    req.flush(servers);
    expect(result).toEqual(servers);
  });
});
