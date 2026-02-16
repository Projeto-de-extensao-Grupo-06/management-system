import type { ProjectStatusType } from '../enum/ProjectStatus';

export interface ProjectNotification {
    projectId: number;
    clientName: string;
    projectFrom: 'WHATSAPP_BOT' | 'SITE_BUDGET_FORM';
    createdAt: string;
    status: ProjectStatusType;
    clientPhone: string;
}
