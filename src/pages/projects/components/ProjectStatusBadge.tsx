import { projectStatusLabel } from '../../../utils/mappers/projectStatusLabel';
import styles from '../ProjectStatusBadge.module.css';

interface Props {
  status: string;
}

const statusColorMap: Record<string, string> = {
  NEW: '#1565C0',
  PRE_BUDGET: '#42A5F5',
  CLIENT_AWAITING_CONTACT: '#FDD835',
  AWAITING_RETRY: '#BDBDBD',
  RETRYING: '#FB8C00',
  NEGOTIATION_FAILED: '#D32F2F',
  SCHEDULED_TECHNICAL_VISIT: '#8E24AA',
  TECHNICAL_VISIT_COMPLETED: '#795548',
  FINAL_BUDGET: '#0288D1',
  AWAITING_MATERIALS: '#FFB300',
  SCHEDULED_INSTALLING_VISIT: '#558B2F',
  INSTALLED: '#43A047',
  COMPLETED: '#1B5E20',
};

export default function ProjectStatusBadge({ status }: Props) {
  const backgroundColor = statusColorMap[status] ?? '#999';

  return (
    <span
      className={styles.badge}
      style={{ backgroundColor }}
    >
      {projectStatusLabel[status] ?? status}
    </span>
  );
}
