import styles from "./Analysis.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faDollarSign,
  faCalendarDays,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import clsx from "clsx";
import AcquisitionChannelsGraph from "./Graphs/AcquisitionChannelsGraph";
import CostProfitGraph from "./Graphs/CostProfitGraph";
import ProjectStatusGraph from "./Graphs/ProjectsStatusGraph";
import SalesFunnelGraph from "./Graphs/SalesFunnelGraph";

export default function Analysis() {
  function Kpi() {
    return (
      <>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faArrowTrendUp} color="#fff" />
            </div>
            <p>Canal Mais Custoso</p>
          </div>
          <p>Site</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faDollarSign} color="#fff" />
            </div>
            <p>Margem Lucro</p>
          </div>
          <p>R$ 57.000</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faCalendarDays} color="#fff" />
            </div>
            <p>Finalização Projetos</p>
          </div>
          <p>33%</p>
        </div>
        <div className={styles.kpi_container}>
          <div className={styles.kpi_content}>
            <div className={styles.kpi_icon}>
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </div>
            <p>Conversão Funil</p>
          </div>
          <p>25%</p>
        </div>
      </>
    );
  }

  function Filter() {
    return (
      <>
        <div className={styles.filter_container}>
          <p>Este Mes</p>
        </div>
        <div className={styles.filter_container}>
          <p>Este Semestre</p>
        </div>
        <div className={styles.filter_container}>
          <p>Este Ano</p>
        </div>
        <div className={styles.filter_container}>
          <p>Selecionar Periodo</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.title_container}>
        <h1>Analises</h1>
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
