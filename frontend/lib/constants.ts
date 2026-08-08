import { AboutProfile, HostingPlan, MarketplaceProduct, ServiceItem, SocialLink } from "@/types";

export const APP_NAME = "CRYPTICX";

export const EXTERNAL_TOOLS = {
  ENCRYPT_TOOL: "https://website107.github.io/ENCRYPT_TOOL/",
  ENCODE_DECODE_TOOL: "https://website107.github.io/encodedecodewebsit/",
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    titleKey: "services.webdev.title",
    descKey: "services.webdev.desc",
    category: "Development",
    priceBDT: 15000,
    iconName: "Code",
    popular: true,
  },
  {
    id: "serv-2",
    titleKey: "services.etin.title",
    descKey: "services.etin.desc",
    category: "Documentation",
    priceBDT: 1500,
    iconName: "FileCheck",
  },
  {
    id: "serv-3",
    titleKey: "services.cert.title",
    descKey: "services.cert.desc",
    category: "Documentation",
    priceBDT: 2500,
    iconName: "Award",
  },
  {
    id: "serv-4",
    titleKey: "services.marketing.title",
    descKey: "services.marketing.desc",
    category: "Marketing",
    priceBDT: 8000,
    iconName: "TrendingUp",
  },
  {
    id: "serv-5",
    titleKey: "services.support.title",
    descKey: "services.support.desc",
    category: "Support",
    priceBDT: 3000,
    iconName: "Headphones",
    popular: true,
  },
  {
    id: "serv-6",
    titleKey: "services.other.title",
    descKey: "services.other.desc",
    category: "General",
    priceBDT: 2000,
    iconName: "Layers",
  },
];

export const DEFAULT_MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "prod-1",
    title: "CrypticX Enterprise SaaS Dashboard Template",
    category: "Templates",
    priceBDT: 3500,
    rating: 4.9,
    salesCount: 142,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "Tailwind", "Dashboard"],
  },
  {
    id: "prod-2",
    title: "Full E-Commerce Portal with bKash/Nagad Integration",
    category: "Websites",
    priceBDT: 25000,
    rating: 5.0,
    salesCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "FastAPI", "E-Commerce"],
  },
  {
    id: "prod-3",
    title: "Cyber Security Audit Automation Script Suite",
    category: "Digital Products",
    priceBDT: 5000,
    rating: 4.8,
    salesCount: 63,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "Security", "DevOps"],
  },
  {
    id: "prod-4",
    title: "Managed Cloud Infrastructure Setup & Hardening",
    category: "Services",
    priceBDT: 12000,
    rating: 4.9,
    salesCount: 95,
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    tags: ["VPS", "Nginx", "Docker"],
  },
];

export const DEFAULT_HOSTING_PLANS: HostingPlan[] = [
  {
    id: "plan-starter",
    name: "Starter Web Hosting",
    priceBDTMonthly: 250,
    storage: "10 GB NVMe SSD",
    bandwidth: "Unmetered",
    domainsAllowed: "1 Website",
  },
  {
    id: "plan-business",
    name: "Business Cloud",
    priceBDTMonthly: 650,
    storage: "50 GB NVMe SSD",
    bandwidth: "Unmetered",
    domainsAllowed: "5 Websites",
    isPopular: true,
  },
  {
    id: "plan-premium",
    name: "Premium Pro",
    priceBDTMonthly: 1200,
    storage: "150 GB NVMe SSD",
    bandwidth: "Unmetered",
    domainsAllowed: "Unlimited Websites",
  },
  {
    id: "plan-vps",
    name: "Managed KVM VPS",
    priceBDTMonthly: 3500,
    storage: "4 vCPU / 8GB RAM / 100GB SSD",
    bandwidth: "5 TB Bandwidth",
    domainsAllowed: "Full Root Access",
  },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { platform: "Facebook", url: "https://facebook.com", iconName: "Facebook" },
  { platform: "X", url: "https://x.com", iconName: "Twitter" },
  { platform: "Telegram", url: "https://t.me", iconName: "Send" },
  { platform: "GitHub", url: "https://github.com", iconName: "Github" },
  { platform: "LinkedIn", url: "https://linkedin.com", iconName: "Linkedin" },
  { platform: "WhatsApp", url: "https://whatsapp.com", iconName: "MessageSquare" },
];

export const DEFAULT_FOUNDER_PROFILE: AboutProfile = {
  name: "CRYPTICX Architecture Team",
  role: "Lead Platform Architect & Security Researchers",
  bioKey: "about.bio",
  experienceYears: 10,
  skills: ["Cybersecurity", "Cloud Architecture", "Full-Stack Dev", "Cryptographic Tools", "FinTech Integration"],
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
};
