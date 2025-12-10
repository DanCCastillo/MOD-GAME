export enum Platform {
  PC = 'PC',
  PLAYSTATION = 'PlayStation',
  XBOX = 'Xbox',
  NINTENDO = 'Nintendo'
}

export enum Category {
  PERFORMANCE = 'Rendimiento',
  GRAPHICS = 'Gráficos',
  QOL = 'Calidad de Vida',
  CONTENT = 'Contenido & DLC',
  CHARACTERS = 'Personajes',
  AUDIO = 'Audio',
  UI = 'Interfaz'
}

export interface Dependency {
  name: string;
  version: string;
  mandatory: boolean;
}

export interface Mod {
  id: string;
  title: string;
  gameTitle: string;
  author: string;
  version: string;
  supportedGameVersion: string; // Used for compatibility check
  imageUrl: string;
  category: Category;
  platforms: Platform[];
  downloads: number;
  endorsementRate: number; // 0.0 to 5.0
  verified: boolean;
  description: string;
  size: string;
  uploadDate: string;
  hash: string; // SHA-256
  dependencies: Dependency[];
}

export type ViewState = 'HOME' | 'SEARCH' | 'DETAIL' | 'LIBRARY' | 'PROFILE';