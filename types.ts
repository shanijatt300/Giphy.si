export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  isAdmin: boolean;
  email?: string;
  bio?: string;
}

export interface Gif {
  id: string;
  title: string;
  url: string; // The display URL (optimized)
  fullUrl: string; // The original download URL
  width: number;
  height: number;
  username: string;
  userAvatar: string;
  tags: string[];
  views: number;
  likes: number;
  isVerified?: boolean;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  coverUrl: string;
  slug: string;
}

export type ViewState = 'HOME' | 'SEARCH' | 'CATEGORY' | 'DETAIL' | 'UPLOAD' | 'ADMIN' | 'LOGIN' | 'DASHBOARD' | 'ABOUT' | 'CONTACT' | 'PRIVACY' | 'TERMS';

export interface GeneratedMetadata {
  title: string;
  tags: string[];
  description: string;
}

export interface IntegrationConfig {
  googleAdsense: string;
  googleSearchConsole: string;
  googleAnalytics: string;
}
