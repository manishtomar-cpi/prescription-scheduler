import { Request, Response } from "express";

export const calculateScheduleController = (req: Request, res: Response) => {
  // for now, we only return placeholder response
  res.status(200).json({
    message: "Schedule calculation endpoint (Stage 1)",
    validatedInput: req.body,
    requestId: req.requestId
  });
};
