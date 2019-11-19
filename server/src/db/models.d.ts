export interface User {
  email: string;
  fName: string;
  password: string;
}
export interface UserDB extends User {
  created_at: Date;
  id: number;
  updated_at: Date;
}

export interface Operation {
  amount: number;
  categoryId: number;
  label: string;
  operationDate: Date | string;
  userId?: number;
}
export interface OperationDB extends Operation {
  id: number;
}
export interface OperationRow extends OperationDB {
  categoryTitle: string;
}

export interface Category {
  parentCategoryId: number;
  title: string;
}
export interface CategoryDB extends Category {
  id: number;
}
