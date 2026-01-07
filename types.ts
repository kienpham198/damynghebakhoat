
export interface Product {
  id: string;
  title: string;
  desc: string;
  img: string;
  price: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AboutFeature {
  title: string;
  desc: string;
}

export interface SiteContent {
  brandName: string;
  hotline: string;
  email: string;
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutContent: string;
  aboutFeatures: AboutFeature[];
  stats: {
    experience: string;
    projects: string;
    artisans: string;
    provinces: string;
  };
  heroImage: string;
  aboutImage: string;
  products: Product[];
  galleryImages: string[];
}
