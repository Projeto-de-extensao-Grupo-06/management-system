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

import AcquisitionChannelsGraph from "./Graphs/AcquisitionChannelsGraph";
import CostProfitGraph from "./Graphs/CostProfitGraph";
import ProjectStatusGraph from "./Graphs/ProjectsStatusGraph";
import SalesFunnelGraph from "./Graphs/SalesFunnelGraph";
import { Input } from "../../components/ui/Form";

export default function Analysis() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState("Este Mes");

  function Kpi() {
    const [kpi, setKpi] = useState<Kpis>({
      mostCostlyChannel: "",
      totalProfitMargin: 0,
      projectCompletionRate: 0,
      funnelConversionRate: 0
    });

    const service = new AnalysisService();

    useEffect(() => {
      service
        .getKpis(startDate, endDate)
        .then((data: Kpis) => {
          if (data) {
            setKpi(data);
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

  function Filter() {
    const applyFilter = (filter: string) => {
      setSelectedFilter(filter);
      const today = new Date();
      let start = new Date();
      let end = new Date();

      if (filter === "Este Mes") {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      } else if (filter === "Este Trimestre") {
        const currentQuarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), currentQuarter * 3, 1);
        end = new Date(today.getFullYear(), currentQuarter * 3 + 3, 0);
      } else if (filter === "Este Ano") {
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
      } else if (filter === "Selecionar Periodo") {
        return;
      }

      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    };

    // Initial load
    useEffect(() => {
      if (selectedFilter !== "Selecionar Periodo") {
        applyFilter(selectedFilter);
      }
    }, []);


    return (
      <>
        <div
          className={styles.filter_container}
          onClick={() => applyFilter("Este Mes")}
          style={{
            backgroundColor: selectedFilter === "Este Mes" ? "#125F0B" : "",
            color: selectedFilter === "Este Mes" ? "#FFF" : "",
            cursor: "pointer",
          }}
        >
          <b>Este Mês</b>
        </div>
        <div
          className={styles.filter_container}
          onClick={() => applyFilter("Este Trimestre")}
          style={{
            backgroundColor:
              selectedFilter === "Este Trimestre" ? "#125F0B" : "",
            color: selectedFilter === "Este Trimestre" ? "#FFF" : "",
            cursor: "pointer",
          }}
        >
          <b>Este Trimestre</b>
        </div>
        <div
          className={styles.filter_container}
          onClick={() => applyFilter("Este Ano")}
          style={{
            backgroundColor: selectedFilter === "Este Ano" ? "#125F0B" : "",
            color: selectedFilter === "Este Ano" ? "#FFF" : "",
            cursor: "pointer",
          }}
        >
          <b>Este Ano</b>
        </div>
        <div
          className={styles.filter_container}
          onClick={() => setSelectedFilter("Selecionar Periodo")}
          style={{
            backgroundColor:
              selectedFilter === "Selecionar Periodo" ? "#125F0B" : "",
            color: selectedFilter === "Selecionar Periodo" ? "#FFF" : "",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FontAwesomeIcon icon={faCalendarDays} />
          <b>Selecionar Periodo</b>
        </div>

        {selectedFilter === "Selecionar Periodo" && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '0px' }}>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ height: '40px', padding: '5px' }}
            />
            <span>até</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ height: '40px', padding: '5px' }}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className={styles.title_container}>
        <h1>Análises</h1>
        <div className={styles.filters}>
          <Filter />
        </div>
      </div>

      <div className={styles.kpis}>
        <Kpi />
      </div>

      <div className={styles.graphs}>
        <div className={styles.graph_container}>
          <AcquisitionChannelsGraph startDate={startDate} endDate={endDate} />
        </div>
        <div className={styles.graph_container}>
          <CostProfitGraph startDate={startDate} endDate={endDate} />
        </div>
        <div className={styles.graph_container}>
          <ProjectStatusGraph startDate={startDate} endDate={endDate} />
        </div>
        <div className={styles.graph_container}>
          <SalesFunnelGraph startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </>
  );
}
