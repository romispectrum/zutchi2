"use client"

import { useEffect, useState } from 'react';

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

  const getMoodEmoji = () => {
    switch (petMood) {
      case 'hungry': return '🐱';
      case 'tired': return '😴';
      case 'sad': return '😿';
      default: return '😸';
    }
  };

  const activities = [
    { id: 'home', name: 'Home', emoji: '🏠' },
    { id: 'sleep', name: 'Sleep', emoji: '🌙' },
    { id: 'eat', name: 'Eat', emoji: '🍽️' },
    { id: 'work', name: 'Work', emoji: '💼' },
    { id: 'social', name: 'Social', emoji: '👥' }
  ];

  return (
    <div className="min-h-screen bg-orange-300 p-4 relative">
      {/* Top Status Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>
          <span className="text-black font-bold">{coins}</span>
        </div>

        <div className="flex gap-2">
          <button className="bg-pink-500 border-4 border-white rounded-2xl p-2 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="text-white text-lg">❤️</div>
            <div className="text-xs text-white font-bold">{stats.happiness}</div>
          </button>
          <button className="bg-orange-500 border-4 border-white rounded-2xl p-2 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="text-white text-lg">🍽️</div>
            <div className="text-xs text-white font-bold">{stats.hunger}</div>
          </button>
          <button className="bg-yellow-500 border-4 border-white rounded-2xl p-2 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="text-white text-lg">⚡</div>
            <div className="text-xs text-white font-bold">{stats.energy}</div>
          </button>
          <button className="bg-purple-500 border-4 border-white rounded-2xl p-2 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="text-white text-lg">💼</div>
            <div className="text-xs text-white font-bold">{stats.work}</div>
          </button>
        </div>

        <div className="bg-white border-4 border-black rounded-full p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-black text-xs font-bold">
            ID: {userId?.slice(0, 4)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
        {/* Pet Character */}
        <div className="relative mb-8">
          <div className="w-64 h-64 bg-white rounded-full border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-all duration-500 hover:scale-105">
            <div className="text-8xl animate-pulse">
              {getMoodEmoji()}
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Zutchi 2.0
            </div>
          </div>
        </div>

        {/* Activity Navigation */}
        <div className="flex justify-center gap-3 flex-wrap">
          {activities.map((activity) => {
            const isActive = currentActivity === activity.id;
            return (
              <button
                key={activity.id}
                onClick={() => onActivityChange(activity.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-4 border-black transition-all duration-200 hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  isActive
                    ? 'bg-yellow-400 scale-110'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className="text-3xl">{activity.emoji}</div>
                <span className={`text-xs font-bold ${isActive ? 'text-black' : 'text-gray-600'}`}>
                  {activity.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-orange-400 border-t-4 border-black"></div>
    </div>
  );
};

export default PetGame;