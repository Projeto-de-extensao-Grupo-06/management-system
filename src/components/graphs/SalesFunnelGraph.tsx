import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type SalesFunnel from "../../interfaces/types/SalesFunnel";
import AnalysisService from "../../services/AnalysisService";

interface SalesFunnelGraphProps {
  startDate?: string;
  endDate?: string;
}

export default function SalesFunnelGraph({ startDate, endDate }: SalesFunnelGraphProps) {
  const [funnel, setFunnel] = useState<SalesFunnel[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getSalesFunnel(startDate, endDate)
      .then((data: SalesFunnel[]) => {
        setFunnel(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados de funil.", e);
      });
  }, [startDate, endDate]);

  const series = [
    {
      name: "Funil",
      data: funnel.map((f) => f.value),
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
      text: "Funil de Conversão de Vendas",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#333",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 4,
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toString();
      },
      dropShadow: { enabled: false },
      style: {
        fontSize: "13px",
        colors: ["#fff"],
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: funnel.map((item) => item.stage),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontSize: "13px",
          fontWeight: 500,
          colors: ["#333"],
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } },
      padding: {
        top: 0,
        bottom: 0,
        left: 10,
        right: 10
      }
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    colors: ["#D8691D", "#E7893B", "#EFA96A", "#F3BF87"],
  };

  return (
    <div id="sales-funnel-chart">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
