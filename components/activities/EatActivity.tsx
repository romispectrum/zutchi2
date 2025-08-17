"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ActivityMobilePanel from './ActivityMobilePanel';
import ActivityRightPanel from './ActivityRightPanel';
import { useZutchiPet } from '../../hooks/useZutchiPet';
import { ZutchiStatsTransformer } from '../../lib/zutchiStats';

interface EatActivityProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  onBack: () => void;
  onLogout: () => void;
}

const EatActivity = ({ onActivityChange, currentActivity, userId, onBack, onLogout }: EatActivityProps) => {
  const {
    gameStats, petMood, feedPet, isLoading, error
  } = useZutchiPet();

  const [coins] = useState(305);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEating, setIsEating] = useState(false);
  const [eatTimer, setEatTimer] = useState(0);
  const [feedAmount, setFeedAmount] = useState(10);

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
    if (isEating) {
      return `Yummy! So delicious! 😋 (${eatTimer}s)`;
    }
    return petMood?.message || 'Time for some tasty food! 😸';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEat = async () => {
    if (currentActivity === 'eat' && !isEating) {
      setIsEating(true);
      setEatTimer(5);

      try {
        // Call the contract to feed the pet
        const success = await feedPet(feedAmount);
        
        if (success) {
          // Start eating animation timer
          const timer = setInterval(() => {
            setEatTimer((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setIsEating(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setIsEating(false);
          setEatTimer(0);
        }
      } catch (error) {
        console.error('Error feeding pet:', error);
        setIsEating(false);
        setEatTimer(0);
      }
    } else {
      onActivityChange('eat');
    }
  };

  const handleActivityClick = (activityId: string) => {
    if (activityId === 'home') {
      onBack();
    } else {
      onActivityChange(activityId);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍽️</div>
          <p className="text-xl font-bold text-black">Loading eating activity...</p>
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
          animate={isEating ? { scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: isEating ? Infinity : 0 }}
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
              {isEating ? 'Hungry Zutchi 🍽️' : `Zutchi #${gameStats.level}`} ✨
            </span>
          </div>
          
          {/* Mood indicator */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-2xl">{isEating ? '😋' : petMood?.emoji}</span>
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

        {/* Right side - Coins and back button */}
        <div className="flex flex-col items-end space-y-2">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl">
            <p className="text-lg font-bold text-yellow-600">🪙 {coins}</p>
          </div>
          
          <button
            onClick={onBack}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Stats Display */}
      <div className="absolute top-32 left-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Eating Stats</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {getActivityStats('eat').map((statKey) => {
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
              <div>Time until hungry: {ZutchiStatsTransformer.formatDuration(gameStats.timeUntilHungry)}</div>
              <div>Last ate: {ZutchiStatsTransformer.formatDuration(gameStats.timeSinceLastAte)} ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Amount Selector and Feed Button */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl border border-white/40">
          <label className="text-sm font-semibold text-gray-700 mr-2">Food Amount:</label>
          <select
            value={feedAmount}
            onChange={(e) => setFeedAmount(Number(e.target.value))}
            className="bg-transparent border-none text-gray-800 font-bold focus:outline-none"
            disabled={isEating}
          >
            <option value={5}>5 🍎</option>
            <option value={10}>10 🥕</option>
            <option value={20}>20 🍖</option>
            <option value={50}>50 🍕</option>
          </select>
        </div>
        
        <motion.button
          onClick={handleEat}
          disabled={isEating}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 touch-manipulation ${
            isEating ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 active:scale-95'
          }`}
        >
          <span className="text-xl">🍽️</span>
          <span className="text-sm sm:text-base">
            {isEating ? `Eating... ${eatTimer}s` : `Feed ${feedAmount} Food`}
          </span>
          {isEating && <span className="text-xl">😋</span>}
        </motion.button>
      </div>

      {/* Activity Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
        {activities.map((activity) => {
          const isActive = currentActivity === activity.id;
          const isDisabled = (activity.id === 'work' && gameStats.isWorking) || 
                           (activity.id === 'sleep' && gameStats.isSleeping);
          
          return (
            <motion.button
              key={activity.id}
              onClick={() => handleActivityClick(activity.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 ${
                isActive ? 'ring-4 ring-yellow-400 scale-110' : ''
              } ${
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

export default EatActivity;