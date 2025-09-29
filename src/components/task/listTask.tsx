import { DataContext } from "@/state/datacontext";
import { ListTaskPropsType, SubtaskType } from "@/types";
import React, { useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd"; // Import Draggable and Droppable
import styles from "../../styles/ListTask.module.css";
import TaskCard from "./taskCard";

const ListTask: React.FC<ListTaskPropsType> = ({
  tasks,
  title,
  columnId,
  columnIndex,
}) => {
  const { setOpenedTask } = useContext(DataContext);

  const RenderTask = (): React.ReactNode[] => {
    return tasks.map(
      (
        task: {
          title: string;
          description: string;
          id: string;
          subtasks: SubtaskType[];
        },
        index: number
      ) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                id={task.id}
                columnId={columnId}
                subtask={task.subtasks}
                index={index}
                columnIndex={columnIndex}
                onClick={() => {
                  setOpenedTask({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    columnId: columnId,
                    subTask: task.subtasks,
                  });
                }}
              />
            </div>
          )}
        </Draggable>
      )
    );
  };

  return (
    <Droppable droppableId={columnId} type="TASK">
      {(provided) => (
        <div
          className={styles.ListTaskDiv}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className={styles.ListTaskRow}>
            <h1 className={styles.ListTaskTitle}>
              {title}({tasks.length})
            </h1>
          </div>
          <div className={styles.ListTaskCols}>
            {RenderTask()}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default ListTask;
