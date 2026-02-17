import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import { useState } from "react";
import type { ProjectDetails } from "../../../../interfaces/types/ProjectDetails";
import ProjectService from "../../../../services/ProjectService";
import styles from "./ProjectObservation.module.css";

interface ProjectObservationProps {
    project: ProjectDetails;
    setProject: React.Dispatch<React.SetStateAction<ProjectDetails | null>>;
}

export default function ProjectObservation({ project, setProject }: ProjectObservationProps) {

    const projectService = new ProjectService();
    const [loading, setLoading] = useState(false);

    async function handleBlur() {
        try {
            setLoading(true);

            await projectService.updateProject(project.id, {
                description: project.description
            });

        } catch (err) {
            console.error("Erro ao atualizar descrição", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faPen} />
                <span>Observações</span>
            </div>

            <textarea
                className={styles.textarea}
                value={project.description ?? ""}
                onChange={(e) =>
                    setProject((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            description: e.target.value
                        };
                    })
                }
                onBlur={handleBlur}
                placeholder="Digite observações sobre o projeto..."
                disabled={loading}
            />
        </div>
    );
}
