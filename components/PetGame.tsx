"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
  work: number;
  social: number;
}

interface PetGameProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  user?: any;
  onLogout?: () => void;
}

const PetGame = ({ onActivityChange, currentActivity, userId, user, onLogout }: PetGameProps) => {
  const [stats] = useState<PetStats>({
    happiness: 75,
    hunger: 60,
    energy: 80,
    work: 45,
    social: 50
  });

  const [petMood, setPetMood] = useState<'happy' | 'sad' | 'tired' | 'hungry'>('happy');
  const [coins] = useState(305);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Image with Animation */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/backgrounds/home.png"
          alt="Home background"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Magical overlay with Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-50/15 to-blue-100/20"
      />

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
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-start">
            {/* Welcome & Time Combined */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-3 py-2 shadow-xl border border-white/40">
              <div className="flex items-center gap-2 sm:gap-3">
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
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/cats-for-use/home/V54.png"
                alt="Zutchi Cat"
                width={200}
                height={200}
                className="drop-shadow-2xl sm:w-[240px] sm:h-[240px]"
                priority
              />
            </motion.div>

            {/* Pet name tag */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
              <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Zutchi 2.0 ✨
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
          <motion.div
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3"
          >
            {activities.slice(1).map((activity, index) => {
              const isActive = currentActivity === activity.id;
              return (
                <motion.button
                  key={activity.id}
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onActivityChange(activity.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-700 ease-out touch-manipulation ${
                    isActive
                      ? 'border-purple-300 bg-gradient-to-r from-purple-100/80 to-pink-100/80 shadow-xl scale-105'
                      : 'border-white/40 bg-gradient-to-r from-white/90 to-white/80 hover:border-purple-200 hover:shadow-lg active:scale-95'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-md transition-all duration-300`}>
                    <span className="text-2xl leading-none">{activity.emoji}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    isActive ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {activity.name}
                  </span>

                  {isActive && (
                    <motion.div
                      className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
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

        {/* Desktop Layout - Fixed height, no scrolling */}
        <div className="hidden lg:flex flex-1 px-6 pb-6">
          <div className="w-full flex gap-12 items-start justify-center">
            {/* Left Panel - Stats (Desktop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                    className={`bg-gradient-to-r backdrop-blur-lg rounded-2xl p-3 shadow-lg border transition-all duration-700 ease-out ${
                      isRelevant
                        ? 'from-white/90 to-white/80 border-white/40'
                        : 'from-gray-400/80 to-gray-500/80 border-gray-400/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl leading-none transition-all duration-700 ease-out ${isRelevant ? '' : 'grayscale saturate-0 brightness-75'}`}>
                        {stat.icon}
                      </span>
                      <span className={`text-xs font-semibold transition-all duration-700 ease-out ${
                        isRelevant ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200/60 rounded-full h-2">
                        <motion.div
                                                  className={`h-2 rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
                          isRelevant ? getStatColor(stat.value) : 'from-gray-500 to-gray-600'
                        }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                      <span className={`text-xs font-bold mt-1 block transition-all duration-700 ease-out ${
                        isRelevant ? 'text-gray-800' : 'text-gray-400'
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center justify-center relative flex-1 max-w-md"
            >
              {/* Pet Character */}
              <motion.div
                className="relative mb-4"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/cats-for-use/home/V54.png"
                  alt="Zutchi Cat"
                  width={280}
                  height={280}
                  className="drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Pet name tag */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Zutchi 2.0 ✨
                </span>
              </div>

              {/* Pet Speech Bubble */}
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
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
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="w-72 xl:w-80 space-y-3 flex-shrink-0"
            >
              {/* Activities Header */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-white/40">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-sm leading-none">🎮</span>
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
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onActivityChange(activity.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-700 ease-out ${
                      isActive
                        ? 'border-purple-300 bg-gradient-to-r from-purple-100/80 to-pink-100/80 shadow-xl scale-105'
                        : 'border-white/40 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg hover:border-purple-200 hover:shadow-lg'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-md transition-all duration-300`}>
                      <span className="text-xl leading-none">{activity.emoji}</span>
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
        </div>

        {/* Bottom Tip - Fixed position */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex-shrink-0 text-center pb-1"
        >
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/40 inline-block">
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <span>💡</span>
              <span className="hidden sm:inline">Balance all stats for maximum happiness!</span>
              <span className="sm:hidden">Keep your pet happy!</span>
              <span>🌟</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PetGame;