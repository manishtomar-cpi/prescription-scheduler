import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = 500;

  logger.error("Unhandled error", {
    requestId: req.requestId,
    error:
      err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : { message: String(err) }
  });

  res.status(statusCode).json({
    error: "Internal Server Error",
    requestId: req.requestId
  });
};
