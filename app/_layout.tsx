import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

import { AuthProvider } from '@/context/auth';
import { migrateDatabase } from '@/lib/sqlite/migrations';
import theme from '@/lib/theme';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="twinmind.db" onInit={migrateDatabase}>
      <AuthProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.colors.background },
            headerShown: false,
          }}
        />
      </AuthProvider>
    </SQLiteProvider>
  );
}
