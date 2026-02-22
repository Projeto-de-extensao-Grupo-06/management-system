import { ProjectStatus } from "../../interfaces/enum/ProjectStatus";

export const ProjectStatusLabel: Record<string, string> = {
    [ProjectStatus.NEW]: "Novo",
    [ProjectStatus.PRE_BUDGET]: "Pré-Orçamento",
    [ProjectStatus.CLIENT_AWAITING_CONTACT]: "Aguardando Contato",
    [ProjectStatus.AWAITING_RETRY]: "Aguardando Retentativa",
    [ProjectStatus.RETRYING]: "Retentando",
    [ProjectStatus.SCHEDULED_TECHNICAL_VISIT]: "Visita Técnica Agendada",
    [ProjectStatus.TECHNICAL_VISIT_COMPLETED]: "Visita Técnica Realizada",
    [ProjectStatus.FINAL_BUDGET]: "Orçamento Final",
    [ProjectStatus.AWAITING_MATERIALS]: "Aguardando Materiais",
    [ProjectStatus.SCHEDULED_INSTALLING_VISIT]: "Instalação Agendada",
    [ProjectStatus.INSTALLED]: "Instalado",
    [ProjectStatus.COMPLETED]: "Finalizado",
    [ProjectStatus.NEGOTIATION_FAILED]: "Negociação Falhou",
    [ProjectStatus.CONTACT_NOT_REQUESTED]: "Contato Não Solicitado",
};

export const AcquisitionChannelLabel: Record<string, string> = {
    SITE_BUDGET_FORM: "Site",
    WHATSAPP_BOT: "WhatsApp",
    INTERNAL_MANUAL_ENTRY: "Boca a Boca"
};

export function getProjectStatusLabel(status: string): string {
    return ProjectStatusLabel[status] || status;
}

export function getChannelLabel(channel: string): string {
    if (!channel) return "N/A";

    if (AcquisitionChannelLabel[channel]) {
        return AcquisitionChannelLabel[channel];
    }

    return channel
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
}
