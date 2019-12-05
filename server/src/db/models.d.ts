export interface User {
  createdAt: Date;
  email: string;
  fName: string;
  id: number;
  password: string;
  updatedAt: Date;
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
