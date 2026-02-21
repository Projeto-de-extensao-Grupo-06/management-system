import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type ProjectStatus from "../../interfaces/types/ProjectStatus";
import AnalysisService from "../../services/AnalysisService";
import { getProjectStatusLabel } from "../../utils/mappers/StatusMapper";

interface ProjectStatusGraphProps {
  startDate?: string;
  endDate?: string;
}

export default function ProjectStatusGraph({ startDate, endDate }: ProjectStatusGraphProps) {
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getProjectsStatus(startDate, endDate)
      .then((data: ProjectStatus[]) => {
        setProjectStatus(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados do status do projeto", e);
      });
  }, [startDate, endDate]);

  const series = [
    {
      data: projectStatus.map((p) => p.count),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Montserrat, sans-serif",
    },
    title: {
      text: "Projetos por Status",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#333",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: "60%",
        borderRadius: 4,
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "middle",
      formatter: (val: number) => {
        return val.toString();
      },
      offsetX: 0,
      offsetY: -2,
      dropShadow: { enabled: false },
      style: {
        fontSize: "14px",
        fontFamily: "Montserrat",
        fontWeight: "600",
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: projectStatus.map((p) => getProjectStatusLabel(p.status)),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'left',
        style: {
          fontSize: "13px",
          fontWeight: 500,
          colors: ["#333"],
        },
        formatter: (value: string | number) => {
          return getProjectStatusLabel(value.toString());
        }
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } },
      padding: {
        left: 10,
        right: 10
      }
    },
    legend: {
      show: false,
    },
    colors: ["#125F0B", "#E47D26", "#0033A0", "#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845"],
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val} projetos`,
      },
    },
  };

  return (
    <div id="project-status-chart">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
