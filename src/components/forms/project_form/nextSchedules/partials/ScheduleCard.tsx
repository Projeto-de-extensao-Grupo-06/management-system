import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faWrench, faStickyNote } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import type { Schedule } from "../../../../../interfaces/types/Schedule";
import CoworkerService from "../../../../../services/CoworkerService";
import styles from "../NextSchedules.module.css";

interface ScheduleCardProps {
    type: Schedule["type"];
    dateTime: string;
    responsibleId: number;
}

const coworkerService = new CoworkerService();

export default function ScheduleCard({
    type,
    dateTime,
    responsibleId
}: ScheduleCardProps) {
    const [coworkerName, setCoworkerName] = useState("");

    function resolveScheduleConfig(): {
        title: string;
        icon: IconDefinition;
        variant: "blue" | "pink" | "gray";
    } {
        switch (type) {
            case "TECHNICAL_VISIT":
                return {
                    title: "Visita Técnica",
                    icon: faHouse,
                    variant: "blue"
                };

            case "INSTALL_VISIT":
                return {
                    title: "Instalação",
                    icon: faWrench,
                    variant: "pink"
                };

            case "NOTE":
                return {
                    title: "Observação",
                    icon: faStickyNote,
                    variant: "gray"
                };

            default:
                return {
                    title: "Compromisso",
                    icon: faHouse,
                    variant: "blue"
                };
        }
    }

    const { title, icon, variant } = resolveScheduleConfig();

    const date = new Date(dateTime);

    const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const formattedTime = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    useEffect(() => {
        async function getCoworkerName() {
            console.log(responsibleId)
            const { firstName, lastName } = await coworkerService.getCoworkerById(responsibleId);

            setCoworkerName(`${firstName} ${lastName}`);
        }

        getCoworkerName();
    }, []);

    return (
        <div className={`${styles.card} ${styles[variant]}`}>
            <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={icon} />
                <span className={styles.cardTitle}>{title}</span>
            </div>

            <p><b>Data:</b> {formattedDate}</p>
            <p><b>Horário:</b> {formattedTime}</p>
            <p><b>Responsável:</b> {coworkerName}</p>
        </div>
    );
}
