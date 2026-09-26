import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Play, Sparkles, HelpCircle, Check, Copy } from 'lucide-react-native';
import type { CodeSnippet } from '../types/mobile';

interface MobileCodeEditorProps {
  snippet: CodeSnippet;
  onVoiceExplain: () => void;
  onRunTest: () => void;
  onApplyFix?: () => void;
}

export const MobileCodeEditor: React.FC<MobileCodeEditorProps> = ({
  snippet,
  onVoiceExplain,
  onRunTest,
  onApplyFix,
}) => {
  const lines = snippet.code.split('\n');

  return (
    <View style={styles.container}>
      {/* Top action toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.langBadge}>
          <Text style={styles.langText}>{snippet.language.toUpperCase()}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onVoiceExplain}>
            <Sparkles size={14} color="#c084fc" />
            <Text style={styles.actionTextPurple}>Explain</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={onRunTest}>
            <Play size={14} color="#4ade80" />
            <Text style={styles.actionTextGreen}>Test</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Code Viewer */}
      <ScrollView horizontal style={styles.horizontalScroll}>
        <ScrollView style={styles.verticalScroll}>
          <View style={styles.codeBlock}>
            {lines.map((line, idx) => (
              <View key={idx} style={styles.codeLine}>
                <Text style={styles.lineNumber}>{idx + 1}</Text>
                <Text style={styles.lineContent}>{line || ' '}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* AI Explanation / Notes Footer */}
      {snippet.explanation ? (
        <View style={styles.aiFooter}>
          <View style={styles.aiHeader}>
            <Sparkles size={14} color="#38bdf8" />
            <Text style={styles.aiTitle}>AI Voice Pair Insight</Text>
          </View>
          <Text style={styles.aiExplanation}>{snippet.explanation}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  langBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  langText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  actionTextPurple: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '600',
  },
  actionTextGreen: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  codeBlock: {
    padding: 12,
    minWidth: 400,
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
  },
  lineNumber: {
    width: 32,
    color: '#475569',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  lineContent: {
    color: '#e2e8f0',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  aiFooter: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.2)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  aiExplanation: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 16,
  },
});
