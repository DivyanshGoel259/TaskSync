import { notifyAssignedUser } from "../lib/utils";
import { taskModel } from "../models/task.model";

interface TaskInput {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  createdBy: string;
}

export const createTask = async ({
  title,
  description,
  assignedTo,
  dueDate,
  createdBy,
}: TaskInput) => {
  try {
    if (!title || !assignedTo || !dueDate || !createdBy) {
      throw new Error("All feilds are required");
    }

    const newTask = await taskModel.create({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newTask.save();
    notifyAssignedUser(assignedTo, {
      message: "You have a new task assigned",
      task: newTask,
    });

    return newTask;
  } catch (err) {
    throw err;
  }
};

export const updateTask = async (
  taskId: string,
  data: any,
  managerId: string
) => {
  try {
    const task = await taskModel.findOne({ _id: taskId, createdBy: managerId });
    if (!task) throw new Error("Task not found or unauthorized");

    Object.assign(task, data, { updatedAt: new Date() });
    await task.save();

    return task;
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (taskId: string, managerId: string) => {
  try {
    const task = await taskModel.findOneAndDelete({
      _id: taskId,
      createdBy: managerId,
    });
    if (!task) throw new Error("Task not found or unauthorized");
    return task;
  } catch (err) {
    throw err;
  }
};

export const getTasksCreatedByManager = async (managerId: string) => {
  try {
    const tasks = await taskModel.find({ createdBy: managerId });
    return tasks;
  } catch (err) {
    throw err;
  }
};
