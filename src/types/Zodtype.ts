const z = require('zod');

export const SubtaskSchema = z.object({
  title: z.string(),
  isCompleted: z.boolean(),
  _id: z.string()
});

export const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
  subtasks: z.array(SubtaskSchema),
  _id: z.string()
});

export const ColumnSchema = z.object({
  name: z.string(),
  tasks: z.array(TaskSchema),
  _id: z.string()
});

export const BoardSchema = z.object({
  name: z.string(),
  columns: z.array(ColumnSchema),
  _id: z.string()
});

export const UserSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  Boards: z.array(BoardSchema),
  __v: z.number()
});



