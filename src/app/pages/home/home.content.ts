import { DefaultServer } from '../../types/common';

export interface Step {
  title: string;
  description: string;
}

export interface GooglePermission {
  label: string;
  scope: string;
  reason: string;
}

// Curated servers shown until the live list loads, or when it can't be loaded
export const FALLBACK_SERVERS: readonly DefaultServer[] = [
  { name: '8x8 Jitsi Meet', serverUrl: 'https://meet.jit.si' },
  { name: 'Brave Talk', serverUrl: 'https://talk.brave.com' },
  { name: 'IONOS Video Chat', serverUrl: 'https://meet.videochat.ionos.com' },
  { name: 'openSUSE Meet', serverUrl: 'https://meet.opensuse.org' }
];

export const HOW_IT_WORKS_STEPS: readonly Step[] = [
  {
    title: 'Install the add-on',
    description: 'Add TOAB Jitsi Plugin to your calendar and sign in with your calendar account.',
  },
  {
    title: 'Choose your Jitsi server',
    description: 'Pick one of the curated public Jitsi servers. Support for your own self-hosted Jitsi server is coming soon.',
  },
  {
    title: 'Create an event',
    description: 'When you create or edit a calendar event, select TOAB Jitsi as the conferencing option. A unique room name is generated for you.',
  },
  {
    title: 'Join the meeting',
    description: 'The plugin adds the Jitsi meeting link to the event, so you and your guests can join with one click.',
  },
];

// The OAuth scopes Google shows on install; keep in sync with the add-on manifest
export const GOOGLE_PERMISSIONS: readonly GooglePermission[] = [
  {
    label: 'Run as a Google Calendar add-on',
    scope: 'calendar.addons.execute',
    reason: 'To show TOAB Jitsi as a conferencing option and display its panel in your events.',
  },
  {
    label: 'Read the event you have open',
    scope: 'calendar.addons.current.event.read',
    reason: "To check that TOAB Jitsi is the selected conferencing option and get the event's ID.",
  },
  {
    label: 'Update the event you have open',
    scope: 'calendar.addons.current.event.write',
    reason: 'To add the Jitsi meeting link to the event, and replace it when you choose a different server.',
  },
  {
    label: 'View your calendar events',
    scope: 'calendar.events.readonly',
    reason: 'To notice when you save or cancel an event with a TOAB Jitsi meeting, so we can mark the meeting active or cancelled. Only event IDs and their status are sent to our servers.',
  },
  {
    label: 'See your email address',
    scope: 'userinfo.email',
    reason: 'To find your TOAB Jitsi Plugin account and keep your settings linked to you.',
  },
  {
    label: 'Connect to external services',
    scope: 'script.external_request',
    reason: 'To reach our backend service, which creates meetings and lists the Jitsi servers you can choose from.',
  },
  {
    label: 'Manage triggers',
    scope: 'script.scriptapp',
    reason: 'To run the event check above in the background whenever your calendar events change.',
  },
];
