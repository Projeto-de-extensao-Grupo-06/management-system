import Chart from "react-apexcharts";

export default function CostProfitGraph() {
  const series = [
    {
      name: "Custo",
      data: [1000, 500, 2000],
    },
    {
      name: "Lucro",
      data: [1500, 1000, 4000],
    },
  ];

  const options = {
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
        endingShape: "rounded",
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
      markers: {
        radius: 4,
      },
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
