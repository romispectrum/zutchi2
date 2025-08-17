"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

interface WalletLoadingScreenProps {
  onWalletReady: () => void;
  onLeaveGame: () => void;
}

const COLORS = {
  cream: "#f6f1e7",
  greenPrimary: "#1f9f49",
  greenSecondary: "#3db54a",
  teal: "#00b1c8",
  dark: "#303e2d",
  deepGreen: "#2c7e3e",
};

export default function WalletLoadingScreen({
  onWalletReady,
  onLeaveGame,
}: WalletLoadingScreenProps) {
  const { user, authenticated } = usePrivy();
  const router = useRouter();

  const [loadingTime, setLoadingTime] = useState(0);
  const [showChoice, setShowChoice] = useState(false);

  // Resolve a wallet address safely (Privy may store multiple linked accounts)
  const walletAddress = useMemo(() => {
    const linked = (user as any)?.linkedAccounts?.find?.(
      (a: any) => a?.type?.includes("wallet")
    );
    return (
      (user as any)?.wallet?.address ||
      linked?.address ||
      (user as any)?.wallet?.address
    );
  }, [user]);

  useEffect(() => {
    if (!authenticated) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(elapsed);

      const hasProvider =
        typeof window !== "undefined" &&
        (window as any)?.ethereum &&
        typeof (window as any).ethereum.request === "function";

      const isReady = Boolean(walletAddress) || hasProvider;

      if (isReady && elapsed >= 2) {
        setShowChoice(true);
        clearInterval(interval);
      }
    }, 120);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setShowChoice(true);
    }, 10_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [authenticated, walletAddress]);

  const handleMintNFT = () => onWalletReady();
  const handleLeaveGame = () => {
    onLeaveGame();
    router.push("/");
  };

  if (!authenticated) return null;

  const pct = Math.min((loadingTime / 10) * 100, 100);

  // ---- Shell with softer overlay (≈40% opacity + 1px blur) ----
  const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 bg-cover bg-no-repeat bg-bottom"
      style={{
        backgroundImage: "url('/28.png')", // ensure file at public/28.png
        backgroundColor: COLORS.cream,
      }}
    >
      <div
        className="absolute inset-0 backdrop-blur-[1px]"
        style={{ backgroundColor: `${COLORS.cream}66` }} // 0x66 ≈ 40% opacity
      />
      <div className="relative z-10 max-w-md w-full">{children}</div>
    </div>
  );

  // ---- Local BrandCard (so it’s always found) ----
  const BrandCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Card
      className="rounded-2xl border bg-white"
      style={{
        borderColor: "rgba(48,62,45,0.12)",
        boxShadow:
          "0 8px 28px rgba(48,62,45,0.10), 0 1px 0 rgba(48,62,45,0.04)",
      }}
    >
      <div className="p-8">{children}</div>
    </Card>
  );

  // -------------------- Loading View --------------------
  if (!showChoice) {
    return (
      <Shell>
        <BrandCard>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="text-6xl mb-6"
              aria-hidden
            >
              🔗
            </motion.div>

            <h1
              className="text-2xl font-semibold mb-2 tracking-tight"
              style={{ color: COLORS.dark }}
            >
              Connecting Wallet…
            </h1>
            <p className="text-sm mb-6" style={{ color: "rgba(48,62,45,0.7)" }}>
              Please wait while we establish a secure connection to your wallet.
            </p>

            {/* Progress */}
            <div className="mb-2">
              <div
                className="h-2 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(44,126,62,0.15)" }}
                aria-label="Loading progress"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.teal} 0%, ${COLORS.greenPrimary} 50%, ${COLORS.greenSecondary} 100%)`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs" style={{ color: "rgba(48,62,45,0.7)" }}>
                {loadingTime}s / 10s
              </div>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: "rgba(48,62,45,0.7)" }}>Wallet</span>
                <span className="font-medium" style={{ color: COLORS.dark }}>
                  {walletAddress
                    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "rgba(48,62,45,0.7)" }}>Network</span>
                <span className="font-medium" style={{ color: COLORS.dark }}>
                  Zircuit Garfield Testnet
                </span>
              </div>
            </div>
          </div>
        </BrandCard>
      </Shell>
    );
  }

  // -------------------- Connected View --------------------
  return (
    <Shell>
      <BrandCard>
        <div className="text-center">
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-6xl mb-6"
            aria-hidden
          >
            🎮
          </motion.div>

        <h1
            className="text-2xl font-semibold mb-2 tracking-tight"
            style={{ color: COLORS.dark }}
          >
            Wallet Connected!
          </h1>
          <p className="text-sm mb-8" style={{ color: "rgba(48,62,45,0.7)" }}>
            Your wallet is ready. What would you like to do?
          </p>

          <div className="space-y-3">
            {/* Primary CTA */}
            <Button
              onClick={handleMintNFT}
              className="w-full h-12 rounded-xl font-semibold transition-all"
              style={{
                color: "#ffffff",
                background: `linear-gradient(90deg, ${COLORS.greenPrimary} 0%, ${COLORS.greenSecondary} 100%)`,
                boxShadow: "0 8px 20px rgba(31,159,73,0.25)",
              }}
            >
              🚀 Start Playing &amp; Mint NFT
            </Button>

            {/* Secondary CTA */}
            <Button
              onClick={handleLeaveGame}
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold"
              style={{
                color: COLORS.deepGreen,
                borderColor: "rgba(44,126,62,0.35)",
                backgroundColor: "rgba(44,126,62,0.06)",
              }}
            >
              ❌ Leave Game
            </Button>
          </div>

          <div className="mt-6 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: "rgba(48,62,45,0.7)" }}>Wallet</span>
              <span className="font-medium" style={{ color: COLORS.dark }}>
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "rgba(48,62,45,0.7)" }}>Network</span>
              <span className="font-medium" style={{ color: COLORS.dark }}>
                Zircuit Garfield Testnet
              </span>
            </div>
          </div>
        </div>
      </BrandCard>
    </Shell>
  );
}
