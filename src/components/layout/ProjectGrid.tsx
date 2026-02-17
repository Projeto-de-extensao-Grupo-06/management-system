import { useNavigate } from 'react-router';
import type ProjectSummary from '../../interfaces/types/ProjectSummary';
import ProjectCard from '../../pages/projects/components/ProjectCard';
import styles from '../../pages/clients/Clients.module.css';

interface ProjectGridProps {
    projects: ProjectSummary[];
    emptyMessage?: string;
    onProjectClick?: (projectId: number) => void;
}

export default function ProjectGrid({
    projects,
    emptyMessage = "Nenhum projeto encontrado.",
    onProjectClick
}: ProjectGridProps) {
    const navigate = useNavigate();

    if (projects.length === 0) {
        return (
            <div className={styles.emptyState}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={styles.projectsGrid}>
            {projects.map(project => (
                <div
                    key={project.id}
                    onClick={() => onProjectClick ? onProjectClick(project.id) : navigate(`/projetos/${project.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <ProjectCard project={project} />
                </div>
            ))}
        </div>
    );
}
