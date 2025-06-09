import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { Text } from 'react-native';

import theme from '@/lib/theme';

const BaseTabs = createMaterialTopTabNavigator();

const defaultScreenOptions: MaterialTopTabNavigationOptions = {
  tabBarStyle: {
    backgroundColor: theme.colors.background,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    zIndex: 0,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: '#666',
  tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
  tabBarLabel: ({ children, color, focused }) => (
    <Text
      style={{
        color,
        fontWeight: focused ? '600' : '400',
      }}
    >
      {children}
    </Text>
  ),
  sceneStyle: { backgroundColor: theme.colors.background },
};

type MaterialTopTabsProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Navigator>;

function MaterialTopTabs({ children, screenOptions, ...rest }: MaterialTopTabsProps) {
  return (
    <BaseTabs.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        ...screenOptions,
      }}
      {...rest}
    >
      {children}
    </BaseTabs.Navigator>
  );
}

MaterialTopTabs.Screen = BaseTabs.Screen;

export default withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof BaseTabs.Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(MaterialTopTabs);
