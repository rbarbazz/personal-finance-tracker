/// <reference types="react-scripts" />

declare interface User {
  fName: string;
  email: string;
  password: string;
}

declare interface Operation {
  operationDate: string;
  amount: number;
  label: string;
  categoryId: string;
}

declare interface Category {
  id: number;
  title: string;
}
