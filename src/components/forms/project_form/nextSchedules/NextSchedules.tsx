import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import type { Schedule } from "../../../../interfaces/types/Schedule";
import type { ScheduleSchemaType } from "../../../../schemas/scheduleSchema";
import ScheduleService from "../../../../services/ScheduleService";
import ScheduleFormModal from "../../../dialogs/schedule/ScheduleFormModal";
import SecureComponent from "../../../security/SecureComponent";
import styles from "./NextSchedules.module.css";
import ScheduleCard from "./partials/ScheduleCard";

const scheduleService = new ScheduleService();

interface NextSchedulesProps {
    projectId: number;
}

export default function NextSchedules({ projectId }: NextSchedulesProps) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingSchedule(null);
    }

    async function handleEditSubmit(data: ScheduleSchemaType) {
        if (!editingSchedule) return;
        try {
            await scheduleService.updateEvent(String(editingSchedule.id), data);
            closeModal();
            fetchSchedules();
        } catch (error) {
            console.error("Erro ao atualizar compromisso", error);
        }
    }

    function buildDefaultValues(schedule: Schedule): Partial<ScheduleSchemaType> {
        // startDate vem como "2025-05-20T21:00:00" — extrair date e time
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

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>Próximos compromissos</span>
                </div>
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
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleEditSubmit}
                    defaultValues={buildDefaultValues(editingSchedule)}
                    mode="edit"
                />
            )}
        </div>
    );
}
