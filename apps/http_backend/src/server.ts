import express from "express";
import cors from "cors";
import logger from "./config/logger.config.js";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware.js";
import v1Router from "./routers/v1/index.js";
import { appErrorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(attachCorrelationIdMiddleware);

app.use("/api/v1", v1Router);
// app.use("/api/v2", v2Router);

// Add Error Handler
app.use(appErrorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server is running on http://localhost:${env.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});
