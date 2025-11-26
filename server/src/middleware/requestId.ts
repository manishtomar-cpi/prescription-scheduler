import { NextFunction, Request, Response } from "express";

const generateRequestId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
};

export const requestId = (req: Request, _res: Response, next: NextFunction) => {
  req.requestId = generateRequestId();
  next();
};
