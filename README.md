# Zutchi Monorepo

Play · Earn · Socialize · Educate. Your digital pet, brought to life.

Zutchi is a Web3-native Tamagotchi built on Zircuit, blending fun, DeFi utility, and social interaction into a single game. This monorepo contains both the smart contracts and the web application that power Zutchi.

⸻

🚀 Project Overview

The Problem

Web3 is powerful but intimidating. Most products focus on speculation instead of users. What people actually want is fun.
Currently, there is no game built on Zircuit—an opportunity to create something engaging that showcases the ecosystem.

The Solution: Zutchi

Zutchi reimagines the classic Tamagotchi as a Web3-native experience:
- Fun & Accessible → Start with just an email; grow into a Web3 power user.
- Useful → Your pet thrives when you interact with DeFi and the Zircuit ecosystem.
- Social → Events, mini-games, and on-chain interactions with others.
- Educational → Learn Web3 concepts naturally while playing.

⸻

🕹 Core Gameplay

Each pet has 4 needs:
- Food → Feed it with tokens; part flows back into the community.
- Sleep → Natural break mechanic.
- Work → Pets “work” by providing liquidity or governance participation.
- Social-Fun → Events, on-chain connections, and mini-games.

## ⚙️ Contracts

Located in contracts/.
The main contract is Zutchi ERC-721 NFT Contract:
	•	ERC-721 Standard with metadata
	•	Ownable for admin control
	•	Mintable & Burnable (owner only)
	•	Unlimited supply
	•	Gas optimized

See hardhat/README_ZUTCHI.md for full details.

## 🌐 Webapp

Located in webapp/.

Features:
	•	Onboarding funnel → Start Web2-simple, progress into Web3.
	•	Pet dashboard → View, feed, evolve, and socialize with your Zutchi.
	•	Marketplace → Use ZRC for feeding, trading, and rewards.
	•	DeFi integration hooks → Pets “work” across the Zircuit ecosystem.

 ## 🔮 Roadmap
EIP-6551 Integration → Pets as wallets
Mini-games → Expand fun & social mechanics
AI Agents → Pets as companions with personality
More DeFi Integrations → Staking, lending, and governance work

## Setup

1. Clone this repository and open it in your terminal. 
```sh
git clone https://github.com/privy-io/create-next-app
```

2. Install the necessary dependencies (including [Privy Auth](https://www.npmjs.com/package/@privy-io/react-auth)) with `npm`.
```sh
npm i 
```

3. Initialize your environment variables by copying the `.env.example` file to an `.env.local` file. Then, in `.env.local`, [paste your Privy App ID from the dashboard](https://docs.privy.io/guide/dashboard/api-keys).

4. Run in

```sh
npm run dev
```
