export default interface Kpis {
  mostExpensiveChannel: {
    name: string;
    icon: string;
  };

  profitMargin: {
    value: number;
    currency: string;
    format: string;
  };

  projectCompletionPercent: {
    value: number;
    suffix: string;
  };

  funnelConversionPercent: {
    value: number;
    suffix: string;
  };
}
