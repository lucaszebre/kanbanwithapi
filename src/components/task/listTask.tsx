import { columnApiServices } from "@/api/column.service";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Column, Task } from "@/types/global";
import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router";
import styles from "../../styles/ListTask.module.css";
import { EditableText } from "../reusable/EditableText";
import { TaskCard } from "./taskCard";

export const ListTask = ({ tasks, id, name, index }: Column) => {
  const { boardId: boardIdParams } = useParams();
  const taskManager = useTaskManagerStore((s) => s.taskManager);

  const updateColumnLocal = useTaskManagerStore((state) => state.updateColumn);
  const queryClient = useQueryClient();
  const { mutate: updateColumn } = useMutation({
    mutationFn: ({
      id,
      name,
      index,
    }: {
      id: string;
      name: string;
      index: number;
    }) => columnApiServices.updateColumn({ id, name, index }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const { ref } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });

  const boardId = useMemo(
    () => boardIdParams ?? taskManager?.boards[0]?.id ?? "",
    [boardIdParams, taskManager]
  );

  const handleNameUpdate = (name: string) => {
    updateColumnLocal({ boardId, id, name, tasks });
    updateColumn({ id, name, index });
  };

  const RenderTask = ({ tasks }: { tasks: Task[] }) => {
    return (
      <>
        {tasks
          .sort((a, b) => a.index - b.index)
          .map((task, index) => (
            <TaskCard key={task.id} {...task} index={index} columnId={id} />
          ))}
      </>
    );
  };

  return (
    <div ref={ref} className={styles.ListTaskDiv}>
      <div className={"flex flex-row gap-3 items-start"}>
        <EditableText
          initialValue={`${name}`}
          onSave={handleNameUpdate}
          textClassName={styles.ListTaskTitle}
          inputClassName={`${styles.ListTaskTitle} bg-transparent border-b-2 border-gray-400 focus:outline-none`}
        />
        <span className={styles.ListTaskTitle}>({tasks.length})</span>
      </div>
      <div className={styles.ListTaskCols}>
        <RenderTask tasks={tasks} />
      </div>
    </div>
  );
};
