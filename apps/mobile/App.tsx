import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JoinScreen } from './src/screens/JoinScreen';
import { ClassroomScreen } from './src/screens/ClassroomScreen';
import { AICoderScreen } from './src/screens/AICoderScreen';
import { agoraVoiceService } from './src/services/agoraVoiceService';
import type { Role, ProficiencyTag } from '@echosphere/shared-types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'join' | 'classroom' | 'coder'>('join');
  const [userName, setUserName] = useState('Alex River');
  const [role, setRole] = useState<Role>('student');
  const [sessionId, setSessionId] = useState('demo-room-101');

  const handleJoin = async (params: {
    userName: string;
    role: Role;
    mode: 'classroom' | 'coder';
    sessionId: string;
    level?: ProficiencyTag;
    customAppId?: string;
    customAppCert?: string;
  }) => {
    setUserName(params.userName);
    setRole(params.role);
    setSessionId(params.sessionId);

    // Initialize Agora Voice
    const defaultAppId = params.customAppId || 'demo-agora-app-id';
    agoraVoiceService.initialize(defaultAppId);

    try {
      await agoraVoiceService.joinChannel({
        appId: defaultAppId,
        channelName: params.sessionId,
        token: 'demo-token',
        uid: Math.floor(Math.random() * 100000) + 1,
      });
    } catch (e) {
      console.warn('Voice join notice', e);
    }

    if (params.mode === 'classroom') {
      setCurrentScreen('classroom');
    } else {
      setCurrentScreen('coder');
    }
  };

  const handleLeave = () => {
    agoraVoiceService.leaveChannel();
    setCurrentScreen('join');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {currentScreen === 'join' && <JoinScreen onJoin={handleJoin} />}
        {currentScreen === 'classroom' && (
          <ClassroomScreen
            sessionId={sessionId}
            userName={userName}
            role={role}
            onLeave={handleLeave}
            onSwitchToCoder={() => setCurrentScreen('coder')}
          />
        )}
        {currentScreen === 'coder' && (
          <AICoderScreen
            userName={userName}
            onLeave={handleLeave}
            onSwitchToClassroom={() => setCurrentScreen('classroom')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
});
