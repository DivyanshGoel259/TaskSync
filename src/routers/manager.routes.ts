import { Router } from "express";
import { body } from "express-validator";
import * as controller from "../controllers/manager.controller";
import { authMiddleware } from "../middelwares/authMiddleware";
import { managerOnly } from "../middelwares/roleMiddleware";

const taskRouter = Router();

taskRouter.post(
  "/",
  authMiddleware,
  managerOnly,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("assignedTo").notEmpty().withMessage("AssignedTo is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
  ],
  controller.createTask
);

export default taskRouter;
