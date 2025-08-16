"use client"

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ActivityMobilePanel from './ActivityMobilePanel';
import ActivityRightPanel from './ActivityRightPanel';

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
  work: number;
  social: number;
}

interface WorkActivityProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  onBack?: () => void;
  onLogout?: () => void;
}

const WorkActivity = ({ onActivityChange, currentActivity, userId, onBack, onLogout }: WorkActivityProps) => {
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
  const [isWorking, setIsWorking] = useState(false);
  const [workTimer, setWorkTimer] = useState(0);

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
    if (isWorking) {
      return `Hard at work! 💪 (${workTimer}s)`;
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

  const handleWork = () => {
    if (currentActivity === 'work' && !isWorking) {
      setIsWorking(true);
      setWorkTimer(10);

      const interval = setInterval(() => {
        setWorkTimer(prev => {
          if (prev <= 1) {
            setIsWorking(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      onActivityChange('work');
    }
  };

  const handleActivityClick = (activityId: string) => {
    if (activityId === 'work') {
      handleWork();
    } else {
      onActivityChange(activityId);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <Image
        src="/backgrounds/home.png"
        alt="Work background"
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

      {/* Fixed Main Container - No scrolling on desktop */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Header - Fixed height */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 px-6 py-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            {/* Welcome & Time Combined with Back Button */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-3 py-2 shadow-xl border border-white/40">
              <div className="flex items-center gap-2 sm:gap-3">
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
                  <p className="text-sm font-bold text-gray-800">{formatTime(currentTime)}</p>
                </div>
              </div>
            </div>

            {/* User Actions Stack */}
            <div className="flex flex-col gap-2 sm:items-end">
              {/* Coins */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-3 py-2 shadow-xl border border-white/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{coins.toLocaleString()}</span>
                </div>
              </div>

              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl border border-red-400 text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Mobile Layout - Visible on screens smaller than lg */}
        <div className="lg:hidden flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          {/* Mobile Stats Grid (2x2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { key: 'happiness', icon: '💖', label: 'Happy', value: stats.happiness },
              { key: 'hunger', icon: '🍼', label: 'Full', value: stats.hunger },
              { key: 'energy', icon: '⚡', label: 'Energy', value: stats.energy },
              { key: 'work', icon: '🎯', label: 'Focus', value: stats.work }
            ].map((stat, index) => {
              const isRelevant = activityStatsMapping[currentActivity]?.includes(stat.key) || currentActivity === 'home';
              return (
                <motion.div
                  key={stat.key}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`bg-gradient-to-r backdrop-blur-lg rounded-xl p-3 shadow-lg border transition-all duration-300 ${
                    isRelevant
                      ? 'from-white/90 to-white/80 border-white/40'
                      : 'from-gray-300/60 to-gray-400/60 border-gray-300/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg transition-all duration-300 ${isRelevant ? '' : 'grayscale opacity-70'}`}>
                      {stat.icon}
                    </span>
                    <span className={`text-xs font-semibold transition-all duration-300 ${
                      isRelevant ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200/60 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r transition-all duration-300 ${
                          isRelevant ? getStatColor(stat.value) : 'from-gray-400 to-gray-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      />
                    </div>
                    <span className={`text-xs font-bold mt-1 block transition-all duration-300 ${
                      isRelevant ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {stat.value}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile Pet Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center relative flex-1 min-h-[300px]"
          >
            {/* Pet Character */}
            <motion.div
              className="relative mb-4"
              animate={isWorking ? {
                scale: [1, 1.02, 1],
              } : {
                y: [0, -8, 0],
              }}
              transition={{
                duration: isWorking ? 1.5 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/cats-for-use/work/Cat 2a.png"
                alt="Working Zutchi Cat"
                width={200}
                height={200}
                className="drop-shadow-2xl sm:w-[240px] sm:h-[240px]"
                priority
              />

              {/* Work effects - Focus particles */}
              <AnimatePresence>
                {isWorking && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={`focus-${i}`}
                        className="absolute text-xl sm:text-2xl"
                        initial={{
                          x: 80 + i * 20,
                          y: 80,
                          opacity: 0,
                          scale: 0.5
                        }}
                        animate={{
                          x: 80 + i * 20,
                          y: 60,
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeInOut"
                        }}
                      >
                        {['💡', '⚡', '🎯'][i]}
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Pet name tag */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
              <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isWorking ? 'Focused Zutchi 💼' : 'Zutchi 2.0 ✨'}
              </span>
            </div>

            {/* Pet Speech Bubble */}
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

          {/* Mobile Activities Grid (2x2) */}
          <ActivityMobilePanel
            currentActivity={currentActivity}
            activities={activities}
            onActivityClick={handleActivityClick}
            className=""
          />
        </div>

        {/* Desktop Layout - Fixed height, no scrolling */}
        <div className="hidden lg:flex flex-1 px-6 pb-6">
          <div className="w-full flex gap-12 items-start justify-center">
            {/* Left Panel - Stats (Desktop) */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-72 xl:w-80 space-y-3 flex-shrink-0"
            >
              {/* Stats Header */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-white/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
                    <span className="text-white text-sm leading-none">📊</span>
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
              ].map((stat, index) => {
                const isRelevant = activityStatsMapping[currentActivity]?.includes(stat.key) || currentActivity === 'home';
                return (
                  <motion.div
                    key={stat.key}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className={`bg-gradient-to-r backdrop-blur-lg rounded-2xl p-3 shadow-lg border transition-all duration-300 ${
                      isRelevant
                        ? 'from-white/90 to-white/80 border-white/40'
                        : 'from-gray-300/60 to-gray-400/60 border-gray-300/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl leading-none transition-all duration-300 ${isRelevant ? '' : 'grayscale opacity-70'}`}>
                        {stat.icon}
                      </span>
                      <span className={`text-xs font-semibold transition-all duration-300 ${
                        isRelevant ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200/60 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r transition-all duration-300 ${
                            isRelevant ? getStatColor(stat.value) : 'from-gray-400 to-gray-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                      <span className={`text-xs font-bold mt-1 block transition-all duration-300 ${
                        isRelevant ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {stat.value}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Center Panel - Pet Display (Desktop) - Fixed positioning */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center justify-center relative flex-1 max-w-md"
            >
              {/* Pet Character */}
              <motion.div
                className="relative mb-4"
                animate={isWorking ? {
                  scale: [1, 1.02, 1],
                } : {
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: isWorking ? 1.5 : 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/cats-for-use/work/Cat 2a.png"
                  alt="Working Zutchi Cat"
                  width={280}
                  height={280}
                  className="drop-shadow-2xl"
                  priority
                />

                {/* Work effects - Focus particles */}
                <AnimatePresence>
                  {isWorking && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`focus-${i}`}
                          className="absolute text-2xl"
                          initial={{
                            x: 120 + i * 30,
                            y: 100,
                            opacity: 0,
                            scale: 0.5
                          }}
                          animate={{
                            x: 120 + i * 30,
                            y: 80,
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut"
                          }}
                        >
                          {['💡', '⚡', '🎯'][i]}
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pet name tag */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {isWorking ? 'Focused Zutchi 💼' : 'Zutchi 2.0 ✨'}
                </span>
              </div>

              {/* Pet Speech Bubble */}
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

            {/* Right Panel - Activities (Desktop) */}
            <ActivityRightPanel
              currentActivity={currentActivity}
              activities={activities}
              onActivityClick={handleActivityClick}
              className=""
            />
          </div>
        </div>

        {/* Work Action Button - Fixed position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex-shrink-0 flex justify-center pb-1"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWork}
            disabled={isWorking}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 touch-manipulation ${
              isWorking
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 active:scale-95'
            }`}
          >
            <span className="text-xl">💼</span>
            <span className="text-sm sm:text-base">
              {isWorking ? `Working... ${workTimer}s` : 'Start Working'}
            </span>
            {isWorking && <span className="text-xl">💪</span>}
          </motion.button>
        </motion.div>

        {/* Bottom Tip - Fixed position */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex-shrink-0 text-center pb-1"
        >
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/40 inline-block">
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <span>💼</span>
              Work improves focus and earns coins!
              <span>💪</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkActivity;
