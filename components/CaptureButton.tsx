import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { insertMemory, Memory } from '@/lib/sqlite/memories';

type CaptureButtonProps = {
  hideIcon?: boolean;
  small?: boolean;
  payload?: Omit<Memory, 'id' | 'createdAt'>;
};

export default function CaptureButton({
  hideIcon = false,
  small = false,
  payload,
}: CaptureButtonProps) {
  const db = useSQLiteContext();
  const router = useRouter();

  const handlePress = async () => {
    const id = await insertMemory(db, {
      title: payload?.title || 'Untitled',
      calendarId: payload?.calendarId,
    });
    router.push({
      pathname: '/(protected)/memories/[id]',
      params: { id, capture: 'true' },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {!hideIcon && <MaterialIcons name="mic" size={small ? 20 : 24} color="white" />}
      <Text style={[styles.text, { fontSize: small ? 12 : 18, fontWeight: small ? '500' : '600' }]}>
        Capture
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#21597c',
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});
