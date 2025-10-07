import { useTaskManagerStore } from "@/state/taskManager";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Button } from "../ui/button";
import { EditBoard } from "./editBoard";

export const EmptyBoard = () => {
  const { t } = useTranslation("board");
  const taskManager = useTaskManagerStore((s) => s.taskManager);
  const { boardId } = useParams();

  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);

  const containerClasses =
    "flex flex-col items-center justify-center h-full w-full box-border text-[14px] cursor-pointer";
  const titleClasses =
    "text-[20px] font-medium mb-2.5 text-gray-500 md:text-[20px] text-center px-4 md:px-0";
  const buttonClasses =
    "bg-[#635FC7] text-white rounded-md px-5 py-2.5 text-[14px] font-medium cursor-pointer transition-colors  h-12 hover:brightness-110";

  return (
    <>
      <div className={containerClasses}>
        <h1 className={titleClasses}>{t("empty.title")}</h1>

        <EditBoard board={currentBoard}>
          <Button className={buttonClasses}>{t("empty.button")}</Button>
        </EditBoard>
      </div>
    </>
  );
};
