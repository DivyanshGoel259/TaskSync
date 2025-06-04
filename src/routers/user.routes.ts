import { Router } from "express";
import { body } from "express-validator";
import * as controller from "../controllers/user.controller";
import { authMiddleware } from "../middelwares/authMiddleware";
import { managerOnly } from "../middelwares/roleMiddleware";

const userRouter = Router();

userRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
  ],
  controller.register
);

userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  controller.login
);


userRouter.get(
  '/:id',
  authMiddleware,
  controller.getUserById
);

userRouter.get(
  '/employees',
  authMiddleware,
  managerOnly,
  controller.getAllEmployees
);


export default userRouter;
