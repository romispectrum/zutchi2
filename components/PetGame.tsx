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
}

const PetGame = ({ onActivityChange, currentActivity, userId }: PetGameProps) => {
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
    { id: 'home', name: 'Home', emoji: '🏠', color: 'from-emerald-400 to-emerald-600', shadowColor: 'shadow-emerald-200' },
    { id: 'sleep', name: 'Sleep', emoji: '🌙', color: 'from-indigo-400 to-indigo-600', shadowColor: 'shadow-indigo-200' },
    { id: 'eat', name: 'Eat', emoji: '🍽️', color: 'from-orange-400 to-orange-600', shadowColor: 'shadow-orange-200' },
    { id: 'work', name: 'Work', emoji: '💼', color: 'from-purple-400 to-purple-600', shadowColor: 'shadow-purple-200' },
    { id: 'social', name: 'Social', emoji: '👥', color: 'from-pink-400 to-pink-600', shadowColor: 'shadow-pink-200' }
  ];

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <Image
        src="/cats-for-use/backrounds/1.png"
        alt="Cute game background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Magical overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-50/20 to-blue-100/30" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10
            }}
            animate={{
              y: -10,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 max-w-6xl mx-auto">
        {/* Top Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-6"
        >
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">👋</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Welcome back,</p>
                <p className="text-lg font-bold text-gray-800">Roman-24</p>
              </div>
            </div>
          </div>

          {/* Time Card */}
          <div className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🕐</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Current Time</p>
                <p className="text-lg font-bold text-gray-800">{formatTime(currentTime)}</p>
              </div>
            </div>
          </div>

          {/* Coins Card */}
          <div className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">💰</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">ZRC Balance</p>
                <p className="text-lg font-bold text-gray-800">{coins.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pet Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Pet Vitals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { key: 'happiness', icon: '💖', label: 'Happiness', value: stats.happiness },
              { key: 'hunger', icon: '🍼', label: 'Fullness', value: stats.hunger },
              { key: 'energy', icon: '⚡', label: 'Energy', value: stats.energy },
              { key: 'work', icon: '🎯', label: 'Focus', value: stats.work }
            ].map((stat) => (
              <div key={stat.key} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200/80 rounded-full h-4 shadow-inner">
                    <motion.div
                      className={`h-4 rounded-full bg-gradient-to-r ${getStatColor(stat.value)} shadow-lg`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                    {stat.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Pet Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center mb-8"
        >
          {/* Pet Character */}
          <div className="relative">
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/cats-for-use/home/9-1.svg"
                alt="Zutchi Cat"
                width={350}
                height={350}
                className="drop-shadow-2xl filter brightness-105"
                priority
              />
            </motion.div>

            {/* Pet name tag */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/50">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Zutchi 2.0 ✨
                </span>
              </div>
            </div>
          </div>

          {/* Pet Speech Bubble */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 relative"
          >
            <div className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 max-w-md">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">{getMoodMessage()}</p>
                <p className="text-sm text-gray-600">Tap an activity below to play together!</p>
              </div>
              {/* Speech bubble arrow */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/95 rotate-45 border-l border-t border-white/50"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Activity Navigation */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white text-lg">🎮</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Choose Activity</h3>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {activities.map((activity, index) => {
              const isActive = currentActivity === activity.id;
              return (
                <motion.button
                  key={activity.id}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onActivityChange(activity.id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-purple-300 bg-gradient-to-br from-purple-100/80 to-pink-100/80 shadow-2xl transform scale-110'
                      : 'border-white/50 bg-gradient-to-br from-white/80 to-white/60 hover:border-purple-200 hover:shadow-xl'
                  }`}
                >
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-lg ${activity.shadowColor} transition-all duration-300`}>
                    <span className="text-2xl">{activity.emoji}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    isActive ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {activity.name}
                  </span>

                  {isActive && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
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
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/50 inline-block">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>💡</span>
              Keep all stats balanced for the happiest Zutchi!
              <span>🌟</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PetGame;