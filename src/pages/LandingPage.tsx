import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-24 w-24 text-purple-500 mx-auto mb-8" />
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to Care N Connect
        </h1>
        <p className="text-2xl md:text-3xl text-gray-300 mb-12">
          Connecting Seniors, Simplifying Lives
        </p>
        <Button
          onClick={() => navigate('/details')}
          className="text-2xl px-12"
        >
          Get Started
        </Button>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Premium Features</h3>
            <p className="text-gray-300">Unlock more features for $9.99/month</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Our Devices</h3>
            <p className="text-gray-300">Care N Connect Tablet - $99</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">24/7 Support</h3>
            <p className="text-gray-300">We're here to help anytime</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;