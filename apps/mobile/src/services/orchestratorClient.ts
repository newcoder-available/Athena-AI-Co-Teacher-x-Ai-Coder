import type {
  ClassroomEvent,
  Role,
  ProficiencyTag,
} from '@echosphere/shared-types';

export class OrchestratorClient {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor(baseUrl: string = 'http://localhost:8787') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async createSession(params: {
    title: string;
    teacherName: string;
    lessonMaterial?: string;
    agora?: { appId: string; appCertificate: string };
  }) {
    const res = await fetch(`${this.baseUrl}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create session' }));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return res.json();
  }

  async joinSession(sessionId: string, params: {
    participantId: string;
    displayName: string;
    role: Role;
    preferredLanguage?: string;
  }) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to join session' }));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return res.json();
  }

  async getTokens(sessionId: string, uid: string) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/tokens?uid=${encodeURIComponent(uid)}`);
    if (!res.ok) {
      throw new Error(`Token fetch failed: ${res.statusText}`);
    }
    return res.json();
  }

  async toggleMute(sessionId: string, muted: boolean) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/policy`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muted }),
    });
    return res.json();
  }

  async setStudentFloor(sessionId: string, studentsMayInvoke: boolean) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/policy`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentsMayInvoke }),
    });
    return res.json();
  }

  async raiseHand(sessionId: string, participantId: string, raised: boolean) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/hand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId, raised }),
    });
    return res.json();
  }

  async submitQuizAnswer(sessionId: string, submission: {
    quizId: string;
    participantId: string;
    answer: string;
    via?: 'ui' | 'voice';
  }) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/quiz/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    return res.json();
  }

  async startQuiz(sessionId: string, topic?: string) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/quiz/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic || 'Current topic' }),
    });
    return res.json();
  }

  async bringAthena(sessionId: string) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/agent/start`, {
      method: 'POST',
    });
    return res.json();
  }

  subscribeToEvents(
    sessionId: string,
    onEvent: (event: ClassroomEvent) => void,
    onError?: (err: any) => void
  ): () => void {
    const url = `${this.baseUrl}/api/sessions/${sessionId}/events`;
    
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    let isClosed = false;

    const connectSSE = async () => {
      try {
        const response = await fetch(url, {
          headers: { Accept: 'text/event-stream' },
          signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`SSE connect error: ${response.status}`);
        }

        const reader = (response.body as any).getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (!isClosed) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              try {
                const parsed = JSON.parse(dataStr) as ClassroomEvent;
                onEvent(parsed);
              } catch (e) {
                // Ignore parse error
              }
            }
          }
        }
      } catch (err: any) {
        if (!isClosed && err.name !== 'AbortError') {
          if (onError) onError(err);
          // Reconnect after 2 seconds
          setTimeout(() => {
            if (!isClosed) connectSSE();
          }, 2000);
        }
      }
    };

    connectSSE();

    return () => {
      isClosed = true;
      if (this.abortController) {
        this.abortController.abort();
      }
    };
  }
}

export const orchestratorClient = new OrchestratorClient();
