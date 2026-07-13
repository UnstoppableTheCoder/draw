import type { Request, Response } from "express";

export const pingHandler = (req: Request, res: Response) => {
  const message = req.body.message || "Pong!";
  res.status(200).json({ message });
};
