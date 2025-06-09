import { baseUrl } from './base';
import { GoogleApiError } from './error';

export interface ListEventsSearchParams {
  /**
   * @deprecated
   */
  alwaysIncludeEmail?: boolean;
  eventTypes?:
    | 'birthday'
    | 'default'
    | 'focusTime'
    | 'fromGmail'
    | 'outOfOffice'
    | 'workingLocation';
  iCalUID?: string;
  maxAttendees?: number;
  maxResults?: number;
  orderBy?: 'startTime' | 'updated';
  pageToken?: string;
  privateExtendedProperty?: string;
  q?: string;
  sharedExtendedProperty?: string;
  showDeleted?: boolean;
  showHiddenInvitations?: boolean;
  singleEvents?: boolean;
  syncToken?: string;
  timeMin?: Date;
  timeMax?: Date;
  timeZone?: string;
  updatedMin?: Date;
}

interface ListEventsResponse {
  kind: 'calendar#events';
  etag: string;
  readonly summary: string;
  readonly description: string;
  readonly updated: string;
  readonly timeZone: string;
  readonly accessRole: 'none' | 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  defaultReminders: {
    method: 'email' | 'popup';
    minutes: number;
  }[];
  nextPageToken: string;
  nextSyncToken: string;
  items: GoogleApis.GoogleCalendarEvent[];
}

interface ErrorResponse {
  error: {
    code: number;
    message: string;
    errors: {
      domain: string;
      reason: string;
      message: string;
    }[];
  };
}

/**
 *
 * @param accessToken
 * @param options
 * @returns
 */
export async function getGoogleCalendarEvents(
  accessToken: string,
  options: ListEventsSearchParams = {}
) {
  const searchParams = Object.entries(options).reduce((params, [key, value]) => {
    if (value !== undefined) {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        value = value.toISOString();
      }
      params.append(key, value.toString());
    }
    return params;
  }, new URLSearchParams());

  const url = new URL('/calendar/v3/calendars/primary/events', baseUrl);
  url.search = searchParams.toString();
  console.log('Fetching Google Calendar events from:', url.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    const err = (json as ErrorResponse).error;
    throw new GoogleApiError(err.message, err.code, err.errors);
  }

  return json as ListEventsResponse;
}
