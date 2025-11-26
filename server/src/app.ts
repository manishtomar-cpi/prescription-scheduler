import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { healthRouter } from "./routes/healthRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { scheduleRouter } from "./routes/scheduleRoutes";
import { configRouter } from "./routes/configRoutes";

export const createApp = (): Application => {
  const app = express();

  // Core middleware
  app.use(cors());
  app.use(express.json());

  // Observability middleware
  app.use(requestId);
  app.use(requestLogger);

  // Routes
  app.use("/api", healthRouter);
  app.use("/api", scheduleRouter);
  app.use("/api", configRouter);

  // 404 handler for unknown routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: "Not Found",
      path: req.originalUrl,
      requestId: req.requestId,
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};

const app = createApp();
export default app;
