import { format } from 'date-fns';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Memory } from '@/lib/sqlite/memories';
import { useRouter } from 'expo-router';

export default function MemoryCard({ data }: { data: Memory }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(protected)/memories/[id]',
      params: {
        id: data.id,
        payload: JSON.stringify(data),
      },
    });
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Text style={styles.subtext}>{format(data.createdAt, 'hh:mm a')}</Text>
      <Text style={styles.titleText}>{data.title}</Text>
      <Text style={styles.subtext}>0m</Text>
    </Pressable>
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
