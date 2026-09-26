import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { AthenaVoiceOrb } from '../components/AthenaVoiceOrb';
import { MobileCodeEditor } from '../components/MobileCodeEditor';
import { VoiceControlBar } from '../components/VoiceControlBar';
import { aiCoderEngine } from '../services/aiCoderEngine';
import { agoraVoiceService } from '../services/agoraVoiceService';
import { Sparkles, Terminal, Code2, Play, Mic, MessageSquare } from 'lucide-react-native';
import type { CodeSnippet } from '../types/mobile';

interface AICoderScreenProps {
  userName: string;
  onLeave: () => void;
  onSwitchToClassroom: () => void;
}

export const AICoderScreen: React.FC<AICoderScreenProps> = ({
  userName,
  onLeave,
  onSwitchToClassroom,
}) => {
  const snippets = aiCoderEngine.getSnippets();
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet>(snippets[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [agentState, setAgentState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('LISTENING');
  const [voiceQueryInput, setVoiceQueryInput] = useState('');
  const [spokenFeedback, setSpokenFeedback] = useState<string>(
    `Hi ${userName}! I'm your AI Pair Programmer. Say "Athena, explain this function" or tap a command below.`
  );

  const handleSelectSnippet = (index: number) => {
    setCurrentSnippetIndex(index);
    setCurrentSnippet(snippets[index]);
  };

  const handleVoiceCommand = async (command: string) => {
    setAgentState('THINKING');
    setVoiceQueryInput('');
    try {
      const result = await aiCoderEngine.processVoiceCommand(command, currentSnippet);
      setAgentState('SPEAKING');
      setSpokenFeedback(result.spokenResponse);

      if (result.updatedCode) {
        setCurrentSnippet((prev) => ({
          ...prev,
          code: result.updatedCode!,
          explanation: result.explanation,
        }));
      } else if (result.explanation) {
        setCurrentSnippet((prev) => ({
          ...prev,
          explanation: result.explanation,
        }));
      }

      // Return to listening after speech
      setTimeout(() => {
        setAgentState('LISTENING');
      }, 4000);
    } catch (e) {
      setAgentState('LISTENING');
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleBadge}>
            <Code2 size={16} color="#c084fc" />
            <Text style={styles.title}>ATHENA AI CODER</Text>
          </View>
          <Text style={styles.subtitle}>Voice-First Mobile Pair Programming</Text>
        </View>

        <View style={styles.engineBadge}>
          <Text style={styles.engineText}>Agora ConvoAI</Text>
        </View>
      </View>

      {/* Snippet Selection Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {snippets.map((snip, idx) => (
            <TouchableOpacity
              key={snip.id}
              style={[styles.snippetTab, currentSnippetIndex === idx && styles.activeSnippetTab]}
              onPress={() => handleSelectSnippet(idx)}
            >
              <Text
                style={[
                  styles.snippetTabText,
                  currentSnippetIndex === idx && styles.activeSnippetTabText,
                ]}
              >
                {snip.title.split(' ')[0]} ({snip.language})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Compact Voice Orb & Spoken Feedback */}
      <View style={styles.voiceSection}>
        <View style={styles.orbWrapper}>
          <AthenaVoiceOrb
            state={agentState}
            volume={agentState === 'SPEAKING' ? 65 : 20}
            subTitle="Hands-Free Voice Coder"
          />
        </View>

        <View style={styles.speechBubble}>
          <View style={styles.speechHeader}>
            <Sparkles size={14} color="#c084fc" />
            <Text style={styles.speechAuthor}>Athena Voice Output:</Text>
          </View>
          <Text style={styles.speechContent}>{spokenFeedback}</Text>
        </View>
      </View>

      {/* Code Viewer / Editor Area */}
      <View style={styles.codeArea}>
        <MobileCodeEditor
          snippet={currentSnippet}
          onVoiceExplain={() => handleVoiceCommand(`Explain the logic and architecture of ${currentSnippet.title}`)}
          onRunTest={() => handleVoiceCommand(`Run unit tests and boundary analysis on this ${currentSnippet.language} code`)}
          onApplyFix={() => handleVoiceCommand(`Optimize and fix safety checks for ${currentSnippet.title}`)}
        />
      </View>

      {/* Voice Prompt Suggestions */}
      <View style={styles.promptsRow}>
        <TouchableOpacity
          style={styles.promptChip}
          onPress={() => handleVoiceCommand('How does time and space complexity scale?')}
        >
          <Text style={styles.promptText}>⚡ Complexity?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.promptChip}
          onPress={() => handleVoiceCommand('Find and fix potential runtime errors')}
        >
          <Text style={styles.promptText}>🐛 Fix Bugs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.promptChip}
          onPress={() => handleVoiceCommand('Walk through line by line step-by-step')}
        >
          <Text style={styles.promptText}>🔍 Step-by-Step</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Voice Control Bar */}
      <VoiceControlBar
        isMuted={isMuted}
        isSpeakerOn={isSpeakerOn}
        currentMode="coder"
        onToggleMute={handleToggleMute}
        onToggleSpeaker={handleToggleSpeaker}
        onToggleMode={onSwitchToClassroom}
        onLeaveSession={onLeave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070a12',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(192, 132, 252, 0.15)',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  engineBadge: {
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
  },
  engineText: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '700',
  },
  tabsContainer: {
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  snippetTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#131c2e',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  activeSnippetTab: {
    backgroundColor: 'rgba(192, 132, 252, 0.2)',
    borderColor: '#c084fc',
  },
  snippetTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeSnippetTabText: {
    color: '#f8fafc',
  },
  voiceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 12,
  },
  orbWrapper: {
    transform: [{ scale: 0.75 }],
    width: 110,
    alignItems: 'center',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.2)',
  },
  speechHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  speechAuthor: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '700',
  },
  speechContent: {
    color: '#e2e8f0',
    fontSize: 12,
    lineHeight: 16,
  },
  codeArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  promptsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  promptChip: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  promptText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
});
