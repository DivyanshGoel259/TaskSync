import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.routes";
import { DbConnect } from "./lib/db";

dotenv.config();

const app = express();

DbConnect();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    error: {
      message: err.message || "something went wrong",
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.json("Connection Established");
});

app.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
