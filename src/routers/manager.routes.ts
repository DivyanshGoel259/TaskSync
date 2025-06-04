import { Router } from "express";
import { body, param } from "express-validator";
import * as controller from "../controllers/manager.controller";
import { authMiddleware } from "../middelwares/authMiddleware";
import { managerOnly } from "../middelwares/roleMiddleware";

const managerRouter = Router();

managerRouter.post(
  "/create",
  authMiddleware,
  managerOnly,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("assignedTo").isMongoId().withMessage("AssignedTo is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
  ],
  controller.createTask
);

managerRouter.put(
  "/:taskId",
  authMiddleware,
  managerOnly,
  [
    param("taskId").isMongoId().withMessage("Invalid Task ID"),
    body("title").optional().notEmpty(),
    body("description").optional(),
    body("status").optional().isIn(["Pending", "In Progress", "Completed"]),
    body("dueDate").optional().isISO8601(),
    body("assignedTo").optional().isMongoId(),
  ],
  controller.updateTask
);

// Delete Task
managerRouter.delete(
  "/:taskId",
  authMiddleware,
  managerOnly,
  [param("taskId").isMongoId().withMessage("Invalid Task ID")],
  controller.deleteTask
);


managerRouter.get(
  "/created",
  authMiddleware,
  managerOnly,
  controller.getTasksCreatedByManager
);


export default managerRouter;
