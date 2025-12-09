import api from "./api";

import type AcquisitionChannel from "../interfaces/types/AcquisitionChannel";
import type CostProfit from "../interfaces/types/CostProfit";
import type ProjectStatus from "../interfaces/types/ProjectStatus";
import type SalesFunnel from "../interfaces/types/SalesFunnel";
import type Kpis from "../interfaces/types/Kpis";

export default class AnalysisService {
  async getKpis(): Promise<Kpis> {
    const response = await api.get<Kpis>("/analysis_kpis");
    return response.data;
  }

  async getAcquisitionChannels(): Promise<AcquisitionChannel[]> {
    const response = await api.get<AcquisitionChannel[]>(
      "/analysis_acquisition_channels"
    );
    return response.data;
  }

  async getProfitCostComparison(): Promise<CostProfit[]> {
    const response = await api.get<CostProfit[]>(
      "/analysis_profit_cost_comparison"
    );
    return response.data;
  }

  async getProjectsStatus(): Promise<ProjectStatus[]> {
    const response = await api.get<ProjectStatus[]>(
      "/analysis_projects_status"
    );
    return response.data;
  }

  async getSalesFunnel(): Promise<SalesFunnel[]> {
    const response = await api.get<SalesFunnel[]>("/analysis_sales_funnel");
    return response.data;
  }
}
