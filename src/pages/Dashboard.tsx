import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle, Droplets } from 'lucide-react';
import { contacts } from '../data/contacts';
import { dietPlans } from '../data/dietPlans';
import { exercises } from '../data/exercises';
import { healthyFoods } from '../data/healthyFoods';
import Button from '../components/Button';
import ProfileModal from '../components/ProfileModal';
import VideoCallRoom from '../components/VideoCallRoom';
import EmergencyCallModal from '../components/EmergencyCallModal';
import VoiceCommandIndicator from '../components/VoiceCommandIndicator';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  place: string;
  bloodGroup: string;
}

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string>('videoCall');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const dailyWaterGoal = 8; // 8 glasses per day
  
  // New state for video calling and emergency calls
  const [activeVideoCall, setActiveVideoCall] = useState<string | null>(null);
  const [activeEmergencyCall, setActiveEmergencyCall] = useState<{
    serviceName: string;
    phoneNumber: string;
  } | null>(null);

  // State for meal reminders and custom times
  const [mealReminders, setMealReminders] = useState<Record<string, Record<string, { enabled: boolean, time: string }>>>({
    'Heart-Healthy Diet': { breakfast: { enabled: false, time: '07:00' }, lunch: { enabled: false, time: '12:30' }, dinner: { enabled: false, time: '18:30' }, snacks: { enabled: false, time: '14:00' } },
    'Diabetic-Friendly Diet': { breakfast: { enabled: false, time: '07:00' }, lunch: { enabled: false, time: '12:30' }, dinner: { enabled: false, time: '18:30' }, snacks: { enabled: false, time: '14:00' } },
    'High-Protein Vegetarian Diet': { breakfast: { enabled: false, time: '07:00' }, lunch: { enabled: false, time: '12:30' }, dinner: { enabled: false, time: '18:30' }, snacks: { enabled: false, time: '14:00' } },
    'Low-Carb Indian Diet': { breakfast: { enabled: false, time: '07:00' }, lunch: { enabled: false, time: '12:30' }, dinner: { enabled: false, time: '18:30' }, snacks: { enabled: false, time: '14:00' } },
    'Anti-Inflammatory Diet': { breakfast: { enabled: false, time: '07:00' }, lunch: { enabled: false, time: '12:30' }, dinner: { enabled: false, time: '18:30' }, snacks: { enabled: false, time: '14:00' } },
  });
  const [timeoutIds, setTimeoutIds] = useState<Record<string, Record<string, number | null>>>({
    'Heart-Healthy Diet': { breakfast: null, lunch: null, dinner: null, snacks: null },
    'Diabetic-Friendly Diet': { breakfast: null, lunch: null, dinner: null, snacks: null },
    'High-Protein Vegetarian Diet': { breakfast: null, lunch: null, dinner: null, snacks: null },
    'Low-Carb Indian Diet': { breakfast: null, lunch: null, dinner: null, snacks: null },
    'Anti-Inflammatory Diet': { breakfast: null, lunch: null, dinner: null, snacks: null },
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
    
    // Set up voice command listener
    const handleSpeechCommand = (event: CustomEvent<{ action: string; command: string }>) => {
      const { action, command } = event.detail;
      
      console.log(`Voice command received: ${action} - ${command}`);
      
      // Handle section navigation
      if (action && ['videoCall', 'dietPlans', 'healthyFoods', 'exercises', 'emergency', 'water'].includes(action)) {
        setActiveSection(action);
      }
      
      // Handle video call commands
      if (action === 'videoCall') {
        // Extract contact name from command
        const contactKeywords = contacts.map(contact => contact.name.toLowerCase().split(' ')[0]);
        for (const contact of contacts) {
          const firstName = contact.name.toLowerCase().split(' ')[0];
          if (command.toLowerCase().includes(firstName)) {
            startVideoCall(contact.name);
            break;
          }
        }
      }
      
      // Handle emergency call commands
      if (action === 'emergency') {
        if (command.includes('ambulance')) {
          startEmergencyCall('Ambulance', '102');
        } else if (command.includes('doctor')) {
          startEmergencyCall('Family Doctor', '+91 98765 43210');
        }
      }
    };
    
    window.addEventListener('speechCommand', handleSpeechCommand as EventListener);
    
    return () => {
      window.removeEventListener('speechCommand', handleSpeechCommand as EventListener);
      // Clear all scheduled timeouts when unmounting
      Object.values(timeoutIds).forEach(meals => {
        Object.values(meals).forEach(timeoutId => {
          if (timeoutId !== null) clearTimeout(timeoutId);
        });
      });
    };
  }, []);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const incrementWaterIntake = () => {
    setWaterIntake(prev => Math.min(prev + 1, dailyWaterGoal));
  };

  const decrementWaterIntake = () => {
    setWaterIntake(prev => Math.max(prev - 1, 0));
  };

  const resetWaterIntake = () => {
    setWaterIntake(0);
  };
  
  // Video call functions
  const startVideoCall = (contactName: string) => {
    setActiveVideoCall(contactName);
  };
  
  const endVideoCall = () => {
    setActiveVideoCall(null);
  };
  
  // Emergency call functions
  const startEmergencyCall = (serviceName: string, phoneNumber: string) => {
    setActiveEmergencyCall({ serviceName, phoneNumber });
  };
  
  const endEmergencyCall = () => {
    setActiveEmergencyCall(null);
  };
  
  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received in Dashboard:', command);
    // Additional command handling can be added here if needed
  };

  const handleReminderToggle = (planName: string, mealType: string, enabled: boolean, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date(now);
    reminderTime.setHours(hours, minutes, 0, 0);

    // If the reminder time is in the past, schedule for the next day
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    // Clear existing timeout if any
    if (timeoutIds[planName][mealType] !== null) {
      clearTimeout(timeoutIds[planName][mealType]!);
    }

    setMealReminders(prev => ({
      ...prev,
      [planName]: {
        ...prev[planName],
        [mealType]: { enabled, time }
      }
    }));

    if (enabled) {
      // Schedule the notification
      const timeoutId = setTimeout(() => {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(`Reminder: ${mealType} in ${planName}`, {
              body: `Time to eat your ${mealType} at ${time}!`,
              icon: '/path/to/icon.png' // Optional: Add your app icon path
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification(`Reminder: ${mealType} in ${planName}`, {
                  body: `Time to eat your ${mealType} at ${time}!`,
                  icon: '/path/to/icon.png' // Optional: Add your app icon path
                });
              } else {
                alert('Please enable notifications to receive reminders.');
              }
            });
          } else {
            alert('Notifications are blocked. Please enable them in your browser settings.');
          }
        } else {
          alert('Browser does not support notifications.');
        }
      }, timeUntilReminder) as unknown as number;

      // Update timeoutIds state
      setTimeoutIds(prev => ({
        ...prev,
        [planName]: {
          ...prev[planName],
          [mealType]: timeoutId
        }
      }));
    } else {
      // Clear the timeout when reminder is disabled
      setTimeoutIds(prev => ({
        ...prev,
        [planName]: {
          ...prev[planName],
          [mealType]: null
        }
      }));
    }
  };

  const renderContacts = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {contacts.map(contact => (
        <div key={contact.id} className="bg-gray-900 p-6 rounded-lg shadow-md">
          <img 
            src={contact.image} 
            alt={contact.name} 
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-xl font-bold text-center mb-2 text-white">{contact.name}</h3>
          <p className="text-gray-400 text-center mb-2">{contact.role}</p>
          <p className="text-gray-400 text-center mb-4">{contact.phone}</p>
          <Button 
            onClick={() => startVideoCall(contact.name)}
            fullWidth
            className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Phone className="mr-2" /> Video Call
          </Button>
        </div>
      ))}
    </div>
  );

  const renderDietPlans = () => (
    <div className="space-y-8">
      {dietPlans.map((plan, index) => (
        <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-white">{plan.name}</h3>
          <p className="text-gray-400 mb-6">{plan.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(plan.meals).map(([mealType, meal]) => (
              <div key={mealType} className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h4 className="text-xl font-semibold text-white">{meal.name}</h4>
                    <input
                      type="time"
                      value={mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].time}
                      onChange={(e) => handleReminderToggle(plan.name, mealType, mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].enabled, e.target.value)}
                      className="text-sm p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <Button
                    onClick={() => handleReminderToggle(plan.name, mealType, !mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].enabled, mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].time)}
                    variant={mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].enabled ? 'primary' : 'secondary'}
                    className={`w-full py-2 text-sm ${mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].enabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    {mealReminders[plan.name][mealType as keyof typeof mealReminders['Heart-Healthy Diet']].enabled ? 'Reminder Set' : 'Remind Me'}
                  </Button>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {meal.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {meal.waterReminder && (
                    <p className="text-blue-400 text-sm">{meal.waterReminder}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderHealthyFoods = () => (
    <div className="space-y-8">
      {healthyFoods.map((category, index) => (
        <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-white">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((food, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <img 
                  src={food.image} 
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-2 text-white">{food.name}</h4>
                  <p className="text-gray-300 mb-2">{ food.benefits}</p>
                  <p className="text-gray-400 text-sm">{food.nutrition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-8">
      {exercises.map((category, index) => (
        <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-white">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((exercise, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-2 text-white">{exercise.name}</h4>
                  <p className="text-gray-300 mb-2">{exercise.benefits}</p>
                  <p className="text-gray-400">{exercise.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmergency = () => (
    <div className="space-y-6">
      <div className="bg-red-900 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
          <AlertTriangle className="mr-2 text-red-400" /> Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2 text-white">Ambulance</h4>
            <p className="text-gray-300">Emergency: 102</p>
            <Button 
              onClick={() => startEmergencyCall('Ambulance', '102')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              fullWidth
            >
              Call Ambulance
            </Button>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2 text-white">Family Doctor</h4>
            <p className="text-gray-300">Dr. Sharma: +91 98765 43210</p>
            <Button 
              onClick={() => startEmergencyCall('Family Doctor', '+91 98765 43210')}
              className="mt-4 text-white"
              fullWidth
            >
              Call Doctor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWaterIntake = () => (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
        <Droplets className="mr-2 text-blue-400" /> Daily Water Intake
      </h3>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl text-white">
          {waterIntake} of {dailyWaterGoal} glasses
        </div>
        <Button onClick={resetWaterIntake} variant="secondary" className="text-white">
          Reset
        </Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={decrementWaterIntake}
          variant="secondary"
          className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600"
          disabled={waterIntake <= 0}
        >
          -
        </Button>
        <div className="text-xl text-white">
          {waterIntake} glasses
        </div>
        <Button 
          onClick={incrementWaterIntake}
          variant="secondary"
          className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600"
          disabled={waterIntake >= dailyWaterGoal}
        >
          +
        </Button>
      </div>
      <div className="bg-gray-800 h-4 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${(waterIntake / dailyWaterGoal) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
        <Button onClick={() => setShowProfileModal(true)} variant="secondary" className="text-white">
          Edit Profile
        </Button>
      </div>
      {userProfile ? (
        <div className="space-y-3 text-gray-300">
          <p><span className="font-semibold text-white">Name:</span> {userProfile.name}</p>
          <p><span className="font-semibold text-white">Age:</span> {userProfile.age}</p>
          <p><span className="font-semibold text-white">Gender:</span> {userProfile.gender}</p>
          <p><span className="font-semibold text-white">Place:</span> {userProfile.place}</p>
          <p><span className="font-semibold text-white">Blood Group:</span> {userProfile.bloodGroup}</p>
        </div>
      ) : (
        <p className="text-gray-300">No profile information available</p>
      )}
    </div>
  );

  const sections = [
    { id: 'videoCall', label: 'Video Call' },
    { id: 'dietPlans', label: 'Diet Plans' },
    { id: 'healthyFoods', label: 'Healthy Foods' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'water', label: 'Water Intake' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Welcome, {userProfile?.name || 'User'}
        </h1>
        <Button onClick={() => setShowProfileModal(true)} variant="secondary" className="text-white bg-gray-800 hover:bg-gray-700">
          View Profile
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            variant={activeSection === section.id ? 'primary' : 'secondary'}
            className={`text-lg py-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 ${activeSection === section.id ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            fullWidth
          >
            {section.label}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        {activeSection === 'videoCall' && renderContacts()}
        {activeSection === 'dietPlans' && renderDietPlans()}
        {activeSection === 'healthyFoods' && renderHealthyFoods()}
        {activeSection === 'exercises' && renderExercises()}
        {activeSection === 'emergency' && renderEmergency()}
        {activeSection === 'water' && renderWaterIntake()}
      </div>

      {showProfileModal && userProfile && (
        <ProfileModal
          profile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
      
      {/* Video Call Room */}
      {activeVideoCall && (
        <VideoCallRoom 
          contactName={activeVideoCall}
          onClose={endVideoCall}
        />
      )}
      
      {/* Emergency Call Modal */}
      {activeEmergencyCall && (
        <EmergencyCallModal
          serviceName={activeEmergencyCall.serviceName}
          phoneNumber={activeEmergencyCall.phoneNumber}
          onClose={endEmergencyCall}
        />
      )}
      
      {/* Voice Command Indicator */}
      <VoiceCommandIndicator onCommand={handleVoiceCommand} />
    </div>
  );
};

export default Dashboard;