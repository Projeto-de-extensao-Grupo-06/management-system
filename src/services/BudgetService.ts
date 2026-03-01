import { type Budget } from "../interfaces/types/Budget";
import { type ValueType } from "../interfaces/types/Budget";
import api from "./provider/api";

export interface FixedParameterDefinition {
  name: string;
  type: ValueType;
}

export default class BudgetService {

  async getProjectBudget(projectId: number): Promise<Budget | null> {
    try {
      const res = await api.get<Budget>(`/projects/${projectId}/budget`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async getFixedDefinitions(): Promise<FixedParameterDefinition[]> {
    const { data } = await api.get("/budgets/parameters/fixed");
    return data;
  }

  async patchBudget(projectId: number, body: any) {
    await api.patch(`/projects/${projectId}/budget`, body);
  }

  async patchMaterials(projectId: number, materials: any[]) {
    await api.patch(`/projects/${projectId}/budget/material`, {
      materials,
    });
  }

  async patchFixed(projectId: number, fixedParamaters: any[]) {
    await api.patch(`/projects/${projectId}/budget/parameters/fixed`, {
      fixedParamaters,
    });
  }

  async patchPersonalized(projectId: number, personalizedParameters: any[]): Promise<Budget> {
    const budget = await api.patch<Budget>(`/projects/${projectId}/budget/parameters/personalized`, {
      personalizedParameters,
    });

    return budget.data;
  }

  async deleteFixed(projectId: number, fixedParameterName: string): Promise<void> {
    await api.delete(`/budgets/${projectId}/parameters/fixed/${fixedParameterName}`);
  }

  async deletePersonalizedParameter(projectId: number, personalizedParameterId: number) {
    await api.delete(`/budgets/${projectId}/parameters/personalized/${personalizedParameterId}`);
  }
}