import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import AnalysisService from "../../../services/AnalysisService";
import type AcquisitionChannel from "../../../interfaces/types/AcquisitionChannel";
import { useEffect, useState } from "react";

export default function AcquisitionChannelsGraph() {
  const [channel, setChannel] = useState<AcquisitionChannel[]>([]);
  const service = new AnalysisService();

  useEffect(() => {
    service
      .getAcquisitionChannels()
      .then((data: AcquisitionChannel[]) => {
        setChannel(data);
      })
      .catch((e: any) => {
        console.error("Erro ao buscar dados de aquisicao:", e);
      });
  }, []);

  const series = [
    {
      name: "Dados",
      data: channel.map((ch) => ch.percentage),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    title: {
      text: "Canais de Aquisição",
      align: "center",
      style: {
        fontSize: "24px",
        fontWeight: 600,
        fontFamily: "Montserrat",
        color: "#484544",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
        distributed: true,
        dataLabels: { position: "center" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => `${val}%`,
      style: { colors: ["#fff"], fontSize: "24px", fontFamily: "Montserrat" },
    },

    yaxis: {
      show: false,
      labels: {
        style: { fontSize: "16px" },
      },
    },

    xaxis: {
      categories: ["Site", "Boca a Boca", "Rede Social"],
      labels: {
        show: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      max: 60,
    },

    legend: {
      show: true,
      fontSize: "24px",
      fontFamily: "Montserrat",
    },
    grid: { show: false },

    colors: ["#E47D26", "#1C6321", "#0033A0"],

    tooltip: {
      y: {
        formatter: (val: any) => `${val}%`,
      },
    },
  };

  return (
    <div id="acquisition-channels-chart">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
