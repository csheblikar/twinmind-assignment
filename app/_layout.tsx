import { Stack } from 'expo-router';

import { AuthProvider } from '@/context/auth';
import theme from '@/lib/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
