import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignInButton from '@/components/SignInButton';
import { useAuth } from '@/context/auth';

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  return (
    <LinearGradient colors={['#1A587D', '#F39140']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/twinmind-logo.png')} style={styles.logo} />
          <Text style={styles.subtitle}>
            To get the best out of TwinMind, pick the account with your main calendar.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <SignInButton
            label="Continue with Google"
            icon={require('@/assets/images/google-icon.png')}
            onPress={async () => {
              await signInWithGoogle();
              router.replace('/');
            }}
          />
          <SignInButton
            label="Continue with Apple"
            icon={require('@/assets/images/apple-icon.png')}
            onPress={() => {
              Alert.alert(
                'Unsupported',
                'Apple Sign-In is not implemented in this version of the app.'
              );
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    width: '100%',
    gap: 16,
    marginTop: 44,
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: 177,
    height: 177,
    elevation: 1,
  },
  subtitle: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 24,
  },
});
