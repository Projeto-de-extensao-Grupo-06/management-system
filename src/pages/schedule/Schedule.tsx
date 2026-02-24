import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ScheduleDetailsModal from "../../components/dialogs/schedule/ScheduleDetailsModal";
import ScheduleFormModal from "../../components/dialogs/schedule/ScheduleFormModal";
import Calendar from "../../components/schedule/Calendar";
import ScheduleKpiBoard from "../../components/schedule/ScheduleKpiBoard";
import SecureComponent from "../../components/security/SecureComponent";
import type CalendarEvent from "../../interfaces/types/CalendarEvent";
import type { ScheduleSchemaType } from "../../schemas/scheduleSchema";
import { scheduleDefaultValues } from "../../schemas/scheduleSchema";
import ScheduleService from "../../services/ScheduleService";
import styles from "./Schedule.module.css";

const service = new ScheduleService();

export default function Schedule() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [createDefaults, setCreateDefaults] = useState<Partial<ScheduleSchemaType>>(scheduleDefaultValues());

    const anyModalOpen = isDetailsOpen || isCreateOpen || isEditOpen;

    async function fetchEvents() {
        const data = await service.getEvents();
        setEvents(data);
    }

    useEffect(() => {
        const t = setTimeout(() => { fetchEvents(); }, 0);
        return () => clearTimeout(t);
    }, []);

    const handleOpenCreate = () => {
        setCreateDefaults(scheduleDefaultValues());
        setIsCreateOpen(true);
    };

    const handleDateClick = (dateStr: string) => {
        setCreateDefaults({ ...scheduleDefaultValues(), start: dateStr });
        setIsCreateOpen(true);
    };

    const handleCreate = async (data: ScheduleSchemaType) => {
        await service.createEvent(data);
        await fetchEvents();
        setIsCreateOpen(false);
    };

    const handleOpenEdit = () => {
        setIsDetailsOpen(false);
        setIsEditOpen(true);
    };

    const handleEdit = async (data: ScheduleSchemaType) => {
        if (!selectedEvent) return;
        await service.updateEvent(selectedEvent.id, data);
        await fetchEvents();
        setIsEditOpen(false);
        setSelectedEvent(null);
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;
        await service.deleteEvent(selectedEvent.id);
        await fetchEvents();
        setIsDetailsOpen(false);
        setIsEditOpen(false);
        setSelectedEvent(null);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsDetailsOpen(true);
    };

    const editDefaults: Partial<ScheduleSchemaType> | undefined = selectedEvent
        ? {
            title: selectedEvent.title,
            type: (selectedEvent.extendedProps?.type ?? 'NOTE') as ScheduleSchemaType['type'],
            start: selectedEvent.start ?? new Date().toISOString().split("T")[0],
            endDate: selectedEvent.end ?? "",
            time: selectedEvent.extendedProps?.time ?? "",
            projectId: selectedEvent.extendedProps?.projectId ?? null,
            description: selectedEvent.extendedProps?.description ?? "",
        }
        : undefined;

    return (
        <div className={styles.schedule_container}>
            <SecureComponent permissions={["SCHEDULE_WRITE"]}>
                <div className={styles.title_container}>
                    <h1>Agenda de visitas</h1>
                    <button className={styles.schedule_btn} onClick={handleOpenCreate}>
                        <FontAwesomeIcon icon={faPlus} />
                        Agendar
                    </button>
                </div>
            </SecureComponent>

            <div className={styles.kpis}>
                <ScheduleKpiBoard events={events} />
            </div>

            <div className={styles.calendar_container}>
                <Calendar
                    events={events}
                    onEventClick={handleEventClick}
                    onDateClick={handleDateClick}
                    popoverDisabled={anyModalOpen}
                />
            </div>

            <ScheduleDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => { setIsDetailsOpen(false); setSelectedEvent(null); }}
                event={selectedEvent}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            <ScheduleFormModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
                defaultValues={createDefaults}
                mode="create"
            />

            <ScheduleFormModal
                isOpen={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedEvent(null); }}
                onSubmit={handleEdit}
                onDelete={handleDelete}
                defaultValues={editDefaults}
                mode="edit"
            />
        </div>
    );
}
