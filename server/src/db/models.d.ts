export interface User {
  created_at: Date;
  email: string;
  fName: string;
  id: number;
  password: string;
  updated_at: Date;
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
  categoryId: number;
  categoryTitle?: string;
  id: number;
  userId: number;
}
