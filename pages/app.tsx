"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import PetGame from '../components/PetGame';
import SleepActivity from '../components/activities/SleepActivity';
import EatActivity from '../components/activities/EatActivity';
import WorkActivity from '../components/activities/WorkActivity';
import SocialActivity from '../components/activities/SocialActivity';

const AppPage = () => {
  const { ready, authenticated, logout, user } = usePrivy();
  const router = useRouter();
  const [currentActivity, setCurrentActivity] = useState('home');

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/"); // kick back to landing if logged out
    }
  }, [ready, authenticated, router]);

  const renderActivity = () => {
    switch (currentActivity) {
      case 'sleep':
        return <SleepActivity onBack={() => setCurrentActivity('home')} />;
      case 'eat':
        return <EatActivity onBack={() => setCurrentActivity('home')} />;
      case 'work':
        return <WorkActivity onBack={() => setCurrentActivity('home')} />;
      case 'social':
        return <SocialActivity onBack={() => setCurrentActivity('home')} />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/"); // send back to landing
  };

  // Loading state
  if (!ready) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐱</div>
          <p className="text-xl font-bold text-black">Loading Zutchi...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!authenticated) return null;

  // Activity view
  if (currentActivity !== 'home') {
    return (
      <div className="w-full h-screen">
        {renderActivity()}
      </div>
    );
  }

  // Main pet game view
  return (
    <div className="min-h-screen bg-orange-300 relative">
      {/* User info and logout button */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
          <div className="text-xs font-bold text-gray-600 mb-1">
            Welcome, {user?.id?.slice(0, 8)}...
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded border-2 border-black text-xs font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <PetGame
        onActivityChange={setCurrentActivity}
        currentActivity={currentActivity}
        userId={user?.id}
      />
    </div>
  );
};

export default AppPage;