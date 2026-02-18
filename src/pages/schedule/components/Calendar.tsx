import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import type CalendarEvent from "../../../interfaces/types/CalendarEvent";
import "./Calendar.css";

interface CalendarProps {
    events: CalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
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
            />
        </div>
    );
}
