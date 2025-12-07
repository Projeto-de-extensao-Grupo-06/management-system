import Chart from "react-apexcharts";

export default function SalesFunnelGraph() {
  const data = [
    { label: "Leads", value: 80 },
    { label: "Pré Orçamento", value: 71 },
    { label: "Visita Técnica", value: 35 },
    { label: "Assinado", value: 20 },
  ];

  const series = [
    {
      name: "Etapas do funil",
      data: data.map((item) => item.value),
    },
  ];

  const options = {
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
        fontWeight: 600,
        color: "#333",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        isFunnel: true,
        isFunnel3d: false,
        funnelAlign: "center",
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
        fontWeight: 700,
        colors: ["#FFFFFF"],
      },
      textAnchor: "middle",
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
        formatter: (val: any, opts: { dataPointIndex: string | number }) => {
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
