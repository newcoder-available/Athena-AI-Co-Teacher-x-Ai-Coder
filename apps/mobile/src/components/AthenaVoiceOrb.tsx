import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { Mic, Volume2, ShieldAlert, Sparkles, Code } from 'lucide-react-native';

interface AthenaVoiceOrbProps {
  state: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'RESTRAINED' | 'MUTED';
  volume?: number;
  onPress?: () => void;
  subTitle?: string;
}

export const AthenaVoiceOrb: React.FC<AthenaVoiceOrbProps> = ({
  state,
  volume = 0,
  onPress,
  subTitle,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Pulse animation based on state
    if (state === 'SPEAKING' || state === 'LISTENING') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15 + (volume / 100) * 0.15,
            duration: state === 'SPEAKING' ? 600 : 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: state === 'SPEAKING' ? 600 : 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (state === 'THINKING') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0.3);
    }
  }, [state, volume]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getOrbTheme = () => {
    switch (state) {
      case 'SPEAKING':
        return {
          glowColor: '#10b981', // Emerald
          coreColor: '#059669',
          textColor: '#6ee7b7',
          label: 'Athena is Speaking',
          icon: <Volume2 color="#ffffff" size={32} />,
        };
      case 'LISTENING':
        return {
          glowColor: '#6366f1', // Indigo
          coreColor: '#4f46e5',
          textColor: '#a5b4fc',
          label: 'Listening to Room',
          icon: <Mic color="#ffffff" size={32} />,
        };
      case 'THINKING':
        return {
          glowColor: '#8b5cf6', // Purple
          coreColor: '#7c3aed',
          textColor: '#c4b5fd',
          label: 'Formulating Response',
          icon: <Sparkles color="#ffffff" size={32} />,
        };
      case 'RESTRAINED':
        return {
          glowColor: '#f59e0b', // Amber
          coreColor: '#d97706',
          textColor: '#fcd34d',
          label: 'Restrained (Observing)',
          icon: <ShieldAlert color="#ffffff" size={32} />,
        };
      case 'MUTED':
        return {
          glowColor: '#ef4444', // Red
          coreColor: '#dc2626',
          textColor: '#fca5a5',
          label: 'Athena Hard-Muted',
          icon: <ShieldAlert color="#ffffff" size={32} />,
        };
      default:
        return {
          glowColor: '#3b82f6', // Blue
          coreColor: '#2563eb',
          textColor: '#93c5fd',
          label: 'Athena Ready',
          icon: <Code color="#ffffff" size={32} />,
        };
    }
  };

  const theme = getOrbTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.touchArea}>
        {/* Outer Glow Ring */}
        <Animated.View
          style={[
            styles.outerGlow,
            {
              backgroundColor: theme.glowColor,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Secondary Ripple */}
        <Animated.View
          style={[
            styles.midRing,
            {
              borderColor: theme.glowColor,
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            },
          ]}
        />

        {/* Core Glowing Orb */}
        <View style={[styles.coreOrb, { backgroundColor: theme.coreColor }]}>
          {theme.icon}
        </View>
      </TouchableOpacity>

      <Text style={[styles.statusText, { color: theme.textColor }]}>{theme.label}</Text>
      {subTitle ? <Text style={styles.subTitleText}>{subTitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  touchArea: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  midRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  coreOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  statusText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subTitleText: {
    marginTop: 4,
    fontSize: 13,
    color: '#94a3b8',
  },
});
