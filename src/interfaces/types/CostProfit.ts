export default interface CostProfit {
  months: string[];
  series: {
    name: string;
    data: number[];
    color: string;
  }[];
}
