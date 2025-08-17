import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface WalletLoadingScreenProps {
  onWalletReady: () => void;
  onLeaveGame: () => void;
}

export default function WalletLoadingScreen({ onWalletReady, onLeaveGame }: WalletLoadingScreenProps) {
  const { user, authenticated } = usePrivy();
  const router = useRouter();
  const [walletReady, setWalletReady] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [showChoice, setShowChoice] = useState(false);

  // Simulate wallet loading time and check wallet readiness
  useEffect(() => {
    if (!authenticated || !user?.wallet) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(elapsed);
      
      // Check if wallet is ready (has necessary methods)
      const wallet = user.wallet;
      const isReady = wallet && (
        wallet.request || 
        wallet.readContract || 
        wallet.writeContract ||
        (typeof window !== 'undefined' && (window as any).ethereum?.isConnected?.())
      );
      
      if (isReady && elapsed >= 2) { // Minimum 2 seconds loading time
        setWalletReady(true);
        setShowChoice(true);
        clearInterval(interval);
      }
    }, 100);

    // Maximum loading time of 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setWalletReady(true);
      setShowChoice(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [authenticated, user?.wallet]);

  const handleMintNFT = () => {
    onWalletReady();
  };

  const handleLeaveGame = () => {
    onLeaveGame();
    router.push('/');
  };

  if (!authenticated) {
    return null;
  }

  if (!showChoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-6 animate-bounce">🔗</div>
          <h1 className="text-2xl font-bold text-black mb-4">Connecting Wallet...</h1>
          <p className="text-lg text-gray-700 mb-6">
            Please wait while we establish a secure connection to your wallet
          </p>
          
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((loadingTime / 10) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {loadingTime}s / 10s
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Wallet Address: {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}</p>
            <p>Type: {user?.wallet?.walletClientType}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md mx-4">
        <div className="text-6xl mb-6">🎮</div>
        <h1 className="text-2xl font-bold text-black mb-4">Wallet Connected!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your wallet is now ready. What would you like to do?
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleMintNFT}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🚀 Start Playing & Mint NFT
          </Button>
          
          <Button
            onClick={handleLeaveGame}
            variant="outline"
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            ❌ Leave Game
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Wallet: {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}</p>
          <p>Network: Zircuit Garfield Testnet</p>
        </div>
      </Card>
    </div>
  );
}
