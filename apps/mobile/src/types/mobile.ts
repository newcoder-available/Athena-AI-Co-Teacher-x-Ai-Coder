import type {
  Role,
  ClassroomEvent,
  PublicQuiz,
  MiroStickyNote,
} from '@echosphere/shared-types';

export type AppMode = 'classroom' | 'coder';

export interface MobileQuizOption {
  id: string;
  text: string;
}

export interface MobileSessionState {
  sessionId: string;
  roomName: string;
  role: Role;
  userName: string;
  participantId: string;
  joined: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isHandRaised: boolean;
  floorPermitted: boolean;
  teacherMuted: boolean;
  agentState: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'RESTRAINED' | 'MUTED';
  audioVolume: number; // 0 to 100 for visualizer
}

export interface TranscriptEntry {
  id: string;
  speaker: string;
  role: 'teacher' | 'student' | 'athena' | 'coder';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: 'typescript' | 'javascript' | 'python' | 'cpp' | 'html';
  code: string;
  explanation?: string;
  errorLine?: number;
  suggestedFix?: string;
  tags?: string[];
  lastModified: number;
}

export interface VoiceCoderState {
  currentSnippet: CodeSnippet;
  history: CodeSnippet[];
  activeTab: 'editor' | 'terminal' | 'diff' | 'walkthrough';
  isExecuting: boolean;
  terminalOutput: string[];
  aiNotes: string[];
}
