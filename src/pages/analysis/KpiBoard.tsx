import {
    faArrowTrendUp,
    faDollarSign,
    faCalendarDays,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import type Kpis from "../../interfaces/types/Kpis";
import AnalysisService from "../../services/AnalysisService";
import styles from "./Analysis.module.css";

interface KpiBoardProps {
    startDate?: string;
    endDate?: string;
}

export default function KpiBoard({ startDate, endDate }: KpiBoardProps) {
    const [kpi, setKpi] = useState<Kpis>({
        mostCostlyChannel: "",
        totalProfitMargin: 0,
        projectCompletionRate: 0,
        funnelConversionRate: 0
    });

    const service = new AnalysisService();

    useEffect(() => {
        const start = startDate === "" ? undefined : startDate;
        const end = endDate === "" ? undefined : endDate;

        service
            .getKpis(start, end)
            .then((data: Kpis) => {
                if (data) {
                    const formattedChannel = data.mostCostlyChannel
                        ? data.mostCostlyChannel.replace(/_/g, " ").toLowerCase()
                            .replace(/\b\w/g, l => l.toUpperCase())
                        : "N/A";

                    setKpi({ ...data, mostCostlyChannel: formattedChannel });
                }
            })
            .catch((e: any) => {
                console.error("Erro ao coletar os dados de kpis.", e);
            });
    }, [startDate, endDate]);

    return (
        <>
            <div className={styles.kpi_container}>
                <div className={styles.kpi_content}>
                    <div className={styles.kpi_icon}>
                        <FontAwesomeIcon icon={faArrowTrendUp} color="#fff" />
                    </div>
                    <b>Canal Mais Custoso</b>
                </div>
                <p className={styles.kpi_value}>{kpi.mostCostlyChannel || "N/A"}</p>
            </div>
            <div className={styles.kpi_container}>
                <div className={styles.kpi_content}>
                    <div className={styles.kpi_icon}>
                        <FontAwesomeIcon icon={faDollarSign} color="#fff" />
                    </div>
                    <b>Margem Lucro</b>
                </div>
                <p className={styles.kpi_value}>
                    {kpi.totalProfitMargin?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
            </div>
            <div className={styles.kpi_container}>
                <div className={styles.kpi_content}>
                    <div className={styles.kpi_icon}>
                        <FontAwesomeIcon icon={faCalendarDays} color="#fff" />
                    </div>
                    <b>Finalização Projetos</b>
                </div>
                <p className={styles.kpi_value}>
                    {kpi.projectCompletionRate?.toFixed(2)}%
                </p>
            </div>
            <div className={styles.kpi_container}>
                <div className={styles.kpi_content}>
                    <div className={styles.kpi_icon}>
                        <FontAwesomeIcon icon={faFilter} color="#fff" />
                    </div>
                    <b>Conversão Funil</b>
                </div>
                <p className={styles.kpi_value}>
                    {kpi.funnelConversionRate?.toFixed(2)}%
                </p>
            </div>
        </>
    );
}
