import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold text-white">Care N Connect</span>
        </Link>
        <Link 
          to="/dashboard" 
          className="text-xl text-white hover:text-purple-400 transition-colors"
        >
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;