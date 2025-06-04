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
