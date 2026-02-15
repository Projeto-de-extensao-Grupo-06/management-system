import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActionRequired from "../../components/actionRequired/ActionRequired";
import GeneralInfoForm from "../../components/forms/project_form/generalInfo/GeneralInfoForm";
import PageHeader from "../../components/layout/PageHeader";
import type { ProjectDetails } from "../../interfaces/types/ProjectDetails";
import ProjectService from "../../services/ProjectService";

export default function ProjectDetails() {
    const projectService = new ProjectService();
    const { id } = useParams();
    const [project, setProject] = useState<ProjectDetails>();


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

    return (
        <>
            <PageHeader title="Detalhes de Projeto" />
            <ActionRequired projectStatus="RETRYING" clientName="Bryan" />
            <GeneralInfoForm></GeneralInfoForm>

        </>
    );
}