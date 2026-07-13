import express from "express";
import cors from "cors";
import { serverConfig } from "./config/index.js";
import logger from "./config/logger.config.js";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware.js";
import v1Router from "./routers/v1/index.js";
import v2Router from "./routers/v2/index.js";
import { appErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(attachCorrelationIdMiddleware);

app.use("/api/v1", v1Router);
// app.use("/api/v2", v2Router);

// Add Error Handler
app.use(appErrorHandler);

app.listen(serverConfig.PORT, () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});
