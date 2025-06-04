import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as service from "../services/manager.service";
import { AuthResponse } from "../types";

export const createTask = async (
  req: Request,
  res: Response<AuthResponse>,
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

export const updateTask = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    const updated = await service.updateTask(
      req.params.taskId,
      req.body,
      (req as any).userId
    );
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    const data = await service.deleteTask(
      req.params.taskId,
      (req as any).userId
    );
    res.json({ data });
  } catch (err) {
    next(err);
  }
};



export const getTasksCreatedByManager = async (req: Request, res: Response<AuthResponse>, next: NextFunction) => {
  try {
    const managerId = (req as any).userId;
    const tasks = await service.getTasksCreatedByManager(managerId);
    res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
};
