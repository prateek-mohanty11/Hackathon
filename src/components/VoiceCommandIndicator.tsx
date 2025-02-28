import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Check if speech recognition is supported
    setIsSupported(speechRecognitionService.isSupported());
    
    // Register command handler
    const handleCommand = (command: string) => {
      setLastCommand(command);
      setShowCommand(true);
      
      // Hide the command after 3 seconds
      setTimeout(() => setShowCommand(false), 3000);
      
      // Call the onCommand prop if provided
      if (onCommand) {
        onCommand(command);
      }
    };
    
    speechRecognitionService.registerCommandHandler(handleCommand);
    
    // Clean up
    return () => {
      speechRecognitionService.unregisterCommandHandler(handleCommand);
      if (isListening) {
        speechRecognitionService.stop();
      }
    };
  }, [onCommand, isListening]);

  const toggleListening = () => {
    if (isListening) {
      speechRecognitionService.stop();
      setIsListening(false);
    } else {
      // Show permission modal first
      setShowPermissionModal(true);
    }
  };
  
  const startListening = () => {
    try {
      speechRecognitionService.start();
      setIsListening(true);
      setShowPermissionModal(false);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity">
        <MicOff className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleListening}
        className={`fixed bottom-4 right-4 p-3 rounded-full transition-all duration-200 ${
          isListening 
            ? 'bg-purple-600 text-white animate-pulse' 
            : 'bg-gray-800 text-white opacity-50 hover:opacity-100'
        }`}
        aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? (
          <Mic className="h-6 w-6" />
        ) : (
          <MicOff className="h-6 w-6" />
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
              Voice commands require microphone access. Your browser will ask for permission.
              Please click "Allow" when prompted.
            </p>
            <div className="flex space-x-4">
              <Button onClick={startListening} fullWidth>
                Continue
              </Button>
              <Button 
                onClick={() => setShowPermissionModal(false)} 
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