import type { ProjectStatus } from "../properties/ActionRequiredProps";

export interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  previewStatus: ProjectStatus;
  isActive: boolean;
  clientId: number;
  coworkerId: number;
  addressId: number;
  createdAt: string; 
  systemType: string;
  projectFrom: string;
}