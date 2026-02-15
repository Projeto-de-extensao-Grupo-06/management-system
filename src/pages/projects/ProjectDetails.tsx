import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActionRequired from "../../components/actionRequired/ActionRequired";
import ClientInfoForm from "../../components/forms/project_form/clientInfo/ClientInfoForm";
import GeneralInfoForm from "../../components/forms/project_form/generalInfo/GeneralInfoForm";
import PageHeader from "../../components/layout/PageHeader";
import type { ProjectDetails } from "../../interfaces/types/ProjectDetails";
import ProjectService from "../../services/ProjectService";
import styles from "./ProjectDetails.module.css";

export default function ProjectDetails() {
    const projectService = new ProjectService();
    const { id } = useParams();
    const [project, setProject] = useState<ProjectDetails | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadProject = async () => {
            const project = await projectService.getProjectById(id);

            if (project) {
                setProject(project);
            }
        }

        loadProject();
    }, [id]);

    if (!project) {
        return null;
    }

    return (
        <>
            <PageHeader title="Detalhes de Projeto" />

            <div className={styles.container}>
                <div className={styles.left}>
                    <ActionRequired projectStatus="RETRYING" clientName="Bryan" />
                </div>

                <div className={styles.right}>
                    <div className={styles.generalInfos}>
                        <GeneralInfoForm project={project} setProject={setProject} />
                    </div>
                    <div className={styles.clientInfos}>
                        <ClientInfoForm project={project} />
                    </div>

                </div>
            </div>
        </>
    );
}