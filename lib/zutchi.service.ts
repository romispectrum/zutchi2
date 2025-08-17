// lib/zutchi.service.ts
import { ethers } from "ethers";
import {
  ENV,
  ZIRCUIT_CHAIN_ID_DEC,
  ZIRCUIT_CHAIN_PARAMS,
} from "@/config/contracts"; // <-- keep this path if your file is 'contracts.ts'

const ZUTCHI_ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function getCurrentTokenId() view returns (uint256)",
  "function getZutchiAttributes(uint256 tokenId) view returns (tuple(uint256 bornAtBlock,uint256 energy,uint256 health,uint256 level,uint256 xp,bool isBusy,uint256 freeAtBlock,uint256 hungryAtBlock,uint256 lastAteAt,uint256 nutrition,uint256[] frens,uint256[] potentialFrens))",
  "function getFrens(uint256 tokenId) view returns (uint256[])",
  "function getPotetionalFrens(uint256 tokenId) view returns (uint256[])",
  "function mint() payable returns (uint256)",
  "function feed(uint256 tokenId, uint256 foodAmount)",
  "function putToSleep(uint256 tokenId, uint256 sleepDuration)",
  "function putToWork(uint256 tokenId, uint256 workDuration)",
  "function setBaseURI(string baseURI)",
  "function withdrawZRC() returns (bool)",
  "event TokenMinted(address indexed to, uint256 indexed tokenId)",
];

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
];

export type Address = `0x${string}`;

export type ZutchiData = {
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
};

function getPublicProvider() {
  return new ethers.JsonRpcProvider(ENV.NEXT_PUBLIC_ZIRCUIT_RPC_URL, {
    chainId: ZIRCUIT_CHAIN_ID_DEC,
    name: "Zircuit Garfield Testnet",
  });
}

function hasWindowEthereum() {
  return typeof window !== "undefined" && !!(window as any).ethereum;
}

async function getBrowserProvider(): Promise<ethers.BrowserProvider> {
  if (!hasWindowEthereum()) throw new Error("No injected wallet found.");
  return new ethers.BrowserProvider((window as any).ethereum);
}

async function ensureDeployed(provider: ethers.Provider, address: string) {
  const code = await provider.getCode(address);
  if (!code || code === "0x") {
    throw new Error(`No contract code at ${address}. Check chain/address.`);
  }
}

export async function ensureChainAndSigner() {
  const provider = await getBrowserProvider();
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== ZIRCUIT_CHAIN_ID_DEC) {
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ZIRCUIT_CHAIN_PARAMS.chainId }],
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ZIRCUIT_CHAIN_PARAMS],
        });
      } else {
        throw e;
      }
    }
  }
  return await provider.getSigner();
}

/** READS **/
export async function getZutchiBalanceOf(user: Address): Promise<bigint> {
  if (!user) return 0 as unknown as bigint; // <-- fix
  const provider = getPublicProvider();
  const address = ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS;
  await ensureDeployed(provider, address);
  const c = new ethers.Contract(address, ZUTCHI_ERC721_ABI, provider);
  return (await c.balanceOf(user)) as bigint;
}

export async function hasZutchi(user: Address): Promise<boolean> {
  const bal = await getZutchiBalanceOf(user);
  return Number(bal) > 0;     // no BigInt literal needed
}


export async function totalSupply(): Promise<bigint> {
  const provider = getPublicProvider();
  const address = ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS;
  await ensureDeployed(provider, address);
  const c = new ethers.Contract(address, ZUTCHI_ERC721_ABI, provider);
  return (await c.totalSupply()) as bigint;
}

export async function getCurrentTokenId(): Promise<bigint> {
  const provider = getPublicProvider();
  const address = ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS;
  await ensureDeployed(provider, address);
  const c = new ethers.Contract(address, ZUTCHI_ERC721_ABI, provider);
  return (await c.getCurrentTokenId()) as bigint;
}

export async function getZutchiAttributes(tokenId: bigint): Promise<ZutchiData> {
  const provider = getPublicProvider();
  const address = ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS;
  await ensureDeployed(provider, address);
  const c = new ethers.Contract(address, ZUTCHI_ERC721_ABI, provider);
  return (await c.getZutchiAttributes(tokenId)) as ZutchiData;
}

/** WRITES **/
export async function mintZutchi() {
  const signer = await ensureChainAndSigner();
  const c = new ethers.Contract(
    ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS,
    ZUTCHI_ERC721_ABI,
    signer
  );
  const tx = await c.mint();
  const receipt = await tx.wait();

  let tokenId: bigint | null = null;
  for (const log of receipt.logs) {
    try {
      const iface = new ethers.Interface(ZUTCHI_ERC721_ABI);
      const parsed = iface.parseLog(log);
      if (parsed?.name === "TokenMinted") {
        tokenId = parsed.args?.tokenId as bigint;
        break;
      }
    } catch {}
  }
  return { txHash: tx.hash, receipt, tokenId };
}

export async function approveZircuit(amount: bigint) {
  if (!ENV.NEXT_PUBLIC_ZIRCUIT_TOKEN_ADDRESS) {
    throw new Error("Zircuit ERC-20 token address is not configured.");
  }
  const signer = await ensureChainAndSigner();
  const erc20 = new ethers.Contract(
    ENV.NEXT_PUBLIC_ZIRCUIT_TOKEN_ADDRESS,
    ERC20_ABI,
    signer
  );
  const tx = await erc20.approve(
    ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS,
    amount
  );
  const receipt = await tx.wait();
  return { txHash: tx.hash, receipt };
}

export async function feedZutchi(tokenId: bigint, amount: bigint) {
  const signer = await ensureChainAndSigner();
  const c = new ethers.Contract(
    ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS,
    ZUTCHI_ERC721_ABI,
    signer
  );
  const tx = await c.feed(tokenId, amount);
  return await tx.wait();
}

export async function putToSleep(tokenId: bigint, durationBlocks: bigint) {
  const signer = await ensureChainAndSigner();
  const c = new ethers.Contract(
    ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS,
    ZUTCHI_ERC721_ABI,
    signer
  );
  const tx = await c.putToSleep(tokenId, durationBlocks);
  return await tx.wait();
}

export async function putToWork(tokenId: bigint, durationBlocks: bigint) {
  const signer = await ensureChainAndSigner();
  const c = new ethers.Contract(
    ENV.NEXT_PUBLIC_ZUTCHI_CONTRACT_ADDRESS,
    ZUTCHI_ERC721_ABI,
    signer
  );
  const tx = await c.putToWork(tokenId, durationBlocks);
  return await tx.wait();
}

// No default export – keep named exports only
