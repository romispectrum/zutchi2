"use client"

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import PetGame from '../components/PetGame';
import EatActivity from '../components/activities/EatActivity';
import SleepActivity from '../components/activities/SleepActivity';
import SocialActivity from '../components/activities/SocialActivity';
import WorkActivity from '../components/activities/WorkActivity';

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
        return (
          <SleepActivity 
            onActivityChange={setCurrentActivity}
            currentActivity={currentActivity}
            userId={user?.id}
            onBack={() => setCurrentActivity('home')} 
            onLogout={handleLogout}
          />
        );
      case 'eat':
        return (
          <EatActivity 
            onActivityChange={setCurrentActivity}
            currentActivity={currentActivity}
            userId={user?.id}
            onBack={() => setCurrentActivity('home')} 
            onLogout={handleLogout}
          />
        );
      case 'work':
        return (
          <WorkActivity 
            onActivityChange={setCurrentActivity}
            currentActivity={currentActivity}
            userId={user?.id}
            onBack={() => setCurrentActivity('home')} 
                        onLogout={handleLogout}
          />
        );
      case 'social':
        return (
          <SocialActivity 
            onActivityChange={setCurrentActivity}
            currentActivity={currentActivity}
            userId={user?.id}
            onBack={() => setCurrentActivity('home')} 
                        onLogout={handleLogout}
          />
        );
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
      <PetGame
        onActivityChange={setCurrentActivity}
        currentActivity={currentActivity}
        userId={user?.id}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default AppPage;