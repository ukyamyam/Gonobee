// ElevenLabs voice service
export class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private isConnected = false;

  constructor(apiKey: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB') {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
  }

  // Initialize WebSocket connection
  async initializeConnection(): Promise<boolean> {
    try {
      // Initialize AudioContext
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // WebSocket connection (ElevenLabs Streaming API)
      const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream-input?model_id=eleven_turbo_v2`;
      
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('ElevenLabs WebSocket connected');
        this.isConnected = true;
        
        // Send initial configuration
        this.websocket?.send(JSON.stringify({
          text: " ",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          },
          xi_api_key: this.apiKey
        }));
      };

      this.websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.audio) {
          // Play Base64 audio data
          await this.playAudioChunk(data.audio);
        }
        
        if (data.isFinal) {
          console.log('Audio stream completed');
        }
      };

      this.websocket.onerror = (error) => {
        console.error('ElevenLabs WebSocket error:', error);
        this.isConnected = false;
      };

      this.websocket.onclose = () => {
        console.log('ElevenLabs WebSocket disconnected');
        this.isConnected = false;
      };

      return true;
    } catch (error) {
      console.error('Failed to initialize ElevenLabs connection:', error);
      return false;
    }
  }

  // Convert text to speech and play
  async speakText(text: string): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      console.warn('ElevenLabs not connected, using fallback TTS');
      this.fallbackTTS(text);
      return;
    }

    try {
      // Send text via WebSocket
      this.websocket.send(JSON.stringify({
        text: text,
        try_trigger_generation: true
      }));
    } catch (error) {
      console.error('Error sending text to ElevenLabs:', error);
      this.fallbackTTS(text);
    }
  }

  // Play Base64 audio data
  private async playAudioChunk(base64Audio: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      // Convert Base64 to ArrayBuffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create AudioBuffer and play
      const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio chunk:', error);
    }
  }

  // Fallback browser TTS
  private fallbackTTS(text: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Select English voice
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.includes('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }

  // Close connection
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isConnected = false;
  }

  // Check connection status
  isReady(): boolean {
    return this.isConnected;
  }
}

// Speech recognition service
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;

  constructor() {
    // Initialize browser speech recognition API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (this.onTranscriptCallback) {
          if (finalTranscript) {
            this.onTranscriptCallback(finalTranscript, true);
          } else if (interimTranscript) {
            this.onTranscriptCallback(interimTranscript, false);
          }
        }
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
      
      this.recognition.onend = () => {
        if (this.isListening) {
          // Automatically restart
          this.recognition?.start();
        }
      };
    }
  }

  startListening(onTranscript: (transcript: string, isFinal: boolean) => void): boolean {
    if (!this.recognition) {
      console.warn('Speech recognition not supported');
      return false;
    }

    this.onTranscriptCallback = onTranscript;
    this.isListening = true;
    
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
    this.onTranscriptCallback = null;
  }

  isSupported(): boolean {
    return !!this.recognition;
  }
}