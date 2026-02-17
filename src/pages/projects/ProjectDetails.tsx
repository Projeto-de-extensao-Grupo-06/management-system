import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActionRequired from "../../components/actionRequired/ActionRequired";
import BudgetSummary from "../../components/forms/project_form/budgetSummary/BudgetSummary";
import ClientInfoForm from "../../components/forms/project_form/clientInfo/ClientInfoForm";
import GeneralInfoForm from "../../components/forms/project_form/generalInfo/GeneralInfoForm";
import NextSchedules from "../../components/forms/project_form/nextSchedules/NextSchedules";
import ProjectObservation from "../../components/forms/project_form/observation/ProjectObservation";
import ProjectFiles from "../../components/forms/project_form/projectFiles/ProjectFiles";
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

            {/* MOBILE */}
            <div className={styles.mobileLayout}>
                <ActionRequired projectStatus={project.status} clientId={project.clientId} />
                <NextSchedules projectId={project.id} />
                <GeneralInfoForm project={project} setProject={setProject} />
                <ClientInfoForm project={project} />
                <BudgetSummary projectId={project.id} />
                <ProjectObservation project={project} setProject={setProject} />
                <ProjectFiles projectId={project.id} />
            </div>

            <div className={styles.desktopLayout}>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <ActionRequired projectStatus={project.status} clientId={project.clientId} />
                        <NextSchedules projectId={project.id} />
                        <BudgetSummary projectId={project.id} />
                        <ProjectObservation project={project} setProject={setProject} />
                    </div>

                    <div className={styles.right}>
                        <div className={styles.generalInfos}>
                            <GeneralInfoForm project={project} setProject={setProject} />
                        </div>
                        <div className={styles.clientInfos}>
                            <ClientInfoForm project={project} />
                        </div>

                        <div className={styles.projectFiles}>
                            <ProjectFiles projectId={project.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}