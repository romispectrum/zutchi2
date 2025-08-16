"use client"

import { useState } from "react";

interface SleepActivityProps {
  onBack?: () => void;
}

const SleepActivity = ({ onBack }: SleepActivityProps) => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(0);

  const roomObjects = [
    { id: "closet", name: "Closet", emoji: "🚪", action: "Open" },
    { id: "lamp", name: "Lamp", emoji: "💡", action: "Toggle" },
    { id: "shop", name: "Shop", emoji: "🏪", action: "Buy" },
  ];

  const handleObjectClick = (objectId: string) => {
    if (objectId === "lamp") {
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
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 relative overflow-hidden">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 text-black">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-black/20 hover:bg-black/30 border-2 border-black/20"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="bg-black/20 px-6 py-2 rounded-full border-2 border-black/20 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-black">Bedroom</h1>
        </div>

        <button className="p-3 rounded-full bg-black/20 hover:bg-black/30 border-2 border-black/20 opacity-50">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pillow/Bed Area */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 min-h-[60vh]">
        <div className="relative">
          <div className="w-48 h-32 bg-white rounded-[50px] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-4 border-gray-200 relative">
            <div className="absolute inset-2 bg-gray-50 rounded-[40px]"></div>
            <div className="absolute inset-4 bg-white rounded-[30px]"></div>
          </div>

          {isSleeping && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="text-6xl animate-pulse">💤</div>
              <div className="text-center mt-2 bg-black/20 px-3 py-1 rounded-full border-2 border-black/20">
                <span className="text-black font-bold text-sm">{sleepTimer}s</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Objects */}
      <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/30 p-4">
        <div className="flex justify-between items-end max-w-md mx-auto">
          {roomObjects.map(obj => (
            <button
              key={obj.id}
              onClick={() => handleObjectClick(obj.id)}
              className="flex flex-col items-center gap-2 bg-white/80 hover:bg-white border-4 border-black rounded-3xl p-4 transition-all duration-200 hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="text-4xl">{obj.emoji}</div>
              <span className="text-xs font-bold text-black text-center leading-tight">{obj.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepActivity;