import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import speechRecognitionService from '../services/speechRecognitionService';
import Button from './Button';

interface VoiceCommandIndicatorProps {
  onCommand?: (command: string) => void;
}

const VoiceCommandIndicator: React.FC<VoiceCommandIndicatorProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [showCommand, setShowCommand] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Memoize the command handler to prevent unnecessary re-registrations
  const handleCommand = useCallback((command: string) => {
    console.log('Voice command received in VoiceCommandIndicator:', command);
    setLastCommand(command);
    setShowCommand(true);

    // Hide the command after 3 seconds
    setTimeout(() => setShowCommand(false), 3000);

    // Call the onCommand prop if provided
    if (onCommand) {
      onCommand(command);
    }
  }, [onCommand]);

  useEffect(() => {
    // Check if speech recognition is supported
    setIsSupported(speechRecognitionService.isSupported());

    // Register the command handler
    speechRecognitionService.registerCommandHandler(handleCommand);

    // Listen for speech errors
    const handleSpeechError = (event: Event) => {
      const { message } = (event as CustomEvent).detail;
      setPermissionError(message);
      setShowPermissionModal(true);
      setIsListening(false);
    };
    window.addEventListener('speechError', handleSpeechError);

    // Clean up
    return () => {
      console.log('Cleaning up VoiceCommandIndicator...');
      speechRecognitionService.unregisterCommandHandler(handleCommand);
      window.removeEventListener('speechError', handleSpeechError);
      if (isListening) {
        speechRecognitionService.stop();
      }
    };
  }, [handleCommand, isListening]);

  const toggleListening = useCallback(async () => {
    console.log('Toggling listening state:', isListening ? 'Stopping' : 'Starting');
    if (isListening) {
      speechRecognitionService.stop();
      setIsListening(false);
    } else {
      try {
        await speechRecognitionService.start();
        setIsListening(true);
        setShowPermissionModal(false);
        setPermissionError(null);
      } catch (error: any) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        if (error instanceof Error && error.message.includes('Microphone permission required')) {
          setPermissionError('Microphone permission required. Please grant access in browser settings.');
          setShowPermissionModal(true);
        } else if (error instanceof Error && error.message.includes('Security error')) {
          setPermissionError('Security error: Microphone access blocked. Check browser permissions.');
        } else {
          setPermissionError('An error occurred while starting speech recognition: ' + (error.message || 'Unknown error'));
        }
      }
    }
  }, [isListening]);

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity">
        <MicOff className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleListening}
        className={`fixed bottom-4 right-4 p-3 rounded-full border-2 border-purple-500 transition-all duration-200 ${
          isListening 
            ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white animate-bounce' 
            : 'bg-gray-800 text-white opacity-50 hover:opacity-100 hover:bg-gray-700'
        }`}
        aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? (
          <Mic className="h-8 w-8 text-white" />
        ) : (
          <MicOff className="h-8 w-8 text-white" />
        )}
      </button>
      
      {showCommand && (
        <div className="fixed bottom-16 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm font-semibold mb-1">Voice Command:</p>
          <p className="text-lg">{lastCommand}</p>
        </div>
      )}
      
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Microphone Access Required</h3>
            <p className="mb-6">
              {permissionError || 'Voice commands require microphone access. Your browser will ask for permission. Please click "Allow" when prompted.'}
            </p>
            <div className="flex space-x-4">
              <Button onClick={toggleListening} fullWidth>
                Grant Access
              </Button>
              <Button 
                onClick={() => {
                  setShowPermissionModal(false);
                  setPermissionError(null);
                }} 
                variant="secondary"
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceCommandIndicator;