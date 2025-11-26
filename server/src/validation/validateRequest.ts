import { Request, Response, NextFunction } from "express";
import { scheduleRequestSchema } from "./scheduleValidation";

export const validateScheduleRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = scheduleRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      issues: parsed.error.issues,
      requestId: req.requestId
    });
  }

  // Validated data overrides raw input for safety
  req.body = parsed.data;
  next();
};
