import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import ReactSelect from "react-select"
import type { ProjectStatus } from "../../../../interfaces/properties/ActionRequiredProps";
import type { ProjectDetails } from "../../../../interfaces/types/ProjectDetails";
import type { ProjectSystemType } from "../../../../interfaces/types/ProjectSystemType";
import { CoworkerService } from "../../../../services/CoworkerService";
import { Select, SelectOption, Input } from "../../../ui/Form";
import styles from "./GeneralInfo.module.css";

interface GeneralInfoFormProps {
    project: ProjectDetails;
    setProject: React.Dispatch<React.SetStateAction<ProjectDetails | null>>
}

interface Label<T> {
    value: T;
    label: string;
}

const statusLabels: Label<ProjectStatus>[] = [
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


const projectSystemTypeLabels: Label<ProjectSystemType>[] = [
    {
        value: "OFF_GRID",
        label: "Off-Grid"
    },
    {
        value: "ON_GRID",
        label: "On-Grid"
    }
]

export default function GeneralInfoForm({ project, setProject }: GeneralInfoFormProps) {
    const coworkerService = new CoworkerService();
    const [coworkerSelectOptions, setCoworkersSelectOptions] = useState<Label<number>[]>([]);

    function projectNameHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setProject(prev => {
            if (!prev) return prev;
            return { ...prev, name: e.target.value }
        });
    }

    function projectSystemTypeChangeHandler(value: string) {
        setProject(prev => {
            if (!prev) return prev;
            return { ...prev, systemType: value as ProjectStatus };
        });
    }

    useEffect(() => {
        const loadCoworkers = async () => {
            const coworkers = await coworkerService.getAllCoworkers();

            if (coworkers.length > 0) {
                const coworkersLabels = coworkers.map(c => {
                    return { value: c.id, label: `${c.firstName} ${c.lastName}` }
                });

                setCoworkersSelectOptions(coworkersLabels);
            }
        }

        loadCoworkers();
    }, [coworkerSelectOptions]);


    const projectSystemTypeOptions = useMemo(() => [
        {
            value: "OFF_GRID",
            label: "Off-Grid"
        },
        {
            value: "ON_GRID",
            label: "On-Grid"
        }
    ], []);

    return (
        <div>
            <div className={styles.infoContainer}>
                <FontAwesomeIcon icon={faInfoCircle} color="#FFC300" size="xl" />
                <span className={styles.infoText}>Informações Gerais</span>
            </div>

            <div className={styles.form}>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Nome do projeto:</label>
                    <Input value={project.name} onChange={projectNameHandler} placeholder="Nome do projeto..." />
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Status do projeto:</label>
                    <ReactSelect<Label<ProjectStatus>>
                        value={statusLabels.find(o => o.value === project.status) ?? null}
                        onChange={(v) => setProject(prev => {
                            if (!prev) return prev;
                            return { ...prev, status: v?.value || "NEW" };
                        })}
                        options={statusLabels.map((v) => {
                            return { value: v.value, label: v.label }
                        })}
                    />
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Tipo de Instalação:</label>
                    <Select value={project.systemType} onChange={projectSystemTypeChangeHandler}>
                        {
                            projectSystemTypeLabels.map((v, key) => <SelectOption label={v.label} value={v.value} key={key} />)
                        }
                    </Select>
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Responsável:</label>
                    <ReactSelect<Label<number>>
                        options={coworkerSelectOptions}
                        value={coworkerSelectOptions.find(o => o.value === project.coworkerId) ?? null}
                        onChange={(v) => setProject(prev => {
                            if (!prev) return prev;
                            return { ...prev, coworkerId: v?.value || 0 };
                        })}
                    />
                </div>
            </div>
        </div>
    );
}