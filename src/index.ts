import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.routes";
import { DbConnect } from "./lib/db";
import managerRouter from "./routers/manager.routes";
import employeeRouter from "./routers/employee.routes";
import { verify } from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT ;
const SOCKET_PORT = process.env.SOCKET_PORT;

const app = express();

DbConnect();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/manager", managerRouter);
app.use("/api/v1/employee", employeeRouter);

// Express error handler
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
  console.log(` Express server running on port ${PORT}`);
});


const socketApp = express(); 

const socketServer = http.createServer(socketApp);

export const io = new Server(socketServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    if (!JWT_SECRET) throw new Error("Please Provide Valid Secret Key");

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
    console.log(` User disconnected: ${userId}`);
  });
});

socketApp.get("/", (_, res) => {
  res.send("Socket server running");
});

socketServer.listen(SOCKET_PORT, () => {
  console.log(` Socket.IO server running on port ${SOCKET_PORT}`);
});

export { socketServer, onlineUsers };
