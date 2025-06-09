import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export default function ProgressCard({ currentHours = 159, goalHours = 100 }) {
  const rawRatio = currentHours / goalHours;
  const fillRatio = rawRatio >= 1 ? 1 : rawRatio;

  const barColor = rawRatio >= 1 ? '#FF3B30' : '#FF9500';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={styles.headerText}>Capture 100 Hours to Unlock Features</Text>
          <Text style={styles.titleText}>Building Your Second Brain</Text>
        </View>
        <Image
          source="https://placehold.co/64/png"
          style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden' }}
        />
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${fillRatio * 100}%`,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>

        <Text style={styles.progressLabel}>
          {currentHours} / {goalHours} hours
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 13,
    color: '#FF7500',
  },
  titleText: {
    fontSize: 18,
    color: '#1C1C1E',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3A3A3C',
  },
});
