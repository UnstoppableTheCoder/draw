import type { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../../utils/errors/app.error.js";

export const getHealth = (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Everything's up and running" });
  } catch (error) {
    next(error);
  }
};
