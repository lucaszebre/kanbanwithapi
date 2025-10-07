import { boardApiServices } from "@/api/board.service";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Column } from "@/types/global";
import { getInitialWindowWidth } from "@/utils/GetInitialWidth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { ListTaskNoDnd } from "../task/listTask";
import { EditBoard } from "./editBoard";
import { EmptyBoard } from "./emptyBoard";
import { NoBoards } from "./noBoards";

export const Board = () => {
  const { boardId } = useParams();
  const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth());
  const [editBoard, setEditBoard] = useState(false);
  const taskManager = useTaskManagerStore((state) => state.taskManager);

  // const queryClient = useQueryClient();
  // const column = useMutation({
  //   mutationFn: (formData: {
  //     newColumnId: string;
  //     columnId: string;
  //     taskId: string;
  //   }) =>
  //     columnApiServices.changeColumn(
  //       formData.newColumnId,
  //       formData.columnId,
  //       formData.taskId
  //     ),
  //   onSuccess: () => {
  //     queryClient.refetchQueries({ queryKey: ["boards", "Task"] });
  //   },
  // });
  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // useEffect(() => {
  //   if (windowWidth <= 767) {
  //     setIsSidebarOpen(false);
  //   }
  // }, [windowWidth, setIsSidebarOpen]);

  const { data, isStale } = useQuery({
    queryKey: ["boards"],
    queryFn: () => boardApiServices.fetchBoards(),
  });

  const setTaskManagerData = useTaskManagerStore(
    (state) => state.setTaskManagerData
  );

  useEffect(() => {
    if (data) {
      setTaskManagerData(data);
    }
  }, [data, isStale, setTaskManagerData]);

  // const changeCol = useTaskManagerStore((state) => state.changeCol);

  // Define the onDragEnd function
  // const onDragEnd = (result: Data) => {
  //   // Check if the task was dropped into a different column
  //   if (!result.destination) {
  //     return;
  //   }

  //   // Find the source column based on the source droppableId
  //   const sourceColumnId = result.source.droppableId;
  //   const sourceColumn = taskManager[0].boards[currentBoardIndex].columns.find(
  //     (column: { id: string }) => column.id === sourceColumnId
  //   );

  //   // Check if the source column was found
  //   if (!sourceColumn) {
  //     return;
  //   }

  //   // Find the task that was dragged based on its index in the source column
  //   const draggedTask = sourceColumn.tasks[result.source.index].id;

  //   // Find the destination column's ID
  //   const destinationColumnId = result.destination.droppableId;

  //   // Call the changeColumn mutation to update the task's column
  //   changeCol(destinationColumnId, sourceColumnId, draggedTask);
  //   column.mutate({
  //     newColumnId: destinationColumnId,
  //     columnId: sourceColumnId,
  //     taskId: draggedTask,
  //   });

  //   // Invalidate queries to trigger a refetch
  //   queryClient.refetchQueries({ queryKey: ["boards", "Task"] });
  // };
  // function to render data
  // function renderListTask() {
  //   if (
  //     taskManager?.[0]?.boards?.[currentBoardIndex]?.columns &&
  //     taskManager?.[0]?.boards?.[currentBoardIndex]?.columns?.length > 0
  //   ) {
  //     return (
  //       <DndContext onDragEnd={onDragEnd}>
  //         {taskManager[0].boards[currentBoardIndex].columns.map(
  //           (column: ColumnType, columnIndex: number) => (
  //             <ListTask
  //               key={columnIndex}
  //               title={column.name}
  //               tasks={column.tasks}
  //               columnId={column.id}
  //               columnIndex={columnIndex}
  //               NbList={columnIndex}
  //             />
  //           )
  //         )}
  //       </DndContext>
  //     );
  //   } else {
  //     return <EmptyBoard  />;
  //   }
  // }

  // function to render data without drag and drop
  function renderListTaskNoDnd() {
    if (currentBoard?.columns && currentBoard?.columns?.length > 0) {
      return (
        <div className="flex gap-4">
          {currentBoard?.columns
            .sort((a, b) => a.index - b.index)
            .map((column: Column) => (
              <ListTaskNoDnd key={column.id} {...column} />
            ))}
        </div>
      );
    } else {
      return <EmptyBoard />;
    }
  }

  if (taskManager && currentBoard) {
    return (
      <>
        <EditBoard
          board={currentBoard}
          editBoard={editBoard}
          setEditBoard={setEditBoard}
        />

        {renderListTaskNoDnd()}
      </>
    );
  } else {
    return <NoBoards />;
  }
};
