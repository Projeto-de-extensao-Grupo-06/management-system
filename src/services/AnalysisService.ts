import type AcquisitionChannel from "../interfaces/types/AcquisitionChannel";
import type FinancialRecord from "../interfaces/types/FinancialRecord";
import type Kpis from "../interfaces/types/Kpis";
import type ProjectStatus from "../interfaces/types/ProjectStatus";
import type SalesFunnel from "../interfaces/types/SalesFunnel";
import api from "./provider/api";

export default class AnalysisService {
  async getKpis(startDate?: string, endDate?: string): Promise<Kpis> {
    const params = { startDate, endDate };
    const response = await api.get<Kpis>("/analysis/kpis", { params });
    return response.data;
  }

  async getAcquisitionChannels(startDate?: string, endDate?: string): Promise<AcquisitionChannel[]> {
    const params = { startDate, endDate };
    const response = await api.get<AcquisitionChannel[]>(
      "/analysis/acquisition-channels", { params }
    );
    return response.data;
  }

  async getFinancials(startDate?: string, endDate?: string): Promise<FinancialRecord[]> {
    const params = { startDate, endDate };
    const response = await api.get<FinancialRecord[]>(
      "/analysis/financials", { params }
    );
    return response.data;
  }

  async getProjectsStatus(startDate?: string, endDate?: string): Promise<ProjectStatus[]> {
    const params = { startDate, endDate };
    const response = await api.get<ProjectStatus[]>(
      "/analysis/project-status", { params }
    );
    return response.data;
  }

  async getSalesFunnel(startDate?: string, endDate?: string): Promise<SalesFunnel[]> {
    const params = { startDate, endDate };
    const response = await api.get<SalesFunnel[]>("/analysis/sales-funnel", { params });
    return response.data;
  }
}
