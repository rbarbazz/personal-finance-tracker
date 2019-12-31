export interface User {
  createdAt: Date;
  email: string;
  fName: string;
  id: number;
  isActive: boolean;
  password: string;
  updatedAt: Date | Raw<any>;
}

export interface Operation {
  amount: number;
  categoryId: number;
  categoryTitle?: string;
  id: number;
  label: string;
  operationDate: Date | string;
  parentCategoryId: number;
  userId: number;
}

export interface Category {
  id: number;
  parentCategoryId: number;
  title: string;
}

export interface Budget {
  amount: number;
  budgetDate: Date;
  categoryId: number;
  categoryTitle?: string;
  id: number;
  userId: number;
}

export interface FireParams {
  age: number;
  expectedRoi: number;
  expenses: number;
  id: number;
  incomes: number;
  netWorth: number;
  savingsRate: number;
  userId: number;
}
