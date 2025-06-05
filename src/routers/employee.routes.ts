import { Router } from "express";
import { body, param } from "express-validator";
import * as controller from "../controllers/employee.controller";
import { authMiddleware } from "../middelwares/authMiddleware";

const employeeRouter = Router();

// Get all tasks assigned to employee
employeeRouter.get("/my-tasks", authMiddleware, controller.getEmployeeTasks);

// Employee updates status of a task
employeeRouter.put(
  "/:taskId/status",
  authMiddleware,
  [
    param("taskId").isMongoId().withMessage("Invalid Task ID"),
    body("status")
      .isIn(["Pending", "In Progress", "Completed"])
      .withMessage("Invalid status value"),
  ],
  controller.updateTaskStatusByEmployee
);

export default employeeRouter;
