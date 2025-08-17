// config/contract.ts

export const ZUTCHI_CONFIG = {
  // Deployed Zutchi (ERC-721) on Zircuit Garfield Testnet
  contractAddress: "0x7faD121fe4531B5232B6ac371FF6436D3be65Fcf",

  network: {
    id: 48898,
    name: "Zircuit Garfield Testnet",
    network: "zircuit-garfield-testnet",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://garfield-testnet.zircuit.com/"] },
      public: { http: ["https://garfield-testnet.zircuit.com/"] },
    },
    blockExplorers: {
      default: {
        name: "Zircuit Explorer",
        url: "https://explorer.garfield-testnet.zircuit.com/",
      },
    },
  },

  // Optional dapp constants
  contract: {
    name: "Zutchi",
    symbol: "ZUTCHI",
    mintPrice: "0",
    maxSupply: "10000",
  },

  game: {
    stats: {
      energy: { min: 0, max: 100, default: 80 },
      health: { min: 0, max: 100, default: 100 },
      nutrition: { min: 0, max: 100, default: 100 },
    },
    activities: {
      sleep: { min: 10, max: 100, default: 30 },
      work: { min: 10, max: 100, default: 50 },
      eat: { cooldown: 5 },
    },
    levels: { xpPerLevel: 100, maxLevel: 100 },
  },

  social: { maxFriends: 10, friendRequestCooldown: 24 * 60 * 60 },
} as const;

export const ENV = {
  NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS ||
    ZUTCHI_CONFIG.contractAddress,

  NEXT_PUBLIC_ZIRCUIT_RPC_URL:
    process.env.NEXT_PUBLIC_ZIRCUIT_RPC_URL ||
    ZUTCHI_CONFIG.network.rpcUrls.default.http[0],

  NEXT_PUBLIC_ZIRCUIT_EXPLORER_URL:
    process.env.NEXT_PUBLIC_ZIRCUIT_EXPLORER_URL ||
    ZUTCHI_CONFIG.network.blockExplorers.default.url,

  // ERC-20 Zircuit token address used in `feed()`. Set the live address here.
  NEXT_PUBLIC_ZIRCUIT_TOKEN_ADDRESS:
    process.env.NEXT_PUBLIC_ZIRCUIT_TOKEN_ADDRESS || "", // <-- fill when you have it
} as const;

export const ZIRCUIT_CHAIN_ID_DEC = 48898;
export const ZIRCUIT_CHAIN_ID_HEX = "0xBF02";
export const ZIRCUIT_CHAIN_PARAMS = {
  chainId: ZIRCUIT_CHAIN_ID_HEX,
  chainName: ZUTCHI_CONFIG.network.name,
  rpcUrls: ZUTCHI_CONFIG.network.rpcUrls.default.http,
  nativeCurrency: ZUTCHI_CONFIG.network.nativeCurrency,
  blockExplorerUrls: [ZUTCHI_CONFIG.network.blockExplorers.default.url],
};
