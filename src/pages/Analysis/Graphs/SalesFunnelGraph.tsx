import Chart from "react-apexcharts";
import AnalysisService from "../../../services/AnalysisService";
import type SalesFunnel from "../../../interfaces/types/SalesFunnel";
import { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";

export default function SalesFunnelGraph() {
  const [funnel, setFunnel] = useState<SalesFunnel[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getSalesFunnel()
      .then((data: SalesFunnel[]) => {
        setFunnel(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados de funil.", e);
      });
  }, []);

  const series = [
    {
      name: "Funil",
      data: funnel.map((f) => f.value),
    },
  ];

  const data = [
    { label: "Leads" },
    { label: "Pré Orçamento" },
    { label: "Visita Técnica" },
    { label: "Assinado" },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
    },
    title: {
      text: "Funil de Conversão de Vendas",
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
        isFunnel: true,
        isFunnel3d: false,
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value, opts) => {
        const label = data[opts.dataPointIndex].label;
        return `${label}: ${value}`;
      },
      style: {
        fontSize: "14px",
        fontWeight: "700",
        colors: ["#FFFFFF"],
      },
    },
    xaxis: {
      categories: data.map((item) => item.label),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      max: 45,
    },
    yaxis: {
      labels: { show: false },
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          const label = data[opts.dataPointIndex].label;
          return `${label}: ${val}`;
        },
      },
    },
    colors: ["#D8691D", "#E7893B", "#EFA96A", "#F3BF87"],
  };

  return (
    <div id="sales-funnel-chart">
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
