import { boardApiServices } from "@/api/board.service";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Column, Task } from "@/types/global";
import { move } from "@dnd-kit/helpers";

import { DragDropProvider } from "@dnd-kit/react";

import { columnApiServices } from "@/api/column.service";
import { isSortable } from "@dnd-kit/react/sortable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { ListTask } from "../task/listTask";
import { EmptyBoard } from "./emptyBoard";
import { NoBoards } from "./noBoards";

export const Board = () => {
  const { boardId } = useParams();

  const taskManager = useTaskManagerStore((state) => state.taskManager);

  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);

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

  const updateColumns = useTaskManagerStore((state) => state.updateColumns);

  const updateTasks = useTaskManagerStore((state) => state.updateTasks);

  const { mutate: updateColumnMutate } = useMutation({
    mutationFn: ({
      id,
      name,
      index,
      tasks,
    }: {
      id: string;
      name: string;
      index: number;
      tasks?: Task[];
    }) => columnApiServices.updateColumn({ id, name, index, tasks }),
  });

  const { mutate: updateColumnsMutate } = useMutation({
    mutationFn: ({
      boardId,
      columns,
    }: {
      boardId: string;
      columns: Column[];
    }) => columnApiServices.updateColumns({ boardId, columns }),
  });

  function renderColumns() {
    if (currentBoard?.columns && currentBoard?.columns?.length > 0) {
      return (
        <DragDropProvider
          // onDragOver={(event) => {
          //   const { source, target } = event.operation;

          //   console.log(target, " target  drag over");
          //   console.log(source, "source drag over");

          //   if (source?.type === "column") return;

          //   if (source?.type === "item") {
          //     if (!target || !isSortable(target) || !source.isDragging) {
          //       // Not a sortable droppable/target; nothing to do
          //       return;
          //     }

          //     if (target.sortable.group === "column") {
          //       const targetColumnId = target?.sortable?.group as string;
          //       const initialColumnId = target?.sortable?.initialGroup;
          //       const initialIndex = target?.sortable?.initialIndex;

          //       console.log(
          //         targetColumnId,
          //         initialIndex,
          //         initialColumnId,
          //         initialIndex,
          //         "check when empty "
          //       );
          //       const sourceColumn = currentBoard.columns.find(
          //         (c) => c.id === initialColumnId
          //       );
          //       const targetColumn =
          //         currentBoard.columns[target.sortable.index];
          //       if (!sourceColumn || !targetColumn) {
          //         console.error("Source or target column not found");
          //         return;
          //       }
          //       // Remove task from source column
          //       const newSourceTasks = sourceColumn.tasks
          //         .filter((_, index) => index !== initialIndex)
          //         .map((task, index) => ({ ...task, index }));
          //       const taskToMove = sourceColumn.tasks[initialIndex];
          //       if (!taskToMove) {
          //         console.error("Task to move not found");
          //         return;
          //       }
          //       // Add task to target column
          //       const newTargetTasks = [{ ...taskToMove, index: 0 }];
          //       // Update both columns
          //       updateTasks({
          //         tasks: newSourceTasks,
          //         boardId: currentBoard.id,
          //         columnId: sourceColumn.id,
          //       });
          //       updateTasks({
          //         tasks: newTargetTasks,
          //         boardId: currentBoard.id,
          //         columnId: targetColumn.id,
          //       });
          //       // Update backend
          //       updateColumnMutate({
          //         id: sourceColumn.id,
          //         index: sourceColumn.index,
          //         name: sourceColumn.name,
          //         tasks: newSourceTasks,
          //       });
          //       updateColumnMutate({
          //         id: targetColumn.id,
          //         index: targetColumn.index,
          //         name: targetColumn.name,
          //         tasks: newTargetTasks,
          //       });
          //     }
          //     const targetColumnId = target?.sortable?.group as string;
          //     const targetIndex = target?.sortable?.index;
          //     const initialColumnId = target?.sortable?.initialGroup;
          //     const initialIndex = target?.sortable?.initialIndex;

          //     if (
          //       targetColumnId !== initialColumnId &&
          //       source.id &&
          //       target.id
          //     ) {
          //       const sourceColumn = currentBoard.columns.find(
          //         (c) => c.id === initialColumnId
          //       );
          //       const targetColumn = currentBoard.columns.find(
          //         (c) => c.id === targetColumnId
          //       );
          //       if (!sourceColumn || !targetColumn) {
          //         console.error("Source or target column not found");
          //         return;
          //       }
          //       // Remove task from source column
          //       const newSourceTasks = sourceColumn.tasks
          //         .filter((_, index) => index !== initialIndex)
          //         .map((task, index) => ({ ...task, index }));
          //       const taskToMove = sourceColumn.tasks[initialIndex];
          //       if (!taskToMove) {
          //         console.error("Task to move not found");
          //         return;
          //       }
          //       // Add task to target column
          //       const newTargetTasks = [
          //         ...targetColumn.tasks.slice(0, targetIndex),
          //         { ...taskToMove, columnId: targetColumnId },
          //         ...targetColumn.tasks.slice(targetIndex),
          //       ].map((task, index) => ({ ...task, index }));
          //       // Update both columns
          //       updateTasks({
          //         tasks: newSourceTasks,
          //         boardId: currentBoard.id,
          //         columnId: sourceColumn.id,
          //       });
          //       updateTasks({
          //         tasks: newTargetTasks,
          //         boardId: currentBoard.id,
          //         columnId: targetColumn.id,
          //       });
          //       // Update backend
          //       updateColumnMutate({
          //         id: sourceColumn.id,
          //         index: sourceColumn.index,
          //         name: sourceColumn.name,
          //         tasks: newSourceTasks,
          //       });
          //       updateColumnMutate({
          //         id: targetColumn.id,
          //         index: targetColumn.index,
          //         name: targetColumn.name,
          //         tasks: newTargetTasks,
          //       });
          //     }
          //   }
          // }}
          onDragEnd={(event) => {
            const { source, target } = event.operation;

            console.log(target, " target  drag end");
            console.log(source, "source drag end");

            if (source?.type === "column") {
              const columns = move(currentBoard.columns, event).map(
                (c, index) => ({ ...c, index })
              );
              updateColumns({ boardId: currentBoard.id, columns });

              updateColumnsMutate({ boardId: currentBoard.id, columns });
              return;
            }

            if (source?.type === "item") {
              if (!target || !isSortable(target)) {
                // Not a sortable droppable/target; nothing to do
                return;
              }
              const targetColumnId = target?.sortable?.group as string;
              const initialColumnId = target?.sortable?.initialGroup;

              const sourceColumn = currentBoard.columns.find(
                (c) => c.id === initialColumnId
              );
              const targetColumn = currentBoard.columns.find(
                (c) => c.id === targetColumnId
              );

              if (!sourceColumn || !targetColumn) {
                console.error("Source or target column not found");
                return;
              }

              // Moving within the same column
              if (targetColumnId === initialColumnId) {
                const newTasks = move(sourceColumn.tasks, event);

                updateTasks({
                  tasks: newTasks,
                  boardId: currentBoard.id,
                  columnId: sourceColumn.id,
                });

                updateColumnMutate({
                  id: sourceColumn.id,
                  index: sourceColumn.index,
                  name: sourceColumn.name,
                  tasks: newTasks,
                });
                return;
              }

              // Moving between different columns
            }
          }}
        >
          <div className="flex gap-4">
            {currentBoard?.columns
              .sort((a, b) => a.index - b.index)
              .map((column: Column, index) => (
                <ListTask key={column.id} {...column} index={index} />
              ))}
          </div>
        </DragDropProvider>
      );
    } else {
      return <EmptyBoard />;
    }
  }

  if (taskManager && currentBoard) {
    return <>{renderColumns()}</>;
  } else {
    return <NoBoards />;
  }
};
