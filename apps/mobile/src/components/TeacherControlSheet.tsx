import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal } from 'react-native';
import {
  VolumeX,
  Volume2,
  Users,
  Award,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react-native';

interface TeacherControlSheetProps {
  visible: boolean;
  onClose: () => void;
  isAthenaMuted: boolean;
  allowStudentInitiated: boolean;
  onToggleAthenaMute: () => void;
  onToggleStudentFloor: () => void;
  onStartQuiz: () => void;
  onBringAthena: () => void;
}

export const TeacherControlSheet: React.FC<TeacherControlSheetProps> = ({
  visible,
  onClose,
  isAthenaMuted,
  allowStudentInitiated,
  onToggleAthenaMute,
  onToggleStudentFloor,
  onStartQuiz,
  onBringAthena,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <ShieldCheck size={20} color="#818cf8" />
              <Text style={styles.title}>Teacher Co-Pilot Controls</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            You have absolute veto and real-time override over Athena's voice output.
          </Text>

          {/* Action Cards */}
          <View style={styles.controlsList}>
            {/* Hard Mute Toggle */}
            <View style={styles.controlRow}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Mute Athena (Hard Veto)</Text>
                <Text style={styles.rowDesc}>Cuts Athena off mid-sentence and prevents speech</Text>
              </View>
              <Switch
                value={isAthenaMuted}
                onValueChange={onToggleAthenaMute}
                trackColor={{ false: '#334155', true: '#ef4444' }}
                thumbColor={isAthenaMuted ? '#f87171' : '#cbd5e1'}
              />
            </View>

            {/* Student Initiated Floor */}
            <View style={styles.controlRow}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Allow Student Questions</Text>
                <Text style={styles.rowDesc}>When enabled, students saying "Athena..." get replies</Text>
              </View>
              <Switch
                value={allowStudentInitiated}
                onValueChange={onToggleStudentFloor}
                trackColor={{ false: '#334155', true: '#10b981' }}
                thumbColor={allowStudentInitiated ? '#34d399' : '#cbd5e1'}
              />
            </View>

            {/* Start Spoken Quiz */}
            <TouchableOpacity style={styles.actionButton} onPress={onStartQuiz}>
              <Award size={18} color="#ffffff" />
              <Text style={styles.actionBtnText}>Launch Spoken 3-Question Quiz</Text>
            </TouchableOpacity>

            {/* Bring Athena Agent */}
            <TouchableOpacity style={[styles.actionButton, styles.bringBtn]} onPress={onBringAthena}>
              <Sparkles size={18} color="#ffffff" />
              <Text style={styles.actionBtnText}>Summon Athena Voice Agent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f8fafc',
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  controlsList: {
    gap: 14,
    paddingBottom: 16,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  rowInfo: {
    flex: 1,
    paddingRight: 10,
  },
  rowLabel: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
  },
  rowDesc: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  bringBtn: {
    backgroundColor: '#8b5cf6',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
