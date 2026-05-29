import axios from "axios";

/**
 * Traduz mensagens de erro vindas do backend para português.
 */
export const translateError = (message: string): string => {
  if (!message) return 'Ocorreu um erro inesperado.';

  const translations: Record<string, string> = {
    // Schedule Errors
    'The start date can´t be in the past': 'A data de início não pode estar no passado.',
    'The start date can\'t be in the past': 'A data de início não pode estar no passado.',
    'The selected date and time range overlaps with an existing schedule for this coworker. Use force to do this.': 'O horário selecionado coincide com outro agendamento deste colaborador.',
    'A past or future installation visit already exists for this project. This operation does not make sense. Resubmit the request with the force flag if you really want to perform this operation.': 'Já existe uma visita de instalação para este projeto.',
    'An installation visit is being created without a technical visit ever having been created. This operation does not make sense. If you really want to do this, use the force flag.': 'Não é possível agendar instalação sem antes ter realizado uma visita técnica.',
    'Cannot update a finished schedule.': 'Não é possível editar um agendamento já finalizado.',
    'A project ID must be provided for this schedule type. Only NOTE type schedules can be created without an associated project.': 'Este tipo de agendamento requer um projeto vinculado.',
    'Schedule cannot have a start date after end date': 'A data de início não pode ser posterior à data de término.',
    
    // Project / General Errors
    'Cannot transition project status because the current status is null': 'Não é possível alterar o status: status atual é nulo.',
    'Project name already exists': 'Já existe um projeto com este nome.',
    'Client not found': 'Cliente não encontrado.',
    'Schedule not found': 'Agendamento não encontrado.',
    'Project does not exists on database': 'Projeto não encontrado no banco de dados.',
    'Responsible coworker not found': 'Colaborador responsável não encontrado.',

    // Status Transition Errors (from backend messages)
    'You cannot apply NEW to SCHEDULED_TECHNICAL_VISIT without a TECHNICAL_VISIT scheduled': 'Não é possível alterar para Visita Técnica Agendada sem um agendamento de visita técnica futuro.',
    'SCHEDULED_TECHNICAL_VISIT': 'Não há visita técnica agendada com data futura neste projeto. Crie o agendamento primeiro.',
    'SCHEDULED_INSTALLING_VISIT': 'Não há visita de instalação agendada com data futura neste projeto. Crie o agendamento primeiro.',
    'TECHNICAL_VISIT_COMPLETED': 'A visita técnica ainda não foi marcada como concluída nos agendamentos.',
    'AWAITING_RETRY': 'Não há retentativa de contato agendada com data futura neste projeto.',
    'cannot have a scheduled retry': 'Existe uma retentativa de contato pendente neste projeto. Cancele-a antes de avançar.',
    'FINAL_BUDGET': 'O orçamento cadastrado não é um orçamento final. Registre o orçamento final antes de avançar.',
    'homologation': 'O documento de homologação ainda não foi anexado ao projeto.',
    'INSTALL_VISIT': 'A visita de instalação ainda não foi finalizada nos agendamentos.',
    'active schedule': 'Existe um agendamento futuro ativo neste projeto. Cancele-o antes de retroceder o status.',
    'Cancel the install visit': 'Existe uma visita de instalação futura ativa. Cancele-a antes de voltar ao fluxo de contato.',
  };

  // Tenta encontrar uma tradução exata
  if (translations[message]) {
    return translations[message];
  }

  // Tenta encontrar por padrões conhecidos (insensível a maiúsculas/minúsculas)
  const lowerMessage = message.toLowerCase();
  
  // Re-check patterns from projectStatusTransitions
  if (lowerMessage.includes('scheduled_technical_visit')) return translations['SCHEDULED_TECHNICAL_VISIT'];
  if (lowerMessage.includes('scheduled_installing_visit')) return translations['SCHEDULED_INSTALLING_VISIT'];
  if (lowerMessage.includes('technical_visit_completed')) return translations['TECHNICAL_VISIT_COMPLETED'];
  if (lowerMessage.includes('awaiting_retry')) return translations['AWAITING_RETRY'];
  if (lowerMessage.includes('final_budget')) return translations['FINAL_BUDGET'];
  if (lowerMessage.includes('homologation')) return translations['homologation'];
  
  if (lowerMessage.includes('past')) {
    return 'A data selecionada não pode estar no passado.';
  }
  if (lowerMessage.includes('overlap')) {
    return 'O horário selecionado coincide com outro agendamento.';
  }
  if (lowerMessage.includes('not found')) {
    return 'Recurso não encontrado no sistema.';
  }
  if (lowerMessage.includes('already exists')) {
    return 'Este registro já existe no sistema.';
  }

  return message || 'Não foi possível realizar esta operação. Verifique os dados e tente novamente.';
};

/**
 * Traduz erros de validação de campos (Bean Validation).
 */
export const translateValidationErrors = (validationErrors: { field: string; message: string }[]): string => {
  if (!validationErrors || validationErrors.length === 0) return '';

  const translatedErrors = validationErrors.map(v => {
    switch (v.field) {
      case 'startDate': return 'A data de início não pode estar no passado.';
      case 'endDate': return 'A data de término não pode estar no passado.';
      case 'title': return 'O título é obrigatório.';
      case 'type': return 'O tipo de evento é obrigatório.';
      case 'monthlyBill': return 'O valor da conta é obrigatório.';
      default: return translateError(v.message);
    }
  });

  return translatedErrors.join('\n');
};

/**
 * Extrai e traduz a mensagem de erro de uma resposta da API.
 */
export const getErrorMessage = (error: any): string => {
  if (!axios.isAxiosError(error)) {
    return error?.message || 'Erro desconhecido';
  }

  const data = error.response?.data;
  
  // Erros de validação (lista de campos)
  if (data?.validationErrors && data.validationErrors.length > 0) {
    return translateValidationErrors(data.validationErrors);
  }

  // Mensagem única
  const rawMessage = data?.messages?.[0] || data?.message || '';
  return translateError(rawMessage);
};
