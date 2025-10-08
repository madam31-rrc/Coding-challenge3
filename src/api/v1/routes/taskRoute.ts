import { Router } from "express";
import { createTask } from "../controllers/taskController";
import { validateBody } from "../../../middleware/validate";
import { createTaskSchema } from "../validation/taskValidation";
 
const router = Router();
 
// POST /api/v1/tasks
// 1) Validate request body
// 2) If valid, call controller to create the tas
router.post("/", validateBody(createTaskSchema), createTask);
 
export default router;