"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityRightPanel from './ActivityRightPanel';
import ActivityMobilePanel from './ActivityMobilePanel';

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
  work: number;
  social: number;
}

interface SocialActivityProps {
  onActivityChange: (activity: string) => void;
  currentActivity: string;
  userId?: string;
  onBack?: () => void;
}

const SocialActivity = ({ onActivityChange, currentActivity, userId, onBack }: SocialActivityProps) => {
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
  const [isSocializing, setIsSocializing] = useState(false);
  const [socialTimer, setSocialTimer] = useState(0);
  const [socialAction, setSocialAction] = useState<string | null>(null);
  const [socialReward, setSocialReward] = useState<number>(0);
  const [friends, setFriends] = useState(3);
  const [lastActivity, setLastActivity] = useState<string>('');

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

  const socialActions = [
    { 
      id: 'makeNewFriend', 
      name: 'Make New Friend', 
      emoji: '🐱', 
      color: 'from-pink-400 to-rose-500',
      description: 'Find a new furry friend!',
      reward: '25-75'
    },
    { 
      id: 'playWithFriends', 
      name: 'Play with Friends', 
      emoji: '🎾', 
      color: 'from-blue-400 to-cyan-500',
      description: 'Have fun with existing friends!',
      reward: '15-45'
    },
    { 
      id: 'chatWithNeighbors', 
      name: 'Chat with Neighbors', 
      emoji: '🗣️', 
      color: 'from-green-400 to-emerald-500',
      description: 'Socialize with nearby pets!',
      reward: '10-30'
    },
    { 
      id: 'joinPlayground', 
      name: 'Join Playground', 
      emoji: '🎠', 
      color: 'from-purple-400 to-violet-500',
      description: 'Play at the community playground!',
      reward: '40-120'
    }
  ];

  const getStatColor = (value: number) => {
    if (value >= 70) return 'from-green-400 to-green-500';
    if (value >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const getMoodMessage = () => {
    if (isSocializing && socialAction) {
      const messages: Record<string, string> = {
        makeNewFriend: `Making a new friend! 🐱✨ (+${socialReward} coins in ${socialTimer}s)`,
        playWithFriends: `Playing with friends! 🎾🐕 (+${socialReward} coins in ${socialTimer}s)`,
        chatWithNeighbors: `Chatting with neighbors! 🗣️☕ (+${socialReward} coins in ${socialTimer}s)`,
        joinPlayground: `Having fun at playground! 🎠🎡 (+${socialReward} coins in ${socialTimer}s)`
      };
      return messages[socialAction] || `Socializing! 🎉 (+${socialReward} coins in ${socialTimer}s)`;
    }
    if (isSocializing) {
      return `Making new friends! 🎉 (${socialTimer}s)`;
    }
    switch (petMood) {
      case 'hungry': return 'I\'m getting hungry! 🥺';
      case 'tired': return 'Zzz... I need some rest 😴';
      case 'sad': return 'I need some love and care 💔';
      default: return 'Let\'s hang out together! 😸';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSocialize = () => {
    if (currentActivity === 'social' && !isSocializing) {
      setIsSocializing(true);
      setSocialTimer(6);

      const interval = setInterval(() => {
        setSocialTimer(prev => {
          if (prev <= 1) {
            setIsSocializing(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      onActivityChange('social');
    }
  };

  const performSocialActivity = (activity: string) => {
    if (isSocializing) return;
    
    setSocialAction(activity);
    setIsSocializing(true);
    setLastActivity(activity);
    
    let duration = 0;
    let reward = 0;
    
    switch (activity) {
      case 'makeNewFriend':
        duration = 8;
        reward = Math.floor(Math.random() * 50) + 25; // 25-75 coins
        setFriends(prev => prev + 1);
        break;
      case 'playWithFriends':
        duration = 6;
        reward = Math.floor(Math.random() * 30) + 15; // 15-45 coins
        break;
      case 'chatWithNeighbors':
        duration = 4;
        reward = Math.floor(Math.random() * 20) + 10; // 10-30 coins
        break;
      case 'joinPlayground':
        duration = 10;
        reward = Math.floor(Math.random() * 80) + 40; // 40-120 coins
        break;
      default:
        duration = 5;
        reward = 20;
    }
    
    setSocialTimer(duration);
    setSocialReward(reward);

    const interval = setInterval(() => {
      setSocialTimer(prev => {
        if (prev <= 1) {
          setIsSocializing(false);
          setSocialAction(null);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleActivityClick = (activityId: string) => {
    if (activityId === 'social') {
      handleSocialize();
    } else {
      onActivityChange(activityId);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-orange-300 overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/Social.png"
          alt="Social background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Magical overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-50/15 to-orange-100/20" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-pink-400/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 10
            }}
            animate={{
              y: -10,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800)
            }}
            transition={{
              duration: Math.random() * 6 + 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Scrollable Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Content Wrapper - Scrollable */}
        <div className="w-full max-w-7xl mx-auto flex flex-col px-2 py-2 lg:px-6 lg:py-4 flex-1">
          
          {/* Compact Top Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-3 lg:mb-6 flex-shrink-0"
          >
            {/* Welcome & Time Combined with Back Button */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-lg lg:rounded-2xl px-2 py-1 lg:px-4 lg:py-2 shadow-xl border border-white/40">
              <div className="flex items-center gap-1 lg:gap-3">
                {onBack && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onBack}
                    className="h-6 w-6 lg:h-8 lg:w-8 rounded-lg lg:rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                )}
                <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-lg lg:rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-sm leading-none">👋</span>
                </div>
                <div>
                  <p className="text-xs text-gray-700 font-medium">Hello, Roman-24</p>
                  <p className="text-xs lg:text-sm font-bold text-gray-800">{formatTime(currentTime)}</p>
                </div>
              </div>
            </div>

            {/* Coins Compact */}
            <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-lg lg:rounded-2xl px-2 py-1 lg:px-4 lg:py-2 shadow-xl border border-white/40">
              <div className="flex items-center gap-1 lg:gap-2">
                <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-lg lg:rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                  <span className="text-white text-sm font-bold leading-none">💰</span>
                </div>
                <span className="text-sm lg:text-lg font-bold text-gray-800">{coins.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Mobile: Stats Row */}
          <div className="lg:hidden grid grid-cols-2 gap-2 mb-3">
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
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className={`bg-gradient-to-r backdrop-blur-lg rounded-lg p-2 shadow-lg border transition-all duration-300 ${
                    isRelevant
                      ? 'from-white/90 to-white/80 border-white/40'
                      : 'from-gray-300/60 to-gray-400/60 border-gray-300/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-lg leading-none transition-all duration-300 ${isRelevant ? '' : 'grayscale opacity-70'}`}>
                      {stat.icon}
                    </span>
                    <span className={`text-xs font-semibold transition-all duration-300 ${
                      isRelevant ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200/60 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full bg-gradient-to-r transition-all duration-300 ${
                          isRelevant ? getStatColor(stat.value) : 'from-gray-400 to-gray-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
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
          </div>

          {/* Main Content Area - Responsive Layout */}
          <div className="flex-1 flex flex-col lg:flex-row lg:gap-6 lg:items-start lg:justify-center">

            {/* Desktop: Left Panel - Stats */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block lg:w-72 xl:w-80 space-y-3 lg:max-h-[600px] lg:overflow-y-auto"
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

              {/* Friends Counter */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-white/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl leading-none">👥</span>
                  <span className="text-xs font-semibold text-gray-700">Friends</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-600">{friends}</span>
                  <span className="text-xs text-gray-500">total friends</span>
                </div>
              </motion.div>

              {/* Last Activity */}
              {lastActivity && (
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-white/40"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl leading-none">✨</span>
                    <span className="text-xs font-semibold text-gray-700">Last Activity</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {lastActivity === 'makeNewFriend' && 'Made a new friend!'}
                    {lastActivity === 'playWithFriends' && 'Played with friends!'}
                    {lastActivity === 'chatWithNeighbors' && 'Chatted with neighbors!'}
                    {lastActivity === 'joinPlayground' && 'Joined playground fun!'}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Center Panel - Pet Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center justify-center relative mb-4 lg:mb-0"
            >
              {/* Pet Character - Social cat */}
              <motion.div
                className="relative mb-2 lg:mb-4"
                animate={isSocializing ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                } : {
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: isSocializing ? 1.5 : 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/cats-for-use/social/26.svg"
                  alt="Social Zutchi Cat"
                  width={180}
                  height={180}
                  className="drop-shadow-2xl lg:w-[280px] lg:h-[280px]"
                  priority
                />

                {/* Social effects - Heart particles */}
                <AnimatePresence>
                  {isSocializing && (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={`heart-${i}`}
                          className="absolute text-xl lg:text-2xl text-pink-500"
                          initial={{
                            x: 90 + Math.cos(i * Math.PI / 2) * 20,
                            y: 90 + Math.sin(i * Math.PI / 2) * 20,
                            opacity: 0,
                            scale: 0.5
                          }}
                          animate={{
                            x: 90 + Math.cos(i * Math.PI / 2) * 40,
                            y: 90 + Math.sin(i * Math.PI / 2) * 40,
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut"
                          }}
                        >
                          💖
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pet name tag - Updated for social */}
              <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-full px-3 py-1 lg:px-4 lg:py-2 shadow-xl border border-white/40 mb-2 lg:mb-4">
                <span className="text-xs lg:text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {isSocializing ? 'Socializing Zutchi 💖' : 'Zutchi 2.0 ✨'}
                </span>
              </div>

              {/* Pet Speech Bubble - Compact */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-lg lg:rounded-2xl px-3 py-2 lg:px-4 lg:py-3 shadow-xl border border-white/40 max-w-xs">
                  <p className="text-xs lg:text-sm font-semibold text-gray-800 text-center">{getMoodMessage()}</p>
                  {/* Speech bubble arrow */}
                  <div className="absolute -top-1 lg:-top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 lg:w-4 lg:h-4 bg-white/90 rotate-45 border-l border-t border-white/40"></div>
                </div>
              </motion.div>

              {/* Mobile: Friends Counter */}
              <div className="lg:hidden mt-3 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-lg p-2 shadow-lg border border-white/40">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-lg leading-none">👥</span>
                  <span className="text-xs font-semibold text-gray-700">Friends:</span>
                  <span className="text-sm font-bold text-purple-600">{friends}</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop: Right Panel - Activities */}
            <ActivityRightPanel
              currentActivity={currentActivity}
              activities={activities}
              onActivityClick={handleActivityClick}
              actionItems={currentActivity === 'social' ? socialActions : undefined}
              onActionClick={performSocialActivity}
              isActionDisabled={isSocializing}
              className="hidden lg:block"
            />
          </div>

          {/* Mobile: Activities Grid */}
          <ActivityMobilePanel
            currentActivity={currentActivity}
            activities={activities}
            onActivityClick={handleActivityClick}
            actionItems={currentActivity === 'social' ? socialActions : undefined}
            onActionClick={performSocialActivity}
            isActionDisabled={isSocializing}
            className="lg:hidden"
          />

          {/* Bottom Tip - Compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mt-3 lg:mt-4 pb-4 lg:pb-0"
          >
            <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-lg rounded-lg lg:rounded-2xl px-3 py-1.5 lg:px-4 lg:py-2 shadow-lg border border-white/40 inline-block">
              <p className="text-xs text-gray-600 flex items-center gap-1 lg:gap-2">
                {currentActivity === 'social' ? (
                  <>
                    <span>✨</span>
                    <span className="hidden sm:inline">Choose a social activity to earn coins and make friends!</span>
                    <span className="sm:hidden">Tap activities to play!</span>
                    <span>🐱</span>
                  </>
                ) : (
                  <>
                    <span>👥</span>
                    <span className="hidden sm:inline">Click social to make new friends!</span>
                    <span className="sm:hidden">Go social!</span>
                    <span>💖</span>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SocialActivity;
