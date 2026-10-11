import { DefaultServer } from '../../types/common';

export interface Step {
  title: string;
  description: string;
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
