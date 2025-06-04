import { NextFunction, Request, Response } from "express";
import { AuthResponse } from "../types";
import { validationResult } from "express-validator";
import * as service from "../services/employee.service";

export const getEmployeeTasks = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    const tasks = await service.getTasksAssignedToEmployee(userId);
    res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatusByEmployee = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error(JSON.stringify(errors.array()));

    const userId = (req as any).userId;
    const taskId = req.params.taskId;
    const { status } = req.body;

    const updated = await service.updateTaskStatusByEmployee(
      taskId,
      userId,
      status
    );
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
};
