import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { AthenaVoiceOrb } from '../components/AthenaVoiceOrb';
import { InteractiveQuizCard } from '../components/InteractiveQuizCard';
import { LiveTranscriptSheet } from '../components/LiveTranscriptSheet';
import { VoiceControlBar } from '../components/VoiceControlBar';
import { TeacherControlSheet } from '../components/TeacherControlSheet';
import { agoraVoiceService } from '../services/agoraVoiceService';
import { orchestratorClient } from '../services/orchestratorClient';
import type { TranscriptEntry } from '../types/mobile';
import type { ClassroomEvent, PublicQuiz, Role } from '@echosphere/shared-types';

interface ClassroomScreenProps {
  sessionId: string;
  userName: string;
  role: Role;
  onLeave: () => void;
  onSwitchToCoder: () => void;
}

export const ClassroomScreen: React.FC<ClassroomScreenProps> = ({
  sessionId,
  userName,
  role,
  onLeave,
  onSwitchToCoder,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isTeacherSheetVisible, setIsTeacherSheetVisible] = useState(false);
  const [isAthenaMuted, setIsAthenaMuted] = useState(false);
  const [allowStudentInitiated, setAllowStudentInitiated] = useState(false);
  const [agentState, setAgentState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'RESTRAINED' | 'MUTED'>('LISTENING');
  const [audioVolume, setAudioVolume] = useState(30);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState<PublicQuiz | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  // Live Transcripts
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([
    {
      id: '1',
      speaker: 'System',
      role: 'teacher',
      text: `Connected to Voice Room: ${sessionId}`,
      timestamp: Date.now() - 10000,
      isFinal: true,
    },
    {
      id: '2',
      speaker: 'Athena',
      role: 'athena',
      text: `Hello ${userName}! I'm Athena, your AI Co-Teacher. I'm tuned in and listening.`,
      timestamp: Date.now() - 4000,
      isFinal: true,
    },
  ]);

  useEffect(() => {
    agoraVoiceService.setCallbacks({
      onAudioVolumeIndication: (speakers) => {
        const athenaSpeaker = speakers.find((s) => s.uid === 'athena');
        if (athenaSpeaker && athenaSpeaker.volume > 20) {
          setAgentState('SPEAKING');
          setAudioVolume(athenaSpeaker.volume);
        } else {
          setAgentState(isAthenaMuted ? 'MUTED' : 'LISTENING');
        }
      },
    });

    const unsubscribe = orchestratorClient.subscribeToEvents(sessionId, (event: ClassroomEvent) => {
      if (event.kind === 'echosphere:policy-changed') {
        setIsAthenaMuted(event.policy.muted);
        setAllowStudentInitiated(event.policy.studentsMayInvoke);
        if (event.policy.muted) setAgentState('MUTED');
      } else if (event.kind === 'echosphere:quiz-issued') {
        setActiveQuiz(event.quiz);
        setSelectedOption(null);
        setQuizRevealed(false);
        setCorrectAnswer(null);
      } else if (event.kind === 'echosphere:quiz-closed') {
        setQuizRevealed(true);
        setCorrectAnswer(event.correctAnswer);
      } else if (event.kind === 'echosphere:transcript') {
        const seg = event.segment;
        const newEntry: TranscriptEntry = {
          id: seg.segmentId,
          speaker: seg.speaker === 'agent' ? 'Athena' : seg.speaker,
          role: seg.speaker === 'agent' ? 'athena' : (seg.speaker as any),
          text: seg.text,
          timestamp: seg.at,
          isFinal: true,
        };
        setTranscripts((prev) => [...prev, newEntry]);
      }
    });

    return () => {
      unsubscribe();
      agoraVoiceService.leaveChannel();
    };
  }, [sessionId, isAthenaMuted]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    agoraVoiceService.setMuted(nextMuted);
  };

  const handleToggleSpeaker = () => {
    const nextSpeaker = !isSpeakerOn;
    setIsSpeakerOn(nextSpeaker);
    agoraVoiceService.toggleSpeakerphone(nextSpeaker);
  };

  const handleToggleHand = async () => {
    const nextHand = !isHandRaised;
    setIsHandRaised(nextHand);
    try {
      await orchestratorClient.raiseHand(sessionId, userName, nextHand);
    } catch (e) {
      console.warn('Hand toggle error', e);
    }
  };

  const handleSelectQuizOption = async (option: string) => {
    if (!activeQuiz || quizRevealed) return;
    setSelectedOption(option);
    try {
      await orchestratorClient.submitQuizAnswer(sessionId, {
        quizId: activeQuiz.quizId,
        participantId: userName,
        answer: option,
        via: 'ui',
      });
    } catch (e) {
      console.warn('Submit quiz error', e);
    }
  };

  const handleToggleAthenaMute = async () => {
    const nextMuted = !isAthenaMuted;
    setIsAthenaMuted(nextMuted);
    setAgentState(nextMuted ? 'MUTED' : 'LISTENING');
    await orchestratorClient.toggleMute(sessionId, nextMuted);
  };

  const handleToggleStudentFloor = async () => {
    const nextFloor = !allowStudentInitiated;
    setAllowStudentInitiated(nextFloor);
    await orchestratorClient.setStudentFloor(sessionId, nextFloor);
  };

  const handleStartQuiz = async () => {
    setIsTeacherSheetVisible(false);
    try {
      await orchestratorClient.startQuiz(sessionId, 'Classroom Core Review');
      if (!activeQuiz) {
        setActiveQuiz({
          quizId: 'q-demo-1',
          topic: 'Voice Architecture',
          question: 'What is the primary benefit of Athena’s hard-mute floor architecture?',
          options: [
            'Prevents AI hallucination from disrupting the teacher',
            'Increases network bandwidth',
            'Limits audio quality to mono',
            'Disables student microphones permanently',
          ],
          difficulty: 'medium',
          targetStudentIds: [],
          createdAt: Date.now(),
          deadline: Date.now() + 15000,
          setIndex: 1,
          setTotal: 3,
        });
      }
    } catch (e) {
      Alert.alert('Quiz Notice', 'Started live 3-question spoken quiz round.');
    }
  };

  const handleBringAthena = async () => {
    setIsTeacherSheetVisible(false);
    try {
      await orchestratorClient.bringAthena(sessionId);
    } catch (e) {
      console.warn('Bring agent error', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Session Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.roomNameText}>Room: {sessionId}</Text>
          <Text style={styles.roleTag}>
            Role: {role.toUpperCase()} {role === 'teacher' ? '👑' : '🎓'}
          </Text>
        </View>
        <View style={styles.floorStatusBadge}>
          <Text style={styles.floorStatusText}>
            {allowStudentInitiated ? 'Floor: Open 🟢' : 'Floor: Teacher 🔒'}
          </Text>
        </View>
      </View>

      {/* Main Voice Visualizer & Interaction Area */}
      <View style={styles.centerArea}>
        <AthenaVoiceOrb
          state={agentState}
          volume={audioVolume}
          subTitle={isAthenaMuted ? 'Muted by Teacher Override' : 'Sub-300ms Conversational Voice AI'}
        />

        {/* Live Quiz Card if Active */}
        {activeQuiz && (
          <InteractiveQuizCard
            quiz={activeQuiz}
            onSelectOption={handleSelectQuizOption}
            selectedOption={selectedOption}
            revealed={quizRevealed}
            correctAnswer={correctAnswer}
          />
        )}

        {/* Live Multi-Party Transcript */}
        <LiveTranscriptSheet entries={transcripts} />
      </View>

      {/* Floating Bottom Control Bar */}
      <VoiceControlBar
        isMuted={isMuted}
        isSpeakerOn={isSpeakerOn}
        isHandRaised={isHandRaised}
        isTeacher={role === 'teacher'}
        currentMode="classroom"
        onToggleMute={handleToggleMute}
        onToggleSpeaker={handleToggleSpeaker}
        onToggleHand={handleToggleHand}
        onToggleTeacherSheet={() => setIsTeacherSheetVisible(true)}
        onToggleMode={onSwitchToCoder}
        onLeaveSession={onLeave}
      />

      {/* Teacher Veto & Control Sheet */}
      <TeacherControlSheet
        visible={isTeacherSheetVisible}
        onClose={() => setIsTeacherSheetVisible(false)}
        isAthenaMuted={isAthenaMuted}
        allowStudentInitiated={allowStudentInitiated}
        onToggleAthenaMute={handleToggleAthenaMute}
        onToggleStudentFloor={handleToggleStudentFloor}
        onStartQuiz={handleStartQuiz}
        onBringAthena={handleBringAthena}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  roomNameText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  roleTag: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  floorStatusBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  floorStatusText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  centerArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});
