import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SignInButtonProps = {
  label: string;
  icon: any; // Replace with a more specific type if needed
} & React.ComponentPropsWithoutRef<typeof TouchableOpacity>;

export default function SignInButton({ label, icon, ...rest }: SignInButtonProps) {
  return (
    <TouchableOpacity {...rest}>
      <View style={styles.container}>
        <Image source={icon} style={styles.icon} contentFit="contain" />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 26,
    gap: 8,
    elevation: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
