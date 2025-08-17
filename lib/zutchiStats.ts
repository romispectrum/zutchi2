import { ZutchiData } from './zutchi.service';

export interface GameStats {
  // Core stats (0-100)
  happiness: number;
  hunger: number;
  energy: number;
  work: number;
  social: number;
  
  // Raw contract data
  level: number;
  xp: number;
  nutrition: number;
  health: number;
  
  // Status flags
  isBusy: boolean;
  isWorking: boolean;
  isSleeping: boolean;
  isHungry: boolean;
  isTired: boolean;
  
  // Time-based data
  freeAtBlock: bigint;
  hungryAtBlock: bigint;
  lastAteAt: bigint;
  bornAtBlock: bigint;
  
  // Social data
  frens: bigint[];
  potentialFrens: bigint[];
  
  // Calculated values
  xpToNextLevel: number;
  levelProgress: number;
  timeUntilFree: number;
  timeUntilHungry: number;
  timeSinceLastAte: number;
  age: number;
}

export interface PetMood {
  mood: 'happy' | 'sad' | 'tired' | 'hungry' | 'working' | 'sleeping';
  message: string;
  emoji: string;
}

export class ZutchiStatsTransformer {
  private static readonly BLOCK_TIME = 12; // seconds per block (approximate)
  private static readonly MAX_ENERGY = 100e18; // 100 in wei
  private static readonly MAX_NUTRITION = 100e18; // 100 in wei
  private static readonly MAX_HEALTH = 100e18; // 100 in wei

  /**
   * Transform raw contract data into game stats
   */
  static transformToGameStats(data: ZutchiData, currentBlock?: bigint): GameStats {
    const now = currentBlock || BigInt(Math.floor(Date.now() / 1000));
    
    // Convert bigint values to numbers (assuming they're in wei format)
    const energy = Number(data.energy) / 1e18;
    const nutrition = Number(data.nutrition) / 1e18;
    const health = Number(data.health) / 1e18;
    const level = Number(data.level);
    const xp = Number(data.xp);
    
    // Calculate time-based values
    const timeUntilFree = data.freeAtBlock > now ? Number(data.freeAtBlock - now) * this.BLOCK_TIME : 0;
    const timeUntilHungry = data.hungryAtBlock > now ? Number(data.hungryAtBlock - now) * this.BLOCK_TIME : 0;
    const timeSinceLastAte = data.lastAteAt > 0 ? Number(now - data.lastAteAt) * this.BLOCK_TIME : 0;
    const age = data.bornAtBlock > 0 ? Number(now - data.bornAtBlock) * this.BLOCK_TIME : 0;
    
    // Calculate XP progress
    const xpForNextLevel = Math.pow(2, level);
    const xpToNextLevel = xpForNextLevel - xp;
    const levelProgress = (xp / xpForNextLevel) * 100;
    
    // Determine status flags
    const isWorking = data.isBusy && data.freeAtBlock > now && timeUntilFree > 0;
    const isSleeping = data.isBusy && !isWorking;
    const isHungry = data.hungryAtBlock <= now;
    const isTired = energy < 30;
    
    // Calculate derived stats (0-100 scale)
    const hunger = Math.max(0, Math.min(100, 100 - (isHungry ? 60 : 0)));
    const work = Math.max(0, Math.min(100, 100 - (isWorking ? 50 : 0)));
    const social = Math.min(100, (data.frens.length * 10) + (data.potentialFrens.length * 5));
    
    // Calculate happiness based on multiple factors
    const happiness = Math.max(0, Math.min(100, 
      100 - 
      (isHungry ? 40 : 0) - 
      (isTired ? 30 : 0) - 
      (isWorking ? 20 : 0) - 
      (isSleeping ? 10 : 0) +
      (nutrition > 50 ? 20 : 0) +
      (health > 50 ? 20 : 0) +
      (data.frens.length > 0 ? 15 : 0)
    ));

    return {
      // Core stats (0-100)
      happiness,
      hunger,
      energy: Math.max(0, Math.min(100, energy)),
      work,
      social,
      
      // Raw contract data
      level,
      xp,
      nutrition: Math.max(0, Math.min(100, nutrition)),
      health: Math.max(0, Math.min(100, health)),
      
      // Status flags
      isBusy: data.isBusy,
      isWorking,
      isSleeping,
      isHungry,
      isTired,
      
      // Time-based data
      freeAtBlock: data.freeAtBlock,
      hungryAtBlock: data.hungryAtBlock,
      lastAteAt: data.lastAteAt,
      bornAtBlock: data.bornAtBlock,
      
      // Social data
      frens: data.frens,
      potentialFrens: data.potentialFrens,
      
      // Calculated values
      xpToNextLevel,
      levelProgress,
      timeUntilFree,
      timeUntilHungry,
      timeSinceLastAte,
      age
    };
  }

  /**
   * Get pet mood based on game stats
   */
  static getPetMood(stats: GameStats): PetMood {
    if (stats.isWorking) {
      return {
        mood: 'working',
        message: 'I\'m working hard! 💪',
        emoji: '💼'
      };
    }
    
    if (stats.isSleeping) {
      return {
        mood: 'sleeping',
        message: 'Zzz... Sweet dreams 😴',
        emoji: '😴'
      };
    }
    
    if (stats.isHungry) {
      return {
        mood: 'hungry',
        message: 'I\'m getting hungry! 🥺',
        emoji: '🥺'
      };
    }
    
    if (stats.isTired) {
      return {
        mood: 'tired',
        message: 'Zzz... I need some rest 😴',
        emoji: '😴'
      };
    }
    
    if (stats.happiness < 40) {
      return {
        mood: 'sad',
        message: 'I need some love and care 💔',
        emoji: '💔'
      };
    }
    
    return {
      mood: 'happy',
      message: 'I\'m feeling great today! 😸',
      emoji: '😸'
    };
  }

  /**
   * Format time duration in human-readable format
   */
  static formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.floor(seconds)}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    return `${days}d ${remainingHours}h`;
  }

  /**
   * Get stat color based on value
   */
  static getStatColor(value: number): string {
    if (value >= 70) return 'from-green-400 to-green-500';
    if (value >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  }

  /**
   * Get activity-specific stats to display
   */
  static getActivityStats(stats: GameStats, activity: string): string[] {
    const activityStatsMapping: Record<string, string[]> = {
      'home': ['happiness', 'hunger', 'energy', 'work', 'social'],
      'sleep': ['energy'],
      'eat': ['hunger', 'nutrition'],
      'work': ['work', 'energy'],
      'social': ['happiness', 'social']
    };
    
    return activityStatsMapping[activity] || ['happiness', 'hunger', 'energy'];
  }
}
