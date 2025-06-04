import { taskModel } from "../models/task.model";

enum status {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export const getTasksAssignedToEmployee = async (employeeId: string) => {
  try {
    const tasks = await taskModel
      .find({ assignedTo: employeeId })
      .sort({ dueDate: 1 });
    return tasks;
  } catch (err) {
    throw err;
  }
};

export const updateTaskStatusByEmployee = async (
  taskId: string,
  employeeId: string,
  status: status
) => {
  try {
    const task = await taskModel.findOne({
      _id: taskId,
      assignedTo: employeeId,
    });
    if (!task) throw new Error("Task not found or unauthorized");

    task.status = status;
    task.updatedAt = new Date();
    await task.save();

    return task;
  } catch (err) {
    throw err;
  }
};
