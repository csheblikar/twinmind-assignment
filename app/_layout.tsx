import { Stack } from 'expo-router';

import { AuthProvider } from '@/context/auth';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
