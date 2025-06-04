import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user.model";
import { validationResult } from "express-validator";
import * as service from "../services/user.service";
import { AuthResponse } from "../types";

export const register = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    const data = await service.register(req.body);

    res.cookie("token", data.token);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    const data = await service.login(req.body);

    res.cookie("token", data.token);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};


export const getUserById = async (req: Request, res: Response<AuthResponse>, next: NextFunction):Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId).select('name email');
    if (!user) {
     res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};


export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await userModel.find({ role: 'Employee' }).select('name email');
    res.json({ data: employees });
  } catch (err) {
    next(err);
  }
};
