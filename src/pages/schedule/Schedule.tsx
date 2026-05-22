import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import ScheduleDetailsModal from "../../components/dialogs/schedule/ScheduleDetailsModal";
import ScheduleFormModal from "../../components/dialogs/schedule/ScheduleFormModal";
import PageLayout from "../../components/layout/PageLayout";
import Calendar from "../../components/schedule/Calendar";
import ScheduleKpiBoard from "../../components/schedule/ScheduleKpiBoard";
import SecureComponent from "../../components/security/SecureComponent";
import { Button } from "../../components/ui/Form";
import type CalendarEvent from "../../interfaces/types/CalendarEvent";
import type { ProjectStatusType } from "../../interfaces/enum/ProjectStatus";
import type { ScheduleSchemaType } from "../../schemas/scheduleSchema";
import { scheduleDefaultValues } from "../../schemas/scheduleSchema";
import ProjectService from "../../services/ProjectService";
import ScheduleService from "../../services/ScheduleService";
import Swal from 'sweetalert2';
import styles from "./Schedule.module.css";

const service = new ScheduleService();
const projectService = new ProjectService();

export default function Schedule() {

  useEffect(() => {
  document.title = "Agenda | SolarWay";
}, []);

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [createDefaults, setCreateDefaults] = useState<Partial<ScheduleSchemaType>>(scheduleDefaultValues());

    const anyModalOpen = isDetailsOpen || isCreateOpen || isEditOpen;

    const fetchEvents = useCallback(async (month?: number, year?: number) => {
        const m = month ?? currentMonth;
        const y = year ?? currentYear;

        // Busca mês anterior, atual e próximo para cobrir navegação
        const prevMonth = m === 1 ? 12 : m - 1;
        const prevYear = m === 1 ? y - 1 : y;
        const nextMonth = m === 12 ? 1 : m + 1;
        const nextYear = m === 12 ? y + 1 : y;

        const [prev, curr, next] = await Promise.all([
            service.getEvents(prevMonth, prevYear),
            service.getEvents(m, y),
            service.getEvents(nextMonth, nextYear),
        ]);

        const merged = new Map<string, CalendarEvent>();
        [...prev, ...curr, ...next].forEach(e => merged.set(e.id, e));
        setEvents(Array.from(merged.values()));
    }, [currentMonth, currentYear]);

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenCreate = () => {
        setCreateDefaults(scheduleDefaultValues());
        setIsCreateOpen(true);
    };

    const handleDatesSet = (month: number, year: number) => {
        setCurrentMonth(month);
        setCurrentYear(year);
        service.getEvents(month, year).then(data => setEvents(prev => {
            const merge = new Map<string, CalendarEvent>();
            prev.forEach(e => merge.set(e.id, e));
            data.forEach(e => merge.set(e.id, e));
            return Array.from(merge.values());
        }));
    };

    const handleDateClick = (dateStr: string) => {
        setCreateDefaults({ ...scheduleDefaultValues(), start: dateStr });
        setIsCreateOpen(true);
    };

    const handleCreate = async (data: ScheduleSchemaType) => {
        try {
            await service.createEvent(data);
            await fetchEvents(currentMonth, currentYear);
            setIsCreateOpen(false);

            // Atualiza o status do projeto vinculado conforme o tipo de visita agendada
            if (data.projectId) {
                const statusMap: Partial<Record<ScheduleSchemaType['type'], ProjectStatusType>> = {
                    TECHNICAL_VISIT: 'SCHEDULED_TECHNICAL_VISIT',
                    INSTALL_VISIT:   'SCHEDULED_INSTALLING_VISIT',
                };
                const newStatus = statusMap[data.type];
                if (newStatus) {
                    try {
                        await projectService.updateProject(data.projectId, { status: newStatus });
                    } catch (statusErr) {
                        console.warn('Agendamento criado, mas não foi possível atualizar o status do projeto:', statusErr);
                    }
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Agendamento criado!',
                timer: 2000,
                showConfirmButton: false,
                customClass: { container: 'swal-above-modal' },
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; messages?: string[]; validationErrors?: { field: string; message: string }[] } } };
            const validationErrors = err?.response?.data?.validationErrors;
            
            let validationMsg = '';
            if (validationErrors && validationErrors.length > 0) {
                const translatedErrors = validationErrors.map(v => {
                    if (v.field === 'startDate') return 'A data de início não pode estar no passado.';
                    if (v.field === 'endDate') return 'A data de término não pode estar no passado.';
                    if (v.field === 'title') return 'O título é obrigatório.';
                    if (v.field === 'type') return 'O tipo de evento é obrigatório.';
                    return v.message;
                });
                validationMsg = translatedErrors.join('\n');
            }

            const msg =
                validationMsg ||
                err?.response?.data?.messages?.[0] ||
                err?.response?.data?.message ||
                'Não foi possível criar o agendamento.';
            Swal.fire({
                icon: 'error',
                title: 'Erro ao criar agendamento',
                text: msg,
                customClass: { container: 'swal-above-modal' },
            });
        }
    };

    const handleOpenEdit = () => {
        setIsDetailsOpen(false);
        setIsEditOpen(true);
    };

    const handleEdit = async (data: ScheduleSchemaType) => {
        if (!selectedEvent) return;
        try {
            await service.updateEvent(selectedEvent.id, data);
            await fetchEvents(currentMonth, currentYear);
            setIsEditOpen(false);
            setSelectedEvent(null);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Agendamento atualizado!',
                timer: 2000,
                showConfirmButton: false,
                customClass: { container: 'swal-above-modal' },
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; messages?: string[]; validationErrors?: { field: string; message: string }[] } } };
            const validationErrors = err?.response?.data?.validationErrors;
            
            let validationMsg = '';
            if (validationErrors && validationErrors.length > 0) {
                const translatedErrors = validationErrors.map(v => {
                    if (v.field === 'startDate') return 'A data de início não pode estar no passado.';
                    if (v.field === 'endDate') return 'A data de término não pode estar no passado.';
                    if (v.field === 'title') return 'O título é obrigatório.';
                    if (v.field === 'type') return 'O tipo de evento é obrigatório.';
                    return v.message;
                });
                validationMsg = translatedErrors.join('\n');
            }

            const msg =
                validationMsg ||
                err?.response?.data?.messages?.[0] ||
                err?.response?.data?.message ||
                'Não foi possível atualizar o agendamento.';
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar agendamento',
                text: msg,
                customClass: { container: 'swal-above-modal' },
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;
        await service.deleteEvent(selectedEvent.id);
        await fetchEvents(currentMonth, currentYear);
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
        <PageLayout
            title="Agenda de visitas"
            rightActions={
                <SecureComponent permissions={["SCHEDULE_WRITE"]}>
                    <Button
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        text="Agendar"
                        onClick={handleOpenCreate}
                        width="fit-content"
                    />
                </SecureComponent>
            }
        >

            <div className={styles.kpis}>
                <ScheduleKpiBoard events={events} />
            </div>

            <div className={styles.calendar_container}>
                <Calendar
                    events={events}
                    onEventClick={handleEventClick}
                    onDateClick={handleDateClick}
                    onDatesSet={handleDatesSet}
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
        </PageLayout>
    );
}
