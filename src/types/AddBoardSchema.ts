import { z } from "zod";

export const AddBoardSchema = z.object({
  name: z.string().min(1, "Can't be empty"),
  columns: z.array(z.object({ name: z.string().min(1, "Can't be empty") })),
});
