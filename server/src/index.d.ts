declare namespace Express {
  export interface Request {
    user?: {
      fName: string;
      id: number;
      password: string;
    };
  }
}
