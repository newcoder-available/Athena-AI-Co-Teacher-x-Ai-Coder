import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, XCircle, Timer, Award } from 'lucide-react-native';
import type { PublicQuiz } from '@echosphere/shared-types';

interface InteractiveQuizCardProps {
  quiz: PublicQuiz;
  onSelectOption: (optionIndexOrText: string) => void;
  selectedOption?: string | null;
  revealed?: boolean;
  correctAnswer?: string | null;
}

export const InteractiveQuizCard: React.FC<InteractiveQuizCardProps> = ({
  quiz,
  onSelectOption,
  selectedOption,
  revealed = false,
  correctAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (revealed) return;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((quiz.deadline - now) / 1000));
    setTimeLeft(remaining > 0 ? remaining : 15);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [revealed, quiz.quizId, quiz.deadline]);

  const options = quiz.options || [];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Award size={16} color="#38bdf8" />
          <Text style={styles.badgeText}>
            Voice Quiz {quiz.setIndex ? `• Question ${quiz.setIndex}/${quiz.setTotal || 3}` : '• Spoken Check'}
          </Text>
        </View>
        <View style={styles.timerBadge}>
          <Timer size={14} color={timeLeft <= 5 ? '#f87171' : '#38bdf8'} />
          <Text style={[styles.timerText, timeLeft <= 5 && { color: '#f87171' }]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      <Text style={styles.questionPrompt}>{quiz.question}</Text>

      <View style={styles.optionsList}>
        {options.map((optText, idx) => {
          const optKey = String(idx);
          const isSelected = selectedOption === optKey || selectedOption === optText;
          const isCorrect = correctAnswer === optKey || correctAnswer === optText;
          let optStyle = styles.optionItem;
          let textColor = '#e2e8f0';

          if (revealed) {
            if (isCorrect) {
              optStyle = { ...styles.optionItem, ...styles.correctOption };
              textColor = '#4ade80';
            } else if (isSelected && !isCorrect) {
              optStyle = { ...styles.optionItem, ...styles.wrongOption };
              textColor = '#f87171';
            }
          } else if (isSelected) {
            optStyle = { ...styles.optionItem, ...styles.selectedOption };
            textColor = '#60a5fa';
          }

          const letter = String.fromCharCode(65 + idx);

          return (
            <TouchableOpacity
              key={idx}
              disabled={revealed}
              activeOpacity={0.7}
              style={optStyle}
              onPress={() => onSelectOption(optKey)}
            >
              <View style={styles.optionKeyCircle}>
                <Text style={styles.optionKeyText}>{letter}</Text>
              </View>
              <Text style={[styles.optionText, { color: textColor }]}>{optText}</Text>
              {revealed && isCorrect && <CheckCircle2 size={18} color="#4ade80" />}
              {revealed && isSelected && !isCorrect && <XCircle size={18} color="#f87171" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  timerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  questionPrompt: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 14,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    gap: 10,
  },
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  correctOption: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  wrongOption: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  optionKeyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionKeyText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
