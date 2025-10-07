import { z } from "zod";

export const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Can't be empty"),
  isCompleted: z.boolean(),
  index: z.number(),
});

export const EditTaskSchema = z.object({
  title: z.string().min(1, "Can't be empty"),
  description: z.string().optional(),
  subtasks: z.array(SubtaskSchema),
  columnId: z.string("Please select a column."),
});
