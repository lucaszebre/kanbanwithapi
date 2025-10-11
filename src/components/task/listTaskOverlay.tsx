import type { Column } from "@/types/global";
import styles from "../../styles/ListTask.module.css";
import { TaskCardOverlay } from "./taskCardOverlay";

export const ListTaskOverlay = ({ id, name, tasks, index }: Column) => {
  return (
    <div className={styles.ListTaskDiv} data-column-id={id} data-index={index}>
      <div className={"flex flex-row gap-3 items-start"}>
        <h3 className={styles.ListTaskTitle}>{name}</h3>
        <span className={styles.ListTaskTitle}>({tasks.length})</span>
      </div>
      <div className={"min-h-[400px] w-[280px]"}>
        {tasks
          ?.slice()
          .sort((a, b) => a.index - b.index)
          .map((task) => (
            <TaskCardOverlay key={task.id} {...task} />
          ))}
      </div>
    </div>
  );
};
