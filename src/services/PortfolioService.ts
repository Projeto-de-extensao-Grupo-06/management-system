import type { PortfolioItem, PortfolioItemInput } from '../interfaces/types/Portfolio';
import api from './provider/api';

function sortPortfolioItems(items: PortfolioItem[]) {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return right.id - left.id;
  });
}

export default class PortfolioService {
  async listAll(): Promise<PortfolioItem[]> {
    const response = await api.get<PortfolioItem[]>('/portfolio');
    return sortPortfolioItems(Array.isArray(response.data) ? response.data : []);
  }

  async listPublic(): Promise<PortfolioItem[]> {
    const response = await api.get<PortfolioItem[]>('/portfolio');
    const items = Array.isArray(response.data) ? response.data : [];

    return sortPortfolioItems(items.filter((item) => item.status === 'PUBLISHED'));
  }

  async getById(id: number): Promise<PortfolioItem | null> {
    try {
      const response = await api.get<PortfolioItem>(`/portfolio/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async create(data: PortfolioItemInput): Promise<PortfolioItem> {
    const response = await api.post<PortfolioItem>('/portfolio', data);
    return response.data;
  }

  async update(id: number, data: PortfolioItemInput): Promise<PortfolioItem> {
    const response = await api.put<PortfolioItem>(`/portfolio/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/portfolio/${id}`);
  }

  async reorder(portfolioIds: number[]): Promise<void> {
    await Promise.all(
      portfolioIds.map((id, sortOrder) => api.patch(`/portfolio/${id}`, { sortOrder })),
    );
  }
}