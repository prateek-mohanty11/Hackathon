// speechRecognitionService.ts
type CommandHandler = (command: string) => void;

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private commandHandlers: CommandHandler[] = [];
  private restartTimeout: ReturnType<typeof setTimeout> | null = null;
  private commandKeywords: Record<string, string[]> = {
    videoCall: ['call', 'video call', 'call contact'],
    emergency: ['emergency', 'help', 'ambulance', 'doctor'],
    dietPlans: ['diet', 'diet plan', 'food plan', 'meal plan'],
    healthyFoods: ['food', 'healthy food', 'nutrition'],
    exercises: ['exercise', 'workout', 'yoga'],
    water: ['water', 'drink', 'hydrate'],
  };
  private maxRetries: number = 3; // Limit retries to prevent infinite loops
  private retryCount: number = 0;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    if (this.recognition) {
      console.log('SpeechRecognition instance already exists, reusing it');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      if (!this.recognition) return;

      console.log('Initializing new SpeechRecognition instance');
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = this.handleResult.bind(this);
      this.recognition.onerror = this.handleError.bind(this);
      this.recognition.onend = this.handleEnd.bind(this);
    } catch (error) {
      console.error('Error initializing SpeechRecognition:', error);
    }
  }

  private handleResult(event: SpeechRecognitionEvent): void {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.trim().toLowerCase();
    console.log('Speech recognized:', command, 'Confidence:', event.results[last][0].confidence);
    this.processCommand(command);
  }

  private handleError(event: SpeechRecognitionErrorEvent): void {
    console.error('Speech recognition error:', event.error, 'Message:', event.message);
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    if (['network', 'aborted', 'no-speech'].includes(event.error)) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Attempting retry ${this.retryCount} of ${this.maxRetries}...`);
        this.attemptRestart();
      } else {
        console.error('Max retries reached. Speech recognition failed. Please check microphone access or browser settings.');
        this.notifyError('Max retries reached. Speech recognition failed.');
      }
    } else if (event.error === 'not-allowed') {
      console.error('Microphone access denied. Please grant permission or check browser settings.');
      this.notifyError('Microphone access denied. Please grant permission in browser settings.');
    } else if (event.error === 'security') {
      console.error('Security error: Microphone access blocked. Check browser permissions.');
      this.notifyError('Security error: Microphone access blocked. Check browser permissions.');
    }
  }

  private handleEnd(): void {
    console.log('Speech recognition ended');
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.isListeningRequested()) {
      this.attemptRestart();
    }
  }

  private attemptRestart(): void {
    if (!this.recognition || this.isListening) {
      console.log('Cannot restart: Recognition is null or already listening');
      return;
    }

    console.log('Attempting to restart speech recognition...');
    this.restartTimeout = setTimeout(() => {
      try {
        this.recognition?.start();
        this.isListening = true;
        this.retryCount = 0; // Reset retry count on successful start
        console.log('Speech recognition restarted');
      } catch (error) {
        console.error('Error restarting speech recognition:', error);
        if (error instanceof DOMException) {
          if (error.name === 'InvalidStateError') {
            console.log('Invalid state, retrying...');
            this.attemptRestart();
          } else if (error.name === 'NotAllowedError') {
            console.error('Microphone permission required. Please grant access.');
            this.notifyError('Microphone permission required. Please grant access.');
          } else if (error.name === 'SecurityError') {
            console.error('Security error: Microphone access blocked. Check browser permissions.');
            this.notifyError('Security error: Microphone access blocked. Check browser permissions.');
          }
        }
      }
    }, 1000);
  }

  private processCommand(command: string): void {
    console.log('Processing command:', command);
    this.commandHandlers.forEach(handler => handler(command));
    for (const [action, keywords] of Object.entries(this.commandKeywords)) {
      for (const keyword of keywords) {
        if (command.includes(keyword)) {
          console.log(`Matched command '${command}' to action '${action}'`);
          window.dispatchEvent(new CustomEvent('speechCommand', { detail: { action, command } }));
          return;
        }
      }
    }
    console.log('No matching command found for:', command);
  }

  public async start(): Promise<void> {
    console.log('Starting speech recognition...');
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        throw new Error('Speech recognition not supported or failed to initialize');
      }
    }
    if (this.isListening) {
      console.log('Already listening');
      return;
    }
    return new Promise((resolve, reject) => {
      try {
        this.recognition!.start(); // Use non-null assertion since we checked above
        this.isListening = true;
        console.log('Speech recognition started');
        resolve();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        this.isListening = false;
        if (error instanceof DOMException) {
          if (error.name === 'InvalidStateError') {
            this.attemptRestart();
          } else if (error.name === 'NotAllowedError') {
            console.error('Microphone permission required. Please grant access or check browser settings.');
            this.notifyError('Microphone permission required. Please grant access.');
            reject(new Error('Microphone permission required'));
          } else if (error.name === 'SecurityError') {
            console.error('Security error: Microphone access blocked. Check browser permissions.');
            this.notifyError('Security error: Microphone access blocked.');
            reject(new Error('Security error: Microphone access blocked'));
          }
        } else {
          reject(error);
        }
      }
    });
  }

  public stop(): void {
    console.log('Stopping speech recognition...');
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
        if (this.restartTimeout) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = null;
        }
        this.retryCount = 0; // Reset retry count on stop
        console.log('Speech recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  private isListeningRequested(): boolean {
    return this.isListening || !!this.restartTimeout;
  }

  public registerCommandHandler(handler: CommandHandler): void {
    this.commandHandlers.push(handler);
  }

  public unregisterCommandHandler(handler: CommandHandler): void {
    this.commandHandlers = this.commandHandlers.filter(h => h !== handler);
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  private notifyError(message: string): void {
    // Dispatch a custom event to notify the UI (e.g., VoiceCommandIndicator)
    window.dispatchEvent(new CustomEvent('speechError', { detail: { message } }));
  }
}

const speechRecognitionService = new SpeechRecognitionService();
export default speechRecognitionService;