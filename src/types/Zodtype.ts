import { z } from 'zod';

export const SubtaskSchema = z.object({
  title: z.string(),
  isCompleted: z.boolean(),
  id: z.string()
});

export const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
  subtasks: z.array(SubtaskSchema),
  id: z.string(),
});

export const ColumnSchema = z.object({
  name: z.string(),
  tasks: z.array(TaskSchema),
  id: z.string(),
});

export const BoardSchema = z.object({
  name: z.string(),
  columns: z.array(ColumnSchema),
  id: z.string()
});

export const UserSchema = z.object({
  id: z.string(),
  userId: z.string(),
  boards: z.array(BoardSchema),
  __v: z.number()
});

export type Subtask = z.infer<typeof SubtaskSchema>;

export type Task = z.infer<typeof TaskSchema>;

export type Column = z.infer<typeof ColumnSchema>;

export type Board = z.infer<typeof BoardSchema>;

export type User = z.infer<typeof UserSchema>;

