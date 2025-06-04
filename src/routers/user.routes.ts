import { Router } from "express";
import { body } from "express-validator";
import * as controller from "../controllers/user.controller";

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

export default userRouter;
