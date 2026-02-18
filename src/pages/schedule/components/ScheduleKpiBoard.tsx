import {
    faClipboardCheck,
    faCalendarDay,
    faWrench,
    faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import KpiCard from "../../../components/ui/KpiCard";
import type CalendarEvent from "../../../interfaces/types/CalendarEvent";

interface ScheduleKpiBoardProps {
    events: CalendarEvent[];
}

export default function ScheduleKpiBoard({ events }: ScheduleKpiBoardProps) {
    const completedVisits = 4;
    const scheduledVisits = events.filter(e => e.extendedProps?.type === 'VISIT').length;
    const scheduledInstallations = events.filter(e => e.extendedProps?.type === 'INSTALLATION').length;
    const reminders = events.filter(e => e.extendedProps?.type === 'REMINDER').length;

    return (
        <>
            <KpiCard
                title="Visitas concluídas"
                value={completedVisits}
                icon={faClipboardCheck}
            />
            <KpiCard
                title="Visitas marcadas"
                value={scheduledVisits}
                icon={faCalendarDay}
            />
            <KpiCard
                title="Instalações marcadas"
                value={scheduledInstallations}
                icon={faWrench}
            />
            <KpiCard
                title="Lembretes"
                value={reminders}
                icon={faNoteSticky}
            />
        </>
    );
}
