import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { getCorrelationId } from "../helpers/request.helper.js";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const output = {
        level,
        message,
        timestamp,
        correlationId: getCorrelationId(),
        meta,
      };

      return JSON.stringify(output);
    }),
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new DailyRotateFile({
      level: "info",
      filename: "logs/combined/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      level: "error",
      filename: "logs/error/error-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  );
}

// TODO: add logic to integrate and save logs in mongo

export default logger;
