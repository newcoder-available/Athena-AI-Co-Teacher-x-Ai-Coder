import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  PhoneOff,
  Sliders,
  Code2,
  BookOpen,
} from 'lucide-react-native';

interface VoiceControlBarProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  isHandRaised?: boolean;
  isTeacher?: boolean;
  currentMode: 'classroom' | 'coder';
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onToggleHand?: () => void;
  onToggleTeacherSheet?: () => void;
  onToggleMode: () => void;
  onLeaveSession: () => void;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({
  isMuted,
  isSpeakerOn,
  isHandRaised = false,
  isTeacher = false,
  currentMode,
  onToggleMute,
  onToggleSpeaker,
  onToggleHand,
  onToggleTeacherSheet,
  onToggleMode,
  onLeaveSession,
}) => {
  return (
    <View style={styles.container}>
      {/* Mic Button */}
      <TouchableOpacity
        style={[styles.circleBtn, isMuted ? styles.mutedBtn : styles.activeBtn]}
        onPress={onToggleMute}
      >
        {isMuted ? <MicOff size={22} color="#f87171" /> : <Mic size={22} color="#ffffff" />}
      </TouchableOpacity>

      {/* Speaker Button */}
      <TouchableOpacity
        style={[styles.circleBtn, isSpeakerOn ? styles.secondaryBtn : styles.mutedBtn]}
        onPress={onToggleSpeaker}
      >
        {isSpeakerOn ? <Volume2 size={22} color="#ffffff" /> : <VolumeX size={22} color="#94a3b8" />}
      </TouchableOpacity>

      {/* Raise Hand (Student) or Teacher Sheet */}
      {isTeacher ? (
        <TouchableOpacity
          style={[styles.circleBtn, styles.teacherBtn]}
          onPress={onToggleTeacherSheet}
        >
          <Sliders size={22} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.circleBtn, isHandRaised ? styles.handActiveBtn : styles.secondaryBtn]}
          onPress={onToggleHand}
        >
          <Hand size={22} color={isHandRaised ? '#ffffff' : '#94a3b8'} />
        </TouchableOpacity>
      )}

      {/* Mode Switch (Classroom <-> AI Coder) */}
      <TouchableOpacity style={[styles.circleBtn, styles.modeBtn]} onPress={onToggleMode}>
        {currentMode === 'classroom' ? (
          <Code2 size={22} color="#38bdf8" />
        ) : (
          <BookOpen size={22} color="#a855f7" />
        )}
      </TouchableOpacity>

      {/* Leave Call */}
      <TouchableOpacity style={[styles.circleBtn, styles.leaveBtn]} onPress={onLeaveSession}>
        <PhoneOff size={22} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 32,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBtn: {
    backgroundColor: '#3b82f6',
  },
  mutedBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  teacherBtn: {
    backgroundColor: '#6366f1',
  },
  handActiveBtn: {
    backgroundColor: '#f59e0b',
  },
  modeBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  leaveBtn: {
    backgroundColor: '#dc2626',
  },
});
