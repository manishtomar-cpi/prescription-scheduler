import { Router } from "express";
import { getConfigController } from "../controllers/configController";

const router = Router();

router.get("/config", getConfigController);

export const configRouter = router;
