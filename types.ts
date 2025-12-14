export interface SymbolResult {
  char: string;
  name: string;
  resemblance: string;
  htmlEntity: string;
  confidence?: number; // Simulated confidence score 0-100
}

export interface AnalysisResponse {
  symbols: SymbolResult[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string; // The base64 data preview
  results: SymbolResult[];
}

export type ThemeColor = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose';

export interface AppSettings {
  apiKey: string;
  themeColor: ThemeColor;
  fontSize: number;
  viewMode: 'grid' | 'list';
  fontFamily: 'sans' | 'serif' | 'mono';
  soundEnabled: boolean;
}
