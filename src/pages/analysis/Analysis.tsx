import { useEffect, useState } from "react";
import AcquisitionChannelsGraph from "../../components/graphs/AcquisitionChannelsGraph";
import CostProfitGraph from "../../components/graphs/CostProfitGraph";
import ProjectStatusGraph from "../../components/graphs/ProjectsStatusGraph";
import SalesFunnelGraph from "../../components/graphs/SalesFunnelGraph";
import PageLayout from "../../components/layout/PageLayout";
import styles from "./Analysis.module.css";
import AnalysisFilter from "./AnalysisFilter";
import KpiBoard from "./KpiBoard";

export default function Analysis() {
  
  useEffect(() => {
  document.title = "Análises | SolarWay";
}, []);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <PageLayout
      title="Análises"
      rightActions={<AnalysisFilter onDateRangeChange={handleDateRangeChange} />}
    >

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
    </PageLayout>
  );
}
