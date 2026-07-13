import type { ZodObject } from "zod";
import logger from "../config/logger.config.js";
import type { NextFunction, Request, Response } from "express";

// Validate request body against a Zod schema
export const validateRequestBody = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating request body against schema");
      await schema.parseAsync(req.body);
      logger.info("Request body validation successful");
      next();
    } catch (error: any) {
      logger.error("Request body validation failed");
      logger.error(error);
      res.status(400).json({
        error: "Invalid request body",
        success: false,
        details: error.errors,
      });
    }
  };
};

// Validate query parameters against a Zod schema
export const validateQueryParams = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating query parameters against schema");
      await schema.parseAsync(req.query);
      logger.info("Query parameters validation successful");
      next();
    } catch (error: any) {
      logger.error("Query parameters validation failed");
      logger.error(error);
      res.status(400).json({
        error: "Invalid query parameters",
        success: false,
        details: error.errors,
      });
    }
  };
};
