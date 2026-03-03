import type { Material, MaterialUrl } from "../interfaces/types/Material";
import api from "./provider/api";

export default class MaterialService {
  async listMaterials(): Promise<Material[]> {
    const res = await api.get<Material[]>(`/materials`);

    if(res.status === 204) {
        return [];
    }

    return res.data;
  }

  async listMaterialUrls(materialId: number): Promise<MaterialUrl[]> {
    const res = await api.get<MaterialUrl[]>(`/materialsUrls/material/${materialId}`);
    if(res.status === 204) {
        return [];
    }

    return res.data;
  }
}