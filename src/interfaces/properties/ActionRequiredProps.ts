export type ProjectStatus =
  | "NEW"
  | "PRE_BUDGET"
  | "CLIENT_AWAITING_CONTACT"
  | "AWAITING_RETRY"
  | "RETRYING"
  | "SCHEDULED_TECHNICAL_VISIT"
  | "TECHNICAL_VISIT_COMPLETED"
  | "FINAL_BUDGET"
  | "AWAITING_MATERIALS"
  | "SCHEDULED_INSTALLING_VISIT"
  | "INSTALLED"
  | "COMPLETED"
  | "NEGOTIATION_FAILED";


export interface ActionRequiredProps {
    projectStatus: ProjectStatus;
    clientId: number;
}