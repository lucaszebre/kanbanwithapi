import { z } from "zod";

export const AddTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "description is required" }),
  columnId: z.string().min(1, { message: "Column is required." }),

  subtasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, { message: "Subtask cannot be empty." }),
      isCompleted: z.boolean(),
      index: z.number(),
    })
  ),
});
