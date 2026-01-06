import viaCepApi from "./provider/viaCepApi";

export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

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
