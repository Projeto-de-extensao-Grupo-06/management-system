import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import type { Schedule } from "../../../../interfaces/types/Schedule";
import ScheduleService from "../../../../services/ScheduleService";
import styles from "./NextSchedules.module.css";
import ScheduleCard from "./partials/ScheduleCard";

const scheduleService = new ScheduleService();

interface NextSchedulesProps {
    projectId: number;
}

export default function NextSchedules({ projectId }: NextSchedulesProps) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchSchedules();
    }, [projectId]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>Próximos compromissos</span>
                </div>

                <button className={styles.editButton}>
                    Editar
                </button>
            </div>

            {loading && <p>Carregando...</p>}

            {!loading &&
                schedules.map((schedule) => {
                    return (
                        <ScheduleCard
                            key={schedule.id}
                            type={schedule.type}
                            dateTime={schedule.startDate}
                            responsibleId={schedule.coworkerId}
                        />
                    )
                })}

            {!loading && schedules.length === 0 && (
                <p>Nenhum compromisso encontrado.</p>
            )}
        </div>
    );
}
