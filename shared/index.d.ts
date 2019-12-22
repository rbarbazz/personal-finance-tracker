export type LineChartData = {
  id: string;
  data: { x: string; y: number }[];
}[];

export type BarChartData = {
  data: object[];
  keys: string[];
};
