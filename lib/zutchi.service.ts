import { ethers } from "ethers";
import {
  ZUTCHI_ABI,
  ZUTCHI_CONTRACT_ADDRESS,
  ZIRCUIT_CONFIG,
} from "./zutchiAbi";

export interface ZutchiData {
  bornAtBlock: bigint;
  energy: bigint;
  health: bigint;
  level: bigint;
  xp: bigint;
  isBusy: boolean;
  freeAtBlock: bigint;
  hungryAtBlock: bigint;
  lastAteAt: bigint;
  nutrition: bigint;
  frens: bigint[];
  potentialFrens: bigint[];
}

export class ZutchiService {
  private contract: any;
  private wallet: any;
  private walletClient: any;
  private contractInterface: ethers.Interface;

  constructor(wallet: any) {
    this.wallet = wallet;
    this.walletClient = this.getWalletClient();
    this.contract = this.getContract();
    this.contractInterface = new ethers.Interface(ZUTCHI_ABI);
  }

  private getWalletClient() {
    if (!this.wallet) return null;

    console.log(
      "ZutchiService: Wallet object properties:",
      Object.keys(this.wallet)
    );
    console.log("ZutchiService: Wallet details:", {
      id: this.wallet.id,
      address: this.wallet.address,
      chainType: this.wallet.chainType,
      walletClientType: this.wallet.walletClientType,
      connectorType: this.wallet.connectorType,
    });

    // Try different ways to access the wallet client
    // Privy might expose the wallet client differently
    if (this.wallet.walletClient) {
      console.log("ZutchiService: Found walletClient property");
      return this.wallet.walletClient;
    }

    // Check if the wallet itself has the methods
    if (this.wallet.readContract && this.wallet.writeContract) {
      console.log(
        "ZutchiService: Found readContract/writeContract methods directly on wallet"
      );
      return this.wallet;
    }

    // Check if there's a provider or signer
    if (this.wallet.provider) {
      console.log("ZutchiService: Found provider property");
      return this.wallet.provider;
    }

    if (this.wallet.signer) {
      console.log("ZutchiService: Found signer property");
      return this.wallet.signer;
    }

    // For injected wallets, try to access the ethereum provider
    if (
      this.wallet.connectorType === "injected" &&
      typeof window !== "undefined"
    ) {
      console.log(
        "ZutchiService: Trying to access window.ethereum for injected wallet"
      );
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        console.log("ZutchiService: Found window.ethereum provider");
        return ethereum;
      }
    }

    // Try to access the underlying ethereum provider from the wallet object
    if (this.wallet.ethereum) {
      console.log("ZutchiService: Found ethereum property on wallet");
      return this.wallet.ethereum;
    }

    // Check if the wallet itself has a request method (standard for injected wallets)
    if (this.wallet.request) {
      console.log(
        "ZutchiService: Found request method on wallet - using as ethereum provider"
      );
      return this.wallet;
    }

    // Try to access any method that might be a provider
    for (const key of Object.keys(this.wallet)) {
      const value = this.wallet[key];
      if (value && typeof value === "object" && value.request) {
        console.log(
          `ZutchiService: Found potential provider in property: ${key}`
        );
        return value;
      }
    }

    console.warn(
      "ZutchiService: Could not find suitable wallet client. Available properties:",
      Object.keys(this.wallet)
    );
    return null;
  }

  private getContract() {
    if (!this.walletClient) return null;

    // Check if the wallet client has the required methods
    if (!this.walletClient.readContract && !this.walletClient.request) {
      console.warn(
        "Wallet client does not have readContract method or request method. Available methods:",
        Object.keys(this.walletClient)
      );
      return null;
    }

    return {
      address: ZUTCHI_CONTRACT_ADDRESS,
      abi: ZUTCHI_ABI,
      walletClient: this.walletClient,
    };
  }

  // Helper method to read contract data
  private async readContract(
    functionName: string,
    args: any[] = []
  ): Promise<any> {
    if (!this.walletClient) throw new Error("No wallet client available");

    try {
      // Try different methods to read contract data
      if (this.walletClient.readContract) {
        return await this.walletClient.readContract({
          address: ZUTCHI_CONTRACT_ADDRESS,
          abi: ZUTCHI_ABI,
          functionName,
          args,
        });
      }

      // Fallback to request method (for injected wallets)
      if (this.walletClient.request) {
        const data = this.contractInterface.encodeFunctionData(
          functionName,
          args
        );
        const result = await this.walletClient.request({
          method: "eth_call",
          params: [
            {
              to: ZUTCHI_CONTRACT_ADDRESS,
              data,
            },
            "latest",
          ],
        });

        // Decode the result
        return this.contractInterface.decodeFunctionResult(
          functionName,
          result
        )[0];
      }

      throw new Error("No suitable method to read contract data");
    } catch (error) {
      console.error(`Error reading contract function ${functionName}:`, error);
      throw error;
    }
  }

  // Helper method to write contract data
  private async writeContract(
    functionName: string,
    args: any[] = [],
    value: bigint = BigInt(0)
  ): Promise<string> {
    if (!this.walletClient) throw new Error("No wallet client available");

    try {
      // Try different methods to write contract data
      if (this.walletClient.writeContract) {
        return await this.walletClient.writeContract({
          address: ZUTCHI_CONTRACT_ADDRESS,
          abi: ZUTCHI_ABI,
          functionName,
          args,
          value,
        });
      }

      // Fallback to request method (for injected wallets)
      if (this.walletClient.request) {
        const data = this.contractInterface.encodeFunctionData(
          functionName,
          args
        );
        const accounts = await this.walletClient.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        const result = await this.walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: ZUTCHI_CONTRACT_ADDRESS,
              data,
              value: "0x" + value.toString(16), // Convert to hex
            },
          ],
        });

        return result;
      }

      throw new Error("No suitable method to write contract data");
    } catch (error) {
      console.error(`Error writing contract function ${functionName}:`, error);
      throw error;
    }
  }

  // Check if user has a Zutchi NFT
  async hasZutchi(userAddress: string): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const balance = await this.readContract("balanceOf", [userAddress]);
      return Number(balance) > 0;
    } catch (error) {
      console.error("Error checking Zutchi balance:", error);
      return false;
    }
  }

  // Get user's Zutchi token ID
  async getZutchiTokenId(userAddress: string): Promise<bigint | null> {
    try {
      if (!this.contract) return null;

      const balance = await this.readContract("balanceOf", [userAddress]);

      if (Number(balance) === 0) return null;

      // Get the total number of tokens minted
      const totalSupply = await this.readContract("getCurrentTokenId", []);

      // Iterate through tokens to find the one owned by the user
      for (let tokenId = 1; tokenId <= Number(totalSupply); tokenId++) {
        try {
          const owner = await this.readContract("ownerOf", [tokenId]);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            return BigInt(tokenId);
          }
        } catch (error) {
          // Token might not exist, continue to next
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting Zutchi token ID:", error);
      return null;
    }
  }

  // Mint a new Zutchi NFT
  async mintZutchi(): Promise<bigint | null> {
    try {
      if (!this.contract) return null;

      const hash = await this.writeContract("mint", [], BigInt(0));

      // Wait for transaction confirmation
      const receipt = await this.waitForTransactionReceipt(hash);

      // Get the minted token ID from events
      const mintEvent = receipt.logs?.find(
        (log: any) =>
          log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );

      if (mintEvent) {
        const tokenId = BigInt(mintEvent.topics[3]);
        return tokenId;
      }

      return null;
    } catch (error) {
      console.error("Error minting Zutchi:", error);
      return null;
    }
  }

  // Get Zutchi attributes
  async getZutchiAttributes(tokenId: bigint): Promise<ZutchiData | null> {
    try {
      if (!this.contract) return null;

      const attributes = await this.readContract("getZutchiAttributes", [
        tokenId,
      ]);
      return attributes as ZutchiData;
    } catch (error) {
      console.error("Error getting Zutchi attributes:", error);
      return null;
    }
  }

  // Feed the Zutchi
  async feedZutchi(tokenId: bigint, foodAmount: bigint): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const hash = await this.writeContract("feedZutchi", [
        tokenId,
        foodAmount,
      ]);

      // Wait for transaction confirmation
      await this.waitForTransactionReceipt(hash);

      return true;
    } catch (error) {
      console.error("Error feeding Zutchi:", error);
      return false;
    }
  }

  // Put Zutchi to sleep
  async putToSleep(tokenId: bigint, sleepDuration: bigint): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const hash = await this.writeContract("putToSleep", [
        tokenId,
        sleepDuration,
      ]);

      // Wait for transaction confirmation
      await this.waitForTransactionReceipt(hash);

      return true;
    } catch (error) {
      console.error("Error putting Zutchi to sleep:", error);
      return false;
    }
  }

  // Put Zutchi to work
  async putToWork(tokenId: bigint, workDuration: bigint): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const hash = await this.writeContract("putToWork", [
        tokenId,
        workDuration,
      ]);

      // Wait for transaction confirmation
      await this.waitForTransactionReceipt(hash);

      return true;
    } catch (error) {
      console.error("Error putting Zutchi to work:", error);
      return false;
    }
  }

  // Add a friend
  async addFren(tokenId: bigint, frenId: bigint): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const hash = await this.writeContract("addFren", [tokenId, frenId]);

      // Wait for transaction confirmation
      await this.waitForTransactionReceipt(hash);

      return true;
    } catch (error) {
      console.error("Error adding friend:", error);
      return false;
    }
  }

  // Get friends list
  async getFrens(tokenId: bigint): Promise<bigint[]> {
    try {
      if (!this.contract) return [];

      const frens = await this.readContract("getFrens", [tokenId]);
      return frens as bigint[];
    } catch (error) {
      console.error("Error getting friends:", error);
      return [];
    }
  }

  // Get potential friends
  async getPotentialFrens(tokenId: bigint): Promise<bigint[]> {
    try {
      if (!this.contract) return [];

      const potentialFrens = await this.readContract("getPotentialFrens", [
        tokenId,
      ]);
      return potentialFrens as bigint[];
    } catch (error) {
      console.error("Error getting potential friends:", error);
      return [];
    }
  }

  // Accept friend request
  async acceptFren(tokenId: bigint, frenId: bigint): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const hash = await this.writeContract("acceptFren", [tokenId, frenId]);

      // Wait for transaction confirmation
      await this.waitForTransactionReceipt(hash);

      return true;
    } catch (error) {
      console.error("Error accepting friend:", error);
      return false;
    }
  }

  // Decline friend request
  async declineFren(tokenId: bigint, frenId: bigint): Promise<boolean> {
    try {
      if (!this.contract) return false;

      const hash = await this.writeContract("declineFren", [tokenId, frenId]);

      // Wait for transaction confirmation
      await this.waitForTransactionReceipt(hash);

      return true;
    } catch (error) {
      console.error("Error declining friend:", error);
      return false;
    }
  }

  // Get current token ID (for minting)
  async getCurrentTokenId(): Promise<bigint> {
    try {
      if (!this.contract) return BigInt(0);

      const currentId = await this.readContract("getCurrentTokenId", []);
      return currentId as bigint;
    } catch (error) {
      console.error("Error getting current token ID:", error);
      return BigInt(0);
    }
  }

  // Get total supply
  async getTotalSupply(): Promise<bigint> {
    try {
      if (!this.contract) return BigInt(0);

      const totalSupply = await this.readContract("totalSupply", []);
      return totalSupply as bigint;
    } catch (error) {
      console.error("Error getting total supply:", error);
      return BigInt(0);
    }
  }

  // Wait for transaction receipt
  private async waitForTransactionReceipt(hash: string): Promise<any> {
    if (!this.walletClient) throw new Error("No wallet client available");

    try {
      if (this.walletClient.waitForTransactionReceipt) {
        return await this.walletClient.waitForTransactionReceipt({ hash });
      }

      // Fallback for injected wallets
      if (this.walletClient.request) {
        // Poll for transaction receipt
        let receipt = null;
        while (!receipt) {
          receipt = await this.walletClient.request({
            method: "eth_getTransactionReceipt",
            params: [hash],
          });

          if (!receipt) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          }
        }

        return receipt;
      }

      throw new Error("No suitable method to wait for transaction receipt");
    } catch (error) {
      console.error("Error waiting for transaction receipt:", error);
      throw error;
    }
  }
}
