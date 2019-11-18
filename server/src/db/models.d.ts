export interface User {
  id?: number;
  fName: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Operation {
  id?: number;
  operationDate: Date | string;
  amount: number;
  label: string;
  categoryId: number;
  userId?: number;
}

export interface OperationRow extends Operation {
  categoryTitle: string;
}

export interface Category {
  id?: number;
  title: string;
  parentCategoryId: number;
}
