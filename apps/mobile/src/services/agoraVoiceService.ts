/**
 * Agora Voice & Audio Service for React Native / Mobile
 * Handles voice channel connection, mic state, speakerphone routing, and audio levels.
 */

export interface AgoraVoiceCallbacks {
  onUserJoined?: (uid: string | number) => void;
  onUserLeft?: (uid: string | number) => void;
  onAudioVolumeIndication?: (speakers: Array<{ uid: string | number; volume: number }>) => void;
  onError?: (err: Error) => void;
  onStateChanged?: (state: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'RECONNECTING') => void;
}

export class AgoraVoiceService {
  private appId: string | null = null;
  private channelId: string | null = null;
  private token: string | null = null;
  private uid: number | string = 0;
  private isMuted: boolean = false;
  private isSpeakerphone: boolean = true;
  private isConnected: boolean = false;
  private callbacks: AgoraVoiceCallbacks = {};
  private volumeInterval: any = null;

  initialize(appId: string) {
    this.appId = appId;
  }

  setCallbacks(callbacks: AgoraVoiceCallbacks) {
    this.callbacks = callbacks;
  }

  async joinChannel(params: {
    appId: string;
    channelName: string;
    token: string;
    uid: number | string;
  }) {
    this.appId = params.appId;
    this.channelId = params.channelName;
    this.token = params.token;
    this.uid = params.uid;

    if (this.callbacks.onStateChanged) {
      this.callbacks.onStateChanged('CONNECTING');
    }

    try {
      // In mobile production runtime with react-native-agora or Agora SDK:
      // await rtcEngine.joinChannel(params.token, params.channelName, '', Number(params.uid) || 0);
      this.isConnected = true;
      if (this.callbacks.onStateChanged) {
        this.callbacks.onStateChanged('CONNECTED');
      }

      // Start volume simulation for voice reactive visualizer
      this.startVolumeMonitoring();
      return true;
    } catch (err: any) {
      this.isConnected = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(err);
      }
      throw err;
    }
  }

  async leaveChannel() {
    this.stopVolumeMonitoring();
    this.isConnected = false;
    if (this.callbacks.onStateChanged) {
      this.callbacks.onStateChanged('DISCONNECTED');
    }
  }

  async setMuted(muted: boolean) {
    this.isMuted = muted;
    // In native SDK: await rtcEngine.muteLocalAudioStream(muted);
    return this.isMuted;
  }

  async toggleSpeakerphone(enableSpeaker: boolean) {
    this.isSpeakerphone = enableSpeaker;
    // In native SDK: await rtcEngine.setEnableSpeakerphone(enableSpeaker);
    return this.isSpeakerphone;
  }

  private startVolumeMonitoring() {
    if (this.volumeInterval) clearInterval(this.volumeInterval);
    this.volumeInterval = setInterval(() => {
      if (!this.isConnected) return;
      if (this.callbacks.onAudioVolumeIndication) {
        // Provide audio energy indicator
        const base = this.isMuted ? 0 : Math.floor(Math.random() * 60 + 20);
        this.callbacks.onAudioVolumeIndication([
          { uid: this.uid, volume: base },
          { uid: 'athena', volume: Math.floor(Math.random() * 80 + 10) },
        ]);
      }
    }, 200);
  }

  private stopVolumeMonitoring() {
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }
  }
}

export const agoraVoiceService = new AgoraVoiceService();
