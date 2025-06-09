declare namespace GoogleApis {
  /**
   * Represents a person (creator, organizer, or attendee).
   */
  interface Person {
    /** Read-only: The person's Profile ID, if available. */
    readonly id: string;
    /** Read-only: The person's email address, if available. */
    readonly email: string;
    /** Read-only: The person's display name, if available. */
    readonly displayName: string;
    /** Read-only: Whether this entry represents the authenticated user. */
    readonly self: boolean;
  }

  /**
   * Date-time information for event start/end.
   */
  interface DateTimeInfo {
    /** The date, in "yyyy-mm-dd" format, if this is an all-day event. */
    date: string;
    /** The time, as an RFC3339 combined date-time value. */
    dateTime: string;
    /** The IANA time zone name (e.g. "Europe/Zurich"). */
    timeZone: string;
  }

  /**
   * An attendee of the event.
   */
  interface Attendee {
    /** Read-only: The attendee's Profile ID, if available. */
    readonly id: string;
    /** The attendee's email address. (Required when adding an attendee.) */
    email: string;
    /** The attendee's display name, if available. Optional. */
    displayName?: string;
    /** Read-only: Whether the attendee is the organizer of the event. */
    readonly organizer: boolean;
    /** Read-only: Whether this entry represents the authenticated user. */
    readonly self: boolean;
    /** Whether the attendee is a resource. Optional. */
    resource?: boolean;
    /** Whether this is an optional attendee. Optional (default: false). */
    optional?: boolean;
    /**
     * The attendee's response status.
     * Possible values: "needsAction", "declined", "tentative", "accepted".
     */
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    /** The attendee's response comment. Optional. */
    comment?: string;
    /** Number of additional guests. Optional (default: 0). */
    additionalGuests?: number;
  }

  /**
   * Extended properties (private and shared).
   */
  interface ExtendedProperties {
    /** Private properties visible only on this copy of the event. */
    private: Record<string, string>;
    /** Properties shared between copies of the event on other attendees' calendars. */
    shared: Record<string, string>;
  }

  /** Key identifying a conference solution (e.g., Meet, add-on). */
  interface ConferenceSolutionKey {
    /** The conference solution type (e.g., "hangoutsMeet", "addOn"). */
    type: string;
  }

  /** Status of a conference-create request. */
  interface CreateRequestStatus {
    /** Read-only: The status of the conference create request. "pending" | "success" | "failure". */
    readonly statusCode: 'pending' | 'success' | 'failure';
  }

  /**
   * A request to create a conference (e.g., a Meet link).
   */
  interface CreateRequest {
    /** Client-generated unique ID for this conference-create request. */
    requestId: string;
    /** The conference solution key. */
    conferenceSolutionKey: ConferenceSolutionKey;
    /** Read-only: The status of the conference create request. */
    readonly status: CreateRequestStatus;
  }

  /**
   * One entry point for a conference (e.g., a join URL or phone number).
   */
  interface EntryPoint {
    /** The type of entry point: "video" | "phone" | "sip" | "more". */
    entryPointType: string;
    /**
     * The URI to join.
     * - For "video" or "more": must start with "http:" or "https:".
     * - For "phone": must start with "tel:".
     * - For "sip": must start with "sip:".
     * Optional.
     */
    uri?: string;
    /** The user-visible label for this entry point. */
    label: string;
    /** The PIN to access the conference. Optional. */
    pin?: string;
    /** The access code to access the conference. Optional. */
    accessCode?: string;
    /** The meeting code for the conference. Optional. */
    meetingCode?: string;
    /** The passcode for the conference. Optional. */
    passcode?: string;
    /** The password for the conference. Optional. */
    password?: string;
  }

  /**
   * Details about the conference solution (e.g., Meet).
   */
  interface ConferenceSolution {
    /** Read-only: The key that uniquely identifies the conference solution. */
    readonly key: ConferenceSolutionKey;
    /** Read-only: User-visible name of this solution. */
    readonly name: string;
    /** Read-only: URI of the icon for this solution. */
    readonly iconUri: string;
  }

  /**
   * Conference-related information (e.g., Meet links).
   */
  interface ConferenceData {
    /** A request to generate a new conference and attach it to the event. */
    createRequest: CreateRequest;
    /** Read-only: Information about individual entry points (URLs, phone numbers). */
    readonly entryPoints: EntryPoint[];
    /** Read-only: The conference solution (e.g., Google Meet). */
    readonly conferenceSolution: ConferenceSolution;
    /** Read-only: The ID of the conference. Optional. */
    readonly conferenceId?: string;
    /** Read-only: The signature of the conference data. Optional. */
    readonly signature?: string;
    /** Read-only: Additional notes (HTML) for the conference. Optional. */
    readonly notes?: string;
  }

  /**
   * @deprecated Gadgets are deprecated; used only for birthday calendar metadata.
   */
  interface Gadget {
    /** @deprecated The gadget's type. */
    type: string;
    /** @deprecated The gadget's title. */
    title: string;
    /** @deprecated URL link to the gadget. */
    link: string;
    /** @deprecated URL link to the gadget's icon. */
    iconLink: string;
    /** @deprecated The gadget's width in pixels. Optional. */
    width?: number;
    /** @deprecated The gadget's height in pixels. Optional. */
    height?: number;
    /** @deprecated The gadget's display mode. */
    display: string;
    /** @deprecated Preferences for the gadget. */
    preferences: Record<string, string>;
  }

  /**
   * One override for an event reminder.
   */
  interface RemindersOverride {
    /** The method used by this reminder: "email" or "popup". */
    method: 'email' | 'popup';
    /** Minutes before start when the reminder should trigger (0–40320). */
    minutes: number;
  }

  /**
   * Reminder settings for the event.
   */
  interface Reminders {
    /** Whether the default reminders apply. */
    useDefault: boolean;
    /** If not using defaults, a list of overrides. */
    overrides: RemindersOverride[];
  }

  /**
   * The source from which the event was created.
   */
  interface Source {
    /** The source URL (HTTP or HTTPS). */
    url: string;
    /** Title of the source (e.g., a webpage title or email subject). */
    title: string;
  }

  /** A custom working location. */
  interface CustomLocation {
    /** A label for the custom location. */
    label: string;
  }

  /** An office location (building, floor, etc.). */
  interface OfficeLocation {
    /** Building identifier (from resources database). */
    buildingId: string;
    /** Floor identifier. */
    floorId: string;
    /** Floor section identifier. */
    floorSectionId: string;
    /** Desk identifier. */
    deskId: string;
    /** The office label displayed in Calendar UI. */
    label: string;
  }

  /**
   * Working location event data.
   */
  interface WorkingLocationProperties {
    /**
     * Type of working location.
     * - "homeOffice"
     * - "officeLocation"
     * - "customLocation"
     */
    type: 'homeOffice' | 'officeLocation' | 'customLocation';
    /** Present if working at home. */
    homeOffice: any;
    /** Present if working at a custom location. */
    customLocation: CustomLocation;
    /** Present if working from an office. */
    officeLocation: OfficeLocation;
  }

  /**
   * Out-of-office event data.
   */
  interface OutOfOfficeProperties {
    /**
     * How to decline overlapping invitations.
     * - "declineNone"
     * - "declineAllConflictingInvitations"
     * - "declineOnlyNewConflictingInvitations"
     */
    autoDeclineMode:
      | 'declineNone'
      | 'declineAllConflictingInvitations'
      | 'declineOnlyNewConflictingInvitations';
    /** Message to send when declining. Optional. */
    declineMessage?: string;
  }

  /**
   * Focus-time event data.
   */
  interface FocusTimeProperties {
    /**
     * How to decline overlapping invitations during focus time.
     * - "declineNone"
     * - "declineAllConflictingInvitations"
     * - "declineOnlyNewConflictingInvitations"
     */
    autoDeclineMode:
      | 'declineNone'
      | 'declineAllConflictingInvitations'
      | 'declineOnlyNewConflictingInvitations';
    /** Message to send when declining. Optional. */
    declineMessage?: string;
    /** Chat status during focus time: "available" or "doNotDisturb". */
    chatStatus: 'available' | 'doNotDisturb';
  }

  /**
   * A file attachment for the event.
   */
  interface Attachment {
    /** Read-only: ID of the attached file (Drive file's Files resource ID). */
    readonly fileId: string;
    /** URL link to the attachment. Required when adding. */
    fileUrl: string;
    /** MIME type of the attachment. */
    mimeType: string;
    /** URL of the attachment's icon. */
    iconLink: string;
    /** Attachment title. */
    title: string;
  }

  /**
   * Birthday or special event data (eventType = "birthday").
   */
  interface BirthdayProperties {
    /** Read-only: Resource name of the contact (e.g., "people/c12345"). */
    readonly contact: string;
    /**
     * Type of birthday or special event.
     * - "anniversary"
     * - "birthday"
     * - "custom"
     * - "other"
     * - "self"
     */
    type: 'anniversary' | 'birthday' | 'custom' | 'other' | 'self';
    /** Read-only: Custom type label if type = "custom". */
    readonly customTypeName: string;
  }

  interface GoogleCalendarEvent {
    /** Read-only: Type of the resource ("calendar#event"). */
    readonly kind: 'calendar#event';
    /** Read-only: ETag of the resource. */
    readonly etag: string;
    /**
     * Opaque identifier of the event.
     * Writable on creation. If not supplied, it will be auto-generated.
     */
    id: string;
    /**
     * Status of the event.
     * Optional. Possible values: "confirmed", "tentative", "cancelled".
     */
    status?: 'confirmed' | 'tentative' | 'cancelled';
    /** Read-only: Link to view this event in the Web UI. */
    readonly htmlLink: string;
    /** Read-only: Creation timestamp (RFC3339). */
    readonly created: string;
    /** Read-only: Last modification timestamp (RFC3339). */
    readonly updated: string;
    /** Title of the event. */
    summary: string;
    /** Description of the event. Optional. */
    description?: string;
    /** Location of the event. Optional. */
    location?: string;
    /** Color ID for the event. Optional. */
    colorId?: string;

    /** Read-only: The user who created the event. */
    readonly creator: Person;
    /**
     * Read-only (writable only when importing): The event's organizer.
     */
    readonly organizer: Person;

    /** Start time (inclusive). */
    start: DateTimeInfo;
    /** End time (exclusive). */
    end: DateTimeInfo;
    /** Whether the end time is actually unspecified. (Default: false.) */
    endTimeUnspecified: boolean;

    /** List of recurrence rules (RRULE, EXRULE, RDATE, EXDATE). */
    recurrence: string[];
    /** Read-only: If this is an instance of a recurring event, its parent ID. */
    readonly recurringEventId: string;
    /** Read-only: For a recurring instance, the original start time. */
    readonly originalStartTime: DateTimeInfo;

    /** "opaque" (busy) or "transparent" (available). */
    transparency: 'opaque' | 'transparent';
    /**
     * Visibility of the event.
     * Optional. Possible values: "default", "public", "private", "confidential".
     */
    visibility?: 'default' | 'public' | 'private' | 'confidential';

    /** Read-only: Unique RFC5545 UID for the event (used for imports). */
    readonly iCalUID: string;
    /** Sequence number as per iCalendar. */
    sequence: number;

    /** List of attendees. */
    attendees: Attendee[];
    /** Whether attendees may have been omitted. Optional (default: false). */
    attendeesOmitted?: boolean;

    /** Extended properties (private and shared). */
    extendedProperties: ExtendedProperties;

    /** Read-only: Link to associated Google Hangout. */
    readonly hangoutLink: string;
    /** Conference data (e.g., Meet links). */
    conferenceData: ConferenceData;

    /**
     * @deprecated Gadgets are deprecated; only returned for birthday metadata.
     */
    gadget: Gadget;

    /**
     * @deprecated Whether anyone can add themselves to the event. Optional (default: false).
     */
    anyoneCanAddSelf?: boolean;

    /** Can attendees invite others? Optional (default: true). */
    guestsCanInviteOthers?: boolean;
    /** Can attendees modify the event? Optional (default: false). */
    guestsCanModify?: boolean;
    /** Can attendees see other guests? Optional (default: true). */
    guestsCanSeeOtherGuests?: boolean;
    /** If true, event propagation is disabled. Optional (default: false). */
    privateCopy?: boolean;
    /** Read-only: Whether this event copy is locked. */
    readonly locked: boolean;

    /** Read-only: Reminder settings for the event. */
    readonly reminders: Reminders;

    /** The source from which this event was created. */
    source: Source;

    /** Working location event data. */
    workingLocationProperties: WorkingLocationProperties;
    /** Out-of-office event data. */
    outOfOfficeProperties: OutOfOfficeProperties;
    /** Focus-time event data. */
    focusTimeProperties: FocusTimeProperties;

    /** List of file attachments. */
    attachments: Attachment[];

    /** Birthday or special event data. */
    birthdayProperties: BirthdayProperties;

    /** Specific type of event (cannot be changed after creation). */
    eventType:
      | 'birthday'
      | 'default'
      | 'focusTime'
      | 'fromGmail'
      | 'outOfOffice'
      | 'workingLocation';
  }
}
