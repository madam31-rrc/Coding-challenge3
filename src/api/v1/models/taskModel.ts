export interface Task {
    id?: string;
    userId: string;
    title: string;
    priority: "low" | "medium" | "high";
    status: "open" | "in-progress" | "completed";
    dueDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}