import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  Sparkles,
  GraduationCap,
  User,
  Code2,
  Settings,
  ArrowRight,
  Shield,
} from 'lucide-react-native';
import type { Role, ProficiencyTag } from '@echosphere/shared-types';

interface JoinScreenProps {
  onJoin: (params: {
    userName: string;
    role: Role;
    mode: 'classroom' | 'coder';
    sessionId: string;
    level?: ProficiencyTag;
    customAppId?: string;
    customAppCert?: string;
  }) => Promise<void>;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin }) => {
  const [userName, setUserName] = useState('Alex River');
  const [role, setRole] = useState<Role>('student');
  const [mode, setMode] = useState<'classroom' | 'coder'>('classroom');
  const [sessionId, setSessionId] = useState('demo-room-101');
  const [level, setLevel] = useState<ProficiencyTag>('intermediate');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customAppId, setCustomAppId] = useState('');
  const [customAppCert, setCustomAppCert] = useState('');

  const handleStart = async () => {
    if (!userName.trim()) return;
    setLoading(true);
    try {
      await onJoin({
        userName,
        role,
        mode,
        sessionId: sessionId.trim() || 'default-session',
        level,
        customAppId: customAppId.trim() || undefined,
        customAppCert: customAppCert.trim() || undefined,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Banner */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Sparkles size={28} color="#38bdf8" />
          </View>
          <Text style={styles.title}>ATHENA</Text>
          <Text style={styles.tagline}>AI Co-Teacher x AI Coder</Text>
          <View style={styles.hackathonBadge}>
            <Text style={styles.hackathonText}>Agora Voice AI Hackathon</Text>
          </View>
        </View>

        {/* Experience Mode Selector */}
        <Text style={styles.sectionLabel}>Select Experience Mode</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeCard, mode === 'classroom' && styles.activeModeCard]}
            onPress={() => setMode('classroom')}
          >
            <GraduationCap size={22} color={mode === 'classroom' ? '#38bdf8' : '#64748b'} />
            <Text style={[styles.modeTitle, mode === 'classroom' && styles.activeTextBlue]}>
              AI Co-Teacher
            </Text>
            <Text style={styles.modeDesc}>Live audio classroom, quizzes & teacher veto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, mode === 'coder' && styles.activeModeCardPurple]}
            onPress={() => setMode('coder')}
          >
            <Code2 size={22} color={mode === 'coder' ? '#c084fc' : '#64748b'} />
            <Text style={[styles.modeTitle, mode === 'coder' && styles.activeTextPurple]}>
              AI Voice Coder
            </Text>
            <Text style={styles.modeDesc}>Hands-free voice pair programming & debug</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room / Session Code</Text>
          <TextInput
            style={styles.input}
            value={sessionId}
            onChangeText={setSessionId}
            placeholder="e.g. demo-room-101"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
          />
        </View>

        {/* Role Selector (for Classroom mode) */}
        {mode === 'classroom' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleToggleRow}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'student' && styles.activeRoleBtn]}
                onPress={() => setRole('student')}
              >
                <User size={16} color={role === 'student' ? '#38bdf8' : '#94a3b8'} />
                <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>
                  Student
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleBtn, role === 'teacher' && styles.activeRoleBtn]}
                onPress={() => setRole('teacher')}
              >
                <Shield size={16} color={role === 'teacher' ? '#38bdf8' : '#94a3b8'} />
                <Text style={[styles.roleText, role === 'teacher' && styles.activeRoleText]}>
                  Teacher / Host
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Advanced Agora BYOK Toggle */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings size={14} color="#94a3b8" />
          <Text style={styles.advancedToggleText}>
            {showAdvanced ? 'Hide Agora Credentials' : 'Configure Custom Agora Project (BYOK)'}
          </Text>
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedBox}>
            <Text style={styles.advancedNote}>
              Optional: Provide your own Agora App ID & Certificate if using a dedicated project.
            </Text>
            <TextInput
              style={styles.input}
              value={customAppId}
              onChangeText={setCustomAppId}
              placeholder="Agora App ID"
              placeholderTextColor="#64748b"
            />
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={customAppCert}
              onChangeText={setCustomAppCert}
              placeholder="Agora App Certificate"
              placeholderTextColor="#64748b"
              secureTextEntry
            />
          </View>
        )}

        {/* Launch Button */}
        <TouchableOpacity
          style={styles.launchBtn}
          onPress={handleStart}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Text style={styles.launchBtnText}>
                {mode === 'classroom' ? 'Enter Voice Classroom' : 'Launch AI Voice Coder'}
              </Text>
              <ArrowRight size={18} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  hackathonBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  hackathonText: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#131c2e',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  activeModeCard: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  activeModeCardPurple: {
    borderColor: '#c084fc',
    backgroundColor: 'rgba(192, 132, 252, 0.08)',
  },
  modeTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  modeDesc: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  activeTextBlue: {
    color: '#38bdf8',
  },
  activeTextPurple: {
    color: '#c084fc',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#131c2e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  roleToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#131c2e',
    borderRadius: 12,
    padding: 4,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  activeRoleBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  roleText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeRoleText: {
    color: '#38bdf8',
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 10,
  },
  advancedToggleText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  advancedBox: {
    backgroundColor: '#131c2e',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  advancedNote: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 10,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    gap: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  launchBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
