// speechRecognitionService.ts
type CommandHandler = (command: string) => void;

class SpeechRecognitionService {
    private recognition: SpeechRecognition | null = null;
    private isListening: boolean = false;
    private commandHandlers: CommandHandler[] = [];
    // Change NodeJS.Timeout to number (or ReturnType<typeof setTimeout>)
    private restartTimeout: ReturnType<typeof setTimeout> | null = null;
    private commandKeywords: Record<string, string[]> = {
        videoCall: ['call', 'video call', 'call contact'],
        emergency: ['emergency', 'help', 'ambulance', 'doctor'],
        dietPlans: ['diet', 'diet plan', 'food plan', 'meal plan'],
        healthyFoods: ['food', 'healthy food', 'nutrition'],
        exercises: ['exercise', 'workout', 'yoga'],
        water: ['water', 'drink', 'hydrate']
    };

    constructor() {
        this.initRecognition();
    }

    private initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        if (!this.recognition) return; // Early return if null

        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = this.handleResult.bind(this);
        this.recognition.onerror = this.handleError.bind(this);
        this.recognition.onend = this.handleEnd.bind(this);
    }

    private handleResult(event: SpeechRecognitionEvent) {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        console.log('Speech recognized:', command);
        this.processCommand(command);
    }

    private handleError(event: SpeechRecognitionErrorEvent) {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        if (['network', 'aborted', 'no-speech'].includes(event.error)) {
            this.attemptRestart();
        }
    }

    private handleEnd() {
        this.isListening = false;
        if (this.restartTimeout) {
            clearTimeout(this.restartTimeout);
        }
        if (this.isListeningRequested()) {
            this.attemptRestart();
        }
    }

    private attemptRestart() {
        if (!this.recognition || this.isListening) return;

        this.restartTimeout = setTimeout(() => {
            try {
                this.recognition?.start();
                this.isListening = true;
                console.log('Speech recognition restarted');
            } catch (error) {
                console.error('Error restarting speech recognition:', error);
                if (error instanceof DOMException && error.name === 'InvalidStateError') {
                    this.attemptRestart();
                }
            }
        }, 1000);
    }

    private processCommand(command: string) {
        this.commandHandlers.forEach(handler => handler(command));
        for (const [action, keywords] of Object.entries(this.commandKeywords)) {
            for (const keyword of keywords) {
                if (command.includes(keyword)) {
                    window.dispatchEvent(new CustomEvent('speechCommand', { detail: { action, command } }));
                    break;
                }
            }
        }
    }

    public start() {
        if (!this.recognition) {
            throw new Error('Speech recognition not supported');
        }
        if (this.isListening) {
            console.log('Already listening');
            return;
        }
        try {
            this.recognition.start();
            this.isListening = true;
            console.log('Speech recognition started');
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.isListening = false;
            if (error instanceof DOMException && error.name === 'InvalidStateError') {
                this.attemptRestart();
            } else {
                throw error;
            }
        }
    }

    public stop() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
                this.isListening = false;
                if (this.restartTimeout) {
                    clearTimeout(this.restartTimeout);
                }
                console.log('Speech recognition stopped');
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
    }

    private isListeningRequested(): boolean {
        return this.isListening || !!this.restartTimeout;
    }

    public registerCommandHandler(handler: CommandHandler) {
        this.commandHandlers.push(handler);
    }

    public unregisterCommandHandler(handler: CommandHandler) {
        this.commandHandlers = this.commandHandlers.filter(h => h !== handler);
    }

    public isSupported(): boolean {
        return !!this.recognition;
    }
}

const speechRecognitionService = new SpeechRecognitionService();
export default speechRecognitionService;