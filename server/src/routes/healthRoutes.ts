import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy"
  });
});

export const healthRouter = router;
