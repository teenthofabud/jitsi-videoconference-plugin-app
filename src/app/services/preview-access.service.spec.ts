import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

import { PreviewAccessService } from './preview-access.service';

describe('PreviewAccessService', () => {
  let service: PreviewAccessService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PreviewAccessService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts the email to the preview access list', () => {
    let result: unknown;
    service.join({ email: 'a@b.c' }).subscribe((response) => result = response);

    const req = http.expectOne(`${environment.apiUrl}/api/users/preview`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'a@b.c' });
    req.flush({ message: 'ok' });
    expect(result).toEqual({ message: 'ok' });
  });
});
