import { onlineUsers } from "../index";

// Notify assigned employee
export const notifyAssignedUser = (userId: string, data: any) => {
  const socket = onlineUsers.get(userId);
  if (socket) {
    socket.emit("task-assigned", data);
  }
};

// Notify task owner (manager)
export const notifyManager = (managerId: string, data: any) => {
  const socket = onlineUsers.get(managerId);
  if (socket) {
    socket.emit("task-updated", data);
  }
};
