import type AutomaticBudgetConfig from '../interfaces/types/AutomaticBudgetConfig';
import type { AutomaticBudgetConfigSchemaType } from '../schemas/automaticBudgetConfigSchema';
import api from './provider/api';

export default class AutomaticBudgetConfigService {
    async getConfig(): Promise<AutomaticBudgetConfig> {
        const response = await api.get<AutomaticBudgetConfig>('/automatic-budget-config');
        return response.data;
    }

    async saveConfig(data: AutomaticBudgetConfigSchemaType): Promise<AutomaticBudgetConfig> {
        const response = await api.put<AutomaticBudgetConfig>('/automatic-budget-config', data);
        return response.data;
    }
}