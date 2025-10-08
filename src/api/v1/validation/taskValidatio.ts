import Joi from "joi";

export const createTaskSchema = Joi.object({
  userId: Joi.string().trim().required(),
  title: Joi.string().trim().min(1).max(120).required(),
  priority: Joi.string().valid("low", "medium", "high").default("low"),
  status: Joi.string().valid("open", "in-progress", "completed").default("open"),
  dueDate: Joi.date().iso().required(),
});
