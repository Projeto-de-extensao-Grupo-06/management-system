import { useState } from "react";
import styles from "./Analysis.module.css";
import AnalysisFilter from "./AnalysisFilter";
import AcquisitionChannelsGraph from "./Graphs/AcquisitionChannelsGraph";
import CostProfitGraph from "./Graphs/CostProfitGraph";
import ProjectStatusGraph from "./Graphs/ProjectsStatusGraph";
import SalesFunnelGraph from "./Graphs/SalesFunnelGraph";
import KpiBoard from "./KpiBoard";

export default function Analysis() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <div className={styles.title_container}>
        <h1>Análises</h1>
        <AnalysisFilter onDateRangeChange={handleDateRangeChange} />
      </div>

      <div className={styles.kpis}>
        <KpiBoard startDate={startDate} endDate={endDate} />
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
