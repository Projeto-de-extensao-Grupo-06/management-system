import type { ProjectStatusType } from "../interfaces/enum/ProjectStatus";

export type TransitionResult =
  | { type: "allowed" }
  | { type: "warning"; message: string }
  | { type: "blocked"; message: string };

// ---------------------------------------------------------------------------
// Mensagens de AVISO — exibidas ANTES de chamar a API.
// Informam o usuário sobre o que precisa estar configurado para a transição
// funcionar. Após confirmar, o sistema tenta mesmo assim.
// ---------------------------------------------------------------------------
const preConditionWarnings: Partial<Record<ProjectStatusType, Partial<Record<ProjectStatusType, string>>>> = {
  NEW: {
    SCHEDULED_TECHNICAL_VISIT:
      "Para marcar o projeto como 'Visita técnica agendada', é necessário que haja uma visita técnica cadastrada nos agendamentos do projeto com data futura. Crie o agendamento primeiro e tente novamente.",
  },

  CLIENT_AWAITING_CONTACT: {
    SCHEDULED_TECHNICAL_VISIT:
      "Para marcar o projeto como 'Visita técnica agendada', é necessário que haja uma visita técnica cadastrada nos agendamentos do projeto com data futura. Crie o agendamento primeiro e tente novamente.",
    AWAITING_RETRY:
      "Para registrar uma nova tentativa de contato, é necessário que haja uma retentativa agendada com data futura neste projeto. Configure o agendamento de retentativa antes de continuar.",
  },

  PRE_BUDGET: {
    SCHEDULED_TECHNICAL_VISIT:
      "Para marcar o projeto como 'Visita técnica agendada', é necessário que haja uma visita técnica cadastrada nos agendamentos do projeto com data futura. Crie o agendamento primeiro e tente novamente.",
    AWAITING_RETRY:
      "Para registrar uma nova tentativa de contato, é necessário que haja uma retentativa agendada com data futura neste projeto. Configure o agendamento de retentativa antes de continuar.",
  },

  RETRYING: {
    SCHEDULED_TECHNICAL_VISIT:
      "Para avançar para visita técnica, certifique-se de que não há retentativas de contato pendentes e que haja uma visita técnica agendada com data futura.",
    AWAITING_RETRY:
      "Para registrar uma nova tentativa de contato, é necessário que haja uma retentativa agendada com data futura neste projeto.",
    AWAITING_MATERIALS:
      "Para avançar para aguardando materiais, certifique-se de que não há retentativas de contato pendentes neste projeto.",
    SCHEDULED_INSTALLING_VISIT:
      "Para avançar para instalação agendada, certifique-se de que não há retentativas de contato pendentes e que haja uma visita de instalação agendada com data futura.",
    NEGOTIATION_FAILED:
      "Para encerrar a negociação, certifique-se de que não há retentativas de contato pendentes neste projeto.",
  },

  SCHEDULED_TECHNICAL_VISIT: {
    RETRYING:
      "Para voltar ao fluxo de contato, certifique-se de que não há agendamentos futuros ativos neste projeto. Cancele ou conclua os agendamentos pendentes antes de continuar.",
    TECHNICAL_VISIT_COMPLETED:
      "Para marcar a visita técnica como concluída, a visita precisa ter sido registrada como finalizada no sistema de agendamentos deste projeto.",
  },

  TECHNICAL_VISIT_COMPLETED: {
    FINAL_BUDGET:
      "Para avançar para orçamento final, é necessário que um orçamento final (não pré-orçamento) esteja cadastrado neste projeto. Acesse a seção de orçamento e registre o valor final.",
  },

  FINAL_BUDGET: {
    AWAITING_RETRY:
      "Para registrar uma nova tentativa de contato, é necessário que haja uma retentativa agendada com data futura neste projeto.",
  },

  AWAITING_MATERIALS: {
    SCHEDULED_INSTALLING_VISIT:
      "Para marcar a instalação como agendada, é necessário que haja uma visita de instalação cadastrada nos agendamentos do projeto com data futura. Crie o agendamento primeiro.",
  },

  SCHEDULED_INSTALLING_VISIT: {
    RETRYING:
      "Para voltar ao fluxo de contato, certifique-se de que não há visitas de instalação futuras ativas. Cancele ou conclua os agendamentos de instalação pendentes.",
    INSTALLED:
      "Para marcar o projeto como instalado, a visita de instalação precisa ter sido registrada como finalizada no sistema de agendamentos.",
  },

  INSTALLED: {
    COMPLETED:
      "Para concluir o projeto, o documento de homologação precisa estar anexado nos arquivos do projeto. Faça o upload do documento e tente novamente.",
  },
};

// ---------------------------------------------------------------------------
// Transições BLOQUEADAS — impossíveis a partir de determinado estado.
// Não há nenhuma pré-condição que desbloqueie: a transição simplesmente
// não existe na regra de negócio.
// ---------------------------------------------------------------------------
const TERMINAL_STATE_MESSAGE =
  "Este projeto está em um status final e não pode mais ter seu status alterado.";

const AWAITING_RETRY_GENERAL_MESSAGE =
  "Enquanto o projeto está em 'Aguardando nova tentativa', o único passo possível é aguardar o sistema iniciar automaticamente a retentativa de contato. Nenhuma alteração manual de status é permitida neste momento.";

const blockedTransitions: Partial<Record<ProjectStatusType, Partial<Record<ProjectStatusType, string>>>> = {
  AWAITING_RETRY: {
    NEW: AWAITING_RETRY_GENERAL_MESSAGE,
    PRE_BUDGET: AWAITING_RETRY_GENERAL_MESSAGE,
    CLIENT_AWAITING_CONTACT: AWAITING_RETRY_GENERAL_MESSAGE,
    RETRYING: AWAITING_RETRY_GENERAL_MESSAGE,
    SCHEDULED_TECHNICAL_VISIT: AWAITING_RETRY_GENERAL_MESSAGE,
    TECHNICAL_VISIT_COMPLETED: AWAITING_RETRY_GENERAL_MESSAGE,
    FINAL_BUDGET: AWAITING_RETRY_GENERAL_MESSAGE,
    AWAITING_MATERIALS: AWAITING_RETRY_GENERAL_MESSAGE,
    SCHEDULED_INSTALLING_VISIT: AWAITING_RETRY_GENERAL_MESSAGE,
    INSTALLED: AWAITING_RETRY_GENERAL_MESSAGE,
    COMPLETED: AWAITING_RETRY_GENERAL_MESSAGE,
    NEGOTIATION_FAILED: AWAITING_RETRY_GENERAL_MESSAGE,
    CONTACT_NOT_REQUESTED: AWAITING_RETRY_GENERAL_MESSAGE,
  },

  NEGOTIATION_FAILED: {
    NEW: TERMINAL_STATE_MESSAGE,
    PRE_BUDGET: TERMINAL_STATE_MESSAGE,
    CLIENT_AWAITING_CONTACT: TERMINAL_STATE_MESSAGE,
    AWAITING_RETRY: TERMINAL_STATE_MESSAGE,
    RETRYING: TERMINAL_STATE_MESSAGE,
    SCHEDULED_TECHNICAL_VISIT: TERMINAL_STATE_MESSAGE,
    TECHNICAL_VISIT_COMPLETED: TERMINAL_STATE_MESSAGE,
    FINAL_BUDGET: TERMINAL_STATE_MESSAGE,
    AWAITING_MATERIALS: TERMINAL_STATE_MESSAGE,
    SCHEDULED_INSTALLING_VISIT: TERMINAL_STATE_MESSAGE,
    INSTALLED: TERMINAL_STATE_MESSAGE,
    COMPLETED: TERMINAL_STATE_MESSAGE,
    CONTACT_NOT_REQUESTED: TERMINAL_STATE_MESSAGE,
  },

  COMPLETED: {
    NEW: TERMINAL_STATE_MESSAGE,
    PRE_BUDGET: TERMINAL_STATE_MESSAGE,
    CLIENT_AWAITING_CONTACT: TERMINAL_STATE_MESSAGE,
    AWAITING_RETRY: TERMINAL_STATE_MESSAGE,
    RETRYING: TERMINAL_STATE_MESSAGE,
    SCHEDULED_TECHNICAL_VISIT: TERMINAL_STATE_MESSAGE,
    TECHNICAL_VISIT_COMPLETED: TERMINAL_STATE_MESSAGE,
    FINAL_BUDGET: TERMINAL_STATE_MESSAGE,
    AWAITING_MATERIALS: TERMINAL_STATE_MESSAGE,
    SCHEDULED_INSTALLING_VISIT: TERMINAL_STATE_MESSAGE,
    INSTALLED: TERMINAL_STATE_MESSAGE,
    NEGOTIATION_FAILED: TERMINAL_STATE_MESSAGE,
    CONTACT_NOT_REQUESTED: TERMINAL_STATE_MESSAGE,
  },
};

// ---------------------------------------------------------------------------
// Traduções de fallback para erros 409 vindos do backend.
// Usadas apenas quando a API rejeita a transição mesmo após o aviso.
// ---------------------------------------------------------------------------
const backendErrorTranslations: Array<{ pattern: string; message: string }> = [
  {
    pattern: "SCHEDULED_TECHNICAL_VISIT",
    message:
      "Não há visita técnica agendada com data futura neste projeto. Crie o agendamento primeiro e tente novamente.",
  },
  {
    pattern: "SCHEDULED_INSTALLING_VISIT",
    message:
      "Não há visita de instalação agendada com data futura neste projeto. Crie o agendamento primeiro e tente novamente.",
  },
  {
    pattern: "TECHNICAL_VISIT_COMPLETED",
    message:
      "A visita técnica ainda não foi marcada como concluída nos agendamentos. Finalize o agendamento e tente novamente.",
  },
  {
    pattern: "AWAITING_RETRY",
    message:
      "Não há retentativa de contato agendada com data futura neste projeto. Configure a retentativa antes de continuar.",
  },
  {
    pattern: "cannot have a scheduled retry",
    message:
      "Existe uma retentativa de contato pendente neste projeto. Cancele-a antes de avançar.",
  },
  {
    pattern: "FINAL_BUDGET",
    message:
      "O orçamento cadastrado não é um orçamento final, ou não há orçamento cadastrado. Registre o orçamento final antes de avançar.",
  },
  {
    pattern: "homologation",
    message:
      "O documento de homologação ainda não foi anexado ao projeto. Faça o upload do documento e tente novamente.",
  },
  {
    pattern: "INSTALL_VISIT",
    message:
      "A visita de instalação ainda não foi finalizada nos agendamentos, ou não há visita de instalação com data passada marcada como concluída.",
  },
  {
    pattern: "active schedule",
    message:
      "Existe um agendamento futuro ativo neste projeto. Cancele ou conclua o agendamento antes de retroceder o status.",
  },
  {
    pattern: "Cancel the install visit",
    message:
      "Existe uma visita de instalação futura ativa. Cancele-a antes de voltar ao fluxo de contato.",
  },
];

// ---------------------------------------------------------------------------
// Funções exportadas
// ---------------------------------------------------------------------------

/**
 * Valida se a transição de status é permitida e retorna o resultado adequado.
 */
export function validateStatusTransition(
  currentStatus: ProjectStatusType,
  targetStatus: ProjectStatusType
): TransitionResult {
  if (currentStatus === targetStatus) {
    return { type: "allowed" };
  }

  const blocked = blockedTransitions[currentStatus]?.[targetStatus];
  if (blocked) {
    return { type: "blocked", message: blocked };
  }

  const warning = preConditionWarnings[currentStatus]?.[targetStatus];
  if (warning) {
    return { type: "warning", message: warning };
  }

  return { type: "allowed" };
}

/**
 * Traduz uma mensagem de erro 409 do backend para português amigável.
 */
export function translateBackendError(backendMessage: string): string {
  for (const entry of backendErrorTranslations) {
    if (backendMessage.toLowerCase().includes(entry.pattern.toLowerCase())) {
      return entry.message;
    }
  }
  return "Não foi possível realizar esta alteração de status. Verifique se todas as etapas anteriores foram concluídas corretamente e tente novamente.";
}
