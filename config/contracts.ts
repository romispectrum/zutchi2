// Zutchi Contract Configuration
export const ZUTCHI_CONFIG = {
  // Contract address on Zircuit Garfield testnet
  contractAddress: "0x7faD121fe4531B5232B6ac371FF6436D3be65Fcf",
  
  // Network configuration
  network: {
    id: 48898, // Updated to correct Chain ID
    name: "Zircuit Garfield Testnet",
    network: "zircuit-garfield-testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://garfield-testnet.zircuit.com/"],
      },
      public: {
        http: ["https://garfield-testnet.zircuit.com/"],
      },
    },
    blockExplorers: {
      default: {
        name: "Zircuit Explorer",
        url: "https://explorer.garfield-testnet.zircuit.com/",
      },
    },
  },
  
  // Contract settings
  contract: {
    name: "Zutchi",
    symbol: "ZUTCHI",
    mintPrice: "0", // No ETH required for minting
    maxSupply: "10000", // Maximum number of Zutchi NFTs
  },
  
  // Game mechanics
  game: {
    // Pet stats ranges
    stats: {
      energy: { min: 0, max: 100, default: 80 },
      health: { min: 0, max: 100, default: 100 },
      nutrition: { min: 0, max: 100, default: 100 },
    },
    
    // Activity durations (in blocks)
    activities: {
      sleep: { min: 10, max: 100, default: 30 },
      work: { min: 10, max: 100, default: 50 },
      eat: { cooldown: 5 }, // Cooldown between meals
    },
    
    // Level progression
    levels: {
      xpPerLevel: 100,
      maxLevel: 100,
    },
  },
  
  // Social features
  social: {
    maxFriends: 10,
    friendRequestCooldown: 24 * 60 * 60, // 24 hours in seconds
  },
} as const;

// Environment variables
export const ENV = {
  NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS || ZUTCHI_CONFIG.contractAddress,
  NEXT_PUBLIC_ZIRCUIT_RPC_URL: process.env.NEXT_PUBLIC_ZIRCUIT_RPC_URL || ZUTCHI_CONFIG.network.rpcUrls.default.http[0],
  NEXT_PUBLIC_ZIRCUIT_EXPLORER_URL: process.env.NEXT_PUBLIC_ZIRCUIT_EXPLORER_URL || ZUTCHI_CONFIG.network.blockExplorers.default.url,
} as const;
