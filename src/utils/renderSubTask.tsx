import BoardColumn from "@/components/board/boardColumn";

type NewSubtask = {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId?: any;
  add?: boolean;
};

type RenderSubTaskProps = {
  subTasks: NewSubtask[];
  handleEditSubTask: (
    index: number,
    newTitle: string,
    subTaskId: string,
    add: boolean
  ) => void;
  handleDeleteSubtask: (index: number, subTaskId: string) => void;
  columnErrors: boolean[];
};

export const RenderSubTask = ({
  subTasks,
  handleEditSubTask,
  handleDeleteSubtask,
  columnErrors,
}: RenderSubTaskProps) => {
  return (
    <>
      {subTasks.map((subTask, index) => (
        <BoardColumn
          key={index}
          title={subTask.title}
          onChange={(e: string) =>
            handleEditSubTask(index, e, subTask.id, subTask.add || false)
          }
          Remove={() => handleDeleteSubtask(index, subTask.id)}
          error={columnErrors[index] || false}
        />
      ))}
    </>
  );
};
