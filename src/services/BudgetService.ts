import { type Budget } from "../interfaces/types/Budget";
import api from "./provider/api";

export default class BudgetService {
  async getProjectBudget(projectId: number): Promise<Budget | null> {
    try {
      const res = await api.get<Budget>(`/projects/${projectId}/budget`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
