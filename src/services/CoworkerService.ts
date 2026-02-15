import type { Coworker } from '../interfaces/types/Coworker';
import api from './provider/api';
  
export class CoworkerService {
  async getCoworkerById(id: number) {
    const coworker = await api.get<Coworker>(`/coworkers/${id}`);

    return coworker.data;
  }
  
  async getAllCoworkers() {
    const coworker = await api.get<Coworker[]>(`/coworkers`);

    return coworker.data;
  }
};