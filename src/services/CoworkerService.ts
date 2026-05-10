import type { Coworker } from "../interfaces/types/Coworker";
import type { Page } from "../interfaces/types/Page";
import api from "./provider/api";

type CoworkersResponse = Page<Coworker> | Coworker[];
export interface CreateCoworkerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  permissionGroupId: number;
}

export interface UpdateCoworkerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  permissionGroupId: number;
}

export default class CoworkerService {
  async getAllCoworkers(
    page: number = 0,
    size: number = 20,
    search: string = "",
    status: string = "ACTIVE",
  ): Promise<CoworkersResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (search) params.append("search", search);
    if (status && status !== "Todos")
      params.append(
        "status",
        status === "Ativo"
          ? "ACTIVE"
          : status === "Inativo"
            ? "INACTIVE"
            : status,
      );

    const response = await api.get<CoworkersResponse>("/coworkers", { params });
    return response.data;
  }

  async deleteCoworker(id: number): Promise<void> {
    await api.delete(`/coworkers/${id}`);
  }

  async getCoworkerById(id: number): Promise<Coworker> {
    const res = await api.get<Coworker>(`/coworkers/${id}`);
    return res.data;
  }

  async updateCoworker(id: number, coworker: UpdateCoworkerPayload): Promise<Coworker> {
    const res = await api.put<Coworker>(`/coworkers/${id}`, coworker);
    return res.data;
  }

  async createCoworker(coworker: CreateCoworkerPayload): Promise<Coworker> {
    const res = await api.post<Coworker>("/coworkers", coworker);
    return res.data;
  }
}
