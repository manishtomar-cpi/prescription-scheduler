import express, { Application } from "express";
import cors from "cors";
import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";

export const createApp = (): Application => {
  const app = express();

  // Core middleware
  app.use(cors());
  app.use(express.json());

  // Observability middleware
  app.use(requestId);
  app.use(requestLogger);

  // Routes will be added here

  return app;
};

const app = createApp();
export default app;
