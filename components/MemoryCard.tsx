import { format } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';

import { Memory } from '@/lib/sqlite/memories';

export default function MemoryCard({ data }: { data: Memory }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtext}>{format(data.createdAt, 'hh:mm a')}</Text>
      <Text style={styles.titleText}>{data.title}</Text>
      <Text style={styles.subtext}>0m</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.125,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  subtext: {
    color: '#434343',
    width: 36,
    textAlign: 'center',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#434343',
    flex: 1,
  },
});
