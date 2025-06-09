import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CaptureButton from '@/components/CaptureButton';
import MaterialTopTabs from '@/components/MaterialTopTabs';

export default function DashboardTabsLayout() {
  return (
    <View style={{ flex: 1 }}>
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
