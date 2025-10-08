import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { createTask as createTaskService } from "../services/taskService";

type HttpErrorLike = {
  status?: number;
  message: string;
  details?: unknown;
};

function looksLikeHttpError(err: any): boolean {
// 1) err must exist (not null/undefined)
  if (err == null) return false;


  if (typeof err !== "object") return false;


  if (typeof err.message !== "string") return false;

  return true;
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    
    const task = await createTaskService(req.body);


    res.status(HTTP_STATUS.CREATED).json({ data: task });
  } catch (err: any) {

    if (looksLikeHttpError(err) && typeof err.status === "number") {
      const httpErr = err as HttpErrorLike;

      res.status(httpErr.status).json({
        error: httpErr.message,
        details: httpErr.details ?? undefined,
      });
      return;
    }

    next(err);
  }
}
