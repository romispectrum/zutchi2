"use client"

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import PetGame from '../components/PetGame';
import EatActivity from '../components/activities/EatActivity';
import SleepActivity from '../components/activities/SleepActivity';
import SocialActivity from '../components/activities/SocialActivity';
import WorkActivity from '../components/activities/WorkActivity';
import ZutchiOnboarding from '../components/ZutchiOnboarding';
import WalletLoadingScreen from '../components/WalletLoadingScreen';
import { ZutchiCacheDebugger } from '../components/ZutchiCacheDebugger';
import { useZutchiOnboard } from '../hooks/useZutchiOnboard';

const AppPage = () => {
  const { ready, authenticated, logout, user } = usePrivy();
  const router = useRouter();
  const [currentActivity, setCurrentActivity] = useState('home');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [walletReady, setWalletReady] = useState(false);
  
  const { hasZutchi, isLoading: isZutchiLoading, checkZutchiStatus } = useZutchiOnboard();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/"); // kick back to landing if logged out
    }
  }, [ready, authenticated, router]);

  // Check Zutchi status after wallet is ready
  useEffect(() => {
    if (walletReady && authenticated && user?.wallet) {
      checkZutchiStatus();
    }
  }, [walletReady, authenticated, user?.wallet, checkZutchiStatus]);

  // Handle wallet ready
  const handleWalletReady = () => {
    setWalletReady(true);
  };

  // Handle leave game
  const handleLeaveGame = () => {
    logout();
    router.replace("/");
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

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

  // Loading state - show this while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐱</div>
          <p className="text-xl font-bold text-black">Initializing Zutchi...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!authenticated) return null;

  // Show wallet loading screen if wallet is not ready yet
  if (!walletReady) {
    return (
      <WalletLoadingScreen
        onWalletReady={handleWalletReady}
        onLeaveGame={handleLeaveGame}
      />
    );
  }

  // Show onboarding if user doesn't have a Zutchi yet
  if (!isZutchiLoading && !hasZutchi && !onboardingComplete) {
    return (
      <>
        <ZutchiOnboarding onComplete={handleOnboardingComplete} />
        {/* Debug component - remove in production */}
        {process.env.NODE_ENV === 'development' && <ZutchiCacheDebugger />}
      </>
    );
  }

  // Loading state while checking Zutchi status
  if (isZutchiLoading) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-xl font-bold text-black">Checking Zutchi Status...</p>
        </div>
      </div>
    );
  }

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
      {/* Debug component - remove in production */}
      {process.env.NODE_ENV === 'development' && <ZutchiCacheDebugger />}
    </div>
  );
};

export default AppPage;