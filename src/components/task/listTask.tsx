import { DataContext } from "@/state/datacontext";
import type { ListTaskPropsType } from "@/types";
import React, { useContext } from "react";
import styles from "../../styles/ListTask.module.css";
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

export const ListTaskNoDnd = ({
  tasks,
  title,
  columnId,
}: ListTaskPropsType) => {
  const { setOpenedTask } = useContext(DataContext);

  const RenderTaskNoDnd = (): React.ReactNode[] => {
    return tasks.map((task) => (
      <div key={task.id}>
        <TaskCard
          key={task.id}
          task={{ ...task, columnId }}
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
    ));
  };

  return (
    <div className={styles.ListTaskDiv}>
      <div className={styles.ListTaskRow}>
        <h1 className={styles.ListTaskTitle}>
          {title}({tasks.length})
        </h1>
      </div>
      <div className={styles.ListTaskCols}>{RenderTaskNoDnd()}</div>
    </div>
  );
};
