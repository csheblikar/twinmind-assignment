import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type CaptureButtonProps = {
  hideIcon?: boolean;
  small?: boolean;
  payload?: Record<string, string>;
};

export default function CaptureButton({
  hideIcon = false,
  small = false,
  payload,
}: CaptureButtonProps) {
  const router = useRouter();

  const handlePress = async () => {
    const id = randomUUID();
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
