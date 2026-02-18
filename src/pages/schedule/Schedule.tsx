import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import ScheduleKpiBoard from "./components/ScheduleKpiBoard";
import Calendar from "./components/Calendar";
import type CalendarEvent from "../../interfaces/types/CalendarEvent";
import ScheduleService from "../../services/ScheduleService";

export default function Schedule() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const service = new ScheduleService();
            const data = await service.getEvents();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <div className={styles.schedule_container}>
            <div className={styles.title_container}>
                <h1>Agenda de visitas</h1>
                <button className={styles.schedule_btn}>
                    <FontAwesomeIcon icon={faPlus} />
                    Agendar
                </button>
            </div>

            <div className={styles.kpis}>
                <ScheduleKpiBoard events={events} />
            </div>

            <div className={styles.calendar_container}>
                <Calendar events={events} />
            </div>
        </div>
    );
}
