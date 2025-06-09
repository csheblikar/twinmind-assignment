import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import TopAppBar from '@/components/TopAppBar';
import { useAuth } from '@/context/auth';
import { TopAppBarProvider } from '@/context/top-app-bar';
import theme from '@/lib/theme';

export default function ProtectedLayout() {
  const { firebaseUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!firebaseUser) {
    return <Redirect href="/login" />;
  }

  return (
    <TopAppBarProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '500',
          },
          headerBackTitleStyle: {
            fontSize: 18,
          },
          header(props) {
            return <TopAppBar {...props} />;
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: 'Home' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </TopAppBarProvider>
  );
}
