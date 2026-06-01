export type PortfolioStatus = 'PUBLISHED' | 'DRAFT';

export type PortfolioOrigin = 'MANUAL' | 'CRM';

export type PortfolioEconomyType = 'AMOUNT' | 'PERCENT';

export interface PortfolioImage {
  id: string;
  name: string;
  src: string;
  order: number;
  sourceFileId?: number;
  sourceFileName?: string;
}

export interface PortfolioSource {
  type: PortfolioOrigin;
  projectId?: number;
  projectName?: string;
  clientName?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  location: string;
  systemType: string;
  economyValue: number;
  economyType: PortfolioEconomyType;
  testimonial?: string;
  status: PortfolioStatus;
  sortOrder: number;
  source: PortfolioSource;
  images: PortfolioImage[];
  createdAt: string;
  updatedAt: string;
}

export type PortfolioItemInput = Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>;