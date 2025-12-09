import styles from "./ProjectStatus.module.css";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import AnalysisService from "../../../services/AnalysisService";
import { useEffect, useState } from "react";
import type ProjectStatus from "../../../interfaces/types/ProjectStatus";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function ProjectStatusGraph() {
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getProjectsStatus()
      .then((data: ProjectStatus[]) => {
        setProjectStatus(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados do status do projeto", e);
      });
  }, []);

  const data = [
    { label: "Em andamento" },
    { label: "Agendado" },
    { label: "Finalizado" },
  ];

  const series = [
    {
      data: projectStatus.map((p) => p.quantity),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    title: {
      text: "Projetos por Status",
      align: "center",
      style: {
        fontSize: "24px",
        fontWeight: "600",
        fontFamily: "Montserrat",
        color: "#333",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: "40%",
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString(),
      offsetX: 30,
      style: {
        fontSize: "12px",
        fontWeight: "600",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: projectStatus.map((p) => p.status),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontSize: "14px",
          colors: ["#666"],
        },
      },
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    colors: projectStatus.map((p) => p.color),
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val} projetos`,
      },
    },
  };

  return (
    <div id="project-status-chart">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
