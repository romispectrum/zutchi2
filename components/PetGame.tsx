"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useZutchiPet } from '../hooks/useZutchiPet';
import { ZutchiStatsTransformer } from '../lib/zutchiStats';

interface PetGameProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  user?: any;
  onLogout: () => void;
}

const PetGame = ({ onActivityChange, currentActivity, user, onLogout }: PetGameProps) => {
  const {
    gameStats, petMood, isLoading, error
  } = useZutchiPet();

  const [coins] = useState(305);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activities = [
    { id: 'home', name: 'Home', emoji: '🏠', color: 'from-emerald-400 to-emerald-600' },
    { id: 'sleep', name: 'Sleep', emoji: '🌙', color: 'from-indigo-400 to-indigo-600' },
    { id: 'eat', name: 'Eat', emoji: '🍽️', color: 'from-orange-400 to-orange-600' },
    { id: 'work', name: 'Work', emoji: '💼', color: 'from-purple-400 to-purple-600' },
    { id: 'social', name: 'Social', emoji: '👥', color: 'from-pink-400 to-pink-600' }
  ];

  // Get activity-specific stats to display
  const getActivityStats = (activity: string) => {
    if (!gameStats) return [];
    return ZutchiStatsTransformer.getActivityStats(gameStats, activity);
  };

  const getStatColor = (value: number) => {
    return ZutchiStatsTransformer.getStatColor(value);
  };

  const getMoodMessage = () => {
    return petMood?.message || 'I\'m feeling great today! 😸';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐱</div>
          <p className="text-xl font-bold text-black">Loading your Zutchi...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl font-bold text-black mb-4">Oops! Something went wrong</p>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show no pet state
  if (!gameStats) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐱</div>
          <p className="text-xl font-bold text-black">No Zutchi found</p>
          <p className="text-lg text-gray-700">Please mint a Zutchi NFT to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-yellow-300" />
      
      {/* Pet Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={petMood?.mood === 'working' ? { rotate: [0, 5, 0, -5, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <Image
            src="/zutchi-cat.png"
            alt="Zutchi Pet"
            width={300}
            height={300}
            className="drop-shadow-2xl"
          />
          
          {/* Pet name tag */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Zutchi #{gameStats.level} ✨
            </span>
          </div>
          
          {/* Mood indicator */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-2xl">{petMood?.emoji}</span>
          </div>
        </motion.div>
      </div>

      {/* Top UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Left side - Time and mood */}
        <div className="flex flex-col items-start space-y-2">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl">
            <p className="text-lg font-bold text-gray-800">{formatTime(currentTime)}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl">
            <p className="text-sm font-semibold text-gray-700">{getMoodMessage()}</p>
          </div>
        </div>

        {/* Right side - Coins and logout */}
        <div className="flex flex-col items-end space-y-2">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl">
            <p className="text-lg font-bold text-yellow-600">🪙 {coins}</p>
          </div>
          
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Display */}
      <div className="absolute top-32 left-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Pet Stats</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {getActivityStats(currentActivity).map((statKey) => {
              const value = gameStats[statKey as keyof typeof gameStats] as number;
              const color = getStatColor(value);
              
              return (
                <div key={statKey} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {statKey === 'hunger' ? 'Fullness' : statKey}:
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-800 w-8 text-right">
                      {Math.round(value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Additional info */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Level: {gameStats.level}</div>
              <div>XP: {gameStats.xp}/{Math.pow(2, gameStats.level)}</div>
              <div>Age: {ZutchiStatsTransformer.formatDuration(gameStats.age)}</div>
              <div>Friends: {gameStats.frens.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
        {activities.map((activity) => {
          const isDisabled = (activity.id === 'work' && gameStats.isWorking) || 
                           (activity.id === 'sleep' && gameStats.isSleeping);
          
          return (
            <motion.button
              key={activity.id}
              onClick={() => onActivityChange(activity.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 ${
                isDisabled 
                  ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                  : `bg-gradient-to-r ${activity.color} hover:scale-105 active:scale-95`
              }`}
            >
              <span className="text-2xl mb-1">{activity.emoji}</span>
              <span className="text-xs">{activity.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PetGame;