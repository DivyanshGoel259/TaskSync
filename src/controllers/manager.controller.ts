import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as service from "../services/manager.service";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    const createdBy = (req as any).userId;
    const data = await service.createTask({ ...req.body, createdBy });

    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
};
