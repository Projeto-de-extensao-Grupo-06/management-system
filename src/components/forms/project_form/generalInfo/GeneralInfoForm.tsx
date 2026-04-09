import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import usePermissions from "../../../../hooks/usePermissions";
import type { AutoCompleteSelectOption } from "../../../../interfaces/properties/ReactSelectFormProps";
import type { ProjectDetails } from "../../../../interfaces/types/ProjectDetails";
import CoworkerService from "../../../../services/CoworkerService";
import ProjectService from "../../../../services/ProjectService";
import { Select, SelectOption, Input, AutoCompleteSelect } from "../../../ui/Form";
import styles from "./GeneralInfo.module.css";

interface GeneralInfoFormProps {
    project: ProjectDetails;
    setProject: React.Dispatch<React.SetStateAction<ProjectDetails | null>>;
}

export default function GeneralInfoForm({ project, setProject }: GeneralInfoFormProps) {
    const coworkerService = new CoworkerService();
    const projectService = new ProjectService();
    const permissions = usePermissions();
    const canEdit = permissions.includes("PROJECT_UPDATE");

    const [coworkerSelectOptions, setCoworkersSelectOptions] = useState<AutoCompleteSelectOption[]>([]);

    async function patchProject(data: Partial<{
        name: string;
        responsibleId: number;
        projectType: "ON_GRID" | "OFF_GRID";
    }>) {
        try {
            await projectService.updateProject(project.id, data);
        } catch (err) {
            console.error("Erro ao atualizar projeto", err);
        }
    }

    function projectNameHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        setProject(prev => {
            if (!prev) return prev;
            return { ...prev, name: value };
        });
    }

    async function projectNameBlurHandler() {
        await patchProject({ name: project.name });
    }

    async function projectSystemTypeChangeHandler(value: string) {
        setProject(prev => {
            if (!prev) return prev;
            return { ...prev, systemType: value as any };
        });

        await patchProject({
            projectType: value as "ON_GRID" | "OFF_GRID"
        });
    }

    async function coworkerChangeHandler(v: AutoCompleteSelectOption | null) {
        const id = Number.parseInt(v?.value ?? "0");

        setProject(prev => {
            if (!prev) return prev;
            return { ...prev, coworkerId: id };
        });

        await patchProject({ responsibleId: id });
    }

    useEffect(() => {
        const loadCoworkers = async () => {
            const coworkers = await coworkerService.getAllCoworkers();

            if (coworkers.length > 0) {
                const coworkersLabels = coworkers.map(c => ({
                    value: c.id.toString(),
                    label: `${c.firstName} ${c.lastName}`
                }));

                setCoworkersSelectOptions(coworkersLabels);
            }
        };

        loadCoworkers();
    }, []);

    const projectSystemTypeOptions = useMemo(() => [
        { value: "OFF_GRID", label: "Off-Grid" },
        { value: "ON_GRID", label: "On-Grid" }
    ], []);


    const projectStatusOptions = useMemo(() => [
        { value: "NEW", label: "Novo" },
        { value: "PRE_BUDGET", label: "Pré-orçamento" },
        { value: "CLIENT_AWAITING_CONTACT", label: "Aguardando contato com cliente" },
        { value: "AWAITING_RETRY", label: "Aguardando nova tentativa" },
        { value: "RETRYING", label: "Realizando nova tentativa de contato" },
        { value: "SCHEDULED_TECHNICAL_VISIT", label: "Visita técnica agendada" },
        { value: "TECHNICAL_VISIT_COMPLETED", label: "Visita técnica concluída" },
        { value: "FINAL_BUDGET", label: "Orçamento final" },
        { value: "AWAITING_MATERIALS", label: "Aguardando materiais" },
        { value: "SCHEDULED_INSTALLING_VISIT", label: "Instalação agendada" },
        { value: "INSTALLED", label: "Instalado" },
        { value: "COMPLETED", label: "Concluído" },
        { value: "NEGOTIATION_FAILED", label: "Negociação não concluída" }
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
                    <Input
                        disabled={!canEdit}
                        value={project.name}
                        onChange={projectNameHandler}
                        onBlur={projectNameBlurHandler}
                        placeholder="Nome do projeto..."
                    />
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Status do projeto:</label>
                    <AutoCompleteSelect
                        isDisabled={!canEdit}
                        options={projectStatusOptions}
                        onChange={(v) => {
                            setProject(prev => {
                                if (!prev) return prev;
                                return {
                                    ...prev,
                                    status: v?.value as any ?? prev.status
                                };
                            });
                        }}
                        value={
                            projectStatusOptions.find(o => o.value === project.status) ?? null
                        }
                    />
                </div>


                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Tipo de Instalação:</label>
                    <Select
                        disabled={!canEdit}
                        value={project.systemType}
                        onChange={projectSystemTypeChangeHandler}
                    >
                        {projectSystemTypeOptions.map((v, key) => (
                            <SelectOption
                                label={v.label}
                                value={v.value}
                                key={key}
                            />
                        ))}
                    </Select>
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Responsável:</label>
                    <AutoCompleteSelect
                        isDisabled={!canEdit}
                        options={coworkerSelectOptions}
                        onChange={coworkerChangeHandler}
                        value={
                            coworkerSelectOptions.find(
                                o => o.value === project.coworkerId?.toString()
                            ) ?? null
                        }
                    />
                </div>
            </div>
        </div>
    );
}
