import { format, isWithinInterval, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CaptureButton from './CaptureButton';

function formatTimeRange(start: string, end: string): string {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  const startMeridiem = format(startDate, 'a');
  const endMeridiem = format(endDate, 'a');

  if (startMeridiem === endMeridiem) {
    return `${format(startDate, 'h:mm')} - ${format(endDate, 'h:mm a')}`;
  } else {
    return `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
  }
}

export default function EventCard({ data }: { data: GoogleApis.GoogleCalendarEvent }) {
  const isEventHappeningNow = useMemo(() => {
    const startDate = parseISO(data.start.dateTime);
    const endDate = parseISO(data.end.dateTime);
    const now = new Date();

    return isWithinInterval(now, { start: startDate, end: endDate });
  }, [data.start.dateTime, data.end.dateTime]);

  return (
    <View
      style={[styles.container, isEventHappeningNow ? styles.activeEvent : styles.inactiveEvent]}
    >
      <View
        style={{
          width: 4,
          height: 44,
          backgroundColor: isEventHappeningNow ? '#338af3' : '#ababab',
          borderRadius: 2,
        }}
      />
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={{ fontWeight: '500', fontSize: 15, color: '#434343' }}>{data.summary}</Text>
        <View style={styles.timeRow}>
          <Text numberOfLines={1} style={{ fontSize: 12, color: '#434343' }}>
            {formatTimeRange(data.start.dateTime, data.end.dateTime)}
          </Text>
          {isEventHappeningNow && (
            <View style={styles.nowBadge}>
              <Text style={styles.nowBadgeText}>Now</Text>
            </View>
          )}
        </View>
      </View>
      {isEventHappeningNow && (
        <CaptureButton hideIcon small payload={{ title: data.summary, calendarId: data.id }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.125,
    shadowRadius: 1,
    elevation: 2,
    borderWidth: 1,
  },
  activeEvent: {
    borderColor: '#ccdae6',
    backgroundColor: '#e9eced',
  },
  inactiveEvent: {
    borderColor: '#f1f1f1',
    backgroundColor: '#f1f1f1',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nowBadge: {
    backgroundColor: '#ffaf6c',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  nowBadgeText: {
    fontSize: 8,
    textTransform: 'uppercase',
  },
});
