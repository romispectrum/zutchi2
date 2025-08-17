"use client"

import React from 'react';

interface SleepActivityProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  onBack?: () => void;
  onLogout?: () => void;
}

const SleepActivitySimple: React.FC<SleepActivityProps> = ({ onActivityChange, currentActivity, userId, onBack, onLogout }) => {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sleep Activity</h1>
          <p className="text-gray-600 mb-6">Your pet is ready to rest!</p>
          <button 
            onClick={() => onActivityChange('home')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepActivitySimple;
