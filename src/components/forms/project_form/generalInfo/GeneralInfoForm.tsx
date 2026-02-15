import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import type { ProjectStatus } from "../../../../interfaces/properties/ActionRequiredProps";
import { Select, SelectOption } from "../../../ui/Form";
import styles from "./GeneralInfo.module.css";

interface GeneralInfoFormProps {
    projectStatus: ProjectStatus
    setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>
}

interface StatusLabel {
    value: ProjectStatus;
    label: string;
}

interface StatusLabel {
    value: ProjectStatus;
    label: string;
}

export const statusLabels: StatusLabel[] = [
    {
        value: "NEW",
        label: "Novo"
    },
    {
        value: "PRE_BUDGET",
        label: "Pré-orçamento"
    },
    {
        value: "CLIENT_AWAITING_CONTACT",
        label: "Aguardando contato com cliente",
    },
    {
        value: "AWAITING_RETRY",
        label: "Aguardando nova tentativa",
    },
    {
        value: "RETRYING",
        label: "Realizando nova tentativa de contato",
    },
    {
        value: "SCHEDULED_TECHNICAL_VISIT",
        label: "Visita técnica agendada",
    },
    {
        value: "TECHNICAL_VISIT_COMPLETED",
        label: "Visita técnica concluída",
    },
    { value: "FINAL_BUDGET", label: "Orçamento final" },
    {
        value: "AWAITING_MATERIALS",
        label: "Aguardando materiais",
    },
    {
        value: "SCHEDULED_INSTALLING_VISIT",
        label: "Instalação agendada",
    },
    { value: "INSTALLED", label: "Instalado" },

    { value: "COMPLETED", label: "Concluído" },
    {
        value: "NEGOTIATION_FAILED",
        label: "Negociação não concluída",
    }
];



export default function GeneralInfoForm({ projectStatus, setProjectStatus }: GeneralInfoFormProps) {
    function projectStatusChangeHandler(value: string) {
        setProjectStatus(value as ProjectStatus);
    }


    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <FontAwesomeIcon icon={faInfoCircle} color="#FFC300" size="xl" />
                <span className={styles.infoText}>Informações Gerais</span>
            </div>

            <div className="form">
                <Select value={projectStatus} onChange={projectStatusChangeHandler}>
                    {
                        statusLabels.map((v, key) => <SelectOption label={v.label} value={v.value} key={key} />)
                    }
                </Select>
            </div>
        </div>
    );
}