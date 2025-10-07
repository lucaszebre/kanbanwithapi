import { columnApiServices } from "@/api/column.service";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Column } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router";
import styles from "../../styles/ListTask.module.css";
import { EditableText } from "../reusable/EditableText";
import { TaskCard } from "./taskCard";

// export const ListTask = ({
//   tasks,
//   title,
//   columnId,
//   columnIndex,
// }: ListTaskPropsType) => {
//   const { setOpenedTask } = useContext(DataContext);

//   // const RenderTask = (): React.ReactNode[] => {
//   //   return tasks.map(
//   //     (
//   //       task: {
//   //         title: string;
//   //         description: string;
//   //         id: string;
//   //         subtasks: SubtaskType[];
//   //       },
//   //       index: number
//   //     ) => (
//   //       <Draggable key={task.id} draggableId={task.id} index={index}>
//   //         {(provided) => (
//   //           <div
//   //             ref={provided.innerRef}
//   //             {...provided.draggableProps}
//   //             {...provided.dragHandleProps}
//   //           >
//   //             <TaskCard
//   //               key={task.id}
//   //               title={task.title}
//   //               description={task.description}
//   //               id={task.id}
//   //               columnId={columnId}
//   //               subtask={task.subtasks}
//   //               index={index}
//   //               columnIndex={columnIndex}
//   //               onClick={() => {
//   //                 setOpenedTask({
//   //                   id: task.id,
//   //                   title: task.title,
//   //                   description: task.description,
//   //                   columnId: columnId,
//   //                   subTask: task.subtasks,
//   //                 });
//   //               }}
//   //             />
//   //           </div>
//   //         )}
//   //       </Draggable>
//   //     )
//   //   );
//   // };

//   const RenderTaskNoDnd = (): React.ReactNode[] => {
//     return tasks.map((task) => (
//       <div key={task.id}>
//         <TaskCard
//           key={task.id}
//           task={task}
//           onClick={() => {
//             setOpenedTask({
//               id: task.id,
//               title: task.title,
//               description: task.description,
//               columnId: columnId,
//               subTask: task.subtasks,
//             });
//           }}
//         />
//       </div>
//     ));
//   };

//   return (
//     <Droppable droppableId={columnId} type="TASK">
//       {(provided) => (
//         <div
//           className={styles.ListTaskDiv}
//           ref={provided.innerRef}
//           {...provided.droppableProps}
//         >
//           <div className={styles.ListTaskRow}>
//             <h1 className={styles.ListTaskTitle}>
//               {title}({tasks.length})
//             </h1>
//           </div>
//           <div className={styles.ListTaskCols}>
//             {RenderTask()}
//             {provided.placeholder}
//           </div>
//         </div>
//       )}
//     </Droppable>
//   );
// };

export const ListTaskNoDnd = ({ tasks, id, name }: Column) => {
  const { boardId: boardIdParams } = useParams();
  const taskManager = useTaskManagerStore((s) => s.taskManager);

  const updateColumnLocal = useTaskManagerStore((state) => state.updateColumn);
  const queryClient = useQueryClient();
  const { mutate: updateColumn } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      columnApiServices.updateColumn(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const boardId = useMemo(
    () => boardIdParams ?? taskManager?.boards[0]?.id ?? "",
    [boardIdParams, taskManager]
  );

  const handleNameUpdate = (name: string) => {
    updateColumnLocal({ boardId, columnId: id, name });
    updateColumn({ id, name });
  };

  const RenderTaskNoDnd = () => {
    return tasks.map((task) => (
      <div key={task.id}>
        <TaskCard key={task.id} {...task} />
      </div>
    ));
  };

  return (
    <div className={styles.ListTaskDiv}>
      <div className={"flex flex-row gap-3 items-start"}>
        <EditableText
          initialValue={`${name}`}
          onSave={handleNameUpdate}
          textClassName={styles.ListTaskTitle}
          inputClassName={`${styles.ListTaskTitle} bg-transparent border-b-2 border-gray-400 focus:outline-none`}
        />
        <span className={styles.ListTaskTitle}>({tasks.length})</span>
      </div>
      <div className={styles.ListTaskCols}>{RenderTaskNoDnd()}</div>
    </div>
  );
};
