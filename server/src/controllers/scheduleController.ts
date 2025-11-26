import { Request, Response } from "express";
import { computeSchedule } from "../services/scheduleService";

export const calculateScheduleController = (req: Request, res: Response) => {
  const schedule = computeSchedule(req.body);

  res.status(200).json({
    schedule,
    requestId: req.requestId
  });
};
