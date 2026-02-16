import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import type { ProjectStatus } from "../../../../interfaces/properties/ActionRequiredProps";
import type { AutoCompleteSelectOption } from "../../../../interfaces/properties/ReactSelectFormProps";
import type { ProjectDetails } from "../../../../interfaces/types/ProjectDetails";
import { CoworkerService } from "../../../../services/CoworkerService";
import { Select, SelectOption, Input, AutoCompleteSelect } from "../../../ui/Form";
import styles from "./GeneralInfo.module.css";

interface GeneralInfoFormProps {
    project: ProjectDetails;
    setProject: React.Dispatch<React.SetStateAction<ProjectDetails | null>>
}


export default function GeneralInfoForm({ project, setProject }: GeneralInfoFormProps) {
    const coworkerService = new CoworkerService();
    const [coworkerSelectOptions, setCoworkersSelectOptions] = useState<AutoCompleteSelectOption[]>([]);

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
                    return { value: c.id.toString(), label: `${c.firstName} ${c.lastName}` }
                });

                setCoworkersSelectOptions(coworkersLabels);
            }
        }

        loadCoworkers();
    }, [coworkerSelectOptions]);


    const projectStatusOptions = useMemo(() => [
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
    ], []);

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
                    <AutoCompleteSelect
                        options={projectStatusOptions}
                        onChange={(v) => setProject(prev => {
                            if (!prev) return prev;
                            return { ...prev, status: v?.value as ProjectStatus ?? "NEW" };
                        })}
                        value={projectStatusOptions.find(o => o.value === project.status) ?? null}
                    />
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Tipo de Instalação:</label>
                    <Select value={project.systemType} onChange={projectSystemTypeChangeHandler}>
                        {
                            projectSystemTypeOptions.map((v, key) => <SelectOption label={v.label} value={v.value} key={key} />)
                        }
                    </Select>
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Responsável:</label>
                    <AutoCompleteSelect
                        options={coworkerSelectOptions}
                        onChange={(v) => setProject(prev => {
                            if (!prev) return prev;
                            return { ...prev, coworkerId: Number.parseInt(v?.value ?? "0") };
                        })}
                        value={coworkerSelectOptions.find(o => o.value === project.coworkerId.toString()) ?? null}
                    />
                </div>
            </div>
        </div>
    );
}