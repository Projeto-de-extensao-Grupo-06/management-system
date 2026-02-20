import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import ScheduleKpiBoard from "./components/ScheduleKpiBoard";
import Calendar from "./components/Calendar";
import ScheduleDetailsModal from "./components/ScheduleDetailsModal";
import ScheduleFormModal from "./components/ScheduleFormModal";
import type CalendarEvent from "../../interfaces/types/CalendarEvent";
import type { ScheduleSchemaType } from "../../schemas/scheduleSchema";
import { scheduleDefaultValues } from "../../schemas/scheduleSchema";
import ScheduleService from "../../services/ScheduleService";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    INSTALLATION: { bg: "#FFEADD", text: "#555" },
    VISIT: { bg: "#DDF3FF", text: "#555" },
    REMINDER: { bg: "#FFF9C4", text: "#555" },
};

const TYPE_TITLES: Record<string, string> = {
    INSTALLATION: "Instalação",
    VISIT: "Visita",
    REMINDER: "Lembrete",
};

export default function Schedule() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const service = new ScheduleService();

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [createDefaults, setCreateDefaults] = useState<Partial<ScheduleSchemaType>>(scheduleDefaultValues());

    const anyModalOpen = isDetailsOpen || isCreateOpen || isEditOpen;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const data = await service.getEvents();
        setEvents(data);
    };

    const handleOpenCreate = () => {
        setCreateDefaults(scheduleDefaultValues());
        setIsCreateOpen(true);
    };

    const handleDateClick = (dateStr: string) => {
        setCreateDefaults({ ...scheduleDefaultValues(), start: dateStr });
        setIsCreateOpen(true);
    };

    const handleCreate = async (data: ScheduleSchemaType) => {
        const colors = TYPE_COLORS[data.type];
        const newEvent: Omit<CalendarEvent, "id"> = {
            title: data.clientName
                ? `${TYPE_TITLES[data.type]} - ${data.clientName}`
                : TYPE_TITLES[data.type],
            start: data.start,
            backgroundColor: colors.bg,
            textColor: colors.text,
            borderColor: "transparent",
            extendedProps: {
                type: data.type,
                time: data.time,
                clientName: data.clientName,
                description: data.description,
            },
        };
        await service.createEvent(newEvent);
        await fetchEvents();
        setIsCreateOpen(false);
    };

    const handleOpenEdit = () => {
        setIsDetailsOpen(false);
        setIsEditOpen(true);
    };

    const handleEdit = async (data: ScheduleSchemaType) => {
        if (!selectedEvent) return;
        const colors = TYPE_COLORS[data.type];
        await service.updateEvent(selectedEvent.id, {
            title: data.clientName
                ? `${TYPE_TITLES[data.type]} - ${data.clientName}`
                : TYPE_TITLES[data.type],
            start: data.start,
            backgroundColor: colors.bg,
            textColor: colors.text,
            borderColor: "transparent",
            extendedProps: {
                type: data.type,
                time: data.time,
                clientName: data.clientName,
                description: data.description,
            },
        });
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
            type: selectedEvent.extendedProps?.type ?? "REMINDER",
            start: selectedEvent.start ?? new Date().toISOString().split("T")[0],
            time: selectedEvent.extendedProps?.time ?? "",
            clientName: selectedEvent.extendedProps?.clientName ?? "",
            description: selectedEvent.extendedProps?.description ?? "",
        }
        : undefined;

    return (
        <div className={styles.schedule_container}>
            <div className={styles.title_container}>
                <h1>Agenda de visitas</h1>
                <button className={styles.schedule_btn} onClick={handleOpenCreate}>
                    <FontAwesomeIcon icon={faPlus} />
                    Agendar
                </button>
            </div>

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
