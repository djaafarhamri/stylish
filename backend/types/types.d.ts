import { Request } from "express";

declare module "express-serve-static-core" {
  export interface Request {
    userId: string;
  }
}

declare module "express" {
  export interface Request {
    userId: string;
  }
}
