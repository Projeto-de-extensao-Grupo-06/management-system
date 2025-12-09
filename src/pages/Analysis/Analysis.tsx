import styles from "./Analysis.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faDollarSign,
  faCalendarDays,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import AcquisitionChannelsGraph from "./Graphs/AcquisitionChannelsGraph";
import CostProfitGraph from "./Graphs/CostProfitGraph";
import ProjectStatusGraph from "./Graphs/ProjectsStatusGraph";
import SalesFunnelGraph from "./Graphs/SalesFunnelGraph";
import { useEffect, useState } from "react";
import AnalysisService from "../../services/AnalysisService";
import type Kpis from "../../interfaces/types/Kpis";

export default function Analysis() {
  function Kpi() {
    const [kpi, setKpi] = useState<Kpis>({
      mostExpensiveChannel: {
        name: "",
        icon: "",
      },
      profitMargin: {
        value: 0,
        currency: "",
        format: "",
      },
      projectCompletionPercent: {
        value: 0,
        suffix: "",
      },
      funnelConversionPercent: {
        value: 0,
        suffix: "",
      },
    });

    const service = new AnalysisService();

    useEffect(() => {
      service
        .getKpis()
        .then((data: any) => {
          if (data && data.length > 0) {
            setKpi(data[0]);
          }
          console.log("Dados:", data);
        })
        .catch((e: any) => {
          console.error("Erro ao coletar os dados de kpis.", e);
        });
    }, []);

    return (
      <>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faArrowTrendUp} color="#fff" />
            </div>
            <b>Canal Mais Custoso</b>
          </div>
          <p>{kpi.mostExpensiveChannel?.name}</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faDollarSign} color="#fff" />
            </div>
            <b>Margem Lucro</b>
          </div>
          <p>R$ {kpi.profitMargin?.value},00</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faCalendarDays} color="#fff" />
            </div>
            <b>Finalização Projetos</b>
          </div>
          <p>{kpi.projectCompletionPercent?.value}%</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </div>
            <b>Conversão Funil</b>
          </div>
          <p>{kpi.funnelConversionPercent?.value}%</p>
        </div>
      </>
    );
  }

  function Filter() {
    const [selectedFilter, setSelectedFilter] = useState("Este Mes");
    return (
      <>
        <div
          className={styles.filter_container}
          onClick={() => setSelectedFilter("Este Mes")}
          style={{
            backgroundColor: selectedFilter === "Este Mes" ? "#125F0B" : "",
            color: selectedFilter === "Este Mes" ? "#FFF" : "",
            cursor: "pointer",
          }}
        >
          <b>Este Mes</b>
        </div>
        <div
          className={styles.filter_container}
          onClick={() => setSelectedFilter("Este Semestre")}
          style={{
            backgroundColor:
              selectedFilter === "Este Semestre" ? "#125F0B" : "",
            color: selectedFilter === "Este Semestre" ? "#FFF" : "",
            cursor: "pointer",
          }}
        >
          <b>Este Trimestre</b>
        </div>
        <div
          className={styles.filter_container}
          onClick={() => setSelectedFilter("Este Ano")}
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
          <AcquisitionChannelsGraph />
        </div>
        <div className={styles.graph_container}>
          <CostProfitGraph />
        </div>
        <div className={styles.graph_container}>
          <ProjectStatusGraph />
        </div>
        <div className={styles.graph_container}>
          <SalesFunnelGraph />
        </div>
      </div>
    </>
  );
}
