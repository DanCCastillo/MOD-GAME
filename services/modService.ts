import { Mod, Platform } from '../types';
import { MOCK_MODS } from '../constants';

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CompatibilityResult {
  isCompatible: boolean;
  message: string;
}

export const modService = {
  // Simulate fetching mods from an API with pagination (though we return all for now)
  getMods: async (): Promise<Mod[]> => {
    await delay(600); // Network latency
    return MOCK_MODS;
  },

  getModById: async (id: string): Promise<Mod | undefined> => {
    await delay(300);
    return MOCK_MODS.find(m => m.id === id);
  },

  // Logic to cross-check game version vs mod version
  checkCompatibility: (mod: Mod, userGameVersion: string): CompatibilityResult => {
    // Simplified SemVer check for demo purposes
    if (mod.supportedGameVersion === userGameVersion) {
      return { isCompatible: true, message: 'Compatibilidad Perfecta' };
    }
    
    // In a real app, we'd parse semver properly. 
    // Here we just check if the major version matches roughly or if mod supports "latest"
    if (mod.supportedGameVersion === 'latest' || userGameVersion.startsWith(mod.supportedGameVersion.split('.')[0])) {
       return { isCompatible: true, message: 'Probablemente Compatible' };
    }

    return { 
      isCompatible: false, 
      message: `Versión incompatible: Mod requiere v${mod.supportedGameVersion}, tienes v${userGameVersion}` 
    };
  },

  // Simulate the secure download pipeline: Scan -> Checksum -> Download
  downloadSecure: async (modId: string, onProgress: (stage: string, percent: number) => void): Promise<boolean> => {
    try {
      // Stage 1: Cloud Malware Scan
      onProgress('Escaneando Malware...', 10);
      await delay(1500);
      onProgress('Escaneando Malware...', 40);
      await delay(1000);

      // Stage 2: Integrity Verification
      onProgress('Verificando Checksum SHA-256...', 60);
      await delay(800);
      
      // Stage 3: Transfer
      onProgress('Descargando...', 80);
      await delay(1200);
      onProgress('Finalizando...', 100);
      
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};