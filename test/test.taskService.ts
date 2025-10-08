import { createTask } from "../../src/api/v1/services/taskService";
import { Task } from "../../src/api/v1/models/taskModel";
 
jest.mock("../../src/api/v1/repositories/taskRepository", () => ({
  taskRepository: { create: jest.fn() },
}));
 
import { taskRepository } from "../../src/api/v1/repositories/taskRepository";
 
describe("createTask (service)", () => {
  const mockCreate = taskRepository.create as unknown as jest.Mock;
 
  const FIXED_NOW = new Date("2025-10-20T10:00:00.000Z");
 
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(FIXED_NOW);
  });
 
  afterAll(() => {
    jest.useRealTimers();
  });
 
  beforeEach(() => {
    mockCreate.mockReset();
  });
 
  it("sets timestamps and forwards data to repository; returns created task", async () => {
    const input = {
      userId: "user_123",
      title: "Finish API",
      priority: "high",
      status: "open",
      dueDate: "2025-10-21T23:59:59.000Z",
    };
 
    const repoResult: Task = {
      id: "abc123",
      userId: "user_123",
      title: "Finish API",
      priority: "high",
      status: "open",
      dueDate: new Date("2025-10-21T23:59:59.000Z"),
      createdAt: FIXED_NOW,
      updatedAt: FIXED_NOW,
    };
 
    mockCreate.mockResolvedValue(repoResult);
 
    const result = await createTask(input);
 
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const passed = mockCreate.mock.calls[0][0] as Task;
 
    expect(passed.userId).toBe("user_123");
    expect(passed.title).toBe("Finish API");
    expect(passed.priority).toBe("high");
    expect(passed.status).toBe("open");
    expect(passed.dueDate instanceof Date).toBe(true);
    expect(passed.createdAt).toEqual(FIXED_NOW);
    expect(passed.updatedAt).toEqual(FIXED_NOW);
 
    expect(result).toEqual(repoResult);
  });
 
  it("propagates repository errors", async () => {
    const input = {
      userId: "user_123",
      title: "Will error",
      priority: "low",
      status: "open",
      dueDate: "2025-10-21T23:59:59.000Z",
    };
 
    const boom = new Error("repo failed");
    mockCreate.mockRejectedValue(boom);
 
    await expect(createTask(input)).rejects.toThrow("repo failed");
  });
});