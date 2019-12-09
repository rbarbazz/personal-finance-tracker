declare namespace Express {
  export interface Request {
    user?: {
      fName: string;
      id: number;
    };
  }
}
