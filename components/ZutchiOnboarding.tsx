import React, { useState } from 'react';
import { useZutchiOnboard } from '@/hooks/useZutchiOnboard';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ZutchiOnboardingProps {
  onComplete: () => void;
}

export default function ZutchiOnboarding({ onComplete }: ZutchiOnboardingProps) {
  const { 
    hasZutchi, 
    isLoading, 
    isMinting, 
    error, 
    mintZutchi 
  } = useZutchiOnboard();
  
  const [showMintForm, setShowMintForm] = useState(false);

  const handleMint = async () => {
    setShowMintForm(true);
    const tokenId = await mintZutchi();
    
    if (tokenId) {
      // Wait a bit for the UI to update
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  // If user already has a Zutchi, complete onboarding
  if (hasZutchi) {
    onComplete();
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4 animate-bounce">🐱</div>
          <h2 className="text-2xl font-bold mb-4">Checking your Zutchi...</h2>
          <p className="text-gray-600">Looking for your digital pet...</p>
        </Card>
      </div>
    );
  }

  if (showMintForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4">
          {isMinting ? (
            <>
              <div className="text-6xl mb-4 animate-pulse">🎉</div>
              <h2 className="text-2xl font-bold mb-4">Minting your Zutchi!</h2>
              <p className="text-gray-600 mb-4">Creating your digital pet on the blockchain...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            </>
          ) : error ? (
            <>
              <div className="text-6xl mb-4">😿</div>
              <h2 className="text-2xl font-bold mb-4 text-red-600">Oops!</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => setShowMintForm(false)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Try Again
              </Button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-4">Welcome to Zutchi!</h2>
              <p className="text-gray-600">Your digital pet is ready to play!</p>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md mx-4">
        <div className="text-6xl mb-6">🐱</div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Zutchi!</h1>
        <p className="text-gray-600 mb-6">
          It looks like this is your first time here. Let's create your digital pet!
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Create your unique digital pet</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Start your Web3 journey</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Join the Zutchi community</span>
          </div>
        </div>

        <Button 
          onClick={handleMint}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
          disabled={isMinting}
        >
          {isMinting ? 'Creating...' : 'Create My Zutchi'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          This will mint an NFT on the Zircuit network. No gas fees required!
        </p>
      </Card>
    </div>
  );
}
