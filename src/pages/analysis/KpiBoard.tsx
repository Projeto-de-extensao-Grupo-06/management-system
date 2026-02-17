import {
    faArrowTrendUp,
    faDollarSign,
    faCalendarDays,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import type Kpis from "../../interfaces/types/Kpis";
import AnalysisService from "../../services/AnalysisService";
import KpiCard from "../../components/ui/KpiCard";

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
            <KpiCard
                title="Canal Mais Custoso"
                value={kpi.mostCostlyChannel || "N/A"}
                icon={faArrowTrendUp}
            />
            <KpiCard
                title="Margem Lucro"
                value={kpi.totalProfitMargin?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                icon={faDollarSign}
            />
            <KpiCard
                title="Finalização Projetos"
                value={`${kpi.projectCompletionRate?.toFixed(2)}%`}
                icon={faCalendarDays}
            />
            <KpiCard
                title="Conversão Funil"
                value={`${kpi.funnelConversionRate?.toFixed(2)}%`}
                icon={faFilter}
            />
        </>
    );
}
