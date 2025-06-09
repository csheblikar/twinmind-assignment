import { usePathname } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import MemoryCard from '@/components/MemoryCard';
import { getAllMemories, Memory } from '@/lib/sqlite/memories';
import theme from '@/lib/theme';
import { format, parseISO } from 'date-fns';

function EmptyState() {
  return (
    <View style={[styles.container, styles.emptyState]}>
      <Text>You don&apos;t have any memories.</Text>
      <Text>
        <Text style={styles.bold}>Click &apos;Capture&apos; below</Text> to get started!
      </Text>
    </View>
  );
}

function MemoryList({ data }: { data: Memory[] }) {
  const groupedMemories = useMemo(
    () =>
      data.reduce<Record<string, Memory[]>>((acc, ev) => {
        const key = format(ev.createdAt, 'yyyy-MM-dd');
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
      {Object.keys(groupedMemories).map((date) => (
        <View key={date} style={{ gap: 16 }}>
          <Text style={{ fontSize: 18, color: '#646464' }}>
            {format(new Date(parseISO(date)), 'E, MMM d')}
          </Text>
          {groupedMemories[date].map((mem) => (
            <MemoryCard key={mem.id} data={mem} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function Memories() {
  const db = useSQLiteContext();
  const pathname = usePathname();

  const [data, setData] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMemories(db)
      .then((memories) => setData(memories))
      .finally(() => setLoading(false));
  }, [db, pathname]);

  if (loading) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {data.length === 0 ? <EmptyState /> : <MemoryList data={data} />}
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
    gap: 12,
  },
  bold: {
    fontWeight: '600',
  },
});
