import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { JitsiServerService } from '../../services/jitsi-server.service';
import { PreviewAccessService } from '../../services/preview-access.service';
import { NotificationService } from '../../services/notification.service';
import { DefaultServer } from '../../types/common';

const FALLBACK = [
  ['8x8 Jitsi Meet', 'https://meet.jit.si'],
  ['Brave Talk', 'https://talk.brave.com'],
  ['IONOS Video Chat', 'https://meet.videochat.ionos.com'],
  ['openSUSE Meet', 'https://meet.opensuse.org'],
];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: HTMLElement;
  let api: { fetchDefaultServers: ReturnType<typeof vi.fn>; join: ReturnType<typeof vi.fn> };
  let notifications: NotificationService;

  const serverCards = () => Array.from(element.querySelectorAll('h3 + p.break-all'))
    .map(p => [p.previousElementSibling?.textContent?.trim(), p.textContent?.trim()]);

  async function setup(platform: 'browser' | 'server', servers: Observable<DefaultServer[]>) {
    api = { fetchDefaultServers: vi.fn(() => servers), join: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: platform },
        { provide: JitsiServerService, useValue: api },
        { provide: PreviewAccessService, useValue: api },
      ]
    })
    .compileComponents();

    notifications = TestBed.inject(NotificationService);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }

  function form(valid: boolean, email = 'a@b.c') {
    return { valid, value: { email }, resetForm: vi.fn() } as unknown as NgForm;
  }

  describe('servers', () => {
    it('should create', async () => {
      await setup('browser', of([]));
      expect(component).toBeTruthy();
    });

    it('renders the fallback servers without fetching on the server', async () => {
      await setup('server', of([{ name: 'Live', serverUrl: 'https://live.example' }]));
      expect(api.fetchDefaultServers).not.toHaveBeenCalled();
      expect(serverCards()).toEqual(FALLBACK);
    });

    it('replaces the fallback with the live list in the browser', async () => {
      await setup('browser', of([{ name: 'Live', serverUrl: 'https://live.example' }]));
      expect(api.fetchDefaultServers).toHaveBeenCalledTimes(1);
      expect(serverCards()).toEqual([['Live', 'https://live.example']]);
    });

    it('keeps the fallback when the live list is empty', async () => {
      await setup('browser', of([]));
      expect(serverCards()).toEqual(FALLBACK);
    });

    it('keeps the fallback when loading fails', async () => {
      await setup('browser', throwError(() => new Error('down')));
      expect(serverCards()).toEqual(FALLBACK);
    });
  });

  describe('content', () => {
    beforeEach(() => setup('server', of([])));

    it('renders the four how-it-works steps in order', () => {
      const steps = Array.from(element.querySelectorAll('ol > li h3')).map(h => h.textContent?.trim());
      expect(steps).toEqual(['Install the add-on', 'Choose your Jitsi server', 'Create an event', 'Join the meeting']);
      expect(Array.from(element.querySelectorAll('ol > li .rounded-full')).map(n => n.textContent?.trim())).toEqual(['1', '2', '3', '4']);
    });

    it('lists every Google permission with its scope and reason', () => {
      const rows = Array.from(element.querySelectorAll('tbody tr')).map(tr => [
        tr.querySelector('span')?.textContent?.trim(),
        tr.querySelector('code')?.textContent?.trim(),
        !!tr.querySelectorAll('td')[1]?.textContent?.trim(),
      ]);
      expect(rows).toEqual([
        ['Run as a Google Calendar add-on', 'calendar.addons.execute', true],
        ['Read the event you have open', 'calendar.addons.current.event.read', true],
        ['Update the event you have open', 'calendar.addons.current.event.write', true],
        ['View your calendar events', 'calendar.events.readonly', true],
        ['See your email address', 'userinfo.email', true],
        ['Connect to external services', 'script.external_request', true],
        ['Manage triggers', 'script.scriptapp', true],
      ]);
    });
  });

  describe('preview signup', () => {
    beforeEach(() => setup('server', of([])));

    it('does not flag the empty email input when it loses focus', async () => {
      const input = element.querySelector<HTMLInputElement>('input[name="email"]')!;
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(input.getAttribute('data-touched')).toBe('true');
      expect(input.hasAttribute('data-matches-spartan-invalid')).toBe(false);
    });

    it('flags a malformed email once typed and clears it for a valid one', async () => {
      const input = element.querySelector<HTMLInputElement>('input[name="email"]')!;
      const type = async (value: string) => {
        input.value = value;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      };
      for (const bad of ['not-an-email', 'a@b', 'a@b.c', 'a b@c.com']) {
        await type(bad);
        expect(input.getAttribute('data-matches-spartan-invalid'), bad).toBe('true');
      }
      await type('a@b.co');
      expect(input.hasAttribute('data-matches-spartan-invalid')).toBe(false);
    });

    it('ignores invalid forms', () => {
      component.onSubmit(form(false));
      expect(api.join).not.toHaveBeenCalled();
    });

    it('saves the email, resets the form and notifies success', () => {
      const success = vi.spyOn(notifications, 'success');
      api.join.mockReturnValue(of({ message: 'Welcome' }));
      const f = form(true);
      component.onSubmit(f);
      expect(api.join).toHaveBeenCalledWith({ email: 'a@b.c' });
      expect(f.resetForm).toHaveBeenCalled();
      expect(success).toHaveBeenCalledWith('Success', 'Welcome');
    });

    it('uses a default success message when the API sends none', () => {
      const success = vi.spyOn(notifications, 'success');
      api.join.mockReturnValue(of({ message: '' }));
      component.onSubmit(form(true));
      expect(success).toHaveBeenCalledWith('Success', 'Email successfully subscribed!');
    });

    it('notifies info when the email is already on the list', () => {
      const info = vi.spyOn(notifications, 'info');
      api.join.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Already there' } })));
      const f = form(true);
      component.onSubmit(f);
      expect(info).toHaveBeenCalledWith('Notice', 'Already there');
      expect(f.resetForm).not.toHaveBeenCalled();
    });

    it('notifies a warning with a default message on other errors', () => {
      const warning = vi.spyOn(notifications, 'warning');
      api.join.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      component.onSubmit(form(true));
      expect(warning).toHaveBeenCalledWith('Error', 'Something unexpected happened');
    });

    it('shows a validation message when submitted empty', () => {
      element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      fixture.detectChanges();
      expect(element.textContent).toContain('Valid email is required.');
      expect(api.join).not.toHaveBeenCalled();
    });
  });
});
