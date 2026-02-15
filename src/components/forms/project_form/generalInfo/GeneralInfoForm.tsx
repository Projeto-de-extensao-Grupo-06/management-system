import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import { useState } from "react";
import type { ProjectStatus } from "../../../../interfaces/properties/ActionRequiredProps";
import type { ProjectSystemType } from "../../../../interfaces/types/ProjectSystemType";
import { CoworkerService } from "../../../../services/CoworkerService";
import { Input, Select, SelectOption } from "../../../ui/Form";
import styles from "./GeneralInfo.module.css";

interface GeneralInfoFormProps {
    projectStatus: ProjectStatus;
    setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>;
    projetcSystemType: ProjectSystemType;
    setProjectSystemType: React.Dispatch<React.SetStateAction<ProjectSystemType>>;
    coworkerId: number;
    setCoworkerId: number
}

interface StatusLabel {
    value: ProjectStatus;
    label: string;
}

interface SystemTypeLabel {
    value: ProjectSystemType;
    label: string;
}

const statusLabels: StatusLabel[] = [
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


const projectSystemTypeLabels: SystemTypeLabel[] = [
    {
        value: "OFF_GRID",
        label: "Off-Grid"
    },
    {
        value: "ON_GRID",
        label: "On-Grid"
    }
]





export default function GeneralInfoForm(
    {
        projectStatus,
        setProjectStatus,
        projetcSystemType,
        setProjectSystemType,
        coworkerId,
        setCoworkerId
    }: GeneralInfoFormProps) {

    const [coworkerName, setCoworkerName] = useState();
    const coworkerService = new CoworkerService();

    function projectStatusChangeHandler(value: string) {
        setProjectStatus(value as ProjectStatus);
    }

    function projectSystemTypeChangeHandler(value: string) {
        setProjectSystemType(value as ProjectSystemType);
    }

    function handleCoworker(e: React.FormEvent) {
        coworkerService.getCoworkerById()
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
                <Select value={projetcSystemType} onChange={projectSystemTypeChangeHandler}>
                    {
                        projectSystemTypeLabels.map((v, key) => <SelectOption label={v.label} value={v.value} key={key} />)
                    }
                </Select>

                <Input onChange={(e) => setCoworkerName(e.target.value)} value={coworkerName} />

            </div>
        </div>
    );
}