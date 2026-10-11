import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NoticesComponent } from './notices.component';

describe('NoticesComponent', () => {
  let fixture: ComponentFixture<NoticesComponent>;
  let element: HTMLElement;

  const rows = (section: string) => Array.from(element.querySelectorAll(`#${section} tbody tr`)).map(tr => {
    const [label, detail] = Array.from(tr.querySelectorAll('td:first-child span'));
    return [label.textContent?.trim(), detail.textContent?.trim(), !!tr.querySelectorAll('td')[1]?.textContent?.trim()];
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticesComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticesComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('starts with Your Data and Permissions, with a subsection per app', () => {
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('Your Data and Permissions');
    expect(Array.from(element.querySelectorAll('#data-access h3')).map(h => h.textContent?.trim())).toEqual([
      'Google Calendar add-on: TOAB Jitsi Addon',
      'Cal.com app: toab_jitsi',
    ]);
  });

  it('lists every Google permission with its scope and reason', () => {
    expect(rows('google-calendar')).toEqual([
      ['Run as a Google Calendar add-on', 'calendar.addons.execute', true],
      ['Read the event you have open', 'calendar.addons.current.event.read', true],
      ['Update the event you have open', 'calendar.addons.current.event.write', true],
      ['View your calendar events', 'calendar.events.readonly', true],
      ['See your email address', 'userinfo.email', true],
      ['Connect to external services', 'script.external_request', true],
      ['Manage triggers', 'script.scriptapp', true],
    ]);
    expect(element.querySelector('#google-calendar td span.font-mono')).toBeTruthy();
  });

  it('lists everything the Cal.com app accesses with its reason', () => {
    expect(rows('calcom').map(([label, , reason]) => [label, reason])).toEqual([
      ['Install on your account or team', true],
      ["Read the event type you're editing", true],
      ['Save your server choice on the event type', true],
      ["See the organizer's email address", true],
      ["Read the booking when it's created", true],
      ['Add the meeting link to the booking', true],
      ['Know when a booking is cancelled', true],
      ['Connect to external services', true],
    ]);
    expect(element.querySelector('#calcom td span.font-mono')).toBeNull();
  });

  it('links each subsection to the privacy policy', () => {
    for (const section of ['google-calendar', 'calcom']) {
      expect(element.querySelector(`#${section} a[href="/privacy"]`), section).toBeTruthy();
    }
  });
});
