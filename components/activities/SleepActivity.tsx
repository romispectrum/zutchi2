"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
  work: number;
  social: number;
}

interface SleepActivityProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  onBack?: () => void;
}

const SleepActivity = ({ onActivityChange, currentActivity, userId, onBack }: SleepActivityProps) => {
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
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(0);

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

  const getStatColor = (value: number) => {
    if (value >= 70) return 'from-green-400 to-green-500';
    if (value >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const getMoodMessage = () => {
    if (isSleeping) {
      return `Sweet dreams... 😴 (${sleepTimer}s)`;
    }
    switch (petMood) {
      case 'hungry': return 'I\'m getting hungry! 🥺';
      case 'tired': return 'Zzz... I need some rest 😴';
      case 'sad': return 'I need some love and care 💔';
      default: return 'I\'m feeling great today! 😸';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSleep = () => {
    if (currentActivity === 'sleep' && !isSleeping) {
      setIsSleeping(true);
      setSleepTimer(8);

      const interval = setInterval(() => {
        setSleepTimer(prev => {
          if (prev <= 1) {
            setIsSleeping(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      onActivityChange('sleep');
    }
  };

  const handleActivityClick = (activityId: string) => {
    if (activityId === 'sleep') {
      handleSleep();
    } else {
      onActivityChange(activityId);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col">
      {/* Background Image */}
      <Image
        src="/cats-for-use/backrounds/1.png"
        alt="Cute game background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Magical overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-50/15 to-blue-100/20" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 10
            }}
            animate={{
              y: -10,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800)
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Container - Full Screen with Centered Content */}
      <div className="relative z-10 flex flex-col h-full w-full">

        {/* Content Wrapper - Centered within full screen */}
        <div className="w-full h-full mx-auto flex flex-col px-6 py-4">
          
          {/* Compact Top Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6 flex-shrink-0"
          >
          {/* Welcome & Time Combined with Back Button */}
          <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl border border-white/40">
            <div className="flex items-center gap-3">
              {onBack && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onBack}
                  className="h-8 w-8 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              )}
              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-sm">👋</span>
              </div>
              <div>
                <p className="text-xs text-gray-700 font-medium">Hello, Roman-24</p>
                <p className="text-sm font-bold text-gray-800">{formatTime(currentTime)}</p>
              </div>
            </div>
          </div>

          {/* Coins Compact */}
          <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl border border-white/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                <span className="text-white text-sm font-bold">💰</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{coins.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area - Centered Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-center py-4">

          {/* Left Panel - Stats */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-72 xl:w-80 space-y-3 lg:max-h-[600px] overflow-y-auto"
          >
            {/* Stats Header */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
                  <span className="text-white text-xs">📊</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800">Pet Stats</h3>
              </div>
            </div>

            {/* Individual Stats */}
            {[
              { key: 'happiness', icon: '💖', label: 'Happy', value: stats.happiness },
              { key: 'hunger', icon: '🍼', label: 'Full', value: stats.hunger },
              { key: 'energy', icon: '⚡', label: 'Energy', value: stats.energy },
              { key: 'work', icon: '🎯', label: 'Focus', value: stats.work }
            ].map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-white/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{stat.label}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200/60 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getStatColor(stat.value)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-800 mt-1 block">{stat.value}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Center Panel - Pet Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center relative flex-shrink-0"
          >
            {/* Pet Character - Changed to sleeping cat */}
            <motion.div
              className="relative mb-4"
              animate={isSleeping ? {
                y: [0, -5, 0],
              } : {
                y: [0, -8, 0],
              }}
              transition={{
                duration: isSleeping ? 2.5 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/cats-for-use/sleep/V44.png"
                alt="Sleeping Zutchi Cat"
                width={280}
                height={280}
                className="drop-shadow-2xl"
                priority
              />

              {/* Sleep effects - Z's animation */}
              <AnimatePresence>
                {isSleeping && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={`z-${i}`}
                        className="absolute text-3xl text-indigo-600"
                        initial={{
                          x: -15 + i * 10,
                          y: -25 - i * 15,
                          opacity: 0,
                          scale: 0.5
                        }}
                        animate={{
                          x: -5 + i * 10,
                          y: -45 - i * 15,
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut"
                        }}
                      >
                        💤
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Pet name tag - Updated for sleep */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
              <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isSleeping ? 'Sleepy Zutchi 💤' : 'Zutchi 2.0 ✨'}
              </span>
            </div>

            {/* Pet Speech Bubble - Compact */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-xl border border-white/40 max-w-xs">
                <p className="text-sm font-semibold text-gray-800 text-center">{getMoodMessage()}</p>
                {/* Speech bubble arrow */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45 border-l border-t border-white/40"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Activities */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full lg:w-72 xl:w-80 space-y-3 lg:max-h-[600px] overflow-y-auto"
          >
            {/* Activities Header */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-white/40">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-xs">🎮</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800">Activities</h3>
              </div>
            </div>

            {/* Activity Buttons - Vertical */}
            {activities.map((activity, index) => {
              const isActive = currentActivity === activity.id;
              return (
                <motion.button
                  key={activity.id}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActivityClick(activity.id)}
                  disabled={isSleeping && activity.id === 'sleep'}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-purple-300 bg-gradient-to-r from-purple-100/80 to-pink-100/80 shadow-xl scale-105'
                      : isSleeping && activity.id === 'sleep'
                        ? 'border-gray-300 bg-gray-100/80 opacity-50 cursor-not-allowed'
                        : 'border-white/40 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg hover:border-purple-200 hover:shadow-lg'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-md transition-all duration-300`}>
                    <span className="text-lg">{activity.emoji}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    isActive ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {activity.name}
                  </span>

                  {isActive && (
                    <motion.div
                      className="ml-auto w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Tip - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-4 flex-shrink-0"
        >
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/40 inline-block">
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <span>💤</span>
              Click sleep to start a restful nap!
              <span>🌟</span>
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SleepActivity;