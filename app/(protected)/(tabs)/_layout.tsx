import MaterialTopTabs from '@/components/MaterialTopTabs';

export default function DashboardTabsLayout() {
  return (
    <MaterialTopTabs>
      <MaterialTopTabs.Screen name="index" options={{ title: 'Memories' }} />
      <MaterialTopTabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <MaterialTopTabs.Screen name="questions" options={{ title: 'Questions' }} />
    </MaterialTopTabs>
  );
}
