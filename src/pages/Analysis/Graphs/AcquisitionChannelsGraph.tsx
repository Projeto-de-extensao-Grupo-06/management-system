import Chart from "react-apexcharts";

export default function AcquisitionChannelsGraph() {
  const series = [
    {
      name: "Canais de Aquisição",
      data: [52, 23, 25],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    title: {
      text: "Canais de Aquisição",
      align: "center",
      style: { fontSize: "20px", fontWeight: 600, color: "#484544" },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        distributed: true,
        dataLabels: { position: "center" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => `${val}%`,
      style: { colors: ["#fff"], fontSize: "12px" },
      offsetX: -6,
    },

    yaxis: {
      show: false,
      labels: {
        style: { fontSize: "16px" },
      },
    },

    xaxis: {
      categories: ["Site", "Boca a Boca", "Rede Social"],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      max: 60,
    },

    legend: { show: true },
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
      <Chart options={options} series={series} type="bar" height={200} />
    </div>
  );
}
