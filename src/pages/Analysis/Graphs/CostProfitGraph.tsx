import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type CostProfit from "../../../interfaces/types/CostProfit";
import AnalysisService from "../../../services/AnalysisService";
import { useEffect, useState } from "react";

export default function CostProfitGraph() {
  const [costProfit, setCostProfit] = useState<CostProfit>({
    months: [],
    series: [],
  });
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getProfitCostComparison()
      .then((data: any) => {
        const { months, series } = data;
        setCostProfit({ months, series });
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados de custo e lucro.", e);
      });
  }, []);

  const series = [
    {
      name: "Custo",
      data: costProfit?.series[0]?.data || [],
    },
    {
      name: "Lucro",
      data: costProfit?.series[1]?.data || [],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    title: {
      text: "Análise de Custo x Lucro",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#333",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["JAN", "FEV", "MAR"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `R$ ${(val / 1000).toFixed(0)}k`,
        style: {
          fontSize: "11px",
        },
      },
    },
    grid: {
      strokeDashArray: 4,
      borderColor: "#e5e7eb",
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    colors: ["#E47D26", "#1C6321"],
    tooltip: {
      y: {
        formatter: (val: { toLocaleString: (arg0: string) => any }) =>
          `R$ ${val.toLocaleString("pt-BR")}`,
      },
    },
  };

  return (
    <div id="cost-profit-chart">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
