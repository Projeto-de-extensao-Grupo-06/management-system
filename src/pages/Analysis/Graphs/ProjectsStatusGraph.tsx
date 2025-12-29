import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type ProjectStatus from "../../../interfaces/types/ProjectStatus";
import AnalysisService from "../../../services/AnalysisService";

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
        barHeight: "70%",
        borderRadius: 4,
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString(),
      offsetY: 10,
      style: {
        fontSize: "2rem",
        fontFamily: "Montserrat",
        fontWeight: "700",
        colors: ["#FFF"],
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
          fontSize: "1.2rem",
          fontFamily: "Montserrat",
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
