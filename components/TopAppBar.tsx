import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth';
import theme from '@/lib/theme';

export default function TopAppBar({ back, navigation, options }: NativeStackHeaderProps) {
  // const topAppBarOptions = useTopAppBarOptions();
  const { firebaseUser } = useAuth(); // TODO: get the user's pro status here
  const [isPro] = useState(true); // Placeholder for pro status, replace with actual logic

  return (
    <SafeAreaView style={[styles.safeArea, options.headerStyle]} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.actionButton, styles.left]}
          onPress={() => {
            if (back) {
              navigation.goBack();
            } else {
              navigation.navigate('settings');
            }
          }}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          {back ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="chevron-left" size={28} color={theme.colors.primary} />
              <Text style={[options.headerBackTitleStyle, { color: theme.colors.primary }]}>
                Back
              </Text>
            </View>
          ) : (
            <Image src={firebaseUser?.photoURL || undefined} style={styles.avatar} />
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[
              options.headerTitleStyle,
              styles.title,
              !back && { color: theme.colors.primary },
            ]}
            numberOfLines={1}
          >
            {back ? options.title : 'TwinMind'}
          </Text>
          {!back && isPro && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Pro</Text>
            </View>
          )}
        </View>

        {/* {topAppBarOptions.actionButton && (
          <View style={[styles.actionButton, styles.right]}>
            <topAppBarOptions.actionButton />
          </View>
        )} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  container: {
    position: 'relative',
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  actionButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  titleContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {},
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    elevation: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textTransform: 'uppercase',
  },
});
