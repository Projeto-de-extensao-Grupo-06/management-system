import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type AcquisitionChannel from "../../interfaces/types/AcquisitionChannel";
import AnalysisService from "../../services/AnalysisService";

interface AcquisitionChannelsGraphProps {
  startDate?: string;
  endDate?: string;
}

export default function AcquisitionChannelsGraph({ startDate, endDate }: AcquisitionChannelsGraphProps) {
  const [channel, setChannel] = useState<AcquisitionChannel[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getAcquisitionChannels(startDate, endDate)
      .then((data: AcquisitionChannel[]) => {
        setChannel(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados de aquisicao:", e);
      });
  }, [startDate, endDate]);

  const series = [
    {
      name: "Dados",
      data: channel.map((ch) => ch.percentage),
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
      text: "Canais de Aquisição",
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
        distributed: true,
        borderRadius: 4,
        dataLabels: { position: "center" },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "middle",
      style: { colors: ["#fff"], fontSize: "14px", fontWeight: 600 },
      formatter: function (val) {
        return val + "%";
      },
      offsetX: 0,
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
    xaxis: {
      categories: channel.map((ch) => ch.name),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      max: 100,
    },
    legend: {
      show: false,
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
    colors: ["#E47D26", "#1C6321", "#0033A0", "#FFC300", "#FF5733"],
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: any) => `${val}%`,
      },
    },
  };

  return (
    <div id="acquisition-channels-chart">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
