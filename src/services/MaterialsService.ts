import axios from "axios";
import type { Material, MaterialUrl } from "../interfaces/types/Material";
import api from "./provider/api";

function handleServiceError(err: unknown, defaultMessage: string): never {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 409) {
      throw new Error("Conflito de dados: este material ou dado já existe.");
    }
    if (status === 400) {
      throw new Error("Dados inválidos fornecidos ao sistema.");
    }
    const apiMsg = err.response?.data?.message || err.response?.data?.error;
    if (apiMsg) {
      throw new Error(apiMsg);
    }
    throw new Error(defaultMessage);
  }
  throw err instanceof Error ? err : new Error(defaultMessage);
}

export default class MaterialService {
  async getMaterialById(id: number): Promise<Material> {
    const res = await api.get<Material>(`/materials/${id}`);
    return res.data;
  }

  async listMaterials(): Promise<Material[]> {
    const res = await api.get<Material[]>(`/materials`);

    if (res.status === 204) {
      return [];
    }

    return res.data;
  }

  async createMaterial(data: Omit<Material, "id" | "hidden">): Promise<Material> {
    try {
      const res = await api.post<Material>(`/materials`, data);
      return res.data;
    } catch (err) {
      handleServiceError(err, "Erro ao criar material.");
    }
  }

  async updateMaterial(id: number, data: Omit<Material, "id" | "hidden">): Promise<Material> {
    try {
      const res = await api.put<Material>(`/materials/${id}`, data);
      return res.data;
    } catch (err) {
      handleServiceError(err, "Erro ao editar material.");
    }
  }

  async deleteMaterial(id: number): Promise<void> {
    try {
      await api.delete(`/materials/${id}`);
    } catch (err) {
      handleServiceError(err, "Erro ao excluir material. Pode possuir vínculos ativos.");
    }
  }

  async listMaterialUrls(materialId: number): Promise<MaterialUrl[]> {
    const res = await api.get<MaterialUrl[]>(`/materialUrls/material/${materialId}`);
    if(res.status === 204) {
        return [];
    }

    return res.data;
  }

  async createMaterialUrl(data: { url: string; price: number; materialId: number }): Promise<MaterialUrl> {
    try {
      const res = await api.post<MaterialUrl>(`/materialUrls`, data);
      return res.data;
    } catch (err) {
      handleServiceError(err, "Erro ao criar link.");
    }
  }

  async updateMaterialUrl(id: number, data: { url: string; price: number; materialId: number }): Promise<MaterialUrl> {
    try {
      const res = await api.put<MaterialUrl>(`/materialUrls/${id}`, data);
      return res.data;
    } catch (err) {
      handleServiceError(err, "Erro ao editar link.");
    }
  }

  async deleteMaterialUrl(id: number): Promise<void> {
    try {
      await api.delete(`/materialUrls/${id}`);
    } catch (err) {
      handleServiceError(err, "Erro ao deletar link.");
    }
  }
}