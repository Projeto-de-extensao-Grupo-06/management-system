import styles from '../ProjectCard.module.css';
import ProjectStatusBadge from './ProjectStatusBadge';
import type ProjectSummary from '../../../interfaces/types/ProjectSummary';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faCommentDots } from '@fortawesome/free-solid-svg-icons';

interface Props {
  project: ProjectSummary;
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className={styles.card}>

      {/* HEADER */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {project.projectTitle}
        </h3>

        <ProjectStatusBadge status={project.status} />
      </div>

    {/* BODY */}
<div className={styles.body}>
  <div className={styles.left}>
    <div>Cliente: {project.client?.firstName ?? '-'}</div>

    <div>
      Responsável:{' '}
      {project.responsible
  ? `${project.responsible.firstName} ${project.responsible.lastName}`
  : 'Não definido'}
    </div>

  <div>
  Prazo:{' '}
  {project.deadline
    ? new Date(project.deadline).toLocaleDateString('pt-BR')
    : '-'}
</div>

  </div>

  <div className={styles.right}>
  {project.systemType === 'ON_GRID'
    ? 'On-Grid'
    : project.systemType === 'OFF_GRID'
    ? 'Off-Grid'
    : '-'}
</div>

</div>


      {/* FOOTER */}
      <div className={styles.footer}>

        <div className={styles.footerItem}>
         <FontAwesomeIcon icon={faCommentDots} size="lg" />
          <span>{project.commentCount ?? 0}</span>
        </div>

        <div className={styles.footerItem}>
          <FontAwesomeIcon icon={faPaperclip} size="lg" />
          <span>{project.fileCount ?? 0}</span>
        </div>

        
      </div>

    </div>
  );
}
