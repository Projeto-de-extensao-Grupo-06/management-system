import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef } from "react";
import type CalendarEvent from "../../interfaces/types/CalendarEvent";
import EventPopover from "./EventPopover";
import "./Calendar.css";

interface CalendarProps {
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onDateClick?: (dateStr: string) => void;
    onDatesSet: (month: number, year: number) => void;
    popoverDisabled?: boolean;
}

export default function Calendar({
    events,
    onEventClick,
    onDateClick,
    onDatesSet,
    popoverDisabled = false,
}: CalendarProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;
        const observer = new ResizeObserver(() => {
            window.dispatchEvent(new Event("resize"));
        });
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    const handleEventClick = (info: EventClickArg) => {
        const fullEvent = events.find((e) => e.id === info.event.id);
        if (fullEvent) {
            onEventClick(fullEvent);
        }
    };

    const handleDateClick = (info: DateClickArg) => {
        onDateClick?.(info.dateStr);
    };

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const month = dateInfo.view.calendar.getDate().getMonth() + 1
        const year = dateInfo.view.calendar.getDate().getFullYear();
        onDatesSet(month, year);
    };

    return (
        <div className="calendar-wrapper" ref={wrapperRef}>
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
                dayMaxEvents={2}
                height="auto"
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventContent={(eventInfo) => (
                    <EventPopover eventInfo={eventInfo} disabled={popoverDisabled} />
                )}
                datesSet={handleDatesSet}
            />
        </div>
    );
}
