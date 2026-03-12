import type { Material, MaterialUrl } from "../interfaces/types/Material";
import api from "./provider/api";

export default class MaterialService {
  async getMaterialById(id: number): Promise<Material> {
    const res = await api.get<Material>(`/materials/${id}`);
    return res.data;
  }

  async listMaterials(): Promise<Material[]> {
    const res = await api.get<Material[]>(`/materials`);

    if(res.status === 204) {
        return [];
    }

    return res.data;
  }

  async createMaterial(data: Omit<Material, "id" | "hidden">): Promise<Material> {
    const res = await api.post<Material>(`/materials`, data);
    return res.data;
  }

  async updateMaterial(id: number, data: Omit<Material, "id" | "hidden">): Promise<Material> {
    const res = await api.put<Material>(`/materials/${id}`, data);
    return res.data;
  }

  async deleteMaterial(id: number): Promise<void> {
    await api.delete(`/materials/${id}`);
  }

  async listMaterialUrls(materialId: number): Promise<MaterialUrl[]> {
    const res = await api.get<MaterialUrl[]>(`/materialUrls/material/${materialId}`);
    if(res.status === 204) {
        return [];
    }

    return res.data;
  }

  async createMaterialUrl(data: { url: string; price: number; materialId: number }): Promise<MaterialUrl> {
    const res = await api.post<MaterialUrl>(`/materialUrls`, data);
    return res.data;
  }

  async updateMaterialUrl(id: number, data: { url: string; price: number; materialId: number }): Promise<MaterialUrl> {
    const res = await api.put<MaterialUrl>(`/materialUrls/${id}`, data);
    return res.data;
  }

  async deleteMaterialUrl(id: number): Promise<void> {
    await api.delete(`/materialUrls/${id}`);
  }
}