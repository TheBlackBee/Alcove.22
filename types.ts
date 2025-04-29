export interface ResponseTemplate {
  id: number;
  title: string;
  content: Record<string, string>; // language code -> content
  category: string;
  categoryColor: string;
  languages: string[];
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar?: string;
}

export interface Activity {
  id: number;
  type: 'send' | 'create' | 'edit';
  templateId?: number;
  templateTitle: string;
  recipient?: string;
  timestamp: string;
  language: string;
}

export interface Stats {
  totalResponses: number;
  responseTrend: number;
  avgResponseTime: string;
  responseTimeTrend: number;
  satisfaction: number;
  satisfactionTrend: number;
  languagesUsed: number;
  languagesList: string[];
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface LanguageStat {
  language: string;
  code: string;
  percentage: number;
  color: string;
}

export type Language = 'en' | 'es' | 'fr';
