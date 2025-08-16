"use client"

import { useState } from 'react';

interface SocialActivityProps {
  onBack?: () => void;
}

const SocialActivity = ({ onBack }: SocialActivityProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const roomObjects = [
    { id: 'computer', name: 'Computer', emoji: '💻', action: 'Play' },
    { id: 'phone', name: 'Phone', emoji: '📱', action: 'Call' },
    { id: 'shop', name: 'Shop', emoji: '🏪', action: 'Buy' }
  ];

  const handleObjectClick = (objectId: string) => {
    if (objectId === 'computer' || objectId === 'phone') {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-green-400 relative overflow-hidden">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 text-white">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-black/20 hover:bg-black/30 border-2 border-white/20"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="bg-black/20 px-6 py-2 rounded-full border-2 border-white/20 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-white">Game Room</h1>
        </div>

        <button className="p-3 rounded-full bg-black/20 hover:bg-black/30 border-2 border-white/20 opacity-50">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 min-h-[60vh]">
        {isPlaying && (
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-4xl animate-bounce">🎮</div>
              <div className="text-4xl animate-pulse">💕</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</div>
            </div>
            <div className="bg-black/20 px-4 py-2 rounded-full border-2 border-white/20">
              <p className="text-white text-lg font-bold">
                Having fun!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Objects */}
      <div className="absolute bottom-0 left-0 right-0 bg-green-500/30 p-4">
        <div className="flex justify-between items-end max-w-md mx-auto">
          {roomObjects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleObjectClick(obj.id)}
              className="flex flex-col items-center gap-2 bg-white/80 hover:bg-white border-4 border-black rounded-3xl p-4 transition-all duration-200 hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="text-4xl">{obj.emoji}</div>
              <span className="text-xs font-bold text-black text-center leading-tight">
                {obj.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialActivity;