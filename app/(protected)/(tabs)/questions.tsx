import { StyleSheet, Text, View } from 'react-native';

import theme from '@/lib/theme';

export default function Questions() {
  // get all questions from the database

  return (
    <View style={[styles.container, styles.emptyState]}>
      <Text>Want to learn something fun today?</Text>
      <Text>
        Go ahead and{' '}
        <Text
          style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}
          onPress={() => {}}
        >
          Ask TwinMind!
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  bold: {
    fontWeight: '600',
  },
});
