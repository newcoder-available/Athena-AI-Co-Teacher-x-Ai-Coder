import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { User, Sparkles, GraduationCap } from 'lucide-react-native';
import type { TranscriptEntry } from '../types/mobile';

interface LiveTranscriptSheetProps {
  entries: TranscriptEntry[];
}

export const LiveTranscriptSheet: React.FC<LiveTranscriptSheetProps> = ({ entries }) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (entries.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [entries]);

  const renderItem = ({ item }: { item: TranscriptEntry }) => {
    const isAthena = item.role === 'athena';
    const isTeacher = item.role === 'teacher';

    return (
      <View
        style={[
          styles.bubbleContainer,
          isAthena
            ? styles.athenaBubble
            : isTeacher
            ? styles.teacherBubble
            : styles.studentBubble,
        ]}
      >
        <View style={styles.bubbleHeader}>
          {isAthena ? (
            <Sparkles size={14} color="#a855f7" />
          ) : isTeacher ? (
            <GraduationCap size={14} color="#3b82f6" />
          ) : (
            <User size={14} color="#10b981" />
          )}
          <Text
            style={[
              styles.speakerName,
              {
                color: isAthena ? '#c084fc' : isTeacher ? '#60a5fa' : '#34d399',
              },
            ]}
          >
            {item.speaker}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
        </View>

        <Text style={styles.bubbleText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Live Voice Transcript</Text>
      <FlatList
        ref={flatListRef}
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Waiting for spoken conversation...</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  sectionHeader: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  listContent: {
    gap: 8,
    paddingBottom: 8,
  },
  bubbleContainer: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
  },
  athenaBubble: {
    backgroundColor: 'rgba(88, 28, 135, 0.25)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  teacherBubble: {
    backgroundColor: 'rgba(30, 58, 138, 0.25)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  studentBubble: {
    backgroundColor: 'rgba(6, 78, 59, 0.25)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  speakerName: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: '#64748b',
  },
  bubbleText: {
    color: '#f1f5f9',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
