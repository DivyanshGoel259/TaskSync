import mongoose, { Types } from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  assignedTo: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true, // the manager who created the task
  },
  createdAt: Date,
  updatedAt: Date,
});

export const taskModel = mongoose.model("task", taskSchema);
