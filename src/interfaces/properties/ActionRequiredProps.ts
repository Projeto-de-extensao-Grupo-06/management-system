import type { ProjectStatusType } from "../enum/ProjectStatus";

export type ProjectStatus = ProjectStatusType;


export interface ActionRequiredProps {
    projectStatus: ProjectStatus;
    clientId: number;
}