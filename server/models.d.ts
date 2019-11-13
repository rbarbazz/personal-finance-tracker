declare interface User {
  id: number;
  fName: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

declare interface Operation {
  id: number;
  operationDate: Date;
  amount: number;
  label: string;
  categoryId: string;
  userId: number;
}

declare interface Category {
  id: number;
  title: string;
}
