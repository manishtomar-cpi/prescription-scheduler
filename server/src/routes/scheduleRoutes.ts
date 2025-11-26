import { Router } from "express";
import { calculateScheduleController } from "../controllers/scheduleController";
import { validateScheduleRequest } from "../validation/validateRequest";

const router = Router();

router.post("/schedule", validateScheduleRequest, calculateScheduleController);

export const scheduleRouter = router;
