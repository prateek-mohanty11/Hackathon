import React, { useEffect, useRef, useState } from 'react';
import { getTwilioToken } from '../services/twilioService';
import Button from './Button';

interface VideoCallRoomProps {
  contactName: string;
  onClose: () => void;
}

const VideoCallRoom: React.FC<VideoCallRoomProps> = ({ contactName, onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    let localStream: MediaStream | null = null;
    
    const startCall = async () => {
      try {
        // First check if permissions are already granted
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        
        if (hasVideoInput) {
          // For this demo, we'll just access the user's camera and microphone
          localStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
          
          setPermissionGranted(true);
          
          // Simulate connecting to a room
          await new Promise(resolve => setTimeout(resolve, 1500));
          setStatus('connected');
          
          // Simulate getting a token (this would connect to Twilio in a real app)
          const tokenData = await getTwilioToken('currentUser', `room-${contactName}`);
          console.log('Got token:', tokenData);
        } else {
          // No video devices or permissions not granted
          setStatus('error');
        }
      } catch (error) {
        console.error('Error starting video call:', error);
        setStatus('error');
      }
    };
    
    startCall();
    
    // Cleanup function
    return () => {
      // Stop all tracks in the local stream
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [contactName]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, we would mute the actual audio track
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // In a real implementation, we would disable the actual video track
  };
  
  const endCall = () => {
    // In a real implementation, we would disconnect from the Twilio room
    onClose();
  };
  
  const requestPermissions = async () => {
    try {
      // Request permissions explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setPermissionGranted(true);
      setStatus('connecting');
      
      // Simulate connecting to a room
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('connected');
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setStatus('error');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {status === 'connecting' ? 'Connecting to ' : 'Call with '} 
            {contactName}
          </h2>
          <div className="text-gray-400">
            {status === 'connecting' && 'Establishing connection...'}
            {status === 'connected' && 'Connected'}
            {status === 'error' && 'Connection failed'}
          </div>
        </div>
        
        {!permissionGranted && status === 'error' ? (
          <div className="p-8 text-center">
            <p className="text-xl mb-6">Camera and microphone access is required for video calls.</p>
            <Button 
              onClick={requestPermissions}
              className="mx-auto"
            >
              Allow Camera & Microphone Access
            </Button>
            <p className="mt-4 text-gray-400 text-sm">
              If you've denied permission, you'll need to reset it in your browser settings.
            </p>
          </div>
        ) : (
          <>
            <div className="relative aspect-video bg-gray-800">
              {/* Remote video (main view) */}
              <video 
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              
              {/* Placeholder for remote video while connecting */}
              {status !== 'connected' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl text-gray-400">
                    {status === 'connecting' ? 'Connecting...' : 'Connection failed'}
                  </div>
                </div>
              )}
              
              {/* Local video (picture-in-picture) */}
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-700 rounded-lg overflow-hidden">
                <video 
                  ref={localVideoRef}
                  className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                  autoPlay
                  playsInline
                  muted
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-lg text-gray-400">Camera Off</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 flex justify-center space-x-4">
              <Button 
                onClick={toggleMute} 
                variant={isMuted ? 'primary' : 'secondary'}
                className="px-8"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button 
                onClick={toggleVideo} 
                variant={isVideoOff ? 'primary' : 'secondary'}
                className="px-8"
              >
                {isVideoOff ? 'Show Video' : 'Hide Video'}
              </Button>
              <Button 
                onClick={endCall} 
                className="bg-red-600 hover:bg-red-700 px-8"
              >
                End Call
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallRoom;