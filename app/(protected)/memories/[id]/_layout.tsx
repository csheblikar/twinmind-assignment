import { RecordingPresets, useAudioRecorder } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MaterialTopTabs from '@/components/MaterialTopTabs';
import { useTopAppBar } from '@/context/top-app-bar';
import { useRecordingPermissions } from '@/hooks/audio';
import theme from '@/lib/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type TSearchParams = {
  id: string;
  capture?: 'true';
};

export default function MemoryLayout() {
  const { id, capture } = useLocalSearchParams<TSearchParams>();

  const [status, requestPermission] = useRecordingPermissions();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [isRecording, setIsRecording] = useState(false);

  const shouldRecord = capture === 'true' && status?.granted;

  const renderTitle = useCallback(
    () => (
      <View>
        <Text>00:00</Text>
      </View>
    ),
    []
  );

  const renderActionButton = useCallback(
    () =>
      shouldRecord ? (
        <TouchableOpacity>
          <MaterialIcons name="share" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      ) : null,
    [shouldRecord]
  );

  useTopAppBar({
    title: renderTitle,
    actionButton: renderActionButton,
  });

  const startRecording = useCallback(async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
    console.log('Recording started');
  }, [audioRecorder]);

  const stopRecording = useCallback(async () => {
    await audioRecorder.stop();
    setIsRecording(false);
    const uri = audioRecorder.uri;
    if (!uri) {
      console.error('No recording URI found');
      return;
    }

    const filename = uri.split('/').pop();

    const recordingsDir = FileSystem.documentDirectory + 'recordings/';
    await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });

    const newUri = recordingsDir + filename;
    await FileSystem.moveAsync({ from: uri, to: newUri });
    console.log('Recording stopped and saved to:', newUri);
  }, [audioRecorder]);

  useEffect(() => {
    if (capture !== 'true') return;

    async function checkPermissionsAndStartRecording() {
      if (!status?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert(
            'Recording Permission Denied',
            'Please enable microphone access in your device settings to record audio.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return;
        }

        await startRecording();
      }
    }

    checkPermissionsAndStartRecording();
  }, [capture, requestPermission, startRecording, status?.granted]);

  return (
    <View style={{ flex: 1 }}>
      <MaterialTopTabs>
        <MaterialTopTabs.Screen name="index" options={{ title: 'Questions' }} />
        <MaterialTopTabs.Screen name="notes" options={{ title: 'Notes' }} />
        <MaterialTopTabs.Screen name="transcript" options={{ title: 'Transcript' }} />
      </MaterialTopTabs>

      <SafeAreaView edges={['bottom']} style={{ padding: 16 }}>
        {isRecording && (
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: 'red',
              borderRadius: 99,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={stopRecording}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Stop</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}
