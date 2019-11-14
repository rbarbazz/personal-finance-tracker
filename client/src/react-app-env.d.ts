/// <reference types="react-scripts" />

declare interface User {
  fName: string;
  email: string;
  password: string;
}

declare interface Operation {
  id?: number;
  operationDate: string;
  amount: number;
  label: string;
  categoryId: number;
  title?: Category.title;
}

declare interface Category {
  id: number;
  title: string;
}
