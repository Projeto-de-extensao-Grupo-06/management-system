import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import type { EventClickArg } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import type CalendarEvent from "../../interfaces/types/CalendarEvent";
import EventPopover from "./EventPopover";
import "./Calendar.css";

interface CalendarProps {
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onDateClick?: (dateStr: string) => void;
    popoverDisabled?: boolean;
}

export default function Calendar({
    events,
    onEventClick,
    onDateClick,
    popoverDisabled = false,
}: CalendarProps) {
    const handleEventClick = (info: EventClickArg) => {
        const fullEvent = events.find((e) => e.id === info.event.id);
        if (fullEvent) {
            onEventClick(fullEvent);
        }
    };

    const handleDateClick = (info: DateClickArg) => {
        onDateClick?.(info.dateStr);
    };

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev",
                    center: "title",
                    right: "next",
                }}
                locale={ptBrLocale}
                events={events}
                editable={false}
                displayEventTime={false}
                dayMaxEvents={true}
                height="65vh"
                contentHeight="auto"
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventContent={(eventInfo) => (
                    <EventPopover eventInfo={eventInfo} disabled={popoverDisabled} />
                )}
            />
        </div>
    );
}
