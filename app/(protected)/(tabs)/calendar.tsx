import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { addDays, endOfDay, format, parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import EventCard from '@/components/EventCard';
import { useAuth } from '@/context/auth';
import { getGoogleCalendarEvents, ListEventsSearchParams } from '@/lib/googleapis/calendar';
import { GoogleApiError } from '@/lib/googleapis/error';

function SyncDisabledState() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.cardTitle}>By connecting your calendar, TwinMind can...</Text>
            <View style={styles.cardHeaderBullet}>
              <MaterialIcons name="check" size={16} color="#33b888" />
              <Text style={styles.cardSubtitle}>Remind you to capture your events</Text>
            </View>
            <View style={styles.cardHeaderBullet}>
              <MaterialIcons name="check" size={16} color="#33b888" />
              <Text style={styles.cardSubtitle}>Remember event titles and attendees</Text>
            </View>
          </View>
          <Image
            source={require('@/assets/images/google-calendar-icon.png')}
            style={styles.cardHeaderIcon}
          />
        </View>
        <Text style={styles.cardBody}>
          To connect your calendar, you have to logout and sign in with Google and check the box
          that says &ldquo;Allow Calendar Access.&rdquo;
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Logout and Sign In with Google</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#0b4f75" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={[styles.container, styles.emptyState]}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: '#e9eeef',
        }}
      >
        <MaterialIcons name="calendar-month" size={64} color="#7c99ac" />
      </View>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 15, textAlign: 'center', color: '#666' }}>
          You don&apos;t have any upcoming events right now!
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'center', color: '#666' }}>
          But that shouldn&apos;t stop you from using TwinMind!
        </Text>
      </View>
    </View>
  );
}

type EventListProps = {
  data: GoogleApis.GoogleCalendarEvent[];
};

function EventList({ data }: EventListProps) {
  const groupedEvents = useMemo(
    () =>
      data.reduce<Record<string, GoogleApis.GoogleCalendarEvent[]>>((acc, ev) => {
        const key = ev.start.dateTime.split('T')[0]; // use the date part of the dateTime
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(ev);
        return acc;
      }, {}),
    [data]
  );

  return (
    <View style={{ flex: 1, gap: 24, marginTop: 12 }}>
      {Object.keys(groupedEvents).map((date) => (
        <View key={date} style={{ gap: 16 }}>
          <Text style={{ fontSize: 18, color: '#646464' }}>
            {format(new Date(parseISO(date)), 'E, MMM d')}
          </Text>
          {groupedEvents[date].map((ev) => (
            <EventCard key={date + ev.id} data={ev} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function Calendar() {
  const { accessToken, hasCalendarPermission, signOut, refreshAccessToken } = useAuth();
  const [events, setEvents] = useState<GoogleApis.GoogleCalendarEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!accessToken || !hasCalendarPermission) return;

    const options: ListEventsSearchParams = {
      eventTypes: 'default',
      orderBy: 'startTime',
      timeMax: endOfDay(addDays(new Date(), 2)),
      timeMin: new Date(),
      singleEvents: true,
    };

    try {
      const data = await getGoogleCalendarEvents(accessToken, options);
      setEvents(data.items);
    } catch (error) {
      if (error instanceof GoogleApiError && error.code === 401) {
        console.error('Google API Error (401), refreshing token…');

        try {
          const newToken = await refreshAccessToken();

          const retryData = await getGoogleCalendarEvents(newToken, options);
          setEvents(retryData.items);
        } catch (retryErr) {
          if (retryErr instanceof GoogleApiError) {
            console.error(
              'Retry after token refresh still failed:',
              retryErr.message,
              retryErr.errors
            );
          } else {
            console.error('Unexpected error on retry:', retryErr);
          }
          await signOut();
        }
      } else {
        if (error instanceof GoogleApiError) {
          console.error('Google API Error:', error.message, error.errors);
        } else {
          console.error('Unexpected Error:', error);
        }
      }
    }
  }, [accessToken, hasCalendarPermission, refreshAccessToken, signOut]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (!hasCalendarPermission) {
    return <SyncDisabledState />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchEvents().finally(() => {
              setRefreshing(false);
            });
          }}
        />
      }
    >
      {events.length === 0 ? <EmptyState /> : <EventList data={events} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    gap: 12,
    borderRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  cardHeaderIcon: {
    width: 48,
    height: 48,
    marginHorizontal: 8,
  },
  cardBody: {
    fontSize: 11,
    color: '#666',
  },
  cardButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: '#e8edee',
    borderRadius: 99,
    borderColor: '#cedbe8',
    borderWidth: 1,
  },
  cardButtonText: {
    color: '#0b4f75',
    fontWeight: '500',
  },
  bold: {
    fontWeight: '600',
  },
});
