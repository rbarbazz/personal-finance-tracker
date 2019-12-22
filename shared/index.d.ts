// Chart data types
export type LineChartData = {
  id: string;
  data: { x: string; y: number }[];
}[];

export type BarChartData = {
  data: object[];
  keys: string[];
};

export type TreeMapChartNode = {
  categoryId: number;
  children?: TreeMapChartNode[];
  sum?: number;
  title: string;
};

// Budget Category Type
export type BudgetCategoryType = {
  amount: number;
  categoryId: number;
  title: string;
};
