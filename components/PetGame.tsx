"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useZutchiPet } from '../hooks/useZutchiPet';
import { ZutchiStatsTransformer } from '../lib/zutchiStats';
import ActivityRightPanel from './activities/ActivityRightPanel';
import ActivityMobilePanel from './activities/ActivityMobilePanel';

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

  // Mapping of activities to their relevant stats (compatible with new layout)
  const activityStatsMapping: Record<string, string[]> = {
    'home': ['happiness', 'hunger', 'energy', 'work'], // Show all stats on home
    'sleep': ['energy'], // Sleep primarily affects energy
    'eat': ['hunger'], // Eating affects hunger/fullness
    'work': ['work'], // Work affects focus/work stat
    'social': ['happiness'] // Social activities affect happiness
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

  const handleActivityClick = (activityId: string) => {
    onActivityChange(activityId);
  };

  // Convert gameStats to PetStats format for compatibility
  const petStats = gameStats ? {
    happiness: gameStats.happiness || 75,
    hunger: gameStats.hunger || 60,
    energy: gameStats.energy || 80,
    work: gameStats.work || 45,
    social: gameStats.social || 50
  } : {
    happiness: 75,
    hunger: 60,
    energy: 80,
    work: 45,
    social: 50
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-blue-50/15 to-yellow-100/20" />
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🐱</div>
            <p className="text-xl font-bold text-gray-800">Loading your Zutchi...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen w-full relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 via-orange-50/15 to-yellow-100/20" />
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl font-bold text-gray-800 mb-4">Oops! Something went wrong</p>
            <p className="text-lg text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no pet state
  if (!gameStats) {
    return (
      <div className="h-screen w-full relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 via-blue-50/15 to-yellow-100/20" />
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🐱</div>
            <p className="text-xl font-bold text-gray-800">No Zutchi found</p>
            <p className="text-lg text-gray-700">Please mint a Zutchi NFT to continue</p>
          </div>
        </div>
      </div>
    );
  }

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
        className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-blue-50/15 to-yellow-100/20"
      />

      {/* Enhanced floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-200/40 to-green-200/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 20
            }}
            animate={{
              y: -20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: Math.random() * 12 + 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Fixed Main Container - No scrolling on desktop */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Header - Fixed height */}
        <motion.div
          initial={{ y: -30, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-shrink-0 px-6 py-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            {/* Welcome & Time Combined */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl px-3 py-2 shadow-xl border border-white/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
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
              <button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl border border-red-400 text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Layout - Visible on screens smaller than lg */}
        <div className="lg:hidden flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          {/* Mobile Stats Grid (2x2) */}
          <motion.div
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { key: 'happiness', icon: '💖', label: 'Happy', value: petStats.happiness },
              { key: 'hunger', icon: '🍼', label: 'Full', value: petStats.hunger },
              { key: 'energy', icon: '⚡', label: 'Energy', value: petStats.energy },
              { key: 'work', icon: '🎯', label: 'Focus', value: petStats.work }
            ].map((stat, index) => {
              const isRelevant = activityStatsMapping[currentActivity]?.includes(stat.key) || currentActivity === 'home';
              return (
                <motion.div
                  key={stat.key}
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                  className={`bg-gradient-to-r backdrop-blur-lg rounded-xl p-3 shadow-lg border transition-all duration-700 ease-out ${
                    isRelevant
                      ? 'from-white/90 to-white/80 border-white/40'
                      : 'from-gray-400/80 to-gray-500/80 border-gray-400/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg transition-all duration-700 ease-out ${isRelevant ? '' : 'grayscale saturate-0 brightness-75'}`}>
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

          {/* Mobile Pet Display */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
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
                src="/cats-for-use/home/public/V54.png/"
                alt="Happy Zutchi Cat"
                width={200}
                height={200}
                className="drop-shadow-2xl sm:w-[240px] sm:h-[240px]"
                priority
              />
            </motion.div>

            {/* Pet name tag */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
              <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Zutchi #{gameStats.level || 1} ✨
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
                { key: 'happiness', icon: '💖', label: 'Happy', value: petStats.happiness },
                { key: 'hunger', icon: '🍼', label: 'Full', value: petStats.hunger },
                { key: 'energy', icon: '⚡', label: 'Energy', value: petStats.energy },
                { key: 'work', icon: '🎯', label: 'Focus', value: petStats.work }
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
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center justify-center relative flex-1 max-w-md"
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
                  alt="Happy Zutchi Cat"
                  width={280}
                  height={280}
                  className="drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Pet name tag */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl border border-white/40 mb-4">
                <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Zutchi #{gameStats.level || 1} ✨
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

        {/* Bottom Tip - Fixed position */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex-shrink-0 text-center pb-4"
        >
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/40 inline-block">
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <span>🌟</span>
              Click activities to interact with your Zutchi!
              <span>💫</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PetGame;