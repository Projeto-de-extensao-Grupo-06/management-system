import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./KpiCard.module.css";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: IconDefinition;
    iconColor?: string;
}

export default function KpiCard({ title, value, icon, iconColor = "#fff" }: KpiCardProps) {
    return (
        <div className={styles.kpi_container}>
            <div className={styles.kpi_content}>
                <div className={styles.kpi_icon}>
                    <FontAwesomeIcon icon={icon} color={iconColor} />
                </div>
                <b>{title}</b>
            </div>
            <p className={styles.kpi_value}>{value}</p>
        </div>
    );
}
