import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { asyncLocalstorage } from "../helpers/request.helper.js";

export const attachCorrelationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const correlationId = uuidv4();

  asyncLocalstorage.run({ correlationId }, () => {
    next();
  });
};
