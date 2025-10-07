import { z } from "zod";

export const ColumnSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Can't be empty"),
  tasks: z.array(z.any()),
  index: z.number(),
});

export const EditBoardSchema = z.object({
  name: z.string().min(1, "Can't be empty"),
  columns: z.array(ColumnSchema),
});
