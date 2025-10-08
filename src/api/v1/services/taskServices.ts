import { Task } from "../models/taskModel";

export async function createTask(input: any): Promise<Task> {
  const now = new Date();
  return {
    id: "temp-id",
    userId: String(input?.userId ?? ""),
    title: String(input?.title ?? ""),
    priority: (input?.priority ?? "low") as Task["priority"],
    status: (input?.status ?? "open") as Task["status"],
    dueDate: input?.dueDate ? new Date(input.dueDate) : new Date(),
    createdAt: now,
    updatedAt: now,
  };
}
