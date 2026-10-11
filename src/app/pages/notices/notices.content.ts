/** One permission or data item an app gets, shown as a row of a notices table */
export interface AppAccess {
  label: string;
  /** Technical name: the OAuth scope, or the data the app touches */
  detail: string;
  reason: string;
}

// The OAuth scopes Google shows on install; keep in sync with the add-on manifest
export const GOOGLE_PERMISSIONS: readonly AppAccess[] = [
  {
    label: 'Run as a Google Calendar add-on',
    detail: 'calendar.addons.execute',
    reason: 'To show TOAB Jitsi as a conferencing option and display its panel in your events.',
  },
  {
    label: 'Read the event you have open',
    detail: 'calendar.addons.current.event.read',
    reason: "To check that TOAB Jitsi is the selected conferencing option and get the event's ID.",
  },
  {
    label: 'Update the event you have open',
    detail: 'calendar.addons.current.event.write',
    reason: 'To add the Jitsi meeting link to the event, and replace it when you choose a different server.',
  },
  {
    label: 'View your calendar events',
    detail: 'calendar.events.readonly',
    reason: 'To notice when you save or cancel an event with a TOAB Jitsi meeting, so we can mark the meeting active or cancelled. Only event IDs and their status are sent to our servers.',
  },
  {
    label: 'See your email address',
    detail: 'userinfo.email',
    reason: 'To find your TOAB Jitsi Plugin account and keep your settings linked to you.',
  },
  {
    label: 'Connect to external services',
    detail: 'script.external_request',
    reason: 'To reach our backend service, which creates meetings and lists the Jitsi servers you can choose from.',
  },
  {
    label: 'Manage triggers',
    detail: 'script.scriptapp',
    reason: 'To run the event check above in the background whenever your calendar events change.',
  },
];

// What the Cal.com app reads and writes; keep in sync with the app's handlers
export const CALCOM_ACCESS: readonly AppAccess[] = [
  {
    label: 'Install on your account or team',
    detail: 'App installation record',
    reason: 'To make TOAB Jitsi available as a video location for your event types. Only you, or a team admin for team event types, can install it. No passwords or tokens of yours are stored in it.',
  },
  {
    label: "Read the event type you're editing",
    detail: 'Owner, team, hosts and locations',
    reason: 'To check that you own the event type or are an admin of its team, and that "TOAB Jitsi Video" is its selected location.',
  },
  {
    label: 'Save your server choice on the event type',
    detail: 'Event type app settings',
    reason: 'To remember which Jitsi server you picked, and your TOAB Jitsi account ID, so each booking uses that server.',
  },
  {
    label: "See the organizer's email address",
    detail: "Owner's email, or the first host's email for team event types",
    reason: "To find the organizer's TOAB Jitsi account and list the Jitsi servers they can choose from.",
  },
  {
    label: "Read the booking when it's created",
    detail: 'Booking ID and unique booking ID',
    reason: 'To create a meeting for that booking. Only these two IDs, your TOAB Jitsi account ID and your chosen server are sent to our servers.',
  },
  {
    label: 'Add the meeting link to the booking',
    detail: 'Booking video location',
    reason: 'So you and your attendees get the Jitsi link in the booking confirmation and calendar invite.',
  },
  {
    label: 'Know when a booking is cancelled',
    detail: 'Unique booking ID',
    reason: 'To cancel the matching Jitsi meeting on our servers.',
  },
  {
    label: 'Connect to external services',
    detail: 'TOAB Moderator API, via an Auth0 machine-to-machine login',
    reason: 'To reach our backend service, which creates and cancels meetings and lists your Jitsi servers. These credentials are set by your Cal.com administrator, are never sent to your browser, and are never stored on your event types.',
  },
];
