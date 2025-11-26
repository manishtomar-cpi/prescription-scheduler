import express, { Application } from "express";
import cors from "cors";

export const createApp = (): Application => {
  const app = express();

  // core middleware
  app.use(cors());
  app.use(express.json());

  // Routes will be added here

  return app;
};

const app = createApp();
export default app;
