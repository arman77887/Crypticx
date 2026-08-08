export type LanguageCode = 'en' | 'bn' | 'ar' | 'hi' | 'zh';

export interface ServiceItem {
  id: string;
  titleKey: string;
  descKey: string;
  category: string;
  priceBDT: number;
  iconName: string;
  popular?: boolean;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  category: 'Websites' | 'Templates' | 'Digital Products' | 'Services';
  priceBDT: number;
  rating: number;
  salesCount: number;
  imageUrl: string;
  tags: string[];
}

export interface CybersecurityService {
  id: string;
  titleKey: string;
  descKey: string;
  featuresKey: string[];
  iconName: string;
  isCompliant: boolean;
}

export interface HostingPlan {
  id: string;
  name: string;
  priceBDTMonthly: number;
  storage: string;
  bandwidth: string;
  domainsAllowed: string;
  isPopular?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
}

export interface AboutProfile {
  name: string;
  role: string;
  bioKey: string;
  experienceYears: number;
  skills: string[];
  imageUrl: string;
}
