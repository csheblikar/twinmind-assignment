import { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CaptureButton from '@/components/CaptureButton';
import MaterialTopTabs from '@/components/MaterialTopTabs';
import ProgressCard from '@/components/ProgressCard';
import { useTopAppBar } from '@/context/top-app-bar';
import theme from '@/lib/theme';

export default function DashboardTabsLayout() {
  const renderActionButton = useCallback(
    () => (
      <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Text style={{ color: theme.colors.primary, fontSize: 14, fontWeight: '600' }}>Help</Text>
      </TouchableOpacity>
    ),
    []
  );

  useTopAppBar({
    actionButton: renderActionButton,
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <ProgressCard />
      </View>

      <MaterialTopTabs>
        <MaterialTopTabs.Screen name="index" options={{ title: 'Memories' }} />
        <MaterialTopTabs.Screen name="calendar" options={{ title: 'Calendar' }} />
        <MaterialTopTabs.Screen name="questions" options={{ title: 'Questions' }} />
      </MaterialTopTabs>

      <SafeAreaView edges={['bottom']} style={{ padding: 16 }}>
        <CaptureButton />
      </SafeAreaView>
    </View>
  );
}
