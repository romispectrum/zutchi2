"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
  work: number;
  social: number;
}

interface EatActivityProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  onBack: () => void;
  onLogout: () => void;
}

const EatActivity = ({ onActivityChange, currentActivity, userId, onBack, onLogout }: EatActivityProps) => {
  const [stats] = useState<PetStats>({
    happiness: 75,
    hunger: 60,
    energy: 80,
    work: 45,
    social: 50
  });

 const [petMood, setPetMood] = useState<'happy' | 'sad' | 'tired' | 'hungry'>('tired');

  const [coins] = useState(305);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEating, setIsEating] = useState(false);
  const [eatTimer, setEatTimer] = useState(0);
  const [feedAmount, setFeedAmount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Determine pet mood based on stats
    if (stats.hunger < 30) {
      setPetMood('hungry');
    } else if (stats.energy < 30) {
      setPetMood('tired');
    } else if (stats.happiness < 40) {
      setPetMood('sad');
    } else {
      setPetMood('happy');
    }
  }, [stats]);

  const activities = [
    { id: 'home', name: 'Home', emoji: '🏠', color: 'from-emerald-400 to-emerald-600' },
    { id: 'sleep', name: 'Sleep', emoji: '🌙', color: 'from-indigo-400 to-indigo-600' },
    { id: 'eat', name: 'Eat', emoji: '🍽️', color: 'from-orange-400 to-orange-600' },
    { id: 'work', name: 'Work', emoji: '💼', color: 'from-purple-400 to-purple-600' },
    { id: 'social', name: 'Social', emoji: '👥', color: 'from-pink-400 to-pink-600' }
  ];

  // Mapping of activities to their relevant stats
  const activityStatsMapping: Record<string, string[]> = {
    'home': ['happiness', 'hunger', 'energy', 'work'], // Show all stats on home
    'sleep': ['energy'], // Sleep primarily affects energy
    'eat': ['hunger'], // Eating affects hunger/fullness
    'work': ['work'], // Work affects focus/work stat
    'social': ['happiness'] // Social activities affect happiness
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'from-green-400 to-green-500';
    if (value >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const getMoodMessage = () => {
    if (isEating) {
      return `Yummy! So delicious! � (${eatTimer}s)`;
    }
    switch (petMood) {
      case 'hungry': return 'I\'m getting hungry! 🥺';
      case 'tired': return 'Zzz... I need some rest 😴';
      case 'sad': return 'I need some love and care 💔';
      default: return 'Ready to be productive! 😸';
    }
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
        // const success = await feedPet(feedAmount);
        const success = true;
        
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


  // Show no pet state
//   if (!gameStats) {
//     return (
//       <div className="min-h-screen bg-orange-300 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🐱</div>
//           <p className="text-xl font-bold text-black">No Zutchi found</p>
//           <p className="text-lg text-gray-700">Please mint a Zutchi NFT to continue</p>
//         </div>
//       </div>
//     );
//   }

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
              {isEating ? 'Hungry Zutchi 🍽️' : `Zutchi #${stats.hunger}`} ✨
            </span>
          </div>
          
          {/* Mood indicator */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-2xl">{isEating ? '😋' : petMood}</span>
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
          const isDisabled = (activity.id === 'work' && stats.energy) || 
                           (activity.id === 'sleep' && stats.energy);
          
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