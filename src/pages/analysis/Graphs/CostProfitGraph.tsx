import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type FinancialRecord from "../../../interfaces/types/FinancialRecord";
import AnalysisService from "../../../services/AnalysisService";

interface CostProfitGraphProps {
  startDate?: string;
  endDate?: string;
}

export default function CostProfitGraph({ startDate, endDate }: CostProfitGraphProps) {
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getFinancials(startDate, endDate)
      .then((data: FinancialRecord[]) => {
        setFinancials(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados de custo e lucro.", e);
      });
  }, [startDate, endDate]);

  const series = [
    {
      name: "Custo",
      data: financials.map((f) => f.totalCost),
    },
    {
      name: "Lucro",
      data: financials.map((f) => f.totalProfit),
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
        fontSize: "24px",
        fontWeight: 600,
        fontFamily: "Montserrat",
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
      categories: financials.map((f) => `${f.month}/${f.year}`),
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
        formatter: (val: number) =>
          `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      },
    },
  };

  return (
    <div id="cost-profit-chart">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
