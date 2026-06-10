import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useMemo } from "react";
import Swal from 'sweetalert2';
import type { ProjectStatusType } from "../../../../interfaces/enum/ProjectStatus";
import type { Schedule } from "../../../../interfaces/types/Schedule";
import type { ScheduleSchemaType } from "../../../../schemas/scheduleSchema";
import { scheduleDefaultValues } from "../../../../schemas/scheduleSchema";
import ProjectService from "../../../../services/ProjectService";
import ScheduleService from "../../../../services/ScheduleService";
import { getErrorMessage } from "../../../../utils/errorTranslator";
import ScheduleFormModal from "../../../dialogs/schedule/ScheduleFormModal";
import SecureComponent from "../../../security/SecureComponent";
import { Button } from "../../../ui/Form";
import styles from "./NextSchedules.module.css";
import ScheduleCard from "./partials/ScheduleCard";

const scheduleService = new ScheduleService();

interface NextSchedulesProps {
    projectId: number;
    onScheduleChange?: () => void;
}

export default function NextSchedules({ projectId, onScheduleChange }: NextSchedulesProps) {
    const projectService = useMemo(() => new ProjectService(), []);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    async function fetchSchedules() {
        try {
            const data = await scheduleService.listProjectSchedules(projectId);
            setSchedules(data);
        } catch (error) {
            console.error("Erro ao buscar schedules", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSchedules();
    }, [projectId]);

    function openEditModal(schedule: Schedule) {
        setEditingSchedule(schedule);
        setIsEditModalOpen(true);
    }

    function closeEditModal() {
        setIsEditModalOpen(false);
        setEditingSchedule(null);
    }

    function openCreateModal() {
        setIsCreateModalOpen(true);
    }

    function closeCreateModal() {
        setIsCreateModalOpen(false);
    }

    async function handleEditSubmit(data: ScheduleSchemaType) {
        if (!editingSchedule) return;
        try {
            await scheduleService.updateEvent(String(editingSchedule.id), data);

            // Atualiza o status do projeto vinculado conforme o tipo de visita agendada/atualizada
            const statusMap: Partial<Record<ScheduleSchemaType['type'], ProjectStatusType>> = {
                TECHNICAL_VISIT: 'SCHEDULED_TECHNICAL_VISIT',
                INSTALL_VISIT:   'SCHEDULED_INSTALLING_VISIT',
            };
            const newStatus = statusMap[data.type];
            if (newStatus) {
                try {
                    await projectService.updateProject(projectId, { status: newStatus });
                } catch (statusErr) {
                    console.warn('Agendamento atualizado, mas não foi possível atualizar o status do projeto:', statusErr);
                }
            }

            closeEditModal();
            fetchSchedules();
            if (onScheduleChange) {
                onScheduleChange();
            }
            Swal.fire({ 
                icon: 'success', 
                title: 'Sucesso', 
                text: 'Agendamento atualizado!', 
                timer: 2000, 
                showConfirmButton: false,
                customClass: { container: 'swal-above-modal' }
            });
        } catch (error: any) {
            const msg = getErrorMessage(error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: msg,
                customClass: { container: 'swal-above-modal' }
            });
        }
    }

    async function handleCreateSubmit(data: ScheduleSchemaType) {
        try {
            // Force the projectId from the current project page
            const payload = { ...data, projectId };
            await scheduleService.createEvent(payload);

            // Atualiza o status do projeto vinculado conforme o tipo de visita agendada
            const statusMap: Partial<Record<ScheduleSchemaType['type'], ProjectStatusType>> = {
                TECHNICAL_VISIT: 'SCHEDULED_TECHNICAL_VISIT',
                INSTALL_VISIT:   'SCHEDULED_INSTALLING_VISIT',
            };
            const newStatus = statusMap[data.type];
            if (newStatus) {
                try {
                    await projectService.updateProject(projectId, { status: newStatus });
                } catch (statusErr) {
                    console.warn('Agendamento criado, mas não foi possível atualizar o status do projeto:', statusErr);
                }
            }

            closeCreateModal();
            fetchSchedules();
            if (onScheduleChange) {
                onScheduleChange();
            }
            Swal.fire({ 
                icon: 'success', 
                title: 'Sucesso', 
                text: 'Agendamento criado!', 
                timer: 2000, 
                showConfirmButton: false,
                customClass: { container: 'swal-above-modal' }
            });
        } catch (error: any) {
            const msg = getErrorMessage(error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: msg,
                customClass: { container: 'swal-above-modal' }
            });
        }
    }

    async function handleDelete() {
        if (!editingSchedule) return;
        try {
            await scheduleService.deleteEvent(String(editingSchedule.id));
            closeEditModal();
            fetchSchedules();
            if (onScheduleChange) {
                onScheduleChange();
            }
            Swal.fire({ 
                icon: 'success', 
                title: 'Sucesso', 
                text: 'Agendamento excluído!', 
                timer: 2000, 
                showConfirmButton: false,
                customClass: { container: 'swal-above-modal' }
            });
        } catch (error: any) {
            const msg = getErrorMessage(error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao excluir agendamento',
                text: msg,
                customClass: { container: 'swal-above-modal' }
            });
        }
    }

    function buildDefaultValues(schedule: Schedule): Partial<ScheduleSchemaType> {
        const dateStr = schedule.startDate ? schedule.startDate.substring(0, 10) : "";
        const timeStr = schedule.startDate ? schedule.startDate.substring(11, 16) : "";
        const endDateStr = schedule.endDate ? schedule.endDate.substring(0, 10) : "";

        return {
            title: schedule.title,
            type: schedule.type as ScheduleSchemaType["type"],
            start: dateStr,
            endDate: endDateStr || "",
            time: timeStr,
            projectId: schedule.projectId ?? null,
            description: schedule.description ?? "",
        };
    }

    const createDefaults = { ...scheduleDefaultValues(), projectId };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>Próximos compromissos</span>
                </div>
                <SecureComponent permissions={["SCHEDULE_WRITE"]}>
                    <Button 
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        text="Novo"
                        onClick={openCreateModal}
                        width="fit-content"
                        style={{ padding: '8px 16px' }}
                    />
                </SecureComponent>
            </div>

            {loading && <p>Carregando...</p>}

            {!loading &&
                schedules.map((schedule) => {
                    return (
                        <div key={schedule.id} className={styles.scheduleRow}>
                            <ScheduleCard
                                type={schedule.type}
                                dateTime={schedule.startDate}
                                responsibleId={schedule.coworkerId}
                            />
                            <SecureComponent permissions={["SCHEDULE_UPDATE"]}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => openEditModal(schedule)}
                                >
                                    Editar
                                </button>
                            </SecureComponent>
                        </div>
                    );
                })}

            {!loading && schedules.length === 0 && (
                <p>Nenhum compromisso encontrado.</p>
            )}

            {editingSchedule && (
                <ScheduleFormModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSubmit={handleEditSubmit}
                    onDelete={handleDelete}
                    defaultValues={buildDefaultValues(editingSchedule)}
                    mode="edit"
                />
            )}

            <ScheduleFormModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSubmit={handleCreateSubmit}
                defaultValues={createDefaults}
                mode="create"
            />
        </div>
    );
}
