import React, { useState } from 'react';
import { makeEmergencyCall } from '../services/twilioService';
import Button from './Button';
import { AlertTriangle, Phone } from 'lucide-react';

interface EmergencyCallModalProps {
  serviceName: string;
  phoneNumber: string;
  onClose: () => void;
}

const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({ 
  serviceName, 
  phoneNumber, 
  onClose 
}) => {
  const [status, setStatus] = useState<'initial' | 'calling' | 'connected' | 'error'>('initial');
  const [callDuration, setCallDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  const startCall = async () => {
    try {
      setStatus('calling');
      
      // In a real implementation, this would make an actual call via Twilio
      const success = await makeEmergencyCall(phoneNumber, 'User');
      
      if (success) {
        setStatus('connected');
        // Start call timer
        const interval = window.setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval as unknown as number);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error making emergency call:', error);
      setStatus('error');
    }
  };

  const endCall = () => {
    // Clear timer if it exists
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg overflow-hidden">
        <div className="p-6 bg-red-900 flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-white mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Emergency Call</h2>
          <p className="text-xl text-center mb-4">{serviceName}</p>
          <p className="text-xl font-bold">{phoneNumber}</p>
          
          {status === 'connected' && (
            <div className="mt-4 text-lg">
              Call Duration: {formatTime(callDuration)}
            </div>
          )}
        </div>
        
        <div className="p-6">
          {status === 'initial' && (
            <>
              <div className="bg-yellow-900 text-white p-4 rounded-lg mb-6">
                <p className="font-bold">Warning:</p>
                <p>You are about to make an emergency call. Only proceed if you have a genuine emergency.</p>
              </div>
              <Button 
                onClick={startCall} 
                className="bg-red-600 hover:bg-red-700 flex items-center justify-center"
                fullWidth
              >
                <Phone className="mr-2" /> Call {serviceName}
              </Button>
              <Button 
                onClick={onClose} 
                variant="secondary"
                className="mt-4"
                fullWidth
              >
                Cancel
              </Button>
            </>
          )}
          
          {status === 'calling' && (
            <div className="text-center py-4">
              <p className="text-xl mb-4">Calling {serviceName}...</p>
              <div className="animate-pulse flex justify-center">
                <Phone className="h-12 w-12 text-red-500" />
              </div>
            </div>
          )}
          
          {(status === 'connected' || status === 'error') && (
            <Button 
              onClick={endCall} 
              className={`${status === 'connected' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600'} mt-4`}
              fullWidth
            >
              {status === 'connected' ? 'End Call' : 'Close'}
            </Button>
          )}
          
          {status === 'error' && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-6 mt-4">
              <p className="font-bold">Error:</p>
              <p>Failed to connect the call. Please try again or use a physical phone to dial {phoneNumber}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyCallModal;