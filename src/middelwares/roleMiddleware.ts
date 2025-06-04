import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user.model";

export const managerOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await userModel.findById(userId);

    if (!user || user.role !== "Manager") {
      // Throw error instead of returning a response
      throw new Error("Access denied: Managers only");
    }

    next(); // Call next only if allowed
  } catch (err) {
    next(err); // Pass errors to Express error handler
  }
};
