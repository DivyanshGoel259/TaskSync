import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.routes";
import { DbConnect } from "./lib/db";
import managerRouter from "./routers/manager.routes";
import employeeRouter from "./routers/employee.routes";
import http from "http";
import { Server } from "socket.io";
import { verify } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

DbConnect();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/manager", managerRouter);
app.use("/api/v1/employee", employeeRouter);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    if (!JWT_SECRET) {
      throw new Error("Please Provide Valid Secret Key");
    }
    const decoded: any = verify(token, JWT_SECRET);
    (socket as any).userId = decoded._id;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  console.log(`User connected: ${userId}`);
  onlineUsers.set(userId, socket);

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

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



server.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});



export { server, onlineUsers };
