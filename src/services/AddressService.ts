import type { ViaCepResponse } from "../interfaces/types/AddressTypes";
import viaCepApi from "./provider/viaCepApi";

export default class AddressService {
    async getAddressByCep(cep: string): Promise<ViaCepResponse | null> {
        try {
            const cleanCep = cep.replace(/\D/g, "");
            if (cleanCep.length !== 8) return null;

            const response = await viaCepApi.get<ViaCepResponse>(`${cleanCep}/json/`);

            if (response.data.erro) {
                return null;
            }

            return response.data;
        } catch (error) {
            console.error("Error fetching address by CEP:", error);
            return null;
        }
    }
}
