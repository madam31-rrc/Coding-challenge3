import { createTask as createTaskController } from "../../src/api/v1/controllers/taskController";
import { HTTP_STATUS } from "../../src/constants/httpConstants";

// Mock the service the controller calls
jest.mock("../../src/api/v1/services/taskService", () => ({
  createTask: jest.fn(),
}));

import { createTask as createTaskService } from "../../src/api/v1/services/taskService";

describe("createTask (controller)", () => {
  const mockService = createTaskService as unknown as jest.Mock;

  const makeRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("returns 201 and the created task on success", async () => {
    const req: any = { body: { userId: "u1", title: "Hello", dueDate: "2025-10-30T00:00:00.000Z" } };
    const res = makeRes();
    const next = jest.fn();

    const created = {
      id: "t1",
      userId: "u1",
      title: "Hello",
      priority: "low",
      status: "open",
      dueDate: new Date("2025-10-30"),
      createdAt: new Date("2025-10-20"),
      updatedAt: new Date("2025-10-20"),
    };

    mockService.mockResolvedValue(created);

    await createTaskController(req, res, next);

    expect(mockService).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(res.json).toHaveBeenCalledWith({ data: created });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns the error's status and message when service throws a typed error (e.g., 422)", async () => {
    const req: any = { body: {} }; // invalid on purpose
    const res = makeRes();
    const next = jest.fn();

    const typedError = {
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: "Validation failed",
      details: [{ message: '"title" is required' }],
    };

    mockService.mockRejectedValue(typedError);

    await createTaskController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNPROCESSABLE_ENTITY);
    expect(res.json).toHaveBeenCalledWith({
      error: "Validation failed",
      details: typedError.details,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards unknown errors to next()", async () => {
    const req: any = { body: { userId: "u1" } };
    const res = makeRes();
    const next = jest.fn();

    const unknown = new Error("boom");
    mockService.mockRejectedValue(unknown);

    await createTaskController(req, res, next);

    expect(next).toHaveBeenCalledWith(unknown);
  });
});
