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

    return newTask;
  } catch (err) {
    throw err;
  }
};
