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
import { useState } from "react";

export default function Analysis() {
  function Kpi() {
    return (
      <>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faArrowTrendUp} color="#fff" />
            </div>
            <b>Canal Mais Custoso</b>
          </div>
          <p>Site</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faDollarSign} color="#fff" />
            </div>
            <b>Margem Lucro</b>
          </div>
          <p>R$ 57.000</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faCalendarDays} color="#fff" />
            </div>
            <b>Finalização Projetos</b>
          </div>
          <p>33%</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </div>
            <b>Conversão Funil</b>
          </div>
          <p>25%</p>
        </div>
      </>
    );
  }

  const [selectedFilter, setSelectedFilter] = useState("Este Mes");

  function Filter() {
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
